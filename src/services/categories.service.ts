<<<<<<< HEAD
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
=======
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
>>>>>>> fc6a7514ce55db2e4e35223257173877c0e98758
};