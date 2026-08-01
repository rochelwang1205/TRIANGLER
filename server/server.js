import express from 'express';
import cors from 'cors';
import { fileURLToPath } from 'url';
import path from 'path';
import fs from 'fs';
import yaml from 'yaml';
import swaggerUi from 'swagger-ui-express';
import jsonServer from 'json-server';
import {
  createDefaultProfile,
  generateOrderId,
  mergeCourseWithDetail,
  buildProfileResponse,
  computeAdminStats,
  createNotification,
  buildDefaultCourseDetail,
} from './helpers.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const PORT = 3001;
const CART_MAX = 3;

const app = express();
app.use(cors());
app.use(express.json());

const swaggerPath = path.join(__dirname, 'swagger.yaml');
const swaggerDocument = yaml.parse(fs.readFileSync(swaggerPath, 'utf8'));
app.use('/docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

const router = jsonServer.router(path.join(__dirname, 'db.json'));
const middlewares = jsonServer.defaults();
const db = router.db;

app.use('/api', middlewares);

function getUserIdFromToken(req) {
  const auth = req.headers.authorization;
  if (!auth?.startsWith('Bearer ')) return null;
  const match = auth.slice(7).match(/mock-jwt-token-(\d+)/);
  return match ? Number(match[1]) : null;
}

function requireAuth(req, res) {
  const userId = getUserIdFromToken(req);
  if (!userId) {
    res.status(401).json({ message: '請先登入' });
    return null;
  }
  return userId;
}

function getUser(req) {
  const userId = getUserIdFromToken(req);
  if (!userId) return null;
  return db.get('users').find({ id: userId }).value();
}

function requireRole(req, res, roles) {
  const user = getUser(req);
  if (!user) {
    res.status(401).json({ message: '請先登入' });
    return null;
  }
  const role = user.role ?? 'student';
  if (!roles.includes(role)) {
    res.status(403).json({ message: '權限不足' });
    return null;
  }
  return user;
}

function getCartKey(req) {
  const userId = getUserIdFromToken(req);
  return userId ? `user_${userId}` : 'guest';
}

function getCartItems(req) {
  const key = getCartKey(req);
  const cart = db.get('carts').find({ key }).value();
  return cart ? cart.items : [];
}

function saveCartItems(req, items) {
  const key = getCartKey(req);
  return saveCartItemsByKey(key, items);
}

function saveCartItemsByKey(key, items) {
  const existing = db.get('carts').find({ key }).value();
  if (existing) {
    db.get('carts').find({ key }).assign({ items }).write();
  } else {
    db.get('carts').push({ key, items }).write();
  }
  return items;
}

function getUserProfile(userId) {
  let profile = db.get('userProfiles').find({ userId }).value();
  if (!profile) {
    const user = db.get('users').find({ id: userId }).value();
    if (!user) return null;
    profile = createDefaultProfile(userId, user.account);
    db.get('userProfiles').push(profile).write();
  }
  return profile;
}

function getUserOrders(userId) {
  return db.get('orders').filter({ userId }).value();
}

function saveSavedCourses(userId, savedCourses) {
  db.get('userProfiles').find({ userId }).assign({ savedCourses }).write();
}

function addMyCourse(userId, course) {
  const profile = getUserProfile(userId);
  const exists = profile.myCourses.some((item) => item.courseId === course.id);
  if (exists) return;

  const myCourses = [
    ...profile.myCourses,
    {
      courseId: course.id,
      title: course.title,
      image: course.image,
      progress: 0,
      lastStudy: new Date().toISOString().slice(0, 16).replace('T', ' '),
    },
  ];

  const completedCount = myCourses.filter((item) => item.progress >= 100).length;
  const achievements = profile.achievements.map((item) =>
    item.label === '完成課程' ? { ...item, value: `${completedCount} 門` } : item
  );

  db.get('userProfiles').find({ userId }).assign({ myCourses, achievements }).write();
}

app.post('/api/auth/login', (req, res) => {
  const { account, password } = req.body;
  if (!account || !password) {
    return res.status(400).json({ message: '請提供帳號與密碼' });
  }

  const user = db.get('users').find({ account, password }).value();
  if (!user) {
    return res.status(401).json({ message: '帳號或密碼錯誤' });
  }

  getUserProfile(user.id);
  res.json({
    token: `mock-jwt-token-${user.id}`,
    user: {
      id: user.id,
      account: user.account,
      name: user.name,
      role: user.role ?? 'student',
    },
  });
});

app.post('/api/auth/register', (req, res) => {
  const { account, password, confirmPassword } = req.body;

  if (!account || !password || !confirmPassword) {
    return res.status(400).json({ message: '請填寫完整註冊資訊' });
  }
  if (password !== confirmPassword) {
    return res.status(400).json({ message: '兩次密碼不一致' });
  }
  if (db.get('users').find({ account }).value()) {
    return res.status(409).json({ message: '帳號已存在' });
  }

  const users = db.get('users').value();
  const newUser = {
    id: users.length ? Math.max(...users.map((item) => item.id)) + 1 : 1,
    account,
    password,
    name: account,
    role: 'student',
  };

  db.get('users').push(newUser).write();
  db.get('userProfiles').push(createDefaultProfile(newUser.id, account)).write();

  res.status(201).json({
    token: `mock-jwt-token-${newUser.id}`,
    user: {
      id: newUser.id,
      account: newUser.account,
      name: newUser.name,
      role: newUser.role,
    },
  });
});

app.post('/api/auth/reset-password', (req, res) => {
  const { account, password, confirmPassword } = req.body;

  if (!account || !password || !confirmPassword) {
    return res.status(400).json({ message: '請填寫完整資訊' });
  }
  if (password !== confirmPassword) {
    return res.status(400).json({ message: '兩次密碼不一致' });
  }
  if (!db.get('users').find({ account }).value()) {
    return res.status(404).json({ message: '找不到使用者' });
  }

  db.get('users').find({ account }).assign({ password }).write();
  res.json({ message: '密碼重設成功' });
});

app.post('/api/recommend', (req, res) => {
  const { answers } = req.body;
  if (!answers || !Array.isArray(answers) || answers.length === 0) {
    return res.status(400).json({ message: '請提供測驗答案' });
  }
  res.json({ courses: db.get('recommendResults').value() });
});

app.get('/api/cart', (req, res) => {
  res.json({ items: getCartItems(req) });
});

app.post('/api/cart', (req, res) => {
  const { courseId } = req.body;
  if (!courseId) {
    return res.status(400).json({ message: '請提供課程 ID' });
  }

  const course = db.get('courses').find({ id: Number(courseId) }).value();
  if (!course) {
    return res.status(404).json({ message: '找不到課程' });
  }

  const items = getCartItems(req);
  if (items.some((item) => item.id === course.id)) {
    return res.status(409).json({ message: '此課程已在購物車中' });
  }
  if (items.length >= CART_MAX) {
    return res.status(400).json({ message: '購物車已達上限' });
  }

  const next = [...items, { id: course.id, title: course.title, price: course.price }];
  saveCartItems(req, next);
  res.json({ items: next });
});

app.delete('/api/cart/:courseId', (req, res) => {
  const next = getCartItems(req).filter((item) => item.id !== Number(req.params.courseId));
  saveCartItems(req, next);
  res.json({ items: next });
});

app.delete('/api/cart', (req, res) => {
  saveCartItems(req, []);
  res.json({ items: [] });
});

app.post('/api/cart/merge-guest', (req, res) => {
  const userId = requireAuth(req, res);
  if (!userId) return;

  const guestItems = db.get('carts').find({ key: 'guest' }).value()?.items || [];
  const userKey = `user_${userId}`;

  if (!guestItems.length) {
    return res.json({ items: getCartItems(req) });
  }

  const userItems = db.get('carts').find({ key: userKey }).value()?.items || [];
  const merged = [...userItems];

  for (const item of guestItems) {
    if (merged.length >= 3) break;
    if (!merged.some((i) => i.id === item.id)) merged.push(item);
  }

  saveCartItemsByKey(userKey, merged);
  saveCartItemsByKey('guest', []);
  res.json({ items: merged });
});

app.get('/api/profile', (req, res) => {
  const userId = requireAuth(req, res);
  if (!userId) return;

  const user = db.get('users').find({ id: userId }).value();
  const profile = getUserProfile(userId);
  if (!user || !profile) {
    return res.status(404).json({ message: '找不到個人資料' });
  }

  res.json(buildProfileResponse(user, profile, getUserOrders(userId)));
});

app.post('/api/likeGoods', (req, res) => {
  const userId = requireAuth(req, res);
  if (!userId) return;

  const { courseId } = req.body;
  if (!courseId) {
    return res.status(400).json({ message: '請提供課程 ID' });
  }

  const course = db.get('courses').find({ id: Number(courseId) }).value();
  if (!course) {
    return res.status(404).json({ message: '找不到課程' });
  }

  const profile = getUserProfile(userId);
  if (profile.savedCourses.some((item) => item.courseId === course.id)) {
    return res.status(409).json({ message: '此課程已在收藏中' });
  }

  const savedCourses = [
    ...profile.savedCourses,
    {
      courseId: course.id,
      title: course.title,
      image: course.image,
      tag: course.tag,
      level: course.level,
    },
  ];

  saveSavedCourses(userId, savedCourses);
  res.status(201).json({ savedCourses });
});

app.delete('/api/likeGoods/:courseId', (req, res) => {
  const userId = requireAuth(req, res);
  if (!userId) return;

  const profile = getUserProfile(userId);
  const savedCourses = profile.savedCourses.filter(
    (item) => item.courseId !== Number(req.params.courseId)
  );

  saveSavedCourses(userId, savedCourses);
  res.json({ savedCourses });
});

app.post('/api/purchase', (req, res) => {
  const userId = requireAuth(req, res);
  if (!userId) return;

  const items = getCartItems(req);
  if (!items.length) {
    return res.status(400).json({ message: '購物車是空的' });
  }

  const createdOrders = items.map((item) => {
    const course = db.get('courses').find({ id: item.id }).value();
    const order = {
      id: generateOrderId(),
      userId,
      courseId: item.id,
      title: course?.title || item.title,
      price: item.price,
      status: 'completed',
      date: new Date().toISOString().slice(0, 10),
    };
    db.get('orders').push(order).write();
    if (course) addMyCourse(userId, course);
    return order;
  });

  saveCartItems(req, []);
  res.status(201).json({ orders: createdOrders });
});

app.get('/api/purchaseHistory', (req, res) => {
  const userId = requireAuth(req, res);
  if (!userId) return;
  res.json(getUserOrders(userId));
});

app.get('/api/purchaseHistory/:id', (req, res) => {
  const userId = requireAuth(req, res);
  if (!userId) return;

  const order = db.get('orders').find({ id: req.params.id, userId }).value();
  if (!order) {
    return res.status(404).json({ message: '找不到訂單' });
  }
  res.json(order);
});

app.patch('/api/purchaseHistory/:id', (req, res) => {
  const userId = requireAuth(req, res);
  if (!userId) return;

  const { status } = req.body;
  if (!status) {
    return res.status(400).json({ message: '請提供訂單狀態' });
  }

  const order = db.get('orders').find({ id: req.params.id, userId }).value();
  if (!order) {
    return res.status(404).json({ message: '找不到訂單' });
  }

  db.get('orders').find({ id: req.params.id }).assign({ status }).write();
  res.json({ ...order, status });
});

app.get('/api/popularSearches', (req, res) => {
  const items = db.get('popularSearches').value();
  res.json(items.map((item) => (typeof item === 'string' ? item : item.term)));
});

app.get(['/api', '/api/'], (req, res) => {
  res.json({
    message: 'Triangle Light Mock API',
    docs: `http://localhost:${PORT}/docs`,
    endpoints: {
      courses: '/api/courses',
      profile: '/api/profile',
      cart: '/api/cart',
      purchase: 'POST /api/purchase',
      purchaseHistory: '/api/purchaseHistory',
      likeGoods: 'POST /api/likeGoods',
    },
  });
});

app.get('/api/courses/:id', (req, res) => {
  const id = Number(req.params.id);
  const course = db.get('courses').find({ id }).value();
  if (!course) {
    return res.status(404).json({ message: '找不到課程' });
  }
  const user = getUser(req);
  const isOwner = user?.role === 'teacher' && course.teacherId === user.id;
  const isAdmin = user?.role === 'admin';
  if (course.status !== 'published' && !isOwner && !isAdmin) {
    return res.status(404).json({ message: '找不到課程' });
  }

  const detail = db.get('courseDetails').find({ courseId: id }).value();
  res.json(mergeCourseWithDetail(course, detail));
});

app.get('/api/courses', (req, res) => {
  const { q, status } = req.query;
  let courses = db.get('courses').value();
  const user = getUser(req);

  if (status) {
    if (user?.role !== 'teacher' && user?.role !== 'admin') {
      return res.status(403).json({ message: '權限不足' });
    }
    courses = courses.filter((c) => c.status === status);
    if (user?.role === 'teacher') {
      courses = courses.filter((c) => c.teacherId === user.id);
    }
  } else {
    courses = courses.filter((c) => c.status === 'published');
  }

  if (q) {
    const keyword = String(q).toLowerCase();
    courses = courses.filter(
      (course) =>
        course.title.toLowerCase().includes(keyword) ||
        course.author.toLowerCase().includes(keyword)
    );
  }
  res.json(courses);
});

// --- Notifications ---
app.get('/api/notifications', (req, res) => {
  const userId = requireAuth(req, res);
  if (!userId) return;
  const items = db.get('notifications').filter({ userId }).value() ?? [];
  res.json(items.sort((a, b) => b.id - a.id));
});

app.patch('/api/notifications/:id/read', (req, res) => {
  const userId = requireAuth(req, res);
  if (!userId) return;
  const notification = db
    .get('notifications')
    .find({ id: Number(req.params.id), userId })
    .value();
  if (!notification) return res.status(404).json({ message: '找不到通知' });
  db.get('notifications').find({ id: notification.id }).assign({ read: true }).write();
  res.json({ ...notification, read: true });
});

app.patch('/api/notifications/read-all', (req, res) => {
  const userId = requireAuth(req, res);
  if (!userId) return;
  const items = db.get('notifications').filter({ userId }).value() ?? [];
  items.forEach((n) => {
    db.get('notifications').find({ id: n.id }).assign({ read: true }).write();
  });
  res.json({ message: '已全部標為已讀' });
});

// --- Settings ---
app.patch('/api/settings/profile', (req, res) => {
  const userId = requireAuth(req, res);
  if (!userId) return;
  const { name, email } = req.body;
  const user = db.get('users').find({ id: userId }).value();
  const profile = getUserProfile(userId);
  if (!user || !profile) return res.status(404).json({ message: '找不到使用者' });

  if (name) db.get('users').find({ id: userId }).assign({ name }).write();
  if (email) db.get('userProfiles').find({ userId }).assign({ email }).write();

  const updatedUser = db.get('users').find({ id: userId }).value();
  const updatedProfile = getUserProfile(userId);
  res.json(buildProfileResponse(updatedUser, updatedProfile, getUserOrders(userId)));
});

app.patch('/api/settings/password', (req, res) => {
  const userId = requireAuth(req, res);
  if (!userId) return;
  const { currentPassword, newPassword, confirmPassword } = req.body;
  if (!currentPassword || !newPassword || !confirmPassword) {
    return res.status(400).json({ message: '請填寫完整資訊' });
  }
  if (newPassword !== confirmPassword) {
    return res.status(400).json({ message: '兩次密碼不一致' });
  }
  const user = db.get('users').find({ id: userId }).value();
  if (user.password !== currentPassword) {
    return res.status(401).json({ message: '目前密碼錯誤' });
  }
  db.get('users').find({ id: userId }).assign({ password: newPassword }).write();
  res.json({ message: '密碼更新成功' });
});

// --- Teacher ---
app.get('/api/teacher/courses', (req, res) => {
  const user = requireRole(req, res, ['teacher']);
  if (!user) return;
  const courses = db.get('courses').filter({ teacherId: user.id }).value();
  res.json(courses.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)));
});

app.post('/api/teacher/courses', (req, res) => {
  const user = requireRole(req, res, ['teacher']);
  if (!user) return;
  const { title, tag, level, dept, price, courseType, description } = req.body;
  if (!title) return res.status(400).json({ message: '請提供課程標題' });

  const courses = db.get('courses').value();
  const newCourse = {
    id: courses.length ? Math.max(...courses.map((c) => c.id)) + 1 : 1,
    title,
    image: '/images/courses/hot-1.png',
    tag: tag || '生活',
    level: level || 'A2',
    author: user.name,
    dept: dept || '生活英文',
    price: Number(price) || 0,
    students: 0,
    isHot: false,
    createdAt: new Date().toISOString(),
    courseType: courseType || '影音課',
    teacherId: user.id,
    status: 'draft',
    description: description || '',
  };
  db.get('courses').push(newCourse).write();
  res.status(201).json(newCourse);
});

app.patch('/api/teacher/courses/:id', (req, res) => {
  const user = requireRole(req, res, ['teacher']);
  if (!user) return;
  const course = db
    .get('courses')
    .find({ id: Number(req.params.id), teacherId: user.id })
    .value();
  if (!course) return res.status(404).json({ message: '找不到課程' });
  if (course.status === 'published') {
    return res.status(400).json({ message: '已上架課程無法直接編輯，請聯繫管理員' });
  }

  const allowed = ['title', 'tag', 'level', 'dept', 'price', 'courseType', 'description', 'image'];
  const updates = {};
  allowed.forEach((key) => {
    if (req.body[key] !== undefined) updates[key] = req.body[key];
  });
  db.get('courses').find({ id: course.id }).assign(updates).write();
  res.json({ ...course, ...updates });
});

app.post('/api/teacher/courses/:id/submit', (req, res) => {
  const user = requireRole(req, res, ['teacher']);
  if (!user) return;
  const course = db
    .get('courses')
    .find({ id: Number(req.params.id), teacherId: user.id })
    .value();
  if (!course) return res.status(404).json({ message: '找不到課程' });
  if (!['draft', 'rejected'].includes(course.status)) {
    return res.status(400).json({ message: '此課程狀態無法提交審核' });
  }

  db.get('courses').find({ id: course.id }).assign({ status: 'pending_review' }).write();
  const admins = db.get('users').filter({ role: 'admin' }).value();
  admins.forEach((admin) => {
    createNotification(db, {
      userId: admin.id,
      type: 'course_pending',
      title: '新課程待審核',
      message: `${user.name} 提交了「${course.title}」待審核。`,
    });
  });
  res.json({ ...course, status: 'pending_review' });
});

app.get('/api/teacher/courses/:id/students', (req, res) => {
  const user = requireRole(req, res, ['teacher']);
  if (!user) return;
  const course = db
    .get('courses')
    .find({ id: Number(req.params.id), teacherId: user.id })
    .value();
  if (!course) return res.status(404).json({ message: '找不到課程' });

  const orders = db
    .get('orders')
    .filter({ courseId: course.id, status: 'completed' })
    .value();
  const students = orders.map((order) => {
    const student = db.get('users').find({ id: order.userId }).value();
    const profile = getUserProfile(order.userId);
    const myCourse = profile?.myCourses?.find((c) => c.courseId === course.id);
    return {
      userId: order.userId,
      name: student?.name ?? '未知',
      email: profile?.email ?? '',
      progress: myCourse?.progress ?? 0,
      lastStudy: myCourse?.lastStudy ?? null,
      purchasedAt: order.date,
    };
  });
  res.json(students);
});

// --- Admin ---
app.get('/api/admin/stats', (req, res) => {
  const user = requireRole(req, res, ['admin']);
  if (!user) return;
  const orders = db.get('orders').value();
  const platformStats = db.get('platformStats').value() ?? {};
  res.json(computeAdminStats(orders, platformStats));
});

app.get('/api/admin/courses', (req, res) => {
  const user = requireRole(req, res, ['admin']);
  if (!user) return;
  const { status } = req.query;
  let courses = db.get('courses').value();
  if (status) courses = courses.filter((c) => c.status === status);
  res.json(courses.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)));
});

app.patch('/api/admin/courses/:id/review', (req, res) => {
  const user = requireRole(req, res, ['admin']);
  if (!user) return;
  const { action, reason } = req.body;
  if (!['approve', 'reject'].includes(action)) {
    return res.status(400).json({ message: '無效的審核動作' });
  }
  const course = db.get('courses').find({ id: Number(req.params.id) }).value();
  if (!course) return res.status(404).json({ message: '找不到課程' });
  if (course.status !== 'pending_review') {
    return res.status(400).json({ message: '此課程不在待審核狀態' });
  }

  const newStatus = action === 'approve' ? 'published' : 'rejected';
  db.get('courses').find({ id: course.id }).assign({ status: newStatus }).write();

  if (action === 'approve') {
    const existingDetail = db.get('courseDetails').find({ courseId: course.id }).value();
    if (!existingDetail) {
      db.get('courseDetails').push(buildDefaultCourseDetail({ ...course, status: newStatus })).write();
    }
  }

  createNotification(db, {
    userId: course.teacherId,
    type: 'course_review_result',
    title: action === 'approve' ? '課程審核通過' : '課程審核未通過',
    message:
      action === 'approve'
        ? `「${course.title}」已通過審核並上架。`
        : `「${course.title}」未通過審核。${reason ? `原因：${reason}` : ''}`,
  });
  res.json({ ...course, status: newStatus });
});

app.get('/api/admin/orders', (req, res) => {
  const user = requireRole(req, res, ['admin']);
  if (!user) return;
  const orders = db.get('orders').value().sort((a, b) => b.date.localeCompare(a.date));
  res.json(orders);
});

app.patch('/api/admin/orders/:id', (req, res) => {
  const user = requireRole(req, res, ['admin']);
  if (!user) return;
  const { status } = req.body;
  if (!status) return res.status(400).json({ message: '請提供訂單狀態' });
  const order = db.get('orders').find({ id: req.params.id }).value();
  if (!order) return res.status(404).json({ message: '找不到訂單' });
  db.get('orders').find({ id: order.id }).assign({ status }).write();
  res.json({ ...order, status });
});

app.get('/api/admin/users', (req, res) => {
  const user = requireRole(req, res, ['admin']);
  if (!user) return;
  const users = db.get('users').value().map(({ password, ...rest }) => rest);
  res.json(users);
});

app.patch('/api/admin/users/:id', (req, res) => {
  const user = requireRole(req, res, ['admin']);
  if (!user) return;
  const target = db.get('users').find({ id: Number(req.params.id) }).value();
  if (!target) return res.status(404).json({ message: '找不到使用者' });
  const { role, name } = req.body;
  const updates = {};
  if (role) updates.role = role;
  if (name) updates.name = name;
  db.get('users').find({ id: target.id }).assign(updates).write();
  const { password, ...safeUser } = { ...target, ...updates };
  res.json(safeUser);
});

app.get('/api/admin/ads', (req, res) => {
  const user = requireRole(req, res, ['admin']);
  if (!user) return;
  res.json(db.get('ads').value() ?? []);
});

app.post('/api/admin/ads', (req, res) => {
  const user = requireRole(req, res, ['admin']);
  if (!user) return;
  const { title, image, link, active, sortOrder } = req.body;
  if (!title) return res.status(400).json({ message: '請提供標題' });
  const ads = db.get('ads').value() ?? [];
  const newAd = {
    id: ads.length ? Math.max(...ads.map((a) => a.id)) + 1 : 1,
    title,
    image: image || '/images/courses/hot-1.png',
    link: link || '/',
    active: active !== false,
    sortOrder: sortOrder ?? ads.length + 1,
  };
  db.get('ads').push(newAd).write();
  res.status(201).json(newAd);
});

app.patch('/api/admin/ads/:id', (req, res) => {
  const user = requireRole(req, res, ['admin']);
  if (!user) return;
  const ad = db.get('ads').find({ id: Number(req.params.id) }).value();
  if (!ad) return res.status(404).json({ message: '找不到廣告' });
  db.get('ads').find({ id: ad.id }).assign(req.body).write();
  res.json({ ...ad, ...req.body });
});

app.delete('/api/admin/ads/:id', (req, res) => {
  const user = requireRole(req, res, ['admin']);
  if (!user) return;
  db.get('ads').remove({ id: Number(req.params.id) }).write();
  res.json({ message: '已刪除' });
});

app.use('/api', router);

app.get('/', (req, res) => {
  res.redirect('/docs');
});

app.listen(PORT, () => {
  console.log(`Mock API Server: http://localhost:${PORT}/api`);
  console.log(`Swagger UI:       http://localhost:${PORT}/docs`);
});
