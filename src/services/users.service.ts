import { httpRequest } from './http.js';
export const UsersAPI = {
    getUser: (id: number) => httpRequest('users', `/api/users/${id}`, 'GET'),
    getAllUsers: () => httpRequest('users', `/api/users`, 'GET'),
    createUser: (user: any) => httpRequest('users', `/api/users`, 'POST', user),
    updateUser: (id: number, data: any) => httpRequest('users', `/api/users/${id}`, 'PUT', data),
    deleteUser: (id: number) => httpRequest('users', `/api/users/${id}`, 'DELETE'),
    changePassword: (id: number, currentPassword: string, newPassword: string) => httpRequest('users', `/api/auth/change-password`, 'POST', { currentPassword, newPassword }),
    getUserByUsername: async (username: string) => { return UsersAPI.getAllUsers().then((response: any) => (response.data || response).find((u: any) => u.username === username) || null); },
    getUserByEmail: async (email: string) => { return UsersAPI.getAllUsers().then((response: any) => (response.data || response).find((u: any) => u.email === email) || null); },
};
