<<<<<<< HEAD
import { httpRequest } from './http.js';
export const RecentlyViewedAPI = {
    getRecentlyViewed: () => httpRequest('recentlyViewed', `/api/user/recently-viewed`, 'GET'),
    addRecentlyViewed: (productId: number) => httpRequest('recentlyViewed', `/api/user/recently-viewed`, 'POST', { productId }),
=======
import { httpRequest } from './http';
export const RecentlyViewedAPI = {
    getRecentlyViewedByUser: (userId: number) => httpRequest('recentlyViewed', `/api/user/${userId}/recently-viewed`, 'GET'),
    getRecentlyViewed: () => httpRequest('recentlyViewed', `/api/recently-viewed`, 'GET'),
    addRecentlyViewed: (userId: number, productId: number) => httpRequest('recentlyViewed', `/api/recently-viewed`, 'POST', { userId, productId }),
>>>>>>> fc6a7514ce55db2e4e35223257173877c0e98758
};
