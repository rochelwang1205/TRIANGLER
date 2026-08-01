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
    user: { id: user.id, account: user.account, name: user.name },
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
  };

  db.get('users').push(newUser).write();
  db.get('userProfiles').push(createDefaultProfile(newUser.id, account)).write();

  res.status(201).json({
    token: `mock-jwt-token-${newUser.id}`,
    user: { id: newUser.id, account: newUser.account, name: newUser.name },
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

  const detail = db.get('courseDetails').find({ courseId: id }).value();
  res.json(mergeCourseWithDetail(course, detail));
});

app.get('/api/courses', (req, res, next) => {
  const { q } = req.query;
  if (q) {
    const keyword = String(q).toLowerCase();
    const courses = db
      .get('courses')
      .filter(
        (course) =>
          course.title.toLowerCase().includes(keyword) ||
          course.author.toLowerCase().includes(keyword)
      )
      .value();
    return res.json(courses);
  }
  next();
});

app.use('/api', router);

app.get('/', (req, res) => {
  res.redirect('/docs');
});

app.listen(PORT, () => {
  console.log(`Mock API Server: http://localhost:${PORT}/api`);
  console.log(`Swagger UI:       http://localhost:${PORT}/docs`);
});
