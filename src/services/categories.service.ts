import { httpRequest } from './http';
export const CategoriesAPI = {
    getAllCategories: () => httpRequest('categories', `/api/categories`, 'GET'),
    getAllCategoriesData: (p: any) => httpRequest('categories', `/api/categories`, 'GET', p),
    getAllCategoriesMetadata: (p: any) => httpRequest('categories', `/api/metadata/categories`, 'GET', p),
    getCategory: (categoryId: number) => httpRequest('categories', `/api/metadata/category/${categoryId}`, 'GET'),
    getCategoryByName: (categoryName: string) => httpRequest('categories', `/api/metadata/category`, 'GET', { name: categoryName }),
    createCategory: (p: any) => httpRequest('categories', `/api/category`, 'POST', p),
    updateCategory: (categoryId: number, data: any) => httpRequest('categories', `/api/category/${categoryId}`, 'PATCH', data),
    deleteCategory: (categoryId: number) => httpRequest('categories', `/api/category/${categoryId}`, 'DELETE'),
};