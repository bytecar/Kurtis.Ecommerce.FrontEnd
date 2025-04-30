import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { ThemeProvider } from "@/components/theme/theme-provider";
import NotFound from "@/pages/not-found";
import HomePage from "@/pages/home-page";
import AuthPage from "@/pages/auth-page";
import ProductListing from "@/pages/product-listing";
import ProductDetail from "@/pages/product-detail";
import CartPage from "@/pages/cart-page";
import CheckoutPage from "@/pages/checkout-page";
import WishlistPage from "@/pages/wishlist-page";
import ProfilePage from "@/pages/profile-page";
import OrdersPage from "@/pages/orders-page";
import OrderDetailPage from "@/pages/order-detail-page";
import ReturnsPage from "@/pages/returns-page";
import DashboardPage from "@/pages/admin/dashboard-page";
import InventoryPage from "@/pages/admin/inventory-page";
import ReviewPage from "@/pages/admin/review-page";
import { AuthProvider } from "@/hooks/use-auth";
import { CartProvider } from "@/hooks/use-cart";
import { WishlistProvider } from "@/hooks/use-wishlist";
import { RecentlyViewedProvider } from "@/hooks/use-recently-viewed";
import { ProtectedRoute } from "@/lib/protected-route";
import { AdminRoute } from "@/lib/protected-route";
import { ContentManagerRoute } from "@/lib/protected-route";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";

function Router() {
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-grow">
        <Switch>
          <Route path="/" component={HomePage} />
          <Route path="/auth" component={AuthPage} />
          <Route path="/products/:gender" component={ProductListing} />
          <Route path="/product/:id" component={ProductDetail} />
          <Route path="/cart" component={CartPage} />
          <Route path="/checkout" component={CheckoutPage} />
          
          {/* Protected routes for logged-in users */}
          <ProtectedRoute path="/wishlist" component={WishlistPage} />
          <ProtectedRoute path="/profile" component={ProfilePage} />
          <ProtectedRoute path="/orders" component={OrdersPage} />
          <ProtectedRoute path="/order/:id" component={OrderDetailPage} />
          <ProtectedRoute path="/returns" component={ReturnsPage} />
          
          {/* Admin routes */}
          <AdminRoute path="/admin/dashboard" component={DashboardPage} />
          <AdminRoute path="/admin/reviews" component={ReviewPage} />
          
          {/* Content Manager routes */}
          <ContentManagerRoute path="/admin/inventory" component={InventoryPage} />
          
          {/* Fallback 404 */}
          <Route component={NotFound} />
        </Switch>
      </main>
      <Footer />
    </div>
  );
}

function App() {
  return (
    <ThemeProvider defaultTheme="light" attribute="class">
      <QueryClientProvider client={queryClient}>
        <AuthProvider>
          <CartProvider>
            <WishlistProvider>
              <RecentlyViewedProvider>
                <TooltipProvider>
                  <Toaster />
                  <Router />
                </TooltipProvider>
              </RecentlyViewedProvider>
            </WishlistProvider>
          </CartProvider>
        </AuthProvider>
      </QueryClientProvider>
    </ThemeProvider>
  );
}

export default App;
