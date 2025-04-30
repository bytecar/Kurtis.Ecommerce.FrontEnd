export interface Review {
  id: number;
  rating: number;
  comment: string | null;
  createdAt: Date | null;
  productId: number;
  userId: number;
  userFullName?: string;
}