import { httpRequest } from './http.js';
export const OrdersAPI = {
    getAllOrders: () => httpRequest('orders', `/api/orders`, 'GET'),
    getOrdersByUser: (userId: number) => httpRequest('orders', `/api/orders`, 'GET'), // Note: Backend uses current user context
    getOrder: (orderId: number) => httpRequest('orders', `/api/orders/${orderId}`, 'GET'),
    getOrderItemsByOrder: (orderId: number) => httpRequest('orders', `/api/orders/${orderId}`, 'GET'), // Returns { order, items }
    createOrder: (data: any) => httpRequest('orders', `/api/orders`, 'POST', data),
    updateOrderStatus: (orderId: number, status: string) => httpRequest('orders', `/api/orders/${orderId}/status`, 'PUT', { status }),
    getRecentOrders: () => httpRequest('orders', `/api/orders?pageSize=5`, 'GET'),
    getRecentOrdersByUser: () => httpRequest('orders', `/api/orders?pageSize=5`, 'GET'),
};