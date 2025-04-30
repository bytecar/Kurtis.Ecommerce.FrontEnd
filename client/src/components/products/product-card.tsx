import { useState } from "react";
import { Link } from "wouter";
import { Product } from "@shared/schema";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { StarRating } from "@/components/products/star-rating";
import { useWishlist } from "@/hooks/use-wishlist";
import { useCart } from "@/hooks/use-cart";
import { Heart } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/use-auth";

interface ProductCardProps {
  product: Product;
  onQuickView?: (product: Product) => void;
}

export function ProductCard({ product, onQuickView }: ProductCardProps) {
  const { user } = useAuth();
  const { isInWishlist, toggleWishlist } = useWishlist();
  const { addItem } = useCart();
  const [isLoading, setIsLoading] = useState(false);

  // Determine if product is new (less than 30 days old)
  const thirtyDaysInMs = 30 * 24 * 60 * 60 * 1000;
  const isNew = product.createdAt instanceof Date && 
    (Date.now() - product.createdAt.getTime() < thirtyDaysInMs);
  
  // Calculate discount percentage
  const discountPercentage = product.discountedPrice && product.price
    ? Math.round(((product.price - product.discountedPrice) / product.price) * 100)
    : 0;

  const handleAddToWishlist = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    toggleWishlist(product);
  };

  const handleQuickView = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (onQuickView) {
      onQuickView(product);
    }
  };

  return (
    <Card className="group overflow-hidden border-0 shadow-none relative h-full flex flex-col transform transition-all duration-300 hover:shadow-lg hover:-translate-y-1">
      <div className="relative overflow-hidden rounded-lg">
        {/* Badge for new or sale */}
        {isNew && (
          <Badge className="absolute top-2 left-2 z-10 bg-primary">New</Badge>
        )}
        {discountPercentage > 0 && (
          <Badge className="absolute top-2 left-2 z-10 bg-destructive">
            {discountPercentage}% OFF
          </Badge>
        )}
        
        {/* Wishlist Button */}
        {user && (
          <Button
            variant="ghost"
            size="icon"
            className={`absolute top-2 right-2 z-10 bg-white/90 opacity-0 group-hover:opacity-100 transition-all duration-300 transform hover:scale-110 ${isInWishlist(product.id) ? 'text-destructive hover:text-destructive' : 'text-gray-500 hover:text-gray-700'}`}
            onClick={handleAddToWishlist}
          >
            <Heart className={isInWishlist(product.id) ? "fill-current" : ""} size={18} />
          </Button>
        )}
        
        <Link href={`/product/${product.id}`}>
          <div className="block overflow-hidden cursor-pointer">
            <img 
              src={Array.isArray(product.imageUrls) && product.imageUrls.length > 0
                ? product.imageUrls[0]
                : "https://images.unsplash.com/photo-1612722432474-b971cdcea546?auto=format&fit=crop&q=80&w=500"}
              alt={product.name}
              className="h-64 md:h-72 w-full object-cover transition-transform duration-700 ease-in-out group-hover:scale-110"
            />
          </div>
        </Link>
      </div>
      
      <CardContent className="p-3 pt-4 transition-all duration-300">
        <div className="mb-1 transform group-hover:scale-105 transition-transform duration-300">
          <StarRating 
            rating={4.5} // This should come from product reviews
            count={128}
            showCount
            size="sm"
          />
        </div>
        <h3 className="font-medium text-base mb-1 truncate transform group-hover:translate-x-1 transition-all duration-300 ease-out">
          <Link href={`/product/${product.id}`}>
            <div className="hover:text-primary transition-all duration-300 hover:font-semibold cursor-pointer">
              {product.name}
            </div>
          </Link>
        </h3>
        <p className="text-muted-foreground text-sm transform group-hover:translate-x-1 transition-all duration-300 ease-out">{product.brand}</p>
        <div className="mt-1 flex items-center gap-2 transform group-hover:scale-105 transition-all duration-300 ease-out">
          <span className="font-medium group-hover:text-primary transition-colors duration-300">
            ₹{product.discountedPrice ?? product.price}
          </span>
          {product.discountedPrice && (
            <>
              <span className="text-muted-foreground text-sm line-through">
                ₹{product.price}
              </span>
              <span className="text-green-600 text-sm group-hover:text-green-500 group-hover:font-medium transition-all duration-300">
                {discountPercentage}% off
              </span>
            </>
          )}
        </div>
      </CardContent>
      
      <CardFooter className="p-3 pt-0 mt-auto opacity-0 group-hover:opacity-100 transform translate-y-2 group-hover:translate-y-0 transition-all duration-300">
        <div className="flex gap-2 w-full">
          <Button
            variant="default"
            size="sm"
            className="w-full transition-all duration-300 hover:shadow-md transform hover:scale-105"
            onClick={() => {
              setIsLoading(true);
              setTimeout(() => {
                if (product.id) {
                  addItem(product, "M", 1); // Default size M
                  setIsLoading(false);
                }
              }, 500);
            }}
            disabled={isLoading}
          >
            {isLoading ? 'Adding...' : 'Add to Cart'}
          </Button>
          <Button
            variant="outline"
            size="sm"
            className="transition-all duration-300 hover:bg-primary hover:text-white hover:shadow-md transform hover:scale-105"
            onClick={handleQuickView}
          >
            View
          </Button>
        </div>
      </CardFooter>
    </Card>
  );
}
