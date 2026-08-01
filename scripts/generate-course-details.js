import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const dbPath = path.join(__dirname, '../server/db.json');

const db = JSON.parse(fs.readFileSync(dbPath, 'utf8'));

const unitTemplates = {
  檢定: [
    { id: 1, title: '單元 1 考試架構與題型分析', items: ['1.1 題型總覽', '1.2 時間分配策略', '作業 1 模擬測驗'] },
    { id: 2, title: '單元 2 核心解題技巧' },
    { id: 3, title: '單元 3 實戰演練' },
    { id: 4, title: '單元 4 弱點強化' },
    { id: 5, title: '單元 5 全真模擬' },
  ],
  生活: [
    { id: 1, title: '單元 1 日常會話基礎', items: ['1.1 問候與自我介紹', '1.2 購物用語', '作業 1 口說練習'] },
    { id: 2, title: '單元 2 情境對話' },
    { id: 3, title: '單元 3 聽力強化' },
    { id: 4, title: '單元 4 寫作應用' },
  ],
  商務: [
    { id: 1, title: '單元 1 商務溝通基礎', items: ['1.1 會議英文', '1.2 商務書信', '作業 1 簡報練習'] },
    { id: 2, title: '單元 2 簡報與談判' },
    { id: 3, title: '單元 3 跨文化溝通' },
    { id: 4, title: '單元 4 實務案例' },
  ],
  旅遊: [
    { id: 1, title: '單元 1 機場與交通', items: ['1.1 報到劃位', '1.2 問路用語', '作業 1 對話練習'] },
    { id: 2, title: '單元 2 住宿與餐飲' },
    { id: 3, title: '單元 3 購物與緊急狀況' },
  ],
  學術: [
    { id: 1, title: '單元 1 學術寫作架構', items: ['1.1 論文結構', '1.2 引用格式', '作業 1 摘要撰寫'] },
    { id: 2, title: '單元 2 論述與論證' },
    { id: 3, title: '單元 3 口頭報告' },
    { id: 4, title: '單元 4 研究倫理' },
  ],
};

const reviewPool = [
  { name: 'jasmine Hung', title: '迅速的學習效果', rating: 5, text: '課程節奏很好，解題技巧非常實用！' },
  { name: 'jason08', title: '清晰的課程架構', rating: 5, text: '每個單元都有明確目標，學起來很有方向。' },
  { name: 'Amy Lin', title: '講師講解到位', rating: 5, text: '複雜的題型講解得很清楚。' },
  { name: 'Kevin Wu', title: '值得推薦', rating: 4, text: '模擬考部分幫助很大，成績有明顯提升。' },
];

function buildDetail(course, index) {
  const units = unitTemplates[course.tag] || unitTemplates['生活'];
  const unitCount = units.length;
  const chapterCount = unitCount * 3 + 2;

  return {
    courseId: course.id,
    description: [
      `《${course.title}》由 ${course.author} 主講，適合 ${course.level} 程度學員，聚焦${course.dept}實戰應用。`,
      '課程採循序漸進設計，結合理論講解、例題演練與課後作業，幫助你在有限時間內建立完整能力。',
      '完成課程後可獲得個人化學習進度追蹤與複習提醒，有效提升學習效率。',
    ],
    chapters: `${unitCount} 個單元 共 ${chapterCount} 個章節, ${unitCount + 1} 項作業`,
    duration: `${10 + (index % 8)} 小時 ${15 + (index % 45)} 分鐘`,
    units,
    reviews: reviewPool.slice(0, 3 + (index % 2)),
  };
}

const COURSE_TYPES = ['影音課', '直播課', '演講', '說明會'];

db.courses = db.courses.map((course, index) => ({
  ...course,
  courseType: course.courseType || COURSE_TYPES[index % COURSE_TYPES.length],
}));

db.courseDetails = db.courses.map((course, index) => buildDetail(course, index));

if (!db.orders) {
  db.orders = [
    {
      id: '20240806-00000181',
      userId: 1,
      courseId: 7,
      title: '托福寫作精修班',
      price: 4800,
      status: 'completed',
      date: '2024-08-06',
    },
    {
      id: '20240715-00000102',
      userId: 1,
      courseId: 2,
      title: 'IELTS考試成功策略',
      price: 5500,
      status: 'completed',
      date: '2024-07-15',
    },
  ];
}

db.userProfiles[0].orders = db.orders
  .filter((order) => order.userId === 1)
  .map(({ id, date, title, price, status }) => ({ id, date, title, price, status }));

fs.writeFileSync(dbPath, `${JSON.stringify(db, null, 2)}\n`);
console.log(`Generated ${db.courseDetails.length} course details`);
