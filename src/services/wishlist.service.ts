import { httpRequest } from './http';
export const WishlistAPI = {
    addToWishlist: (userId:number, productId:number) => httpRequest('wishlist', `/api/wishlist`, 'POST', { userId, productId }),
    removeFromWishlist: (userId: number, productId: number) => httpRequest('wishlist', `/api/wishlist/${productId}`, 'DELETE'),
    getWishlist: () => httpRequest('wishlist', `/api/wishlist`, 'GET'),
    getWishListCount: () => httpRequest('wishlist', `/api/wishlist/count`, 'GET'),
    getWishlistProducts: () => httpRequest('wishlist', `/api/wishlist/products`, 'GET'),
    getWishlistProductIds: () => httpRequest('wishlist', `/api/wishlist/product-ids`, 'GET'),
    getWishlistByUser: (userId: number) => httpRequest('wishlist', `/api/wishlist/user/${userId}`, 'GET'),
};
