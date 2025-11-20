import React from 'react';
import { Link } from 'wouter';
<<<<<<< HEAD
import { FeaturedProductsProps } from '@/shared/types/component.types';
=======
import { FeaturedProductsProps } from '@shared/types/component.types';
>>>>>>> fc6a7514ce55db2e4e35223257173877c0e98758
import { ProductGrid } from '@/components/products/ProductGrid';
import { AnimatedHeading } from './AnimatedHeading.js';
import { useTranslation } from 'react-i18next';

// Import CSS
import './styles/FeaturedProducts.css';

export const FeaturedProducts: React.FC<FeaturedProductsProps> = ({ products, isLoading }) => {
  // The HTML structure is maintained in './html/FeaturedProducts.html'
  const { t } = useTranslation();
  return (
    <section className="featured-section">
      <div className="container mx-auto px-4">
        <div className="section-header">
          <AnimatedHeading>{t('home.featuredProducts')}</AnimatedHeading>
          <Link href="/products/featured">
            <div className="view-all-link">
              {t('common.viewAll')}
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
              </svg>
            </div>
          </Link>
        </div>
        
        <ProductGrid 
          products={products} 
          isLoading={isLoading}
          emptyMessage={t('products.noFeaturedProducts')}
        />
      </div>
    </section>
  );
}