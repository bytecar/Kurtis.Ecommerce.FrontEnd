import { httpRequest } from './http';
export const PreferencesAPI = {
    getUserPreferences: (userId: number) => httpRequest('preferences', `/api/user/${userId}/preferences`, 'GET'),
    saveUserPreferences: (preferences: any) => httpRequest('preferences', `/api/user/preferences`, 'POST', preferences),
};