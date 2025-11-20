import { httpRequest } from './http.js';
export const BrandsAPI = {
    getAllBrands: () => httpRequest('brands', `/api/brands`, 'GET'),
    getAllBrandsData: (p: any) => httpRequest('brands', `/api/brands`, 'GET'),
    getAllBrandsMetadata: (p: any) => httpRequest('brands', `/api/brands`, 'GET'),
    getBrand: (brandId: number) => httpRequest('brands', `/api/brands/${brandId}`, 'GET'),
    getBrandByName: (name: string) => httpRequest('brands', `/api/brands/search`, 'GET', { q: name }),
    createBrand: (p: any) => httpRequest('brands', `/api/brands`, 'POST', p),
    updateBrand: (brandId: number, data: any) => httpRequest('brands', `/api/brands/${brandId}`, 'PUT', data),
    deleteBrand: (brandId: number) => httpRequest('brands', `/api/brands/${brandId}`, 'DELETE'),
};
