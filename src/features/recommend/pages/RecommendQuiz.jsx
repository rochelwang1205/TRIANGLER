import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuizQuestions } from '@/features/recommend/api/useRecommend';
import { saveRecommendAnswer } from '../utils/recommendStorage';

export default function RecommendQuiz() {
  const { step } = useParams();
  const navigate = useNavigate();
  const currentStep = parseInt(step, 10);
  const [selected, setSelected] = useState(null);
  const { data: questions = [], isPending, error } = useQuizQuestions();

  const question = questions[currentStep - 1];

  useEffect(() => {
    if (!isPending && questions.length > 0 && !question) {
      navigate('/recommend');
    }
  }, [isPending, questions, question, navigate]);

  if (isPending) {
    return (
      <main className="recommend-page">
        <div className="container"><p>載入中...</p></div>
      </main>
    );
  }

  if (error) {
    return (
      <main className="recommend-page">
        <div className="container"><p>載入失敗：{error.message}</p></div>
      </main>
    );
  }

  if (!question) return null;

  const isLast = currentStep === questions.length;

  const handleNext = () => {
    saveRecommendAnswer(question.id, selected);
    if (isLast) {
      navigate('/recommend/loading');
    } else {
      navigate(`/recommend/quiz/${currentStep + 1}`);
    }
  };

  return (
    <main className="recommend-page">
      <div className="container quiz-container">
        <h2 className="quiz-title">{question.title}</h2>
        <div className="quiz-options">
          {question.options.map((option, idx) => (
            <button
              key={idx}
              type="button"
              className={`quiz-option ${selected === idx ? 'quiz-option--selected' : ''}`}
              onClick={() => setSelected(idx)}
            >
              {option}
            </button>
          ))}
        </div>
        <button
          type="button"
          className="btn-yellow btn-yellow--lg"
          disabled={selected === null}
          onClick={handleNext}
        >
          {isLast ? '獲得我的專屬課程' : '下一題'}
        </button>
      </div>
    </main>
  );
}
