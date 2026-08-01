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

export function mergeCourseWithDetail(course, detail) {
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

export function buildProfileResponse(user, profile, orders) {
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
