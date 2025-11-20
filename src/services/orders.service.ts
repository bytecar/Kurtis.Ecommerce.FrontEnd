<<<<<<< HEAD
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
=======
import { httpRequest } from './http';
export const OrdersAPI = {
    getAllOrders: () => httpRequest('orders', `/api/orders/user`, 'GET'),
    getOrdersByUser: (userId: number) => httpRequest('orders', `/api/orders/user/${userId}`, 'GET'),
    getOrder: (orderId: number) => httpRequest('orders', `/api/order/${orderId}`, 'GET'),
    getOrderItemsByOrder: (orderId: number) => httpRequest('orders', `/api/order/${orderId}/items`, 'GET'),
    createOrder: (data: any) => httpRequest('orders', `/api/order`, 'POST', data),
    createOrderItems: (data: any) => httpRequest('orders', `/api/order/order-items`, 'POST', data),
    updateOrderStatus: (orderId: number, status: string) => httpRequest('orders', `/api/order/${orderId}/status`, 'PATCH', { status }),
    getRecentOrders: () => httpRequest('orders', `/api/orders/recent`, 'GET'),
    getRecentOrdersByUser: () => httpRequest('orders', `/api/orders/recent/user`, 'GET'),
>>>>>>> fc6a7514ce55db2e4e35223257173877c0e98758
};