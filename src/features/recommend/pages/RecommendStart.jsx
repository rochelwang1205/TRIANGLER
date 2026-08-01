import { Link } from 'react-router-dom';
import recommandImg from '@/assets/material/img_illustration/img_home-recommand-lg.png';
import { clearRecommendData } from '../utils/recommendStorage';

export default function RecommendStart() {
  const handleStart = () => {
    clearRecommendData();
  };

  return (
    <main className="recommend-page">
      <div className="container recommend-start">
        <h1 className="page-title">客製化課程推薦</h1>
        <div className="recommend-start__image">
          <img src={recommandImg} alt="客製化課程推薦" />
        </div>
        <p className="recommend-start__desc">
          透過簡單的六題測驗，找到最適合自己的英文學習課程！
        </p>
        <Link to="/recommend/quiz/1" className="btn-yellow btn-yellow--lg" onClick={handleStart}>
          開始我的推薦
        </Link>
      </div>
    </main>
  );
}
