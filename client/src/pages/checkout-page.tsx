import { useEffect } from "react";
import { useLocation } from "wouter";
import { useCart } from "@/hooks/use-cart";
import { useAuth } from "@/hooks/use-auth";
import { Button } from "@/components/ui/button";
import { CartView } from "@/components/checkout/cart-view";
import { CheckoutForm } from "@/components/checkout/checkout-form";
import { AlertCircle, ShoppingBag } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

export default function CheckoutPage() {
  const [, navigate] = useLocation();
  const { user } = useAuth();
  const { items, totalItems } = useCart();
  
  useEffect(() => {
    document.title = "Checkout | Kurtis & More";
  }, []);
  
  // If cart is empty, redirect to cart page
  useEffect(() => {
    if (items.length === 0) {
      navigate("/cart");
    }
  }, [items, navigate]);
  
  if (items.length === 0) {
    return (
      <div className="container mx-auto px-4 py-16 max-w-6xl">
        <h1 className="text-3xl font-serif font-bold mb-8">Checkout</h1>
        
        <div className="text-center py-16 border rounded-lg">
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-muted mb-4">
            <ShoppingBag className="h-10 w-10 text-muted-foreground" />
          </div>
          <h2 className="text-2xl font-medium mb-2">Your cart is empty</h2>
          <p className="text-muted-foreground mb-6 max-w-md mx-auto">
            Please add some items to your cart before proceeding to checkout.
          </p>
          <Button onClick={() => navigate("/products/women")}>
            Shop Now
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-16 max-w-6xl">
      <h1 className="text-3xl font-serif font-bold mb-8">Checkout</h1>
      
      {/* Guest Checkout Alert */}
      {!user && (
        <Alert className="mb-8">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Checking out as a guest</AlertTitle>
          <AlertDescription className="flex flex-col sm:flex-row gap-4 justify-between items-start sm:items-center">
            <span>You are checking out as a guest. To track your orders and maintain a purchase history, please log in or create an account.</span>
            <Button variant="outline" onClick={() => navigate("/auth")}>
              Login / Register
            </Button>
          </AlertDescription>
        </Alert>
      )}
      
      {/* Mobile Order Summary - Only visible on mobile */}
      <div className="md:hidden mb-8">
        <details className="border rounded-lg">
          <summary className="flex justify-between items-center p-4 cursor-pointer">
            <span className="font-medium">Order Summary ({totalItems} {totalItems === 1 ? 'item' : 'items'})</span>
            <span className="text-primary">
              Show details ▼
            </span>
          </summary>
          <div className="p-4 border-t">
            <CartView showCheckoutButton={false} />
          </div>
        </details>
      </div>
      
      {/* Checkout Form */}
      <CheckoutForm />
    </div>
  );
}
