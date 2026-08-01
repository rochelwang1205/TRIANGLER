import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useAuth } from '@/features/auth/context/AuthContext';
import { api } from '@/lib/api/api';

export default function PaymentProcessing() {
  const navigate = useNavigate();
  const { clearCart } = useCart();
  const { isLoggedIn } = useAuth();

  useEffect(() => {
    if (!isLoggedIn) {
      navigate('/cart', { replace: true });
      return undefined;
    }

    const timer = setTimeout(async () => {
      try {
        await api.purchase();
        await clearCart();
        navigate('/checkout/success', { replace: true });
      } catch {
        navigate('/checkout/failure', { replace: true });
      }
    }, 2000);

    return () => clearTimeout(timer);
  }, [navigate, clearCart, isLoggedIn]);

  return (
    <main className="payment-status-page">
      <div className="container">
        <h1 className="page-title">付款中...</h1>
      </div>
    </main>
  );
}
