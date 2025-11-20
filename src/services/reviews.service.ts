<<<<<<< HEAD
import { httpRequest } from './http.js';

export const ReviewsAPI = {
    createReview: (data: any) => httpRequest('reviews', `/api/reviews`, 'POST', data),
    getReviewsByProduct: (productId: number) => httpRequest('reviews', `/api/reviews/product/${productId}`, 'GET'),
    getAllReviews: () => httpRequest('reviews', `/api/reviews`, 'GET'),
    deleteReview: (id: number) => httpRequest('reviews', `/api/reviews/${id}`, 'DELETE'),
=======
import { httpRequest } from './http';
export const ReviewsAPI = {
    createReview: (data: any) => httpRequest('reviews', `/api/review`, 'POST', data),
    getReviewsByProduct: (productId: number) => httpRequest('reviews', `/api/products/${productId}/reviews`, 'GET'),
    getAllReviews: () => httpRequest('reviews', `/api/reviews`, 'GET'),
    deleteReview: (id: number) => httpRequest('reviews', `/api/review/${id}`, 'DELETE'),
>>>>>>> fc6a7514ce55db2e4e35223257173877c0e98758
};