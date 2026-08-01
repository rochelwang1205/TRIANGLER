import { useMemo } from 'react';
import { Link } from 'react-router-dom';
import HeroCarousel from '../components/HeroCarousel';
import CourseCard from '@/features/courses/components/CourseCard';
import CourseCardWide from '@/features/courses/components/CourseCardWide';
import CourseCardRow from '@/features/courses/components/CourseCardRow';
import CourseCarousel from '@/features/courses/components/CourseCarousel';
import { useCourses } from '@/features/courses/api/useCourses';
import { useTestimonials } from '@/features/home/api/useTestimonials';
import { resolveCourses } from '@/features/courses/utils/courseImages';
import aboutBg from '@/assets/material/img_illustration/img_home-about-bg-lg.png';
import reviewBg from '@/assets/material/img_illustration/img_home-review-bg-lg.png';
import recommandImg from '@/assets/material/img_illustration/img_home-recommand-lg.png';

export default function Home() {
  const hotQuery = useCourses({ isHot: true });
  const testQuery = useCourses({ dept: '檢定英文' });
  const dailyQuery = useCourses({ dept: '生活英文' });
  const testimonialsQuery = useTestimonials();

  const hotCourses = useMemo(
    () => resolveCourses(hotQuery.data ?? []),
    [hotQuery.data]
  );
  const testCourses = useMemo(
    () => resolveCourses(testQuery.data ?? []),
    [testQuery.data]
  );
  const dailyCourses = useMemo(
    () => resolveCourses(dailyQuery.data ?? []),
    [dailyQuery.data]
  );
  const testimonials = testimonialsQuery.data ?? [];

  const loading =
    hotQuery.isPending ||
    testQuery.isPending ||
    dailyQuery.isPending ||
    testimonialsQuery.isPending;
  const error =
    hotQuery.error ||
    testQuery.error ||
    dailyQuery.error ||
    testimonialsQuery.error;

  if (loading) {
    return (
      <main className="home-page">
        <div className="container"><p>載入中...</p></div>
      </main>
    );
  }

  if (error) {
    return (
      <main className="home-page">
        <div className="container"><p>載入失敗：{error.message}</p></div>
      </main>
    );
  }

  return (
    <main className="home-page">
      <HeroCarousel />

      <section className="about-section">
        <img src={aboutBg} alt="" className="about-section__bg" aria-hidden="true" />
        <div className="container">
          <div className="about-section__deco about-section__deco--top" aria-hidden="true">▲</div>
          <h2 className="section-title">關於我們</h2>
          <div className="about-card">
            <h3>Triangle makes Perfect !</h3>
            <p>
              Triangle 是一個專為現代人設計的線上英文學習平台。我們相信，學習不應該是枯燥的背誦，
              而應該是充滿樂趣和成就感的旅程。
            </p>
            <p>
              我們運用遺忘曲線和間隔重複的科學原理，幫助你在最適合的時間複習，
              讓記憶更持久。無論你是忙碌的上班族還是積極的學生，
              Triangle 都能為你量身打造最適合的學習計畫。
            </p>
          </div>
          <div className="about-section__deco about-section__deco--bottom" aria-hidden="true">▼</div>
        </div>
      </section>

      <section className="recommend-banner">
        <div className="container">
          <div className="recommend-banner__card">
            <div className="recommend-banner__image">
              <img src={recommandImg} alt="客製化課程推薦" />
            </div>
            <div className="recommend-banner__text">
              <h3>客製化課程推薦</h3>
              <p>免費、免註冊。推薦適合您的課程與學習建議！</p>
              <Link to="/recommend" className="btn-yellow">立即體驗</Link>
            </div>
          </div>
        </div>
      </section>

      <section className="popular-section">
        <div className="container">
          <h2 className="section-title">熱門課程</h2>
          <CourseCarousel className="popular-carousel">
            {hotCourses.map((course) => (
              <CourseCardWide key={course.id} course={course} />
            ))}
          </CourseCarousel>
        </div>
      </section>

      <section className="course-grid-section">
        <div className="container">
          <h2 className="section-title">檢定英文</h2>
          <div className="course-grid course-grid--desktop">
            {testCourses.map((course) => (
              <CourseCard key={course.id} course={course} />
            ))}
          </div>
          <div className="course-list-mobile">
            {testCourses.map((course) => (
              <CourseCardRow key={course.id} course={course} />
            ))}
          </div>
          <p className="more-link"><Link to="/explore">更多課程</Link></p>
        </div>
      </section>

      <section className="course-grid-section">
        <div className="container">
          <h2 className="section-title">生活英文</h2>
          <div className="course-grid course-grid--desktop">
            {dailyCourses.map((course) => (
              <CourseCard key={course.id} course={course} />
            ))}
          </div>
          <div className="course-list-mobile">
            {dailyCourses.map((course) => (
              <CourseCardRow key={course.id} course={course} />
            ))}
          </div>
          <p className="more-link"><Link to="/explore">更多課程</Link></p>
        </div>
      </section>

      <section className="review-section">
        <img src={reviewBg} alt="" className="review-section__bg" aria-hidden="true" />
        <div className="container">
          <h2 className="section-title">學員好評</h2>
          <CourseCarousel className="review-carousel">
            {testimonials.map((item) => (
              <div key={item.id} className="review-card">
                <h6 className="review-card__name">{item.name}</h6>
                {item.title && <p className="review-card__headline">{item.title}</p>}
                <div className="review-card__stars">
                  {'★'.repeat(item.rating)}{'☆'.repeat(5 - item.rating)}
                </div>
                <p>{item.text}</p>
              </div>
            ))}
          </CourseCarousel>
        </div>
      </section>

      <section className="cta-section">
        <div className="container text-center">
          <h2>現在加入 Triangle 學習！</h2>
          <button
            type="button"
            className="btn-yellow btn-yellow--lg"
            onClick={() => document.querySelector('.navbar-icons button[aria-label="登入"]')?.click()}
          >
            立即註冊
          </button>
        </div>
      </section>
    </main>
  );
}
