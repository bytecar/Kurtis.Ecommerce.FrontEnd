import { httpRequest } from './http.js';
export const InventoriesAPI = {
    getInventoryByProduct: (productId: number) => httpRequest('inventories', `/api/inventories/product/${productId}`, 'GET'),
    createInventory: (data: any) => httpRequest('inventories', `/api/inventories`, 'POST', data),
    updateInventory: (inventoryId: number, data: any) => httpRequest('inventories', `/api/inventories/${inventoryId}`, 'PUT', data),
};