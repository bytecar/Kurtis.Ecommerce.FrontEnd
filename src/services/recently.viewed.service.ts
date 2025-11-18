import { httpRequest } from './http';
export const RecentlyViewedAPI = {
    getRecentlyViewedByUser: (userId: number) => httpRequest('recentlyViewed', `/api/user/${userId}/recently-viewed`, 'GET'),
    getRecentlyViewed: () => httpRequest('recentlyViewed', `/api/recently-viewed`, 'GET'),
    addRecentlyViewed: (userId: number, productId: number) => httpRequest('recentlyViewed', `/api/recently-viewed`, 'POST', { userId, productId }),
};
