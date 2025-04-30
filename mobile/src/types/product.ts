export interface Product {
  id: number;
  name: string;
  description: string;
  price: number;
  discountedPrice: number | null;
  brand: string;
  category: string;
  gender: string;
  imageUrls: string[];
  createdAt: Date | null;
  updatedAt: Date | null;
}