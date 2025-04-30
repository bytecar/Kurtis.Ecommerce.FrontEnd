import { Product } from './product';

export interface Order {
  id: number;
  status: string;
  createdAt: Date | null;
  updatedAt: Date | null;
  address: string;
  email: string;
  fullName: string;
  userId: number | null;
  city: string;
  state: string;
  postalCode: string;
  phone: string;
  total: number;
}

export interface OrderItem {
  id: number;
  orderId: number;
  productId: number;
  price: number;
  quantity: number;
  size: string;
  product?: Product;
}

export interface OrderWithItems extends Order {
  items: OrderItem[];
}