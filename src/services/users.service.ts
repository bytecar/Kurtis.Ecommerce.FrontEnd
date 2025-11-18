import { httpRequest } from './http';
export const UsersAPI = {
    getUser: (id: number) => httpRequest('users', `/api/user/${id}`, 'GET'),
    getAllUsers: () => httpRequest('users', `/api/admin/users`, 'GET'),
    createUser: (user: any) => httpRequest('users', `/api/admin/user`, 'POST', user),
    updateUser: (id: number, data: any) => httpRequest('users', `/api/admin/user/${id}`, 'PATCH', data),
    deleteUser: (id: number) => httpRequest('users', `/api/admin/users/${id}`, 'DELETE'),
    changePassword: (id: number, currentPassword: string, newPassword: string) => httpRequest('users', `/api/Auth/users/${id}/change-password`, 'POST', { currentPassword, newPassword }),
    getUserByUsername: async (username: string) => { return UsersAPI.getAllUsers().then((users: any) => users.find((u: any) => u.username === username) || null); },
    getUserByEmail: async (email: string) => { return UsersAPI.getAllUsers().then((users: any) => users.find((u: any) => u.email === email) || null); },
};