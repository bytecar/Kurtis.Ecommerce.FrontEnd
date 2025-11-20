import { useState } from "react";
import { Link } from "wouter";
import { ProductCardProps } from "@/shared/types/component.types";
import { calculateDiscountPercentage, isProductNew } from "@/utils/product-utils";
import { useWishlist, useCart, useAuth } from "@/hooks";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { StarRating } from "./StarRating.js";
import { Heart } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

// Import CSS
import "./styles/ProductCard.css";

export function ProductCard({ product, onQuickView }: ProductCardProps) {
  const { user } = useAuth();
  const { isInWishlist, toggleWishlist } = useWishlist();
  const { addItem } = useCart();
  const [isLoading, setIsLoading] = useState(false);

  // Determine if product is new (less than 30 days old)
  const isNew = isProductNew(product.createdAt);
  
  // Calculate discount percentage
  const discountPercentage = product.discountedPrice && product.price
    ? calculateDiscountPercentage(product.price, product.discountedPrice)
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
    <Card className="product-card">
      <div className="image-container">
        {/* Badge for new or sale */}
        {isNew && (
          <Badge className="product-badge product-badge-new">New</Badge>
        )}
        {discountPercentage > 0 && (
          <Badge className="product-badge product-badge-sale">
            {discountPercentage}% OFF
          </Badge>
        )}
        
        {/* Wishlist Button */}
        {user && (
          <Button
            variant="ghost"
            size="icon"
            className={`wishlist-button ${isInWishlist(product.id) ? 'wishlist-active' : ''}`}
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
              className="product-image"
            />
          </div>
        </Link>
      </div>
      
      <CardContent className="product-content">
        <div className="rating-container">
          <StarRating 
            rating={4.5} // This should come from product reviews
            count={128}
            showCount
            size="sm"
          />
        </div>
        <h3 className="product-title">
          <Link href={`/product/${product.id}`}>
            <div className="hover:text-primary cursor-pointer">
              {product.name}
            </div>
          </Link>
        </h3>
        <p className="product-brand">{product.brandId}</p>
        <div className="product-price-container">
          <span className="product-price">
            ₹{product.discountedPrice ?? product.price}
          </span>
          {product.discountedPrice && (
            <>
              <span className="product-original-price">
                ₹{product.price}
              </span>
              <span className="product-discount">
                {discountPercentage}% off
              </span>
            </>
          )}
        </div>
      </CardContent>
      
      <CardFooter className="product-footer">
        <div className="button-container">
          <Button
            variant="default"
            size="sm"
            className="add-to-cart-button"
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
            className="view-button"
            onClick={handleQuickView}
          >
            View
          </Button>
        </div>
      </CardFooter>
    </Card>
  );
}