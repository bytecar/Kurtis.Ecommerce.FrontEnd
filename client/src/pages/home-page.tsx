import React, { useEffect, useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { getQueryFn } from '@/lib/queryClient';
import { Product } from '@shared/schema';
import { useTranslation } from 'react-i18next';

// Import page components
import { Hero } from './components/Hero';
import { FeaturedProducts } from './components/FeaturedProducts';
import { NewArrivals } from './components/NewArrivals';
import { Collections } from './components/Collections';
import { Testimonials } from './components/Testimonials';
import { Features } from './components/Features';
import { Newsletter } from './components/Newsletter';

// Import CSS
import './styles/home-page.css';

// Define data models locally - these should ideally be in a separate types file
interface Testimonial {
  text: string;
  name: string;
  location: string;
  image: string;
}

interface Feature {
  title: string;
  description: string;
  icon: string;
}

export default function HomePage() {
  const { t } = useTranslation();
  // Fetch featured products
  const { 
    data: featuredProducts = [],
    isLoading: isFeaturedLoading
  } = useQuery<Product[]>({
    queryKey: ['/api/products/featured'],
    queryFn: getQueryFn({ on401: "returnNull" }),
  });

  // Fetch new products
  const { 
    data: newArrivals = [],
    isLoading: isNewLoading
  } = useQuery<Product[]>({
    queryKey: ['/api/products/new'],
    queryFn: getQueryFn({ on401: "returnNull" }),
  });

  // Collection data - static for now
  const collections = [
    {
      name: t('collections.womensEthnic'),
      description: t('collections.womensEthnicDesc'),
      image: "https://images.unsplash.com/photo-1610030469668-3a0bd5e08696?auto=format&fit=crop&q=80&w=1000",
      href: "/products/women"
    },
    {
      name: t('collections.mensEthnic'),
      description: t('collections.mensEthnicDesc'),
      image: "https://images.unsplash.com/photo-1558310356-c1e1c6b1e472?auto=format&fit=crop&q=80&w=1000",
      href: "/products/men"
    },
    {
      name: t('collections.festive'),
      description: t('collections.festiveDesc'),
      image: "https://images.unsplash.com/photo-1591213954196-2d0ccb3f8d4c?auto=format&fit=crop&q=80&w=1000",
      href: "/products/festive"
    }
  ];

  // Testimonial data - static for now
  const testimonials = [
    {
      text: "I've been shopping here for years and the quality is always exceptional. The customer service is top-notch too!",
      name: "Priya Sharma",
      location: "Mumbai",
      image: "https://images.unsplash.com/photo-1573497019236-61caafa52406?auto=format&fit=crop&q=80&w=200"
    },
    {
      text: "Found the perfect outfit for my sister's wedding. The designs are unique and the fabrics are so comfortable.",
      name: "Rajiv Patel",
      location: "Delhi",
      image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=200"
    },
    {
      text: "Their collection is a perfect blend of traditional and modern styles. I always get compliments when I wear their clothes!",
      name: "Ananya Singh",
      location: "Bangalore",
      image: "https://images.unsplash.com/photo-1614283233556-f35b0c801ef1?auto=format&fit=crop&q=80&w=200"
    }
  ];

  // Features data - static for now
  const features = [
    {
      title: t('features.freeShipping'),
      description: t('features.freeShippingDesc'),
      icon: "truck"
    },
    {
      title: t('features.easyReturns'),
      description: t('features.easyReturnsDesc'),
      icon: "arrow-go-back"
    },
    {
      title: t('features.securePayments'),
      description: t('features.securePaymentsDesc'),
      icon: "secure-payment"
    },
    {
      title: t('features.support'),
      description: t('features.supportDesc'),
      icon: "customer-service-2"
    }
  ];

  return (
    <div>
      <Hero 
        title={t('home.heroTitle')} 
        subtitle={t('home.heroSubtitle')}
        image="https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?auto=format&fit=crop&q=80&w=1000"
      />
      
      <FeaturedProducts 
        products={featuredProducts}
        isLoading={isFeaturedLoading}
      />
      
      <Collections collections={collections} />
      
      <NewArrivals
        products={newArrivals}
        isLoading={isNewLoading}
      />
      
      <Testimonials testimonials={testimonials} />
      <Features features={features} />
      <Newsletter />
    </div>
  );
}