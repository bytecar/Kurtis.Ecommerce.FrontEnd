import { httpRequest } from './http';
export const MetadataAPI = {
    getAllColors: () => httpRequest('metadata', `/api/metadata/colors`, 'GET'),
    getAllSizes: () => httpRequest('metadata', `/api/metadata/sizes`, 'GET'),
    getRatings: () => httpRequest('metadata', `/api/metadata/ratings`, 'GET'),
    getAllBrandsMetadata: () => httpRequest('metadata', `/api/metadata/brands`, 'GET'),
    getAllCategoriesMetadata: () => httpRequest('metadata', `/api/metadata/categories`, 'GET'),
};