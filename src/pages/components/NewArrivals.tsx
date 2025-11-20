import React from 'react';
import { Link } from 'wouter';
import { NewArrivalsProps } from '@/shared/types/component.types';
import { ProductCard } from '@/components/products/ProductCard';
import { Skeleton } from '@/components/ui/skeleton';
import { AnimatedHeading } from './AnimatedHeading.js';
import { useTranslation } from 'react-i18next';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";

// Import CSS
import './styles/NewArrivals.css';

export const NewArrivals: React.FC<NewArrivalsProps> = ({ products, isLoading }) => {
  const { t } = useTranslation();
  return (
    <section className="new-arrivals-section">
      <div className="container mx-auto px-4">
        <div className="section-header">
          <AnimatedHeading>{t('home.newArrivals')}</AnimatedHeading>
          <Link href="/products/new">
            <div className="view-all-link">
              {t('common.viewAll')}
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
              </svg>
            </div>
          </Link>
        </div>
        
        {isLoading ? (
          <Carousel>
            <CarouselContent>
              {Array(6).fill(0).map((_, index) => (
                <CarouselItem key={index} className="md:basis-1/3 lg:basis-1/4">
                  <div className="p-1">
                    <Skeleton className="h-64 w-full rounded-lg" />
                    <div className="mt-4 space-y-2">
                      <Skeleton className="h-4 w-full" />
                      <Skeleton className="h-4 w-1/2" />
                    </div>
                  </div>
                </CarouselItem>
              ))}
            </CarouselContent>
            <CarouselPrevious />
            <CarouselNext />
          </Carousel>
        ) : (
          <Carousel>
            <CarouselContent>
              {(products || []).map((product) => (
                <CarouselItem key={product.id} className="md:basis-1/3 lg:basis-1/4">
                  <div className="p-1">
                    <ProductCard 
                      product={product}
                      onQuickView={(product) => {
                        // Quick view functionality would be added here
                        console.log("Quick view", product.id);
                      }}
                    />
                  </div>
                </CarouselItem>
              ))}
            </CarouselContent>
            <CarouselPrevious />
            <CarouselNext />
          </Carousel>
        )}
      </div>
    </section>
  );
}
