<<<<<<< HEAD
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
=======
import { httpRequest } from './http';
export const BrandsAPI = {
    getAllBrands: () => httpRequest('brands', `/api/brands`, 'GET'),
    getAllBrandsData: (p: any) => httpRequest('brands', `/api/brands`, 'GET'),
    getAllBrandsMetadata: (p: any) => httpRequest('brands', `/api/metadata/brands`, 'GET'),
    getBrand: (p: any) => httpRequest('brands', `/api/metadata/brand`, 'GET'),
    getBrandByName: (p: any) => httpRequest('brands', `/api/metadata/brand`, 'GET'),
    createBrand: (p: any) => httpRequest('brands', `/api/brand`, 'POST', p),
    updateBrand: (brandId: number, data: any) => httpRequest('brands', `/api/brand/${brandId}`, 'PATCH', data),
    deleteBrand: (brandId: number) => httpRequest('brands', `/api/brand/${brandId}`, 'DELETE'),    
>>>>>>> fc6a7514ce55db2e4e35223257173877c0e98758
};