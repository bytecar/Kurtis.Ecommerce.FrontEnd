import { httpRequest } from './http.js';

export const OrderItemsAPI = {
    getOrderItems: (orderId: number) => httpRequest('orderItems', `/api/orders/${orderId}/items`, 'GET'),
    addOrderItem: (orderId: number, item: any) => httpRequest('orderItems', `/api/orders/${orderId}/items`, 'POST', item),
    removeOrderItem: (orderId: number, itemId: number) => httpRequest('orderItems', `/api/orders/${orderId}/items/${itemId}`, 'DELETE'),
};
