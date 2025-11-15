import { httpRequest } from './http';
export const ReviewAPI = {
    createReview: (data: any) => httpRequest('review', `/api/reviews`, 'POST', data),
    getReviewsByProduct: (productId: number) => httpRequest('review', `/api/products/${productId}/reviews`, 'GET'),
    getAllReviews: () => httpRequest('review', `/api/reviews`, 'GET'),
    deleteReview: (id: number) => httpRequest('review', `/api/reviews/${id}`, 'DELETE'),
};