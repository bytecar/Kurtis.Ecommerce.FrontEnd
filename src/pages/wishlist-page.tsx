import { useEffect } from "react";
import { Link } from "wouter";
import { useWishlist } from "@/hooks/use-wishlist";
import { useCart } from "@/hooks/use-cart";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Heart, Loader2, ShoppingCart } from "lucide-react";
import { StarRating } from "@/components/products/star-rating";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";

export default function WishlistPage() {
  const { items, isLoading, removeFromWishlist } = useWishlist();
  const { addItem } = useCart();
  const { toast } = useToast();
  const [addingToCart, setAddingToCart] = useState<{[key: number]: boolean}>({});
  
  useEffect(() => {
    document.title = "My Wishlist | Kurtis & More";
  }, []);
  
  const handleAddToCart = (productId: number) => {
    const product = items.find(item => item.id === productId);
    if (!product) return;
    
    setAddingToCart(prev => ({ ...prev, [productId]: true }));
    
    // Simulate a slight delay to show loading state
    setTimeout(() => {
      addItem(product, "M", 1); // Default to size M
      toast({
        title: "Added to cart",
        description: `${product.name} has been added to your cart`
      });
      setAddingToCart(prev => ({ ...prev, [productId]: false }));
    }, 500);
  };
  
  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-12">
        <h1 className="text-3xl font-serif font-bold mb-8">My Wishlist</h1>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {Array(4).fill(0).map((_, index) => (
            <div key={index} className="border rounded-lg p-4 space-y-3">
              <Skeleton className="h-60 w-full rounded-md" />
              <Skeleton className="h-6 w-3/4" />
              <Skeleton className="h-4 w-1/4" />
              <Skeleton className="h-4 w-1/2" />
              <div className="pt-4 flex gap-2">
                <Skeleton className="h-9 w-full" />
                <Skeleton className="h-9 w-12" />
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="container mx-auto px-4 py-12">
        <h1 className="text-3xl font-serif font-bold mb-8">My Wishlist</h1>
        
        <div className="text-center py-16 border rounded-lg">
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-muted mb-4">
            <Heart className="h-10 w-10 text-muted-foreground" />
          </div>
          <h2 className="text-2xl font-medium mb-2">Your wishlist is empty</h2>
          <p className="text-muted-foreground mb-6 max-w-md mx-auto">
            Save items you love in your wishlist and review them anytime. Start adding your favorite items now!
          </p>
          <Link href="/products/women">
            <Button>
              Explore Products
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-12">
      <h1 className="text-3xl font-serif font-bold mb-2">My Wishlist</h1>
      <p className="text-muted-foreground mb-8">{items.length} {items.length === 1 ? 'item' : 'items'} saved in your wishlist</p>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {items.map(product => (
          <div key={product.id} className="border rounded-lg overflow-hidden group">
            <div className="relative overflow-hidden">
              <Link href={`/product/${product.id}`}>
                <a>
                  <img 
                    src={Array.isArray(product.imageUrls) && product.imageUrls.length > 0
                      ? product.imageUrls[0]
                      : "https://placehold.co/400x500"}
                    alt={product.name}
                    className="w-full h-64 object-cover transition-transform group-hover:scale-105"
                  />
                </a>
              </Link>
              <Button 
                variant="ghost" 
                size="icon" 
                className="absolute top-2 right-2 bg-white/80 text-destructive hover:text-destructive hover:bg-white"
                onClick={() => removeFromWishlist(product.id)}
              >
                <Heart className="fill-current" />
              </Button>
            </div>
            
            <div className="p-4">
              <Link href={`/product/${product.id}`}>
                <a>
                  <h3 className="font-medium mb-1 hover:text-primary transition-colors">{product.name}</h3>
                </a>
              </Link>
              <p className="text-muted-foreground text-sm">{product.brandId}</p>
              <div className="flex items-center my-2">
                <StarRating rating={4.5} size="sm" />
              </div>
              <div className="flex items-center gap-2 mb-4">
                <span className="font-medium">₹{product.discountedPrice ?? product.price}</span>
                {product.discountedPrice && (
                  <span className="text-muted-foreground text-sm line-through">₹{product.price}</span>
                )}
              </div>
              <div className="flex gap-2">
                <Button 
                  className="flex-1"
                  onClick={() => handleAddToCart(product.id)}
                  disabled={addingToCart[product.id]}
                >
                  {addingToCart[product.id] ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Adding...
                    </>
                  ) : (
                    <>
                      <ShoppingCart className="mr-2 h-4 w-4" />
                      Add to Cart
                    </>
                  )}
                </Button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
