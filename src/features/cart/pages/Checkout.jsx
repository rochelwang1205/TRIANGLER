import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { MdDeleteOutline } from 'react-icons/md';
import { useCart } from '../context/CartContext';
import { useAuth } from '@/features/auth/context/AuthContext';
import AuthLoginModal from '@/features/auth/components/AuthLoginModal';
import { checkoutSchema } from '@/lib/validation/schemas';

const PAYMENT_METHODS = [
  '信用卡一次付清',
  '信用卡分期',
  'Web ATM',
  'ATM 轉帳',
  '銀聯卡',
  '超商代碼',
  'LINE Pay',
];

function FieldError({ message }) {
  return message ? <p className="auth-error">{message}</p> : null;
}

export default function Checkout() {
  const { items, removeItem, total, loading } = useCart();
  const { isLoggedIn } = useAuth();
  const navigate = useNavigate();
  const [method, setMethod] = useState(PAYMENT_METHODS[0]);
  const [showLogin, setShowLogin] = useState(false);
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(checkoutSchema),
    defaultValues: { number: '', expiry: '', cvc: '', email: '' },
  });

  useEffect(() => {
    if (!isLoggedIn) {
      setShowLogin(true);
    }
  }, [isLoggedIn]);

  if (loading) {
    return (
      <main className="checkout-page">
        <div className="container text-center">
          <h1 className="page-title">結帳</h1>
          <p>載入中...</p>
        </div>
      </main>
    );
  }

  if (items.length === 0) {
    return (
      <main className="checkout-page">
        <div className="container text-center">
          <h1 className="page-title">結帳</h1>
          <p>購物車是空的</p>
          <Link to="/explore" className="btn-yellow">前往選課</Link>
        </div>
      </main>
    );
  }

  const onSubmit = () => {
    if (!isLoggedIn) {
      setShowLogin(true);
      return;
    }
    navigate('/checkout/processing');
  };

  if (!isLoggedIn) {
    return (
      <main className="checkout-page">
        <div className="container text-center">
          <h1 className="page-title">結帳</h1>
          <p className="auth-gate-hint">請先登入以繼續結帳付款</p>
          <Link to="/cart" className="btn-outline">返回購物車</Link>
        </div>
        <AuthLoginModal
          show={showLogin}
          onClose={() => navigate('/cart')}
          onSuccess={() => setShowLogin(false)}
        />
      </main>
    );
  }

  const requiresCard = method.startsWith('信用卡');

  return (
    <main className="checkout-page">
      <div className="container">
        <h1 className="page-title">結帳</h1>
        <div className="checkout-grid">
          <section className="checkout-order">
            <h3>訂單資訊</h3>
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
            <div className="cart-box__total">
              <span>總計</span>
              <strong>$ {total.toLocaleString()}</strong>
            </div>
          </section>

          <section className="checkout-payment">
            <h3>付款</h3>
            <form onSubmit={requiresCard ? handleSubmit(onSubmit) : (e) => { e.preventDefault(); onSubmit(); }}>
              <div className="checkout-payment__methods">
                <h6>付款方式</h6>
                {PAYMENT_METHODS.map((m) => (
                  <label key={m} className="payment-radio">
                    <input type="radio" name="method" value={m} checked={method === m} onChange={() => setMethod(m)} />
                    {m}
                  </label>
                ))}
              </div>
              {requiresCard && (
                <div className="checkout-payment__form">
                  <h6>付款資訊</h6>
                  <div className="auth-field">
                    <input type="text" placeholder=" " {...register('number')} />
                    <label>信用卡號</label>
                  </div>
                  <FieldError message={errors.number?.message} />
                  <div className="checkout-payment__row">
                    <div>
                      <div className="auth-field">
                        <input type="text" placeholder=" " {...register('expiry')} />
                        <label>有效年月</label>
                      </div>
                      <FieldError message={errors.expiry?.message} />
                    </div>
                    <div>
                      <div className="auth-field">
                        <input type="text" placeholder=" " {...register('cvc')} />
                        <label>背面末三碼</label>
                      </div>
                      <FieldError message={errors.cvc?.message} />
                    </div>
                  </div>
                  <div className="auth-field">
                    <input type="email" placeholder=" " {...register('email')} />
                    <label>付款人信箱</label>
                  </div>
                  <FieldError message={errors.email?.message} />
                </div>
              )}
              <div className="checkout-actions">
                <Link to="/cart" className="btn-outline">返回購物車</Link>
                <button type="submit" className="btn-yellow">確認付款</button>
              </div>
            </form>
          </section>
        </div>
      </div>
    </main>
  );
}
