<<<<<<< HEAD
import { httpRequest } from './http.js';
export const InventoriesAPI = {
    getInventoryByProduct: (productId: number) => httpRequest('inventories', `/api/inventories/product/${productId}`, 'GET'),
    createInventory: (data: any) => httpRequest('inventories', `/api/inventories`, 'POST', data),
    updateInventory: (inventoryId: number, data: any) => httpRequest('inventories', `/api/inventories/${inventoryId}`, 'PUT', data),
=======
import { httpRequest } from './http';
export const InventoriesAPI = {
    getInventoryByProduct: (productId: number) => httpRequest('inventories', `/api/inventory/product/${productId}`, 'GET'),
    createInventory: (data: any) => httpRequest('inventories', `/api/inventory`, 'POST', data),
    updateInventory: (inventoryId: number, data: any) => httpRequest('inventories', `/api/inventory/${inventoryId}`, 'PATCH', data),
>>>>>>> fc6a7514ce55db2e4e35223257173877c0e98758
};