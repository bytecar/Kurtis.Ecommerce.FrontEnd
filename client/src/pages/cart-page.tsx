import { useEffect } from "react";
import { Link } from "wouter";
import { useCart } from "@/hooks/use-cart";
import { CartView } from "@/components/checkout/cart-view";
import { Button } from "@/components/ui/button";
import { ShoppingBag } from "lucide-react";

export default function CartPage() {
  const { items, totalItems } = useCart();
  
  useEffect(() => {
    document.title = `Cart (${totalItems}) | Kurtis & More`;
  }, [totalItems]);

  // If cart is empty, show a message
  if (items.length === 0) {
    return (
      <div className="container mx-auto px-4 py-16 max-w-6xl">
        <h1 className="text-3xl font-serif font-bold mb-8">Your Shopping Cart</h1>
        
        <div className="text-center py-16 border rounded-lg">
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-muted mb-4">
            <ShoppingBag className="h-10 w-10 text-muted-foreground" />
          </div>
          <h2 className="text-2xl font-medium mb-2">Your cart is empty</h2>
          <p className="text-muted-foreground mb-6 max-w-md mx-auto">
            Looks like you haven't added any items to your cart yet. 
            Continue shopping and add items that you like.
          </p>
          <Link href="/products/women">
            <Button size="lg">
              Continue Shopping
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  // Show cart items
  return (
    <div className="container mx-auto px-4 py-16 max-w-4xl">
      <h1 className="text-3xl font-serif font-bold mb-2">Your Shopping Cart</h1>
      <p className="text-muted-foreground mb-8">{totalItems} {totalItems === 1 ? 'item' : 'items'} in your cart</p>
      
      <CartView 
        onCheckout={() => window.location.href = "/checkout"}
      />
      
      <div className="mt-8 border-t pt-8">
        <h2 className="text-lg font-medium mb-4">Have a promo code?</h2>
        <div className="flex gap-2 max-w-md">
          <input 
            type="text" 
            placeholder="Enter coupon code" 
            className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
          />
          <Button variant="outline">Apply</Button>
        </div>
      </div>
      
      <div className="mt-12 flex justify-between items-center flex-wrap gap-4">
        <Link href="/products/women">
          <Button variant="outline">
            &larr; Continue Shopping
          </Button>
        </Link>
        <Link href="/checkout">
          <Button size="lg">
            Proceed to Checkout
          </Button>
        </Link>
      </div>
    </div>
  );
}
