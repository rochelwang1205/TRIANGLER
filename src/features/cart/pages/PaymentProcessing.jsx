import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useQueryClient } from '@tanstack/react-query';
import { useCart } from '../context/CartContext';
import { useAuth } from '@/features/auth/context/AuthContext';
import { api } from '@/lib/api/api';
import { queryKeys } from '@/lib/react-query/queryKeys';

export default function PaymentProcessing() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
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
        queryClient.invalidateQueries({ queryKey: queryKeys.profile });
        navigate('/checkout/success', { replace: true });
      } catch {
        navigate('/checkout/failure', { replace: true });
      }
    }, 2000);

    return () => clearTimeout(timer);
  }, [navigate, clearCart, isLoggedIn, queryClient]);

  return (
    <main className="payment-status-page">
      <div className="container">
        <h1 className="page-title">付款中...</h1>
      </div>
    </main>
  );
}
