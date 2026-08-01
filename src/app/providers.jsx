import { QueryClientProvider } from '@tanstack/react-query';
import { queryClient } from '@/lib/react-query/queryClient';
import { AuthProvider } from '@/features/auth';
import { CartProvider } from '@/features/cart';

export function AppProviders({ children }) {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <CartProvider>{children}</CartProvider>
      </AuthProvider>
    </QueryClientProvider>
  );
}
