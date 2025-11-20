import { httpRequest } from './http.js';
export const WishlistAPI = {
    addToWishlist: (userId: number, productId: number) => httpRequest('wishlist', `/api/wishlist/${productId}`, 'POST'),
    removeFromWishlist: (userId: number, productId: number) => httpRequest('wishlist', `/api/wishlist/${productId}`, 'DELETE'),
    getWishlist: () => httpRequest('wishlist', `/api/wishlist`, 'GET'),
    getWishListCount: () => httpRequest('wishlist', `/api/wishlist`, 'GET'), // Use total from response
    getWishlistProducts: () => httpRequest('wishlist', `/api/wishlist`, 'GET'),
    getWishlistProductIds: () => httpRequest('wishlist', `/api/wishlist`, 'GET'), // Parse IDs from response
    getWishlistByUser: (userId: number) => httpRequest('wishlist', `/api/wishlist`, 'GET'), // Backend uses current user
};
