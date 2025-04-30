import { Product } from "@shared/schema";

export interface ProductCardProps {
  product: Product;
  onQuickView?: (product: Product) => void;
}

export interface StarRatingProps {
  rating: number;
  count?: number;
  size?: 'sm' | 'md' | 'lg';
  showCount?: boolean;
}

export interface ProductGridProps {
  products: Product[];
  isLoading?: boolean;
  emptyMessage?: string;
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

// Calculate discount percentage utility function
export const calculateDiscountPercentage = (price: number, discountedPrice: number | null): number => {
  if (!discountedPrice) return 0;
  return Math.round(((price - discountedPrice) / price) * 100);
};

// Check if product is new (less than 30 days old)
export const isProductNew = (createdAt: Date | null): boolean => {
  if (!createdAt) return false;
  const thirtyDaysInMs = 30 * 24 * 60 * 60 * 1000;
  return Date.now() - createdAt.getTime() < thirtyDaysInMs;
};