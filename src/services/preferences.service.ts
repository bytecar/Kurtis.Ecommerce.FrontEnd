<<<<<<< HEAD
import { httpRequest } from './http.js';
export const PreferencesAPI = {
    getUserPreferences: () => httpRequest('preferences', `/api/user/preferences`, 'GET'),
    createUserPreferences: (preferences: any) => httpRequest('preferences', `/api/user/preferences`, 'POST', preferences),
    updateUserPreferences: (preferences: any) => httpRequest('preferences', `/api/user/preferences`, 'PUT', preferences),
    saveUserPreferences: async (preferences: any) => {
        try {
            // Try to create first
            return await httpRequest('preferences', `/api/user/preferences`, 'POST', preferences);
        } catch (error: any) {
            // If conflict (409) or similar, try update
            if (error.status === 409 || error.statusCode === 409) {
                return await httpRequest('preferences', `/api/user/preferences`, 'PUT', preferences);
            }
            throw error;
        }
    }
=======
import { httpRequest } from './http';
export const PreferencesAPI = {
    getUserPreferences: (userId: number) => httpRequest('preferences', `/api/user/${userId}/preferences`, 'GET'),
    saveUserPreferences: (preferences: any) => httpRequest('preferences', `/api/user/preferences`, 'POST', preferences),
>>>>>>> fc6a7514ce55db2e4e35223257173877c0e98758
};