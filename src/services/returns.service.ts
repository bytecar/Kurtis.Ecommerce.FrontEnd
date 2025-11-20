<<<<<<< HEAD
import { httpRequest } from './http.js';
export const ReturnsAPI = {
    createReturn: (data: any) => httpRequest('returns', `/api/returns`, 'POST', data),
    getAllReturns: () => httpRequest('returns', `/api/returns`, 'GET'),
    getReturnsByUser: () => httpRequest('returns', `/api/returns/user`, 'GET'),
=======
import { httpRequest } from './http';
export const ReturnsAPI = {
    createReturn: (data: any) => httpRequest('returns', `/api/returns`, 'POST', data),
    getReturn: (id: number) => httpRequest('returns', `/api/returns/${id}`, 'GET'),
    getAllReturns: () => httpRequest('returns', `/api/returns`, 'GET'),
    getReturnsByUser: (userId: number) => httpRequest('returns', `/api/user/returns/user/${userId}`, 'GET'),
>>>>>>> fc6a7514ce55db2e4e35223257173877c0e98758
    updateReturnStatus: (id: number, status: string) => httpRequest('returns', `/api/returns/${id}`, 'PATCH', { status }),
};