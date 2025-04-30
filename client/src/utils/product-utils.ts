import { Product } from "@shared/schema";

// Calculate discount percentage utility function
export const calculateDiscountPercentage = (price: number, discountedPrice: number | null): number => {
  if (!discountedPrice) return 0;
  return Math.round(((price - discountedPrice) / price) * 100);
};

// Check if product is new (less than 30 days old)
export const isProductNew = (createdAt: Date | string | null): boolean => {
  if (!createdAt) return false;
  
  const thirtyDaysInMs = 30 * 24 * 60 * 60 * 1000;
  const createdDate = typeof createdAt === 'string' ? new Date(createdAt) : createdAt;
  
  return Date.now() - createdDate.getTime() < thirtyDaysInMs;
};

// Filter products by category
export const filterProductsByCategory = (products: Product[], category: string): Product[] => {
  if (!category || category === 'all') return products;
  return products.filter(product => product.category === category);
};

// Filter products by price range
export const filterProductsByPrice = (
  products: Product[], 
  minPrice: number, 
  maxPrice: number
): Product[] => {
  return products.filter(product => {
    const price = product.discountedPrice || product.price;
    return price >= minPrice && price <= maxPrice;
  });
};

// Filter products by brand
export const filterProductsByBrand = (products: Product[], brands: string[]): Product[] => {
  if (!brands.length) return products;
  return products.filter(product => brands.includes(product.brand));
};

// Sort products by price (low to high)
export const sortProductsByPriceLowToHigh = (products: Product[]): Product[] => {
  return [...products].sort((a, b) => {
    const priceA = a.discountedPrice || a.price;
    const priceB = b.discountedPrice || b.price;
    return priceA - priceB;
  });
};

// Sort products by price (high to low)
export const sortProductsByPriceHighToLow = (products: Product[]): Product[] => {
  return [...products].sort((a, b) => {
    const priceA = a.discountedPrice || a.price;
    const priceB = b.discountedPrice || b.price;
    return priceB - priceA;
  });
};

// Sort products by newest
export const sortProductsByNewest = (products: Product[]): Product[] => {
  return [...products].sort((a, b) => {
    const dateA = new Date(a.createdAt || 0).getTime();
    const dateB = new Date(b.createdAt || 0).getTime();
    return dateB - dateA;
  });
};

// Get unique categories from products
export const getUniqueCategories = (products: Product[]): string[] => {
  const categories = products.map(product => product.category);
  return [...new Set(categories)];
};

// Get unique brands from products
export const getUniqueBrands = (products: Product[]): string[] => {
  const brands = products.map(product => product.brand);
  return [...new Set(brands)];
};

// Get price range from products
export const getPriceRange = (products: Product[]): [number, number] => {
  if (!products.length) return [0, 0];
  
  const prices = products.map(product => product.discountedPrice || product.price);
  return [Math.min(...prices), Math.max(...prices)];
};