import { useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Product } from "@shared/schema";
import { Link } from "wouter";
import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent } from "@/components/ui/card";

interface ProductRecommendationsProps {
  productId: number;
  className?: string;
}

export function ProductRecommendations({ productId, className }: ProductRecommendationsProps) {
  const { data: recommendations, isLoading } = useQuery<Product[]>({
    queryKey: [`/api/products/${productId}/recommendations`],
    enabled: !!productId,
  });
  
  if (isLoading) {
    return (
      <div className={className}>
        <h2 className="text-2xl font-serif font-bold mb-6">You May Also Like</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {Array(4).fill(0).map((_, index) => (
            <div key={index} className="space-y-3">
              <Skeleton className="h-64 w-full rounded-lg" />
              <Skeleton className="h-5 w-full" />
              <Skeleton className="h-4 w-40" />
              <Skeleton className="h-4 w-20" />
            </div>
          ))}
        </div>
      </div>
    );
  }
  
  if (!recommendations || recommendations.length === 0) {
    return null;
  }
  
  return (
    <div className={className}>
      <h2 className="text-2xl font-serif font-bold mb-6">You May Also Like</h2>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {recommendations.map((product) => (
          <Card key={product.id} className="border-0 shadow-none">
            <Link href={`/product/${product.id}`}>
              <a className="group">
                <div className="overflow-hidden rounded-lg grow-on-hover">
                  <img 
                    src={Array.isArray(product.imageUrls) && product.imageUrls.length > 0
                      ? product.imageUrls[0]
                      : "https://images.unsplash.com/photo-1612722432474-b971cdcea546"}
                    alt={product.name}
                    className="w-full aspect-[3/4] object-cover"
                  />
                </div>
                <CardContent className="p-3 pt-4">
                  <h3 className="font-medium text-base truncate">{product.name}</h3>
                  <p className="text-muted-foreground text-sm">{product.brand}</p>
                  <p className="font-medium mt-1">
                    ₹{product.discountedPrice ?? product.price}
                  </p>
                </CardContent>
              </a>
            </Link>
          </Card>
        ))}
      </div>
    </div>
  );
}
