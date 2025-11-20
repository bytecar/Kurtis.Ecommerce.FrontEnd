import { httpRequest } from './http.js';
export const ReturnsAPI = {
    createReturn: (data: any) => httpRequest('returns', `/api/returns`, 'POST', data),
    getAllReturns: () => httpRequest('returns', `/api/returns`, 'GET'),
    getReturnsByUser: () => httpRequest('returns', `/api/returns/user`, 'GET'),
    updateReturnStatus: (id: number, status: string) => httpRequest('returns', `/api/returns/${id}`, 'PATCH', { status }),
};