import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSubmitRecommend } from '@/features/recommend/api/useRecommend';
import { getRecommendAnswers, setRecommendResults } from '../utils/recommendStorage';
import { resolveCourses } from '@/features/courses/utils/courseImages';

export default function RecommendLoading() {
  const navigate = useNavigate();
  const submitRecommend = useSubmitRecommend({
    onSuccess: (data) => {
      setRecommendResults(resolveCourses(data.courses));
      setTimeout(() => navigate('/recommend/result'), 1500);
    },
  });

  useEffect(() => {
    submitRecommend.mutate(getRecommendAnswers());
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <main className="recommend-page">
      <div className="container recommend-loading">
        <h1 className="page-title">
          {submitRecommend.error ? '推薦失敗' : '客製化課程推薦中...'}
        </h1>
        {submitRecommend.error ? (
          <p>{submitRecommend.error.message}</p>
        ) : (
          <div className="loading-placeholder" />
        )}
      </div>
    </main>
  );
}
