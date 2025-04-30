import React from 'react';
import { Link } from 'wouter';
import { FeaturedProductsProps } from '@/types/component.types';
import { ProductGrid } from '@/components/products/ProductGrid';
import { AnimatedHeading } from './AnimatedHeading';

export const FeaturedProducts: React.FC<FeaturedProductsProps> = ({ products, isLoading }) => {
  return (
    <section className="featured-section">
      <div className="container mx-auto px-4">
        <div className="section-header">
          <AnimatedHeading>Featured Products</AnimatedHeading>
          <Link href="/products/featured">
            <div className="view-all-link">
              View All
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
              </svg>
            </div>
          </Link>
        </div>
        
        <ProductGrid 
          products={products} 
          isLoading={isLoading}
          emptyMessage="No featured products available at the moment."
        />
      </div>
    </section>
  );
}