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
};