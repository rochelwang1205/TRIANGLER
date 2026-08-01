import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

export function createDefaultProfile(userId, account) {
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

export function generateOrderId() {
  const now = new Date();
  const date = now.toISOString().slice(0, 10).replace(/-/g, '');
  const seq = String(Math.floor(Math.random() * 90000000) + 10000000);
  return `${date}-${seq}`;
}

const unitTemplates = {
  檢定: [
    { id: 1, title: '單元 1 考試架構與題型分析', items: ['1.1 題型總覽', '1.2 時間分配策略', '作業 1 模擬測驗'] },
    { id: 2, title: '單元 2 核心解題技巧' },
    { id: 3, title: '單元 3 實戰演練' },
  ],
  生活: [
    { id: 1, title: '單元 1 日常會話基礎', items: ['1.1 問候與自我介紹', '1.2 購物用語'] },
    { id: 2, title: '單元 2 情境對話' },
    { id: 3, title: '單元 3 聽力強化' },
  ],
  商務: [
    { id: 1, title: '單元 1 商務溝通基礎', items: ['1.1 會議英文', '1.2 商務書信'] },
    { id: 2, title: '單元 2 簡報與談判' },
    { id: 3, title: '單元 3 跨文化溝通' },
  ],
  簡報: [
    { id: 1, title: '單元 1 簡報架構', items: ['1.1 開場技巧', '1.2 視覺輔助'] },
    { id: 2, title: '單元 2 口語表達' },
  ],
};

export function buildDefaultCourseDetail(course) {
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

export function mergeCourseWithDetail(course, detail) {
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

export function buildProfileResponse(user, profile, orders) {
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

export function computeAdminStats(orders, platformStats = {}, periodDays = 30) {
  const cutoff = new Date();
  cutoff.setDate(cutoff.getDate() - periodDays);
  const cutoffStr = cutoff.toISOString().slice(0, 10);

  const recent = orders.filter(
    (o) => o.status === 'completed' && o.date >= cutoffStr
  );
  const totalSales = recent.reduce((sum, o) => sum + o.price, 0);
  const totalOrders = recent.length;

  return {
    totalVisits: platformStats.totalVisits ?? 0,
    totalSales,
    totalOrders,
    avgOrderValue: totalOrders ? Math.round(totalSales / totalOrders) : 0,
  };
}

export function createNotification(db, { userId, type, title, message }) {
  const notifications = db.get('notifications').value() ?? [];
  const id = notifications.length
    ? Math.max(...notifications.map((n) => n.id)) + 1
    : 1;
  const notification = {
    id,
    userId,
    type,
    title,
    message,
    read: false,
    createdAt: new Date().toISOString().slice(0, 16).replace('T', ' '),
  };
  db.get('notifications').push(notification).write();
  return notification;
}

export const COURSE_STATUS_LABELS = {
  draft: '草稿',
  pending_review: '審核中',
  published: '已上架',
  rejected: '已退回',
  archived: '已下架',
};
