import { httpRequest } from './http';
export const AuthAPI = {
    register: (p: any) => httpRequest('auth', `/api/Auth/register`, 'POST', p),
    login: (p: any) => httpRequest('auth', `/api/Auth/login`, 'POST', p),
    logout: () => httpRequest('auth', `/api/Auth/logout`, 'POST'),
    currentUser: () => httpRequest('auth', `/api/user`, 'GET'),
    validateToken: () => httpRequest('auth', `/api/Auth/validate`, 'GET'),
    changePassword: (userId: number, currentPassword: any, newPassword: any) => httpRequest('auth', `/api/Auth/users/${userId}/changepassword`, 'POST', { currentPassword,  newPassword }),
    updateProfile: (userId: number, data: any) => httpRequest('auth', `/api/Auth/users/${userId}`, 'PATCH', data),
};