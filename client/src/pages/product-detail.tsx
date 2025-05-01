import { useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { useParams } from "wouter";
import { Product, Review } from "@shared/schema";
import { StarRating } from "@/components/products/star-rating";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import { useCart } from "@/hooks/use-cart";
import { useWishlist } from "@/hooks/use-wishlist";
import { useRecentlyViewed } from "@/hooks/use-recently-viewed";
import { useAuth } from "@/hooks/use-auth";
import { Heart, Loader2 } from "lucide-react";
import { ProductRecommendations } from "@/components/products/product-recommendations";
import { RecentlyViewed } from "@/components/products/recently-viewed";
import { ProductReviews } from "@/components/products/product-reviews";
import { SizeSelector, SizeOption } from "@/components/products/size-selector";
import { SizeRecommendationWizard } from "@/components/products/size-recommendation-wizard";
import { VirtualTryOn } from "@/components/products/virtual-try-on";
import { SocialShareButton } from "@/components/social";
import { useState } from "react";
import { logger, LogCategory } from "@/lib/logging";

export default function ProductDetail() {
  const { id } = useParams();
  const productId = parseInt(id);
  const { toast } = useToast();
  const { user } = useAuth();
  const { addItem } = useCart();
  const { isInWishlist, toggleWishlist } = useWishlist();
  const { addToRecentlyViewed } = useRecentlyViewed();
  const [selectedSize, setSelectedSize] = useState<string | null>(null);
  const [quantity, setQuantity] = useState(1);
  const [addingToCart, setAddingToCart] = useState(false);
  const [activeImage, setActiveImage] = useState(0);

  // Fetch product details
  const {
    data: product,
    isLoading,
    isError,
  } = useQuery<Product>({
    queryKey: [`/api/products/${productId}`],
    enabled: !isNaN(productId),
  });

  // Fetch inventory for the product
  const { 
    data: inventory,
    isLoading: isInventoryLoading
  } = useQuery({
    queryKey: [`/api/inventory/product/${productId}`],
    enabled: !isNaN(productId),
  });

  // Add product to recently viewed on mount
  useEffect(() => {
    // Only add to recently viewed if product ID is valid
    if (productId && !isNaN(productId)) {
      // Using setTimeout to ensure this happens after the component has fully mounted
      const timer = setTimeout(() => {
        addToRecentlyViewed(productId);
      }, 300);
      
      return () => clearTimeout(timer);
    }
  }, [productId, addToRecentlyViewed]);
  
  // Update page title when product data is available
  useEffect(() => {
    if (product) {
      document.title = `${product.name} | Kurtis & More`;
    }
  }, [product]);

  // Prepare size options from inventory
  const getSizeOptions = (): SizeOption[] => {
    if (!inventory) return [];
    
    return inventory.map(item => ({
      value: item.size,
      label: item.size,
      available: item.quantity > 0,
      inventory: item.quantity
    }));
  };
  
  // Handle size selection with availability toast notification
  const handleSizeSelect = (size: string) => {
    setSelectedSize(size);
    
    // Show availability toast message if we have inventory data
    if (inventory) {
      const stockItem = inventory.find(item => item.size === size);
      
      if (stockItem) {
        if (stockItem.quantity === 0) {
          toast({
            title: "Out of Stock",
            description: "This size is currently out of stock. Please select another size or check back later.",
            variant: "destructive",
            duration: 3000,
          });
        } else if (stockItem.quantity === 1) {
          toast({
            title: "Limited Stock",
            description: "Only 1 item left in this size!",
            variant: "destructive",
            duration: 3000,
          });
        } else if (stockItem.quantity <= 5) {
          toast({
            title: "Limited Stock",
            description: `Only ${stockItem.quantity} items left in this size!`,
            variant: "destructive",
            duration: 3000,
          });
        } else {
          toast({
            title: "In Stock",
            description: `${stockItem.quantity} items available in this size`,
            variant: "default",
            duration: 2000,
          });
        }
      }
    }
  };

  // Handle adding to cart
  const handleAddToCart = () => {
    if (!product || !selectedSize) {
      toast({
        title: "Please select a size",
        description: "You must select a size before adding to cart",
        variant: "destructive",
      });
      return;
    }
    
    setAddingToCart(true);
    
    // Simulate a slight delay to show loading state
    setTimeout(() => {
      addItem(product, selectedSize, quantity);
      setAddingToCart(false);
    }, 500);
  };

  // Sharing is now handled by the SocialShareButton component

  // Calculate discount percentage
  const discountPercentage = product?.discountedPrice && product.price
    ? Math.round(((product.price - product.discountedPrice) / product.price) * 100)
    : 0;

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-12 flex justify-center items-center min-h-[70vh]">
        <Loader2 className="h-12 w-12 animate-spin text-primary" />
      </div>
    );
  }

  if (isError || !product) {
    return (
      <div className="container mx-auto px-4 py-12 flex justify-center items-center min-h-[70vh]">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-2">Product Not Found</h2>
          <p className="text-muted-foreground mb-4">
            The product you're looking for doesn't exist or has been removed.
          </p>
          <Button onClick={() => window.history.back()}>Go Back</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white">
      <div className="container mx-auto px-4 py-8">
        {/* Breadcrumbs */}
        <div className="mb-6">
          <div className="flex items-center text-sm text-gray-500">
            <a href="/" className="hover:text-primary">Home</a>
            <span className="mx-2">/</span>
            <a href={`/products/${product.gender}`} className="hover:text-primary">
              {product.gender.charAt(0).toUpperCase() + product.gender.slice(1)}
            </a>
            <span className="mx-2">/</span>
            <a href={`/products/${product.gender}?category=${product.category}`} className="hover:text-primary">
              {product.category.charAt(0).toUpperCase() + product.category.slice(1)}
            </a>
            <span className="mx-2">/</span>
            <span className="text-gray-900">{product.name}</span>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Product Images */}
          <div className="space-y-4">
            {/* Main Image */}
            <div className="rounded-lg overflow-hidden">
              <img 
                src={Array.isArray(product.imageUrls) && product.imageUrls.length > 0
                  ? product.imageUrls[activeImage]
                  : "https://images.unsplash.com/photo-1612722432474-b971cdcea546?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=MnwxfDB8MXxyYW5kb218MHx8d29tZW4ncyBpbmRpYW4gZXRobmljIGRyZXNzZXN8fHx8fHwxNzE4NTU3Njk5&ixlib=rb-4.0.3&q=80&utm_campaign=api-credit&utm_medium=referral&utm_source=unsplash_source&w=1080"}
                alt={product.name}
                className="w-full object-cover"
              />
            </div>
            
            {/* Thumbnails */}
            {Array.isArray(product.imageUrls) && product.imageUrls.length > 1 && (
              <div className="grid grid-cols-4 gap-2">
                {product.imageUrls.map((url, index) => (
                  <button 
                    key={index}
                    className={`rounded-md overflow-hidden border-2 ${activeImage === index ? 'border-primary' : 'border-transparent hover:border-primary'}`} 
                    onClick={() => setActiveImage(index)}
                  >
                    <img 
                      src={url}
                      alt={`${product.name} - View ${index + 1}`}
                      className="w-full aspect-square object-cover"
                    />
                  </button>
                ))}
              </div>
            )}
          </div>
          
          {/* Product Info */}
          <div>
            <h1 className="text-2xl font-medium mb-2">{product.name}</h1>
            <p className="text-muted-foreground mb-4">By {product.brand}</p>
            
            {/* Ratings */}
            <div className="flex items-center mb-4">
              <StarRating 
                rating={4.5} 
                count={128}
                showCount
              />
            </div>
            
            {/* Price */}
            <div className="mb-6">
              <div className="flex items-baseline gap-3">
                <span className="text-2xl font-semibold">
                  ₹{product.discountedPrice ?? product.price}
                </span>
                {product.discountedPrice && (
                  <>
                    <span className="text-muted-foreground line-through">₹{product.price}</span>
                    <Badge className="bg-green-100 text-green-700 hover:bg-green-100">
                      {discountPercentage}% off
                    </Badge>
                  </>
                )}
                
                {/* Stock Status Badge */}
                {!isInventoryLoading && inventory && (
                  <div className="ml-auto">
                    {inventory.reduce((total, item) => total + item.quantity, 0) > 0 ? (
                      <Badge className="bg-green-100 text-green-700 hover:bg-green-100 flex gap-1 items-center px-3 py-1">
                        <div className="w-2 h-2 rounded-full bg-green-500"></div>
                        <span>In Stock</span>
                      </Badge>
                    ) : (
                      <Badge className="bg-red-100 text-red-700 hover:bg-red-100 flex gap-1 items-center px-3 py-1">
                        <div className="w-2 h-2 rounded-full bg-red-500"></div>
                        <span>Out of Stock</span>
                      </Badge>
                    )}
                  </div>
                )}
              </div>
              <p className="text-muted-foreground text-sm mt-1">Inclusive of all taxes</p>
            </div>
            
            {/* Size Selection */}
            <div className="mb-6">
              <div className="flex justify-between items-center mb-2">
                <h3 className="font-medium">Select Size</h3>
                <Button variant="link" className="p-0 h-auto">Size Guide</Button>
              </div>
              <SizeSelector
                sizes={getSizeOptions()}
                selectedSize={selectedSize}
                onSizeSelect={handleSizeSelect}
                showInventory
              />
              
              {selectedSize && (
                <div className="mt-2">
                  {(() => {
                    const stockQuantity = inventory?.find(item => item.size === selectedSize)?.quantity;
                    
                    if (stockQuantity === 0) {
                      return (
                        <div className="flex items-center gap-1.5">
                          <div className="w-2 h-2 rounded-full bg-red-500"></div>
                          <p className="text-red-600 text-sm font-medium">Out of Stock</p>
                        </div>
                      );
                    } else if (stockQuantity === 1) {
                      return (
                        <div className="flex items-center gap-1.5">
                          <div className="w-2 h-2 rounded-full bg-orange-500"></div>
                          <p className="text-orange-600 text-sm font-medium">Only 1 left!</p>
                        </div>
                      );
                    } else if (stockQuantity !== undefined && stockQuantity > 1 && stockQuantity <= 5) {
                      return (
                        <div className="flex items-center gap-1.5">
                          <div className="w-2 h-2 rounded-full bg-orange-500"></div>
                          <p className="text-orange-600 text-sm font-medium">Only {stockQuantity} left!</p>
                        </div>
                      );
                    } else if (stockQuantity !== undefined && stockQuantity > 5) {
                      return (
                        <div className="flex items-center gap-1.5">
                          <div className="w-2 h-2 rounded-full bg-green-500"></div>
                          <p className="text-green-600 text-sm font-medium">In Stock</p>
                        </div>
                      );
                    }
                    
                    return null;
                  })()}
                </div>
              )}
            </div>
            
            {/* Quantity */}
            <div className="mb-6">
              <h3 className="font-medium mb-2">Quantity</h3>
              <div className="flex items-center">
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => quantity > 1 && setQuantity(quantity - 1)}
                  disabled={quantity <= 1}
                >
                  -
                </Button>
                <span className="mx-4 w-6 text-center">{quantity}</span>
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => quantity < 10 && setQuantity(quantity + 1)}
                  disabled={quantity >= 10}
                >
                  +
                </Button>
              </div>
            </div>
            
            {/* Actions */}
            <div className="flex gap-4 mb-8">
              <Button 
                className="flex-1"
                onClick={handleAddToCart}
                disabled={!selectedSize || isInventoryLoading || addingToCart || (selectedSize && inventory?.find(item => item.size === selectedSize)?.quantity === 0)}
              >
                {addingToCart ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Adding...
                  </>
                ) : (
                  'Add to Cart'
                )}
              </Button>
              {user && (
                <Button
                  variant="outline"
                  onClick={() => toggleWishlist(product)}
                  className={isInWishlist(product.id) ? "text-destructive hover:text-destructive" : ""}
                >
                  <Heart className={`${isInWishlist(product.id) ? "fill-current" : ""}`} />
                </Button>
              )}
              <SocialShareButton
                url={window.location.href}
                title={product.name}
                description={product.description}
                imageUrl={Array.isArray(product.imageUrls) && product.imageUrls.length > 0 ? product.imageUrls[0] : undefined}
                category={product.category}
                // Example occasion and region - these could be properties of the product in a real setup
                occasion={product.category.includes('wedding') ? 'wedding' : product.category.includes('festival') ? 'festival' : 'casual'}
                region="north-india"
                buttonSize="icon"
              />
            </div>
            
            {/* Product Details Tabs */}
            <Tabs defaultValue="details">
              <TabsList className="w-full">
                <TabsTrigger value="details" className="flex-1">Details</TabsTrigger>
                <TabsTrigger value="care" className="flex-1">Care Instructions</TabsTrigger>
                <TabsTrigger value="returns" className="flex-1">Returns</TabsTrigger>
              </TabsList>
              <TabsContent value="details" className="pt-4">
                <div className="text-muted-foreground space-y-3">
                  <p>{product.description}</p>
                  <h4 className="font-medium text-foreground">Features:</h4>
                  <ul className="list-disc list-inside space-y-1">
                    <li>Premium quality fabric</li>
                    <li>Designed for comfort and style</li>
                    <li>Perfect for casual and semi-formal occasions</li>
                    <li>Traditional craftsmanship with modern design</li>
                  </ul>
                </div>
              </TabsContent>
              <TabsContent value="care" className="pt-4">
                <div className="text-muted-foreground space-y-3">
                  <h4 className="font-medium text-foreground">Washing Instructions:</h4>
                  <ul className="list-disc list-inside space-y-1">
                    <li>Hand wash with cold water</li>
                    <li>Do not bleach</li>
                    <li>Dry in shade</li>
                    <li>Iron on medium heat</li>
                    <li>Dry clean if necessary</li>
                  </ul>
                </div>
              </TabsContent>
              <TabsContent value="returns" className="pt-4">
                <div className="text-muted-foreground space-y-3">
                  <p>We offer a 30-day return policy. If you're not completely satisfied with your purchase, you can return it within 30 days for a full refund or exchange.</p>
                  <p>The item must be unused, unworn, and in the original packaging. Return shipping costs are the responsibility of the customer unless the item is defective or incorrect.</p>
                </div>
              </TabsContent>
            </Tabs>
          </div>
        </div>
        
        {/* Product Reviews */}
        <div className="mt-16">
          <ProductReviews productId={productId} />
        </div>
        
        {/* Recently Viewed */}
        <RecentlyViewed className="mt-16" />
        
        {/* You May Also Like */}
        <ProductRecommendations productId={productId} className="mt-16" />
      </div>
    </div>
  );
}
