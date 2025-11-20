import { httpRequest } from './http.js';

export const ReviewsAPI = {
    createReview: (data: any) => httpRequest('reviews', `/api/reviews`, 'POST', data),
    getReviewsByProduct: (productId: number) => httpRequest('reviews', `/api/reviews/product/${productId}`, 'GET'),
    getAllReviews: () => httpRequest('reviews', `/api/reviews`, 'GET'),
    deleteReview: (id: number) => httpRequest('reviews', `/api/reviews/${id}`, 'DELETE'),
};
