import { httpRequest } from './http.js';
export const MetadataAPI = {
    getAllColors: () => httpRequest('metadata', `/api/metadatas/colors`, 'GET'),
    getAllSizes: () => httpRequest('metadata', `/api/metadatas/sizes`, 'GET'),
    getRatings: () => httpRequest('metadata', `/api/metadatas/ratings`, 'GET'),
    getAllBrandsMetadata: () => httpRequest('metadata', `/api/metadatas/brands`, 'GET'),
    getAllCategoriesMetadata: () => httpRequest('metadata', `/api/metadatas/categories`, 'GET'),
    getAllProductsMetadata: (p: any) => httpRequest('metadata', `/api/metadatas/products`, 'GET', p),
};
