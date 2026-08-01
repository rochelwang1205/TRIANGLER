import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const dbPath = path.join(__dirname, '../server/db.json');
const db = JSON.parse(fs.readFileSync(dbPath, 'utf8'));

const TEACHER_ID = 4;
const ADMIN_ID = 5;

db.users = db.users.map((u) => ({ ...u, role: u.role ?? 'student' }));

if (!db.users.find((u) => u.id === TEACHER_ID)) {
  db.users.push({
    id: TEACHER_ID,
    account: 'teacher_sarah',
    password: 'TriangleDemo2026',
    name: 'Sarah Chen',
    role: 'teacher',
  });
}

if (!db.users.find((u) => u.id === ADMIN_ID)) {
  db.users.push({
    id: ADMIN_ID,
    account: 'admin',
    password: 'TriangleDemo2026',
    name: '李某某',
    role: 'admin',
  });
}

const authorTeacherMap = {
  'Sarah Chen': TEACHER_ID,
  'James Wu': TEACHER_ID,
  'Emily Lin': TEACHER_ID,
  'David Wang': TEACHER_ID,
};

db.courses = db.courses.map((c) => ({
  ...c,
  teacherId: c.teacherId ?? authorTeacherMap[c.author] ?? TEACHER_ID,
  status: c.status ?? 'published',
}));

const maxId = Math.max(...db.courses.map((c) => c.id));
if (!db.courses.find((c) => c.status === 'draft')) {
  db.courses.push({
    id: maxId + 1,
    title: '商務簡報英語（草稿）',
    image: '/images/courses/hot-1.png',
    tag: '商務',
    level: 'B2',
    author: 'Sarah Chen',
    dept: '商務英文',
    price: 4200,
    students: 0,
    isHot: false,
    createdAt: new Date().toISOString(),
    courseType: '影音課',
    teacherId: TEACHER_ID,
    status: 'draft',
  });
}

if (!db.courses.find((c) => c.status === 'pending_review')) {
  db.courses.push({
    id: maxId + 2,
    title: '面試英語實戰班',
    image: '/images/courses/hot-2.png',
    tag: '商務',
    level: 'B1',
    author: 'Sarah Chen',
    dept: '商務英文',
    price: 3800,
    students: 0,
    isHot: false,
    createdAt: new Date().toISOString(),
    courseType: '直播課',
    teacherId: TEACHER_ID,
    status: 'pending_review',
  });
}

if (!db.userProfiles.find((p) => p.userId === TEACHER_ID)) {
  db.userProfiles.push({
    userId: TEACHER_ID,
    email: 'teacher_sarah@triangle.com',
    avatar: null,
    achievements: [],
    myCourses: [],
    savedCourses: [],
  });
}

if (!db.userProfiles.find((p) => p.userId === ADMIN_ID)) {
  db.userProfiles.push({
    userId: ADMIN_ID,
    email: 'admin@triangle.com',
    avatar: null,
    achievements: [],
    myCourses: [],
    savedCourses: [],
  });
}

db.notifications = db.notifications ?? [
  {
    id: 1,
    userId: TEACHER_ID,
    type: 'course_review_result',
    title: '課程審核通知',
    message: '「面試英語實戰班」已提交審核，請等待管理員回覆。',
    read: false,
    createdAt: '2024-08-06T10:00:00',
  },
  {
    id: 2,
    userId: ADMIN_ID,
    type: 'course_pending',
    title: '新課程待審核',
    message: 'Sarah Chen 提交了「面試英語實戰班」待審核。',
    read: false,
    createdAt: '2024-08-06T10:05:00',
  },
  {
    id: 3,
    userId: 1,
    type: 'system',
    title: '歡迎使用 Triangle',
    message: '開始探索適合你的英語課程吧！',
    read: true,
    createdAt: '2024-08-01T09:00:00',
  },
];

db.ads = db.ads ?? [
  {
    id: 1,
    title: '夏季優惠',
    image: '/images/courses/hot-1.png',
    link: '/explore',
    active: true,
    sortOrder: 1,
  },
  {
    id: 2,
    title: 'IELTS 衝刺班',
    image: '/images/courses/hot-2.png',
    link: '/course/5',
    active: true,
    sortOrder: 2,
  },
];

db.platformStats = db.platformStats ?? { totalVisits: 948 };

fs.writeFileSync(dbPath, JSON.stringify(db, null, 2));
console.log('Migration complete: roles, teacher/admin users, course status, notifications, ads');
