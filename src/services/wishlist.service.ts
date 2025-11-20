<<<<<<< HEAD
import { httpRequest } from './http.js';
export const WishlistAPI = {
    addToWishlist: (userId: number, productId: number) => httpRequest('wishlist', `/api/wishlist/${productId}`, 'POST'),
    removeFromWishlist: (userId: number, productId: number) => httpRequest('wishlist', `/api/wishlist/${productId}`, 'DELETE'),
    getWishlist: () => httpRequest('wishlist', `/api/wishlist`, 'GET'),
    getWishListCount: () => httpRequest('wishlist', `/api/wishlist`, 'GET'), // Use total from response
    getWishlistProducts: () => httpRequest('wishlist', `/api/wishlist`, 'GET'),
    getWishlistProductIds: () => httpRequest('wishlist', `/api/wishlist`, 'GET'), // Parse IDs from response
    getWishlistByUser: (userId: number) => httpRequest('wishlist', `/api/wishlist`, 'GET'), // Backend uses current user
=======
import { httpRequest } from './http';
export const WishlistAPI = {
    addToWishlist: (userId:number, productId:number) => httpRequest('wishlist', `/api/wishlist`, 'POST', { userId, productId }),
    removeFromWishlist: (userId: number, productId: number) => httpRequest('wishlist', `/api/wishlist/${productId}`, 'DELETE'),
    getWishlist: () => httpRequest('wishlist', `/api/wishlist`, 'GET'),
    getWishListCount: () => httpRequest('wishlist', `/api/wishlist/count`, 'GET'),
    getWishlistProducts: () => httpRequest('wishlist', `/api/wishlist/products`, 'GET'),
    getWishlistProductIds: () => httpRequest('wishlist', `/api/wishlist/product-ids`, 'GET'),
    getWishlistByUser: (userId: number) => httpRequest('wishlist', `/api/wishlist/user/${userId}`, 'GET'),
>>>>>>> fc6a7514ce55db2e4e35223257173877c0e98758
};
