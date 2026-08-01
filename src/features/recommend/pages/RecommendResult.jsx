import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { CourseCardRecommend } from '@/features/courses/components/CourseCardWide';
import { getRecommendResults } from '../utils/recommendStorage';

export default function RecommendResult() {
  const [courses, setCourses] = useState([]);

  useEffect(() => {
    setCourses(getRecommendResults());
  }, []);

  return (
    <main className="recommend-page">
      <div className="container">
        <h1 className="page-title">我的專屬課程</h1>
        {courses.length === 0 ? (
          <p>尚無推薦結果，請先完成測驗。</p>
        ) : (
          <div className="recommend-grid">
            {courses.map((course) => (
              <CourseCardRecommend key={course.id} course={course} />
            ))}
          </div>
        )}
        <div className="recommend-result__actions">
          <Link to="/explore" className="btn-yellow btn-yellow--lg">探索更多課程</Link>
          <Link to="/recommend" className="recommend-retry">重新推薦課程</Link>
        </div>
      </div>
    </main>
  );
}
