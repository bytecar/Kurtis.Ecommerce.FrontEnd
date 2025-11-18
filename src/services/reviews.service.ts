import { httpRequest } from './http';
export const ReviewsAPI = {
    createReview: (data: any) => httpRequest('reviews', `/api/review`, 'POST', data),
    getReviewsByProduct: (productId: number) => httpRequest('reviews', `/api/products/${productId}/reviews`, 'GET'),
    getAllReviews: () => httpRequest('reviews', `/api/reviews`, 'GET'),
    deleteReview: (id: number) => httpRequest('reviews', `/api/review/${id}`, 'DELETE'),
};