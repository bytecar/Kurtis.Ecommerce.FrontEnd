import React, { useEffect, useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { getQueryFn } from '@/lib/queryClient';
import { Product } from '@shared/schema';

// Import page components
import { Hero } from './components/Hero';
import { FeaturedProducts } from './components/FeaturedProducts';
import { NewArrivals } from './components/NewArrivals';
import { Collections } from './components/Collections';

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
      name: "Women's Ethnic",
      description: "Traditional & contemporary styles",
      image: "https://images.unsplash.com/photo-1610030469668-3a0bd5e08696?auto=format&fit=crop&q=80&w=1000",
      href: "/products/women"
    },
    {
      name: "Men's Ethnic",
      description: "Classic & modern designs",
      image: "https://images.unsplash.com/photo-1558310356-c1e1c6b1e472?auto=format&fit=crop&q=80&w=1000",
      href: "/products/men"
    },
    {
      name: "Festive Collection",
      description: "Celebrate in style",
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
      title: "Free Shipping",
      description: "Free shipping on all orders above ₹999",
      icon: "truck"
    },
    {
      title: "Easy Returns",
      description: "30-day easy return policy",
      icon: "arrow-go-back"
    },
    {
      title: "Secure Payments",
      description: "Multiple secure payment options",
      icon: "secure-payment"
    },
    {
      title: "24/7 Support",
      description: "Dedicated customer support",
      icon: "customer-service-2"
    }
  ];

  return (
    <div>
      <Hero 
        title="Embrace Tradition with Modern Elegance" 
        subtitle="Discover our exquisite collection of ethnic wear that blends traditional craftsmanship with contemporary designs."
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
      
      {/* We'll add these components later */}
      {/* <Testimonials testimonials={testimonials} /> */}
      {/* <Features features={features} /> */}
      {/* <Newsletter /> */}
    </div>
  );
}