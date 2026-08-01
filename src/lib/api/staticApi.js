const USERS_KEY = 'triangle_mock_users';
const PROFILES_KEY = 'triangle_profiles';
const ORDERS_KEY = 'triangle_orders';
const DATA_URL = `${import.meta.env.BASE_URL}data/db.json`;
const DEMO_ACCOUNT = 'demo_user';

let dbCache = null;

async function loadDb() {
  if (dbCache) return dbCache;
  const response = await fetch(DATA_URL);
  if (!response.ok) throw new Error('無法載入靜態資料');
  dbCache = await response.json();
  return dbCache;
}

function createDefaultProfile(userId, account) {
  return {
    userId,
    email: `${account}@triangle.com`,
    avatar: null,
    achievements: [
      { id: 1, label: '連續學習', value: '0 天' },
      { id: 2, label: '累積學習時數', value: '0 小時' },
      { id: 3, label: '完成課程', value: '0 門' },
    ],
    myCourses: [],
    savedCourses: [],
  };
}

function generateOrderId() {
  const date = new Date().toISOString().slice(0, 10).replace(/-/g, '');
  const seq = String(Math.floor(Math.random() * 90000000) + 10000000);
  return `${date}-${seq}`;
}

function mergeCourseWithDetail(course, detail) {
  if (!detail) return course;
  return {
    ...course,
    description: detail.description,
    chapters: detail.chapters,
    duration: detail.duration,
    units: detail.units,
    reviews: detail.reviews,
  };
}

function getUsers(db) {
  const stored = localStorage.getItem(USERS_KEY);
  let users = stored ? JSON.parse(stored) : [...db.users];

  db.users.forEach((seedUser) => {
    const index = users.findIndex((item) => item.account === seedUser.account);
    if (index === -1) {
      users.push(seedUser);
    } else if (seedUser.account === DEMO_ACCOUNT) {
      users[index] = { ...users[index], password: seedUser.password };
    }
  });

  localStorage.setItem(USERS_KEY, JSON.stringify(users));
  return users;
}

function saveUsers(users) {
  localStorage.setItem(USERS_KEY, JSON.stringify(users));
}

function getProfiles(db) {
  const stored = localStorage.getItem(PROFILES_KEY);
  if (stored) return JSON.parse(stored);

  const initial = {};
  (db.userProfiles || []).forEach((profile) => {
    initial[profile.userId] = { ...profile, orders: undefined };
  });
  localStorage.setItem(PROFILES_KEY, JSON.stringify(initial));
  return initial;
}

function saveProfiles(profiles) {
  localStorage.setItem(PROFILES_KEY, JSON.stringify(profiles));
}

function getOrders(db) {
  const stored = localStorage.getItem(ORDERS_KEY);
  if (stored) return JSON.parse(stored);

  const initial = db.orders || [];
  localStorage.setItem(ORDERS_KEY, JSON.stringify(initial));
  return initial;
}

function saveOrders(orders) {
  localStorage.setItem(ORDERS_KEY, JSON.stringify(orders));
}

function getCurrentUser() {
  try {
    return JSON.parse(localStorage.getItem('user'));
  } catch {
    return null;
  }
}

function requireUser() {
  const user = getCurrentUser();
  if (!user) throw new Error('請先登入');
  return user;
}

function getProfileForUser(db, userId) {
  const profiles = getProfiles(db);
  if (!profiles[userId]) {
    const users = getUsers(db);
    const account = users.find((item) => item.id === userId)?.account || `user${userId}`;
    profiles[userId] = createDefaultProfile(userId, account);
    saveProfiles(profiles);
  }
  return profiles[userId];
}

function buildProfileResponse(db, user) {
  const profile = getProfileForUser(db, user.id);
  const orders = getOrders(db).filter((order) => order.userId === user.id);
  return {
    user: { id: user.id, account: user.account, name: user.name },
    email: profile.email,
    avatar: profile.avatar,
    achievements: profile.achievements,
    myCourses: profile.myCourses,
    savedCourses: profile.savedCourses,
    orders: orders.map(({ id, date, title, price, status }) => ({
      id,
      date,
      title,
      price,
      status,
    })),
  };
}

function filterCourses(courses, params = {}) {
  let result = [...courses];

  if (params.isHot !== undefined && params.isHot !== '') {
    const isHot = params.isHot === true || params.isHot === 'true';
    result = result.filter((course) => course.isHot === isHot);
  }
  if (params.dept) result = result.filter((course) => course.dept === params.dept);
  if (params.tag) result = result.filter((course) => course.tag === params.tag);
  if (params.q) {
    const keyword = String(params.q).toLowerCase();
    result = result.filter(
      (course) =>
        course.title.toLowerCase().includes(keyword) ||
        course.author.toLowerCase().includes(keyword)
    );
  }
  if (params._sort) {
    const order = params._order === 'desc' ? -1 : 1;
    result.sort((a, b) => {
      if (a[params._sort] < b[params._sort]) return -order;
      if (a[params._sort] > b[params._sort]) return order;
      return 0;
    });
  }

  return result;
}

function buildAuthResponse(user) {
  return {
    token: `mock-jwt-token-${user.id}`,
    user: { id: user.id, account: user.account, name: user.name },
  };
}

export const staticApi = {
  async getCourses(params = {}) {
    const db = await loadDb();
    return filterCourses(db.courses, params);
  },

  async getCourse(id) {
    const db = await loadDb();
    const course = db.courses.find((item) => item.id === Number(id));
    if (!course) throw new Error('找不到課程');
    const detail = db.courseDetails?.find((item) => item.courseId === Number(id));
    return mergeCourseWithDetail(course, detail);
  },

  async getFaqCategories() {
    const db = await loadDb();
    return db.faqCategories;
  },

  async getQuizQuestions() {
    const db = await loadDb();
    return db.quizQuestions;
  },

  async getTestimonials() {
    const db = await loadDb();
    return db.testimonials;
  },

  async getThemes() {
    const db = await loadDb();
    return db.themes;
  },

  async submitRecommend(answers) {
    if (!answers?.length) throw new Error('請提供測驗答案');
    const db = await loadDb();
    return { courses: db.recommendResults };
  },

  async login(account, password) {
    if (!account || !password) throw new Error('請提供帳號與密碼');
    const db = await loadDb();
    const users = getUsers(db);
    const user = users.find((item) => item.account === account && item.password === password);
    if (!user) throw new Error('帳號或密碼錯誤');
    getProfileForUser(db, user.id);
    return buildAuthResponse(user);
  },

  async register(account, password, confirmPassword) {
    if (!account || !password || !confirmPassword) throw new Error('請填寫完整註冊資訊');
    if (password !== confirmPassword) throw new Error('兩次密碼不一致');

    const db = await loadDb();
    const users = getUsers(db);
    if (users.some((item) => item.account === account)) throw new Error('帳號已存在');

    const newUser = {
      id: users.length ? Math.max(...users.map((item) => item.id)) + 1 : 1,
      account,
      password,
      name: account,
    };

    saveUsers([...users, newUser]);
    const profiles = getProfiles(db);
    profiles[newUser.id] = createDefaultProfile(newUser.id, account);
    saveProfiles(profiles);

    return buildAuthResponse(newUser);
  },

  async resetPassword(account, password, confirmPassword) {
    if (!account || !password || !confirmPassword) throw new Error('請填寫完整資訊');
    if (password !== confirmPassword) throw new Error('兩次密碼不一致');

    const db = await loadDb();
    const users = getUsers(db);
    const index = users.findIndex((item) => item.account === account);
    if (index === -1) throw new Error('找不到使用者');

    const updatedUsers = [...users];
    updatedUsers[index] = { ...updatedUsers[index], password };
    saveUsers(updatedUsers);
    return { message: '密碼重設成功' };
  },

  async getPopularSearches() {
    const db = await loadDb();
    return (db.popularSearches || []).map((item) =>
      typeof item === 'string' ? item : item.term
    );
  },

  _getCartKey() {
    const user = getCurrentUser();
    return user ? `triangle_cart_${user.id}` : 'triangle_cart_guest';
  },

  _readCart() {
    try {
      const stored = localStorage.getItem(this._getCartKey());
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  },

  _saveCart(items) {
    localStorage.setItem(this._getCartKey(), JSON.stringify(items));
    return items;
  },

  async getCart() {
    return { items: this._readCart() };
  },

  async addToCart(courseId) {
    const db = await loadDb();
    const course = db.courses.find((item) => item.id === Number(courseId));
    if (!course) throw new Error('找不到課程');

    const prev = this._readCart();
    if (prev.some((item) => item.id === course.id)) throw new Error('此課程已在購物車中');
    if (prev.length >= 3) throw new Error('購物車已達上限');

    const next = [...prev, { id: course.id, title: course.title, price: course.price }];
    this._saveCart(next);
    return { items: next };
  },

  async removeFromCart(courseId) {
    const next = this._readCart().filter((item) => item.id !== Number(courseId));
    this._saveCart(next);
    return { items: next };
  },

  async clearCart() {
    this._saveCart([]);
    return { items: [] };
  },

  async getProfile() {
    const user = requireUser();
    const db = await loadDb();
    return buildProfileResponse(db, user);
  },

  async addLikeGoods(courseId) {
    const user = requireUser();
    const db = await loadDb();
    const course = db.courses.find((item) => item.id === Number(courseId));
    if (!course) throw new Error('找不到課程');

    const profiles = getProfiles(db);
    const profile = getProfileForUser(db, user.id);
    if (profile.savedCourses.some((item) => item.courseId === course.id)) {
      throw new Error('此課程已在收藏中');
    }

    profile.savedCourses = [
      ...profile.savedCourses,
      {
        courseId: course.id,
        title: course.title,
        image: course.image,
        tag: course.tag,
        level: course.level,
      },
    ];
    profiles[user.id] = profile;
    saveProfiles(profiles);
    return { savedCourses: profile.savedCourses };
  },

  async removeLikeGoods(courseId) {
    const user = requireUser();
    const db = await loadDb();
    const profiles = getProfiles(db);
    const profile = getProfileForUser(db, user.id);
    profile.savedCourses = profile.savedCourses.filter(
      (item) => item.courseId !== Number(courseId)
    );
    profiles[user.id] = profile;
    saveProfiles(profiles);
    return { savedCourses: profile.savedCourses };
  },

  async purchase() {
    const user = requireUser();
    const db = await loadDb();
    const items = this._readCart();
    if (!items.length) throw new Error('購物車是空的');

    const orders = getOrders(db);
    const profiles = getProfiles(db);
    const profile = getProfileForUser(db, user.id);

    const createdOrders = items.map((item) => {
      const course = db.courses.find((c) => c.id === item.id);
      const order = {
        id: generateOrderId(),
        userId: user.id,
        courseId: item.id,
        title: course?.title || item.title,
        price: item.price,
        status: 'completed',
        date: new Date().toISOString().slice(0, 10),
      };
      orders.push(order);

      if (course && !profile.myCourses.some((c) => c.courseId === course.id)) {
        profile.myCourses.push({
          courseId: course.id,
          title: course.title,
          image: course.image,
          progress: 0,
          lastStudy: new Date().toISOString().slice(0, 16).replace('T', ' '),
        });
      }
      return order;
    });

    const completedCount = profile.myCourses.filter((item) => item.progress >= 100).length;
    profile.achievements = profile.achievements.map((item) =>
      item.label === '完成課程' ? { ...item, value: `${completedCount} 門` } : item
    );

    profiles[user.id] = profile;
    saveProfiles(profiles);
    saveOrders(orders);
    this._saveCart([]);

    return { orders: createdOrders };
  },

  async getPurchaseHistory() {
    const user = requireUser();
    const db = await loadDb();
    return getOrders(db).filter((order) => order.userId === user.id);
  },

  async getPurchaseOne(id) {
    const user = requireUser();
    const db = await loadDb();
    const order = getOrders(db).find((item) => item.id === id && item.userId === user.id);
    if (!order) throw new Error('找不到訂單');
    return order;
  },

  async updatePurchaseStatus(id, status) {
    const user = requireUser();
    const db = await loadDb();
    const orders = getOrders(db);
    const index = orders.findIndex((item) => item.id === id && item.userId === user.id);
    if (index === -1) throw new Error('找不到訂單');

    orders[index] = { ...orders[index], status };
    saveOrders(orders);
    return orders[index];
  },
};
