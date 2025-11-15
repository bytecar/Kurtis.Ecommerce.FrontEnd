import { httpRequest } from './http';
export const BrandAPI = {
    getAllBrands: () => httpRequest('brand', `/api/brands`, 'GET'),
    getAllBrandsData: (p: any) => httpRequest('brand', `/api/brands`, 'GET'),
    getAllBrandsMetadata: (p: any) => httpRequest('brand', `/api/metadata/brands`, 'GET'),
    getBrand: (p: any) => httpRequest('brand', `/api/metadata/brand`, 'GET'),
    getBrandByName: (p: any) => httpRequest('brand', `/api/metadata/brand`, 'GET'),
    createBrand: (p: any) => httpRequest('brand', `/api/brand`, 'POST', p),
    updateBrand: (brandId: number, data: any) => httpRequest('brand', `/api/brand/${brandId}`, 'PATCH', data),
    deleteBrand: (brandId: number) => httpRequest('brand', `/api/brand/${brandId}`, 'DELETE'),    
};