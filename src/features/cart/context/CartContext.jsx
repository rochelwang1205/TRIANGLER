import { createContext, useContext, useMemo, useState, useCallback, useEffect } from 'react';
import { api } from '@/lib/api/api';
import { useAuth } from '@/features/auth/context/AuthContext';

export const CART_MAX = 3;

const CartContext = createContext(null);

export function CartProvider({ children }) {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  const refreshCart = useCallback(async () => {
    try {
      const data = await api.getCart();
      setItems(Array.isArray(data) ? data : data.items || []);
    } catch {
      setItems([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    refreshCart();
  }, [refreshCart, user]);

  const addItem = useCallback(async (course) => {
    try {
      const data = await api.addToCart(course.id);
      const next = data.items || data;
      setItems(next);
      return null;
    } catch (err) {
      return err.message || '加入購物車失敗';
    }
  }, []);

  const removeItem = useCallback(async (id) => {
    try {
      const data = await api.removeFromCart(id);
      setItems(data.items || data);
    } catch (err) {
      console.error(err);
    }
  }, []);

  const clearCart = useCallback(async () => {
    try {
      await api.clearCart();
      setItems([]);
    } catch (err) {
      console.error(err);
    }
  }, []);

  const total = useMemo(
    () => items.reduce((sum, item) => sum + item.price, 0),
    [items]
  );

  const value = useMemo(
    () => ({
      items,
      addItem,
      removeItem,
      clearCart,
      refreshCart,
      total,
      count: items.length,
      isFull: items.length >= CART_MAX,
      loading,
    }),
    [items, addItem, removeItem, clearCart, refreshCart, total, loading]
  );

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error('useCart must be used within CartProvider');
  return ctx;
}
