import { httpRequest } from './http';
export const InventoryAPI = {
    getInventoryByProduct: (productId: number) => httpRequest('inventory', `/api/inventory/product/${productId}`, 'GET'),
    createInventory: (data: any) => httpRequest('inventory', `/api/inventory`, 'POST', data),
    updateInventory: (inventoryId: number, data: any) => httpRequest('inventory', `/api/inventory/${inventoryId}`, 'PATCH', data),
};