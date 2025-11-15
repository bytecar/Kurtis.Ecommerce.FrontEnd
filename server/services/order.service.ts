import { httpRequest } from './http';
export const OrderAPI = {
    getAllOrders: () => httpRequest('order', `/api/orders/user`, 'GET'),
    getOrdersByUser: (userId: number) => httpRequest('order', `/api/orders/user/${userId}`, 'GET'),
    getOrder: (orderId: number) => httpRequest('order', `/api/order/${orderId}`, 'GET'),
    getOrderItemsByOrder: (orderId: number) => httpRequest('order', `/api/order/${orderId}/items`, 'GET'),
    createOrder: (data: any) => httpRequest('order', `/api/order`, 'POST', data),
    createOrderItems: (data: any) => httpRequest('order', `/api/order/order-items`, 'POST', data),
    updateOrderStatus: (orderId: number, status: string) => httpRequest('order', `/api/order/${orderId}/status`, 'PATCH', { status }),
    getRecentOrders: () => httpRequest('order', `/api/orders/recent`, 'GET'),
    getRecentOrdersByUser: () => httpRequest('order', `/api/orders/recent/user`, 'GET'),
};