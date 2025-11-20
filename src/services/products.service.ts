<<<<<<< HEAD
import { httpRequest } from './http.js';
export const ProductsAPI = {
    getAllProducts: () => httpRequest('products', `/api/products`, 'GET'),
    getFeaturedProducts: () => httpRequest('products', `/api/products/featured`, 'GET'),
    getTrendingProducts: () => httpRequest('products', `/api/products/trending`, 'GET'),
    getNewProducts: () => httpRequest('products', `/api/products/new`, 'GET'),
    getProductsInCollection: (collectionId: number) => httpRequest('products', `/api/collections/${collectionId}`, 'GET'),
    getProduct: (productId: number) => httpRequest('products', `/api/products/${productId}`, 'GET'),
    getProductByName: (productName: string) => httpRequest('products', `/api/products`, 'GET', { q: productName }),
    createProduct: (p: any) => httpRequest('products', `/api/products`, 'POST', p),
    updateProduct: (productId: number, data: any) => httpRequest('products', `/api/products/${productId}`, 'PATCH', data),
    deleteProduct: (productId: number) => httpRequest('products', `/api/products/${productId}`, 'DELETE'),
    addProductToCollection: (productId: number, collectionId: number,) => httpRequest('products', `/api/collections/${collectionId}/products`, 'POST', { productId }),
    removeProductFromCollection: (productId: number, collectionId: number,) => httpRequest('products', `/api/collections/${collectionId}/products/${productId}`, 'DELETE'),
=======
import { httpRequest } from './http';
export const ProductsAPI = {
    getAllProducts: () => httpRequest('products', `/api/products`, 'GET'),    
    getNewProducts: () => httpRequest('products', `/api/products/new`, 'GET'), 
    getProductsInCollection: (collectionId: number) => httpRequest('products', `/api/collections/${collectionId}/product`, 'GET'),
    getAllProductsData: (p: any) => httpRequest('products', `/api/products`, 'GET'),    
    getProduct: (productId: number) => httpRequest('products', `/api/product/${productId}`, 'GET'),
    getProductByName: (productName: string) => httpRequest('products', `/api/product`, 'GET', { name: productName }),
    createProduct: (p: any) => httpRequest('products', `/api/product`, 'POST', p),
    updateProduct: (productId: number, data: any) => httpRequest('products', `/api/product/${productId}`, 'PATCH', data),
    deleteProduct: (productId: number) => httpRequest('products', `/api/product/${productId}`, 'DELETE'),
    addProductToCollection: (productId: number, collectionId: number,) => httpRequest('products', `/api/collection/${collectionId}/product/${productId}`, 'POST'),
    removeProductFromCollection: (productId: number, collectionId: number,) => httpRequest('products', `/api/collection/${collectionId}/product/${productId}`, 'DELETE'),    
>>>>>>> fc6a7514ce55db2e4e35223257173877c0e98758
};