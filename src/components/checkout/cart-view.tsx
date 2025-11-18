import { useCart } from "@/hooks/use-cart";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Loader2, Trash2 } from "lucide-react";
import { useState } from "react";

interface CartViewProps {
  showCheckoutButton?: boolean;
  onCheckout?: () => void;
}

export function CartView({ showCheckoutButton = true, onCheckout }: CartViewProps) {
  const { items, totalPrice, totalItems, updateQuantity, removeItem } = useCart();
  const [removingItems, setRemovingItems] = useState<{[key: string]: boolean}>({});
  const [updatingItems, setUpdatingItems] = useState<{[key: string]: boolean}>({});

  const handleUpdateQuantity = (productId: number, size: string, quantity: number) => {
    const key = `${productId}-${size}`;
    setUpdatingItems({ ...updatingItems, [key]: true });
    
    // Simulate a slight delay to show loading state
    setTimeout(() => {
      updateQuantity(productId, size, quantity);
      setUpdatingItems({ ...updatingItems, [key]: false });
    }, 300);
  };

  const handleRemoveItem = (productId: number, size: string) => {
    const key = `${productId}-${size}`;
    setRemovingItems({ ...removingItems, [key]: true });
    
    // Simulate a slight delay to show loading state
    setTimeout(() => {
      removeItem(productId, size);
      setRemovingItems({ ...removingItems, [key]: false });
    }, 300);
  };

  if (items.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-12">
        <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mb-4">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-12 w-12 text-gray-400"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1.5}
              d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"
            />
          </svg>
        </div>
        <h3 className="text-xl font-medium mb-1">Your cart is empty</h3>
        <p className="text-gray-500 mb-4">Looks like you haven't added any items to your cart yet.</p>
        <Button onClick={() => window.location.href = "/"}>Continue Shopping</Button>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {items.map((item) => {
        const key = `${item.product.id}-${item.size}`;
        const isRemoving = removingItems[key];
        const isUpdating = updatingItems[key];
        
        return (
          <Card key={key} className="overflow-hidden">
            <CardContent className="p-0">
              <div className="flex flex-col sm:flex-row">
                <div className="w-full sm:w-24 h-24 sm:h-auto">
                  <img
                    src={
                      Array.isArray(item.product.imageUrls) && item.product.imageUrls.length > 0
                        ? item.product.imageUrls[0]
                        : "https://placehold.co/400x400"
                    }
                    alt={item.product.name}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="p-4 flex-1">
                  <div className="flex flex-col sm:flex-row sm:justify-between">
                    <div>
                      <h3 className="font-medium">{item.product.name}</h3>
                      <p className="text-sm text-gray-500 mb-1">{item.product.brandId}</p>
                      <div className="flex items-center text-sm">
                        <span className="mr-4">Size: {item.size}</span>
                        <div className="flex items-center">
                          <span className="mr-2">Qty:</span>
                          <div className="flex items-center">
                            <Button
                              variant="outline"
                              size="icon"
                              className="h-7 w-7"
                              onClick={() => handleUpdateQuantity(item.product.id, item.size, item.quantity - 1)}
                              disabled={isUpdating || item.quantity <= 1}
                            >
                              -
                            </Button>
                            <span className="mx-2 w-6 text-center">
                              {isUpdating ? (
                                <Loader2 className="h-4 w-4 animate-spin mx-auto" />
                              ) : (
                                item.quantity
                              )}
                            </span>
                            <Button
                              variant="outline"
                              size="icon"
                              className="h-7 w-7"
                              onClick={() => handleUpdateQuantity(item.product.id, item.size, item.quantity + 1)}
                              disabled={isUpdating || item.quantity >= 10}
                            >
                              +
                            </Button>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="mt-4 sm:mt-0 sm:text-right">
                      <div className="text-lg font-medium">
                        ₹{(item.product.discountedPrice || item.product.price) * item.quantity}
                      </div>
                      {item.product.discountedPrice && (
                        <div className="text-sm text-gray-500 line-through">
                          ₹{item.product.price * item.quantity}
                        </div>
                      )}
                      <Button
                        variant="ghost"
                        size="sm"
                        className="text-red-500 hover:text-red-700 hover:bg-red-50 mt-2 h-8 px-2"
                        onClick={() => handleRemoveItem(item.product.id, item.size)}
                        disabled={isRemoving}
                      >
                        {isRemoving ? (
                          <Loader2 className="h-4 w-4 mr-1 animate-spin" />
                        ) : (
                          <Trash2 className="h-4 w-4 mr-1" />
                        )}
                        Remove
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        );
      })}

      <Card>
        <CardContent className="p-4">
          <div className="space-y-2">
            <div className="flex justify-between">
              <span>Subtotal ({totalItems} items)</span>
              <span>₹{totalPrice}</span>
            </div>
            <div className="flex justify-between">
              <span>Shipping</span>
              <span>{totalPrice >= 999 ? 'Free' : '₹99'}</span>
            </div>
            <Separator className="my-2" />
            <div className="flex justify-between font-medium text-lg">
              <span>Total</span>
              <span>₹{totalPrice >= 999 ? totalPrice : totalPrice + 99}</span>
            </div>
          </div>
        </CardContent>
        {showCheckoutButton && (
          <CardFooter className="p-4 pt-0">
            <Button className="w-full" size="lg" onClick={onCheckout}>
              Proceed to Checkout
            </Button>
          </CardFooter>
        )}
      </Card>
    </div>
  );
}
