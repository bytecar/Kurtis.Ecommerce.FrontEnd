import { httpRequest } from './http.js';
export const CategoriesAPI = {
    getAllCategories: () => httpRequest('categories', `/api/categories`, 'GET'),
    getAllCategoriesData: (p: any) => httpRequest('categories', `/api/categories`, 'GET', p),
    getAllCategoriesMetadata: (p: any) => httpRequest('categories', `/api/categories`, 'GET', p),
    getCategory: (categoryId: number) => httpRequest('categories', `/api/categories/${categoryId}`, 'GET'),
    getCategoryByName: (categoryName: string) => httpRequest('categories', `/api/categories`, 'GET'),
    createCategory: (p: any) => httpRequest('categories', `/api/categories`, 'POST', p),
    updateCategory: (categoryId: number, data: any) => httpRequest('categories', `/api/categories/${categoryId}`, 'PUT', data),
    deleteCategory: (categoryId: number) => httpRequest('categories', `/api/categories/${categoryId}`, 'DELETE'),
};
