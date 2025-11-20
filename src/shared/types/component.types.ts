import { Product } from "@/shared/schema";
import { ReactNode } from "react";

// Common prop types
export interface ChildrenProps {
  children: ReactNode;
}

// Layout component props
export interface LayoutProps extends ChildrenProps {
  showHeader?: boolean;
  showFooter?: boolean;
}

// Page component props 
export interface PageProps {
  title?: string;
  description?: string;
}

// UI Component props
export interface ButtonProps {
  label: string;
  onClick?: () => void;
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'link';
  size?: 'sm' | 'md' | 'lg';
  disabled?: boolean;
  className?: string;
  type?: 'button' | 'submit' | 'reset';
  icon?: ReactNode;
  iconPosition?: 'left' | 'right';
}

export interface IconProps {
  name: string;
  size?: 'sm' | 'md' | 'lg';
  color?: string;
  className?: string;
}

export interface CardProps extends ChildrenProps {
  className?: string;
  onClick?: () => void;
}

// Home page component props
export interface HeroProps {
  title: string;
  subtitle: string;
  image: string;
}

export interface FeaturedProductsProps {
  products: Product[];
  isLoading: boolean;
}

export interface CollectionItem {
  name: string;
  description: string;
  image: string;
  href: string;
}

export interface CollectionsProps {
  collections: CollectionItem[];
}

export interface NewArrivalsProps {
  products: Product[];
  isLoading: boolean;
}

export interface TestimonialItem {
  text: string;
  name: string;
  location: string;
  image: string;
}

export interface TestimonialsProps {
  testimonials: TestimonialItem[];
}

export interface FeatureItem {
  title: string;
  description: string;
  icon: string;
}

export interface FeaturesProps {
  features: FeatureItem[];
}

// Product component props
export interface ProductCardProps {
  product: Product;
  onQuickView?: (product: Product) => void;
}

export interface ProductGridProps {
  products: Product[];
  isLoading?: boolean;
  emptyMessage?: string;
}

export interface StarRatingProps {
  rating: number;
  count?: number;
  size?: 'sm' | 'md' | 'lg';
  showCount?: boolean;
}

export interface ProductFilterProps {
  categories: string[];
  brands: string[];
  priceRange: [number, number];
  selectedCategories: string[];
  selectedBrands: string[];
  selectedPriceRange: [number, number];
  onCategoryChange: (categories: string[]) => void;
  onBrandChange: (brands: string[]) => void;
  onPriceRangeChange: (range: [number, number]) => void;
}