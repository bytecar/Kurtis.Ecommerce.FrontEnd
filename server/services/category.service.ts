import { httpRequest } from './http';
export const CategoryAPI = {
    getAllCategories: () => httpRequest('category', `/api/categories`, 'GET'),
    getAllCategoriesData: (p: any) => httpRequest('category', `/api/categories`, 'GET'),
    getAllCategoriesMetadata: (p: any) => httpRequest('category', `/api/metadata/categories`, 'GET'),
    getCategory: (categoryId: number) => httpRequest('category', `/api/metadata/category/${categoryId}`, 'GET'),
    getCategoryByName: (categoryName: string) => httpRequest('category', `/api/metadata/category`, 'GET', { name: categoryName }),
    createCategory: (p: any) => httpRequest('category', `/api/category`, 'POST', p),
    updateCategory: (categoryId: number, data: any) => httpRequest('category', `/api/category/${categoryId}`, 'PATCH', data),
    deleteCategory: (categoryId: number) => httpRequest('category', `/api/category/${categoryId}`, 'DELETE'),
};