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
};