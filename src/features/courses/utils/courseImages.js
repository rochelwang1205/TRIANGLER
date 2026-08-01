import imgDaily1 from '@/assets/material/img_recraft/首頁/img-daily-1.png';
import imgDaily2 from '@/assets/material/img_recraft/首頁/img-daily-2.png';
import imgDaily3 from '@/assets/material/img_recraft/首頁/img-daily-3.png';
import imgDaily4 from '@/assets/material/img_recraft/首頁/img-daily-4.png';
import imgDaily5 from '@/assets/material/img_recraft/首頁/img-daily-5.png';
import imgDaily6 from '@/assets/material/img_recraft/首頁/img-daily-6.png';
import imgTest1 from '@/assets/material/img_recraft/首頁/img-test-1.png';
import imgTest2 from '@/assets/material/img_recraft/首頁/img-test-2.png';
import imgTest3 from '@/assets/material/img_recraft/首頁/img-test-3.png';
import imgTest4 from '@/assets/material/img_recraft/首頁/img-test-4.png';
import imgTest5 from '@/assets/material/img_recraft/首頁/img-test-5.png';
import imgTest6 from '@/assets/material/img_recraft/首頁/img-test-6.png';
import imgHot1 from '@/assets/material/img_recraft/熱門課程/img-hot-1.png';
import imgHot2 from '@/assets/material/img_recraft/熱門課程/img-hot-2.png';
import imgHot3 from '@/assets/material/img_recraft/熱門課程/img-hot-3.png';
import imgHot4 from '@/assets/material/img_recraft/熱門課程/img-hot-4.png';
import imgBusiness1 from '@/assets/material/img_recraft/尋找課程/img-business-1 .png';
import imgBusiness2 from '@/assets/material/img_recraft/尋找課程/img-business-2.png';
import imgBusiness3 from '@/assets/material/img_recraft/尋找課程/img-business-3.png';
import imgBusiness4 from '@/assets/material/img_recraft/尋找課程/img-business-4.png';
import imgBusiness5 from '@/assets/material/img_recraft/尋找課程/img-business-5.png';
import imgTravel1 from '@/assets/material/img_recraft/尋找課程/img-travel-1.png';
import imgTravel2 from '@/assets/material/img_recraft/尋找課程/img-travel-2.png';
import imgTravel3 from '@/assets/material/img_recraft/尋找課程/img-travel-3.png';
import imgTravel4 from '@/assets/material/img_recraft/尋找課程/img-travel-4.png';
import imgTravel5 from '@/assets/material/img_recraft/尋找課程/img-travel-5.png';
import imgAcademic1 from '@/assets/material/img_recraft/尋找課程/img-academic-1.png';
import imgCourseAll from '@/assets/material/img_illustration/img_course-all.png';
import imgCourseLife from '@/assets/material/img_illustration/img_course-life.png';
import imgCourseTravel from '@/assets/material/img_illustration/img_course-travel.png';
import imgCourseBusiness from '@/assets/material/img_illustration/img_course-business.png';
import imgCourseAcademic from '@/assets/material/img_illustration/img_course-academic.png';
import imgCourseTest from '@/assets/material/img_illustration/img_course-test.png';
import imgCourseIssue from '@/assets/material/img_illustration/img_course-issue.png';
import imgCourseOther from '@/assets/material/img_illustration/img_course-other.png';

const courseImageMap = {
  '/images/courses/hot-1.png': imgHot1,
  '/images/courses/hot-2.png': imgHot2,
  '/images/courses/hot-3.png': imgHot3,
  '/images/courses/hot-4.png': imgHot4,
  '/images/courses/daily-1.png': imgDaily1,
  '/images/courses/daily-2.png': imgDaily2,
  '/images/courses/daily-3.png': imgDaily3,
  '/images/courses/daily-4.png': imgDaily4,
  '/images/courses/daily-5.png': imgDaily5,
  '/images/courses/daily-6.png': imgDaily6,
  '/images/courses/test-1.png': imgTest1,
  '/images/courses/test-2.png': imgTest2,
  '/images/courses/test-3.png': imgTest3,
  '/images/courses/test-4.png': imgTest4,
  '/images/courses/test-5.png': imgTest5,
  '/images/courses/test-6.png': imgTest6,
  '/images/courses/business-1.png': imgBusiness1,
  '/images/courses/business-2.png': imgBusiness2,
  '/images/courses/business-3.png': imgBusiness3,
  '/images/courses/business-4.png': imgBusiness4,
  '/images/courses/business-5.png': imgBusiness5,
  '/images/courses/travel-1.png': imgTravel1,
  '/images/courses/travel-2.png': imgTravel2,
  '/images/courses/travel-3.png': imgTravel3,
  '/images/courses/travel-4.png': imgTravel4,
  '/images/courses/travel-5.png': imgTravel5,
  '/images/courses/academic-1.png': imgAcademic1,
};

export const themeIcons = {
  all: imgCourseAll,
  life: imgCourseLife,
  travel: imgCourseTravel,
  business: imgCourseBusiness,
  academic: imgCourseAcademic,
  test: imgCourseTest,
  language: imgCourseIssue,
  other: imgCourseOther,
};

export const THEME_TAG_MAP = {
  all: null,
  life: '生活',
  travel: '旅遊',
  business: '商務',
  academic: '學術',
  test: '檢定',
  language: '語言',
  other: '其他',
};

export const SORT_PARAMS = {
  latest: { _sort: 'createdAt', _order: 'desc' },
  popular: { _sort: 'students', _order: 'desc' },
  price: { _sort: 'price', _order: 'asc' },
};

export function resolveCourseImage(imagePath) {
  return courseImageMap[imagePath] || imagePath;
}

export function resolveCourse(course) {
  return {
    ...course,
    image: resolveCourseImage(course.image),
  };
}

export function resolveCourses(courses) {
  return courses.map(resolveCourse);
}
