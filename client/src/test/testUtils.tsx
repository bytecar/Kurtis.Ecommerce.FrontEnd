import React, { ReactElement } from 'react';
import { render, RenderOptions } from '@testing-library/react';
import { AuthProvider } from '@/hooks/use-auth';
import { WishlistProvider } from '@/hooks/use-wishlist';
import { CartProvider } from '@/hooks/use-cart';
import { RecentlyViewedProvider } from '@/hooks/use-recently-viewed';
import { ThemeProvider } from '@/components/theme/theme-provider';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

// Create a custom render function that includes providers
const AllTheProviders = ({ children }: { children: React.ReactNode }) => {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        retry: false,
      },
    },
  });

  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider>
        <AuthProvider>
          <WishlistProvider>
            <CartProvider>
              <RecentlyViewedProvider>
                {children}
              </RecentlyViewedProvider>
            </CartProvider>
          </WishlistProvider>
        </AuthProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
};

const customRender = (
  ui: ReactElement,
  options?: Omit<RenderOptions, 'wrapper'>,
) => render(ui, { wrapper: AllTheProviders, ...options });

// re-export everything
export * from '@testing-library/react';

// override render method
export { customRender as render };