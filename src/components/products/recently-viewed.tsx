import { useRecentlyViewed } from "@/hooks/use-recently-viewed";
import { Link } from "wouter";
import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent } from "@/components/ui/card";

interface RecentlyViewedProps {
  className?: string;
  limit?: number;
}

export function RecentlyViewed({ className, limit = 5 }: RecentlyViewedProps) {
  const { items, isLoading } = useRecentlyViewed();
  
  const displayItems = items.slice(0, limit);
  
  if (isLoading) {
    return (
      <div className={className}>
        <h2 className="text-2xl font-serif font-bold mb-6">Recently Viewed</h2>
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
          {Array(5).fill(0).map((_, index) => (
            <div key={index} className="space-y-3">
              <Skeleton className="h-48 w-full rounded-lg" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-20" />
            </div>
          ))}
        </div>
      </div>
    );
  }
  
  if (displayItems.length === 0) {
    return null;
  }
  
  return (
    <div className={className}>
      <h2 className="text-2xl font-serif font-bold mb-6">Recently Viewed</h2>
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        {displayItems.map((product) => (
          <Card key={product.id} className="border-0 shadow-none group overflow-hidden transition-all duration-300 hover:shadow-md transform hover:-translate-y-1">
            <Link href={`/product/${product.id}`} className="group">
              <div className="overflow-hidden rounded-lg">
                <img 
                  src={Array.isArray(product.imageUrls) && product.imageUrls.length > 0
                    ? product.imageUrls[0]
                    : "https://images.unsplash.com/photo-1612722432474-b971cdcea546"}
                  alt={product.name}
                  className="w-full aspect-[3/4] object-cover transition-transform duration-500 ease-in-out group-hover:scale-110"
                />
              </div>
              <CardContent className="p-3 pt-4">
                <h3 className="text-sm font-medium truncate group-hover:text-primary transition-colors duration-300">{product.name}</h3>
                <p className="text-muted-foreground text-xs mt-1 transform group-hover:translate-x-1 transition-all duration-300 ease-out">
                  ₹{product.discountedPrice ?? product.price}
                </p>
              </CardContent>
            </Link>
          </Card>
        ))}
      </div>
    </div>
  );
}
