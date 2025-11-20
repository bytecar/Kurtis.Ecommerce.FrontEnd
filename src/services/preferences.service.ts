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
};
