import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { MdDeleteOutline } from 'react-icons/md';
import { useCart, CART_MAX } from '../context/CartContext';
import { useAuth } from '@/features/auth/context/AuthContext';
import AuthLoginModal from '@/features/auth/components/AuthLoginModal';

export default function Cart() {
  const { items, removeItem, total, isFull, loading } = useCart();
  const { isLoggedIn } = useAuth();
  const navigate = useNavigate();
  const [showLogin, setShowLogin] = useState(false);

  const handleCheckout = () => {
    if (!isLoggedIn) {
      setShowLogin(true);
      return;
    }
    navigate('/checkout');
  };

  const handleLoginSuccess = () => {
    setShowLogin(false);
    navigate('/checkout');
  };

  return (
    <main className="cart-page">
      <div className="container">
        <h1 className="page-title">購物車</h1>

        {isFull && (
          <p className="cart-page__limit">購物車已達上限（最多 {CART_MAX} 門課程）</p>
        )}

        <div className="cart-box">
          {loading ? (
            <p className="cart-box__empty">載入中...</p>
          ) : items.length === 0 ? (
            <p className="cart-box__empty">還沒有加入任何課程~</p>
          ) : (
            <ul className="cart-items">
              {items.map((item) => (
                <li key={item.id} className="cart-item">
                  <button type="button" className="cart-item__remove" onClick={() => removeItem(item.id)} aria-label="移除">
                    <MdDeleteOutline size={20} />
                  </button>
                  <div className="cart-item__info">
                    <h5>{item.title}</h5>
                    <p className="cart-item__price">$ {item.price.toLocaleString()}</p>
                    <button type="button" className="cart-item__discount">適用優惠方案</button>
                  </div>
                </li>
              ))}
            </ul>
          )}
          <div className="cart-box__total">
            <span>總計</span>
            <strong>$ {total.toLocaleString()}</strong>
          </div>
        </div>

        <div className="cart-actions">
          <Link to="/explore" className="btn-outline">繼續購物</Link>
          <button
            type="button"
            className="btn-yellow"
            disabled={items.length === 0}
            onClick={handleCheckout}
          >
            結帳
          </button>
        </div>

        {!isLoggedIn && showLogin && (
          <p className="auth-gate-hint">請先登入以繼續結帳</p>
        )}
      </div>

      <AuthLoginModal
        show={showLogin}
        onClose={() => setShowLogin(false)}
        onSuccess={handleLoginSuccess}
      />
    </main>
  );
}
