const USERS_KEY = 'triangle_mock_users';
const PROFILES_KEY = 'triangle_profiles';
const ORDERS_KEY = 'triangle_orders';
const COURSES_KEY = 'triangle_courses';
const NOTIFICATIONS_KEY = 'triangle_notifications';
const ADS_KEY = 'triangle_ads';
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
  const resolved = detail ?? buildDefaultCourseDetail(course);
  const { description: _desc, ...rest } = course;
  return {
    ...rest,
    description: resolved.description,
    chapters: resolved.chapters,
    duration: resolved.duration,
    units: resolved.units,
    reviews: resolved.reviews ?? [],
  };
}

function buildDefaultCourseDetail(course) {
  const unitTemplates = {
    檢定: [
      { id: 1, title: '單元 1 考試架構與題型分析', items: ['1.1 題型總覽', '1.2 時間分配策略'] },
      { id: 2, title: '單元 2 核心解題技巧' },
      { id: 3, title: '單元 3 實戰演練' },
    ],
    生活: [
      { id: 1, title: '單元 1 日常會話基礎', items: ['1.1 問候與自我介紹'] },
      { id: 2, title: '單元 2 情境對話' },
    ],
    商務: [
      { id: 1, title: '單元 1 商務溝通基礎', items: ['1.1 會議英文'] },
      { id: 2, title: '單元 2 簡報與談判' },
    ],
    簡報: [
      { id: 1, title: '單元 1 簡報架構', items: ['1.1 開場技巧'] },
      { id: 2, title: '單元 2 口語表達' },
    ],
  };

  const units = unitTemplates[course.tag] || unitTemplates['生活'];
  const unitCount = units.length;
  const chapterCount = unitCount * 3 + 2;

  let description;
  if (Array.isArray(course.description) && course.description.length) {
    description = course.description;
  } else if (typeof course.description === 'string' && course.description.trim()) {
    description = [course.description.trim()];
  } else {
    description = [
      `《${course.title}》由 ${course.author} 主講，適合 ${course.level} 程度學員，聚焦${course.dept}實戰應用。`,
      '課程採循序漸進設計，結合理論講解、例題演練與課後作業，幫助你在有限時間內建立完整能力。',
    ];
  }

  return {
    courseId: course.id,
    description,
    chapters: `${unitCount} 個單元 共 ${chapterCount} 個章節`,
    duration: `${8 + (course.id % 5)} 小時 ${20 + (course.id % 40)} 分鐘`,
    units,
    reviews: [],
  };
}

function getUsers(db) {
  const stored = localStorage.getItem(USERS_KEY);
  let users = stored ? JSON.parse(stored) : [...db.users];

  db.users.forEach((seedUser) => {
    const index = users.findIndex((item) => item.account === seedUser.account);
    if (index === -1) {
      users.push(seedUser);
    } else {
      users[index] = {
        ...users[index],
        password: seedUser.account === DEMO_ACCOUNT ? seedUser.password : users[index].password,
        role: seedUser.role ?? users[index].role ?? 'student',
        name: seedUser.name ?? users[index].name,
      };
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
    user: {
      id: user.id,
      account: user.account,
      name: user.name,
      role: user.role ?? 'student',
    },
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

function filterCourses(courses, params = {}, options = {}) {
  let result = [...courses];
  const { includeUnpublished = false } = options;

  if (!includeUnpublished && !params.status) {
    result = result.filter((course) => course.status === 'published');
  }
  if (params.status) {
    result = result.filter((course) => course.status === params.status);
  }
  if (params.teacherId) {
    result = result.filter((course) => course.teacherId === Number(params.teacherId));
  }

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
    user: {
      id: user.id,
      account: user.account,
      name: user.name,
      role: user.role ?? 'student',
    },
  };
}

function getMutableCourses(db) {
  const stored = localStorage.getItem(COURSES_KEY);
  if (stored) return JSON.parse(stored);
  const initial = (db.courses || []).map((c) => ({
    ...c,
    teacherId: c.teacherId ?? 4,
    status: c.status ?? 'published',
  }));
  localStorage.setItem(COURSES_KEY, JSON.stringify(initial));
  return initial;
}

function saveCourses(courses) {
  localStorage.setItem(COURSES_KEY, JSON.stringify(courses));
}

function getNotifications(db) {
  const stored = localStorage.getItem(NOTIFICATIONS_KEY);
  if (stored) return JSON.parse(stored);
  const initial = db.notifications || [];
  localStorage.setItem(NOTIFICATIONS_KEY, JSON.stringify(initial));
  return initial;
}

function saveNotifications(notifications) {
  localStorage.setItem(NOTIFICATIONS_KEY, JSON.stringify(notifications));
}

function getAds(db) {
  const stored = localStorage.getItem(ADS_KEY);
  if (stored) return JSON.parse(stored);
  const initial = db.ads || [];
  localStorage.setItem(ADS_KEY, JSON.stringify(initial));
  return initial;
}

function saveAds(ads) {
  localStorage.setItem(ADS_KEY, JSON.stringify(ads));
}

function computeAdminStats(orders, platformStats = {}) {
  const cutoff = new Date();
  cutoff.setDate(cutoff.getDate() - 30);
  const cutoffStr = cutoff.toISOString().slice(0, 10);
  const recent = orders.filter((o) => o.status === 'completed' && o.date >= cutoffStr);
  const totalSales = recent.reduce((sum, o) => sum + o.price, 0);
  const totalOrders = recent.length;
  return {
    totalVisits: platformStats.totalVisits ?? 0,
    totalSales,
    totalOrders,
    avgOrderValue: totalOrders ? Math.round(totalSales / totalOrders) : 0,
  };
}

function addNotification(notifications, { userId, type, title, message }) {
  const id = notifications.length ? Math.max(...notifications.map((n) => n.id)) + 1 : 1;
  const notification = {
    id,
    userId,
    type,
    title,
    message,
    read: false,
    createdAt: new Date().toISOString().slice(0, 16).replace('T', ' '),
  };
  notifications.push(notification);
  return notification;
}

export const staticApi = {
  async getCourses(params = {}) {
    const db = await loadDb();
    const courses = getMutableCourses(db);
    return filterCourses(courses, params);
  },

  async getCourse(id) {
    const db = await loadDb();
    const courses = getMutableCourses(db);
    const user = getCurrentUser();
    const course = courses.find((item) => item.id === Number(id));
    if (!course) throw new Error('找不到課程');
    const isOwner = user?.role === 'teacher' && course.teacherId === user.id;
    const isAdmin = user?.role === 'admin';
    if (course.status !== 'published' && !isOwner && !isAdmin) {
      throw new Error('找不到課程');
    }
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
      role: 'student',
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
    const courses = getMutableCourses(db);
    const course = courses.find((item) => item.id === Number(courseId));
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

  async mergeGuestCart() {
    const user = requireUser();
    const guestKey = 'triangle_cart_guest';
    let guestItems = [];
    try {
      const stored = localStorage.getItem(guestKey);
      guestItems = stored ? JSON.parse(stored) : [];
    } catch {
      guestItems = [];
    }
    if (!guestItems.length) {
      return { items: this._readCart() };
    }

    const userKey = `triangle_cart_${user.id}`;
    let userItems = [];
    try {
      const stored = localStorage.getItem(userKey);
      userItems = stored ? JSON.parse(stored) : [];
    } catch {
      userItems = [];
    }

    const merged = [...userItems];
    for (const item of guestItems) {
      if (merged.length >= 3) break;
      if (!merged.some((i) => i.id === item.id)) merged.push(item);
    }

    localStorage.setItem(userKey, JSON.stringify(merged));
    localStorage.removeItem(guestKey);
    return { items: merged };
  },

  async getProfile() {
    const user = requireUser();
    const db = await loadDb();
    return buildProfileResponse(db, user);
  },

  async addLikeGoods(courseId) {
    const user = requireUser();
    const db = await loadDb();
    const courses = getMutableCourses(db);
    const course = courses.find((item) => item.id === Number(courseId));
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
      const courses = getMutableCourses(db);
      const course = courses.find((c) => c.id === item.id);
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

  async getNotifications() {
    const user = requireUser();
    const db = await loadDb();
    return getNotifications(db)
      .filter((n) => n.userId === user.id)
      .sort((a, b) => b.id - a.id);
  },

  async markNotificationRead(id) {
    const user = requireUser();
    const db = await loadDb();
    const notifications = getNotifications(db);
    const index = notifications.findIndex((n) => n.id === Number(id) && n.userId === user.id);
    if (index === -1) throw new Error('找不到通知');
    notifications[index] = { ...notifications[index], read: true };
    saveNotifications(notifications);
    return notifications[index];
  },

  async markAllNotificationsRead() {
    const user = requireUser();
    const db = await loadDb();
    const notifications = getNotifications(db).map((n) =>
      n.userId === user.id ? { ...n, read: true } : n
    );
    saveNotifications(notifications);
    return { message: '已全部標為已讀' };
  },

  async updateProfile({ name, email }) {
    const user = requireUser();
    const db = await loadDb();
    const users = getUsers(db);
    const profiles = getProfiles(db);
    const userIndex = users.findIndex((u) => u.id === user.id);
    if (userIndex === -1) throw new Error('找不到使用者');

    if (name) {
      users[userIndex] = { ...users[userIndex], name };
      saveUsers(users);
      const stored = getCurrentUser();
      if (stored) {
        localStorage.setItem('user', JSON.stringify({ ...stored, name }));
      }
    }
    if (email) {
      const profile = getProfileForUser(db, user.id);
      profile.email = email;
      profiles[user.id] = profile;
      saveProfiles(profiles);
    }

    const updatedUser = getUsers(db).find((u) => u.id === user.id);
    return buildProfileResponse(db, updatedUser);
  },

  async updatePassword({ currentPassword, newPassword, confirmPassword }) {
    const user = requireUser();
    if (!currentPassword || !newPassword || !confirmPassword) {
      throw new Error('請填寫完整資訊');
    }
    if (newPassword !== confirmPassword) throw new Error('兩次密碼不一致');

    const db = await loadDb();
    const users = getUsers(db);
    const index = users.findIndex((u) => u.id === user.id);
    if (users[index].password !== currentPassword) throw new Error('目前密碼錯誤');

    users[index] = { ...users[index], password: newPassword };
    saveUsers(users);
    return { message: '密碼更新成功' };
  },

  async getTeacherCourses() {
    const user = requireUser();
    if (user.role !== 'teacher') throw new Error('權限不足');
    const db = await loadDb();
    return getMutableCourses(db)
      .filter((c) => c.teacherId === user.id)
      .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
  },

  async createTeacherCourse(data) {
    const user = requireUser();
    if (user.role !== 'teacher') throw new Error('權限不足');
    const db = await loadDb();
    const courses = getMutableCourses(db);
    const newCourse = {
      id: courses.length ? Math.max(...courses.map((c) => c.id)) + 1 : 1,
      title: data.title,
      image: '/images/courses/hot-1.png',
      tag: data.tag || '生活',
      level: data.level || 'A2',
      author: user.name,
      dept: data.dept || '生活英文',
      price: Number(data.price) || 0,
      students: 0,
      isHot: false,
      createdAt: new Date().toISOString(),
      courseType: data.courseType || '影音課',
      teacherId: user.id,
      status: 'draft',
      description: data.description || '',
    };
    courses.push(newCourse);
    saveCourses(courses);
    return newCourse;
  },

  async updateTeacherCourse(id, data) {
    const user = requireUser();
    if (user.role !== 'teacher') throw new Error('權限不足');
    const db = await loadDb();
    const courses = getMutableCourses(db);
    const index = courses.findIndex((c) => c.id === Number(id) && c.teacherId === user.id);
    if (index === -1) throw new Error('找不到課程');
    if (courses[index].status === 'published') throw new Error('已上架課程無法直接編輯');

    const allowed = ['title', 'tag', 'level', 'dept', 'price', 'courseType', 'description', 'image'];
    allowed.forEach((key) => {
      if (data[key] !== undefined) courses[index] = { ...courses[index], [key]: data[key] };
    });
    saveCourses(courses);
    return courses[index];
  },

  async submitTeacherCourse(id) {
    const user = requireUser();
    if (user.role !== 'teacher') throw new Error('權限不足');
    const db = await loadDb();
    const courses = getMutableCourses(db);
    const index = courses.findIndex((c) => c.id === Number(id) && c.teacherId === user.id);
    if (index === -1) throw new Error('找不到課程');
    if (!['draft', 'rejected'].includes(courses[index].status)) {
      throw new Error('此課程狀態無法提交審核');
    }
    courses[index] = { ...courses[index], status: 'pending_review' };
    saveCourses(courses);

    const notifications = getNotifications(db);
    const users = getUsers(db);
    users.filter((u) => u.role === 'admin').forEach((admin) => {
      addNotification(notifications, {
        userId: admin.id,
        type: 'course_pending',
        title: '新課程待審核',
        message: `${user.name} 提交了「${courses[index].title}」待審核。`,
      });
    });
    saveNotifications(notifications);
    return courses[index];
  },

  async getTeacherCourseStudents(id) {
    const user = requireUser();
    if (user.role !== 'teacher') throw new Error('權限不足');
    const db = await loadDb();
    const courses = getMutableCourses(db);
    const course = courses.find((c) => c.id === Number(id) && c.teacherId === user.id);
    if (!course) throw new Error('找不到課程');

    const orders = getOrders(db).filter(
      (o) => o.courseId === course.id && o.status === 'completed'
    );
    const users = getUsers(db);
    return orders.map((order) => {
      const student = users.find((u) => u.id === order.userId);
      const profile = getProfileForUser(db, order.userId);
      const myCourse = profile.myCourses?.find((c) => c.courseId === course.id);
      return {
        userId: order.userId,
        name: student?.name ?? '未知',
        email: profile.email ?? '',
        progress: myCourse?.progress ?? 0,
        lastStudy: myCourse?.lastStudy ?? null,
        purchasedAt: order.date,
      };
    });
  },

  async getAdminStats() {
    const user = requireUser();
    if (user.role !== 'admin') throw new Error('權限不足');
    const db = await loadDb();
    return computeAdminStats(getOrders(db), db.platformStats ?? {});
  },

  async getAdminCourses(params = {}) {
    const user = requireUser();
    if (user.role !== 'admin') throw new Error('權限不足');
    const db = await loadDb();
    let courses = getMutableCourses(db);
    if (params.status) courses = courses.filter((c) => c.status === params.status);
    return courses.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
  },

  async reviewAdminCourse(id, { action, reason }) {
    const user = requireUser();
    if (user.role !== 'admin') throw new Error('權限不足');
    const db = await loadDb();
    const courses = getMutableCourses(db);
    const index = courses.findIndex((c) => c.id === Number(id));
    if (index === -1) throw new Error('找不到課程');
    if (courses[index].status !== 'pending_review') throw new Error('此課程不在待審核狀態');

    const newStatus = action === 'approve' ? 'published' : 'rejected';
    courses[index] = { ...courses[index], status: newStatus };
    saveCourses(courses);

    if (action === 'approve') {
      const details = db.courseDetails ?? [];
      if (!details.some((d) => d.courseId === courses[index].id)) {
        db.courseDetails = [...details, buildDefaultCourseDetail(courses[index])];
      }
    }

    const notifications = getNotifications(db);
    addNotification(notifications, {
      userId: courses[index].teacherId,
      type: 'course_review_result',
      title: action === 'approve' ? '課程審核通過' : '課程審核未通過',
      message:
        action === 'approve'
          ? `「${courses[index].title}」已通過審核並上架。`
          : `「${courses[index].title}」未通過審核。${reason ? `原因：${reason}` : ''}`,
    });
    saveNotifications(notifications);
    return courses[index];
  },

  async getAdminOrders() {
    const user = requireUser();
    if (user.role !== 'admin') throw new Error('權限不足');
    const db = await loadDb();
    return getOrders(db).sort((a, b) => b.date.localeCompare(a.date));
  },

  async updateAdminOrder(id, { status }) {
    const user = requireUser();
    if (user.role !== 'admin') throw new Error('權限不足');
    const db = await loadDb();
    const orders = getOrders(db);
    const index = orders.findIndex((o) => o.id === id);
    if (index === -1) throw new Error('找不到訂單');
    orders[index] = { ...orders[index], status };
    saveOrders(orders);
    return orders[index];
  },

  async getAdminUsers() {
    const user = requireUser();
    if (user.role !== 'admin') throw new Error('權限不足');
    const db = await loadDb();
    return getUsers(db).map(({ password, ...rest }) => rest);
  },

  async updateAdminUser(id, { role, name }) {
    const user = requireUser();
    if (user.role !== 'admin') throw new Error('權限不足');
    const db = await loadDb();
    const users = getUsers(db);
    const index = users.findIndex((u) => u.id === Number(id));
    if (index === -1) throw new Error('找不到使用者');
    if (role) users[index] = { ...users[index], role };
    if (name) users[index] = { ...users[index], name };
    saveUsers(users);
    const { password, ...safeUser } = users[index];
    return safeUser;
  },

  async getAdminAds() {
    const user = requireUser();
    if (user.role !== 'admin') throw new Error('權限不足');
    const db = await loadDb();
    return getAds(db);
  },

  async createAdminAd(data) {
    const user = requireUser();
    if (user.role !== 'admin') throw new Error('權限不足');
    const db = await loadDb();
    const ads = getAds(db);
    const newAd = {
      id: ads.length ? Math.max(...ads.map((a) => a.id)) + 1 : 1,
      title: data.title,
      image: data.image || '/images/courses/hot-1.png',
      link: data.link || '/',
      active: data.active !== false,
      sortOrder: data.sortOrder ?? ads.length + 1,
    };
    ads.push(newAd);
    saveAds(ads);
    return newAd;
  },

  async updateAdminAd(id, data) {
    const user = requireUser();
    if (user.role !== 'admin') throw new Error('權限不足');
    const db = await loadDb();
    const ads = getAds(db);
    const index = ads.findIndex((a) => a.id === Number(id));
    if (index === -1) throw new Error('找不到廣告');
    ads[index] = { ...ads[index], ...data };
    saveAds(ads);
    return ads[index];
  },

  async deleteAdminAd(id) {
    const user = requireUser();
    if (user.role !== 'admin') throw new Error('權限不足');
    const db = await loadDb();
    const ads = getAds(db).filter((a) => a.id !== Number(id));
    saveAds(ads);
    return { message: '已刪除' };
  },
};
