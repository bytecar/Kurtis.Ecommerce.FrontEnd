import React from 'react';
import { ProductGridProps } from '@/shared/types/component.types';
import { ProductCard } from './ProductCard.js';
import { Skeleton } from '@/components/ui/skeleton';
import { Package } from 'lucide-react';

// Import CSS
import './styles/ProductGrid.css';

export function ProductGrid({ products, isLoading = false, emptyMessage = "No products found" }: ProductGridProps) {
  
  // If loading, show skeleton UI
  if (isLoading) {
    return (
      <div className="skeleton-grid">
        {Array(8).fill(0).map((_, index) => (
          <div key={index} className="skeleton-card">
            <Skeleton className="skeleton-image" />
            <div className="skeleton-content">
              <Skeleton className="skeleton-title" />
              <Skeleton className="skeleton-price" />
            </div>
          </div>
        ))}
      </div>
    );
  }
  
  // If no products, show empty state
  if (!products || products.length === 0) {
    return (
      <div className="empty-state">
        <Package className="empty-icon" size={48} />
        <h3 className="empty-title">No Products Found</h3>
        <p className="empty-message">{emptyMessage}</p>
      </div>
    );
  }
  
  // Render products grid
  return (
    <div className="product-grid-container">
      {products.map((product) => (
        <ProductCard 
          key={product.id} 
          product={product}
          onQuickView={(product) => {
            console.log("Quick view", product.id);
            // Implementation for quick view
          }}
        />
      ))}
    </div>
  );
}