import { httpRequest } from './http';
export const ProductAPI = {
    getAllProducts: () => httpRequest('product', `/api/products`, 'GET'),    
    getProductsInCollection: (collectionId: number) => httpRequest('product', `/api/collections/${collectionId}/products`, 'GET'),
    getAllProductsData: (p: any) => httpRequest('product', `/api/products`, 'GET'),
    getAllProductsMetadata: (p: any) => httpRequest('product', `/api/metadata/products`, 'GET'),
    getProduct: (productId: number) => httpRequest('product', `/api/metadata/product/${productId}`, 'GET'),
    getProductByName: (productName: string) => httpRequest('product', `/api/metadata/product`, 'GET', { name: productName }),
    createProduct: (p: any) => httpRequest('product', `/api/product`, 'POST', p),
    updateProduct: (productId: number, data: any) => httpRequest('product', `/api/product/${productId}`, 'PATCH', data),
    deleteProduct: (productId: number) => httpRequest('product', `/api/product/${productId}`, 'DELETE'),
    addProductToCollection: (productId: number, collectionId: number,) => httpRequest('product', `/api/collection/${collectionId}/product/${productId}`, 'POST'),
    removeProductFromCollection: (productId: number, collectionId: number,) => httpRequest('product', `/api/collection/${collectionId}/product/${productId}`, 'DELETE'),
};