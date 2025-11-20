import { useState } from "react";
import { Product } from "@/shared/schema";
import { ProductCard } from "@/components/products/product-card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { SizeSelector, SizeOption } from "@/components/products/size-selector";
import { Button } from "@/components/ui/button";
import { useCart } from "@/hooks/use-cart";
import { StarRating } from "@/components/products/star-rating";
import { Badge } from "@/components/ui/badge";
import { Loader2 } from "lucide-react";

interface ProductGridProps {
  products: Product[];
  isLoading?: boolean;
  emptyMessage?: string;
}

export function ProductGrid({ products, isLoading, emptyMessage = "No products found" }: ProductGridProps) {
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [selectedSize, setSelectedSize] = useState<string | null>(null);
  const [quantity, setQuantity] = useState(1);
  const [addingToCart, setAddingToCart] = useState(false);
  const { addItem } = useCart();

  const handleQuickView = (product: Product) => {
    setSelectedProduct(product);
    setSelectedSize(null);
    setQuantity(1);
  };

  const handleAddToCart = () => {
    if (selectedProduct && selectedSize) {
      setAddingToCart(true);
      setTimeout(() => {
        addItem(selectedProduct, selectedSize, quantity);
        setAddingToCart(false);
        setSelectedProduct(null);
      }, 500);
    }
  };

  // Sample size options for quick view
  const sizeOptions: SizeOption[] = [
    { value: "XS", label: "XS", available: true, inventory: 5 },
    { value: "S", label: "S", available: true, inventory: 8 },
    { value: "M", label: "M", available: true, inventory: 12 },
    { value: "L", label: "L", available: true, inventory: 7 },
    { value: "XL", label: "XL", available: true, inventory: 3 },
    { value: "XXL", label: "XXL", available: false, inventory: 0 },
  ];

  if (isLoading) {
    return (
      <div className="min-h-[400px] flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (products.length === 0) {
    return (
      <div className="min-h-[400px] flex items-center justify-center border rounded-lg">
        <div className="text-center p-6">
          <h3 className="text-lg font-medium mb-2">No Products Found</h3>
          <p className="text-muted-foreground">{emptyMessage}</p>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
        {products.map((product) => (
          <ProductCard 
            key={product.id} 
            product={product} 
            onQuickView={handleQuickView}
          />
        ))}
      </div>

      {/* Quick View Dialog */}
      <Dialog open={!!selectedProduct} onOpenChange={(open) => !open && setSelectedProduct(null)}>
        <DialogContent className="sm:max-w-[700px]">
          {selectedProduct && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="relative overflow-hidden rounded-md">
                <img
                  src={Array.isArray(selectedProduct.imageUrls) && selectedProduct.imageUrls.length > 0
                    ? selectedProduct.imageUrls[0]
                    : "https://images.unsplash.com/photo-1612722432474-b971cdcea546?auto=format&fit=crop&q=80&w=500"}
                  alt={selectedProduct.name}
                  className="w-full h-auto object-cover"
                />
                
                {/* Discount badge */}
                {selectedProduct.discountedPrice && (
                  <Badge className="absolute top-2 right-2 bg-destructive">
                    {Math.round(((selectedProduct.price - selectedProduct.discountedPrice) / selectedProduct.price) * 100)}% OFF
                  </Badge>
                )}
              </div>
              
              <div>
                <DialogHeader>
                  <DialogTitle className="text-xl">{selectedProduct.name}</DialogTitle>
                  <DialogDescription className="text-sm text-muted-foreground">
                    {selectedProduct.brandId}
                  </DialogDescription>
                </DialogHeader>
                
                <div className="mt-3">
                  <StarRating 
                    rating={4.5} // This should come from product reviews
                    count={128}
                    showCount
                    size="md"
                  />
                </div>
                
                <div className="mt-3 mb-4">
                  <div className="flex items-center gap-2">
                    <span className="text-xl font-semibold">
                      ₹{selectedProduct.discountedPrice ?? selectedProduct.price}
                    </span>
                    {selectedProduct.discountedPrice && (
                      <span className="text-muted-foreground line-through">
                        ₹{selectedProduct.price}
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-gray-500 mt-1">Inclusive of all taxes</p>
                </div>
                
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">
                      Select Size
                    </label>
                    <SizeSelector
                      sizes={sizeOptions}
                      selectedSize={selectedSize}
                      onSizeSelect={setSelectedSize}
                      showInventory
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium mb-2">
                      Quantity
                    </label>
                    <div className="flex items-center w-1/3">
                      <Button
                        variant="outline"
                        size="icon"
                        onClick={() => quantity > 1 && setQuantity(quantity - 1)}
                        disabled={quantity <= 1}
                      >
                        -
                      </Button>
                      <span className="mx-4 text-center w-6">{quantity}</span>
                      <Button
                        variant="outline"
                        size="icon"
                        onClick={() => setQuantity(quantity + 1)}
                        disabled={quantity >= 10}
                      >
                        +
                      </Button>
                    </div>
                  </div>
                  
                  <Button 
                    className="w-full"
                    onClick={handleAddToCart}
                    disabled={!selectedSize || addingToCart}
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
                  
                  <div className="pt-4 mt-2 border-t text-sm">
                    <h4 className="font-medium mb-1">Product Details:</h4>
                    <p className="text-muted-foreground line-clamp-4">
                      {selectedProduct.description}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
}
