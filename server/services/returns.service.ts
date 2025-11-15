import { httpRequest } from './http';
export const ReturnsAPI = {
    createReturn: (data: any) => httpRequest('returns', `/api/returns`, 'POST', data),
    getReturn: (id: number) => httpRequest('returns', `/api/returns/${id}`, 'GET'),
    getAllReturns: () => httpRequest('returns', `/api/returns`, 'GET'),
    getReturnsByUser: (userId: number) => httpRequest('returns', `/api/user/returns/user/${userId}`, 'GET'),
    updateReturnStatus: (id: number, status: string) => httpRequest('returns', `/api/returns/${id}`, 'PATCH', { status }),
};