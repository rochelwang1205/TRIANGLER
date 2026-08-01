import FaqAccordion from '../components/FaqAccordion';
import { useFaqCategories } from '@/features/faq/api/useFaq';

export default function FAQ() {
  const { data: categories = [], isPending, error } = useFaqCategories();

  return (
    <main className="faq-page">
      <div className="container">
        <h1 className="page-title">FAQ</h1>
        {isPending && <p>載入中...</p>}
        {error && <p>載入失敗：{error.message}</p>}
        {!isPending && !error && <FaqAccordion categories={categories} />}
        <div className="faq-page__cta">
          <a href="mailto:support@triangle.com" className="btn-yellow">來信詢問</a>
        </div>
      </div>
    </main>
  );
}
