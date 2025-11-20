<<<<<<< HEAD
import { httpRequest } from './http.js';
export const AuthAPI = {
    register: (p: any) => httpRequest('auth', `/api/auth/register`, 'POST', p),
    login: (p: any) => httpRequest('auth', `/api/auth/login`, 'POST', p),
    logout: () => httpRequest('auth', `/api/auth/logout`, 'POST'),
    currentUser: () => httpRequest('auth', `/api/auth/me`, 'GET'),
    validateToken: () => httpRequest('auth', `/api/auth/validate`, 'GET'),
    changePassword: (userId: number, currentPassword: any, newPassword: any) => httpRequest('auth', `/api/auth/users/${userId}/changepassword`, 'POST', { currentPassword,  newPassword }),
    updateProfile: (userId: number, data: any) => httpRequest('auth', `/api/auth/users/${userId}`, 'PATCH', data),
=======
import { httpRequest } from './http';
export const AuthAPI = {
    register: (p: any) => httpRequest('auth', `/api/Auth/register`, 'POST', p),
    login: (p: any) => httpRequest('auth', `/api/Auth/login`, 'POST', p),
    logout: () => httpRequest('auth', `/api/Auth/logout`, 'POST'),
    currentUser: () => httpRequest('auth', `/api/user`, 'GET'),
    validateToken: () => httpRequest('auth', `/api/Auth/validate`, 'GET'),
    changePassword: (userId: number, currentPassword: any, newPassword: any) => httpRequest('auth', `/api/Auth/users/${userId}/changepassword`, 'POST', { currentPassword,  newPassword }),
    updateProfile: (userId: number, data: any) => httpRequest('auth', `/api/Auth/users/${userId}`, 'PATCH', data),
>>>>>>> fc6a7514ce55db2e4e35223257173877c0e98758
};