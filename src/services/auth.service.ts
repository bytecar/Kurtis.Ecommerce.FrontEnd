import { httpRequest } from './http.js';
export const AuthAPI = {
    register: (p: any) => httpRequest('auth', `/api/auth/register`, 'POST', p),
    login: (p: any) => httpRequest('auth', `/api/auth/login`, 'POST', p),
    logout: () => httpRequest('auth', `/api/auth/logout`, 'POST'),
    currentUser: () => httpRequest('auth', `/api/auth/me`, 'GET'),
    validateToken: () => httpRequest('auth', `/api/auth/validate`, 'GET'),
    changePassword: (userId: number, currentPassword: any, newPassword: any) => httpRequest('auth', `/api/auth/users/${userId}/changepassword`, 'POST', { currentPassword,  newPassword }),
    updateProfile: (userId: number, data: any) => httpRequest('auth', `/api/auth/users/${userId}`, 'PATCH', data),
};
