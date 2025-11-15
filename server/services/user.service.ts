import { httpRequest } from './http';
export const UserAPI = {
    getUser: (id: number) => httpRequest('user', `/api/users/${id}`, 'GET'),
    getAllUsers: () => httpRequest('user', `/api/admin/users`, 'GET'),
    createUser: (user: any) => httpRequest('user', `/api/admin/users`, 'POST', user),
    updateUser: (id: number, data: any) => httpRequest('user', `/api/admin/users/${id}`, 'PATCH', data),
    deleteUser: (id: number) => httpRequest('user', `/api/admin/users/${id}`, 'DELETE'),
    changePassword: (id: number, currentPassword: string, newPassword: string) => httpRequest('user', `/api/Auth/users/${id}/change-password`, 'POST', { currentPassword, newPassword }),
    getUserByUsername: async (username: string) => { return UserAPI.getAllUsers().then((users: any) => users.find((u: any) => u.username === username) || null); },
    getUserByEmail: async (email: string) => { return UserAPI.getAllUsers().then((users: any) => users.find((u: any) => u.email === email) || null); },
};