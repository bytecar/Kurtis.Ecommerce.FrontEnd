import { httpRequest } from './http';
export const InventoriesAPI = {
    getInventoryByProduct: (productId: number) => httpRequest('inventories', `/api/inventory/product/${productId}`, 'GET'),
    createInventory: (data: any) => httpRequest('inventories', `/api/inventory`, 'POST', data),
    updateInventory: (inventoryId: number, data: any) => httpRequest('inventories', `/api/inventory/${inventoryId}`, 'PATCH', data),
};