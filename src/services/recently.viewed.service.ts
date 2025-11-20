import { httpRequest } from './http.js';
export const RecentlyViewedAPI = {
    getRecentlyViewed: () => httpRequest('recentlyViewed', `/api/user/recently-viewed`, 'GET'),
    addRecentlyViewed: (productId: number) => httpRequest('recentlyViewed', `/api/user/recently-viewed`, 'POST', { productId }),
};
