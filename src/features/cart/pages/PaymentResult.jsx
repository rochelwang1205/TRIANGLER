import { Link, useParams } from 'react-router-dom';

export default function PaymentResult() {
  const { status } = useParams();
  const success = status === 'success';

  return (
    <main className="payment-status-page">
      <div className="container">
        <h1 className="page-title">{success ? '付款成功！' : '付款失敗'}</h1>
        {!success && <p className="payment-status-page__msg">付款未能完成，請稍後再試或更換付款方式。</p>}
        <div className="cart-actions">
          <Link to="/explore" className="btn-outline">繼續購物</Link>
          {success ? (
            <Link to="/profile" className="btn-yellow">查看我的課程</Link>
          ) : (
            <Link to="/checkout" className="btn-yellow">重新付款</Link>
          )}
        </div>
      </div>
    </main>
  );
}
