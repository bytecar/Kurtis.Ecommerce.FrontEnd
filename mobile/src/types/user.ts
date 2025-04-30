export interface User {
  id: number;
  username: string;
  email: string;
  fullName: string;
  role: 'user' | 'admin' | 'content_manager';
  createdAt: Date | null;
}

export interface UserPreferences {
  id: number;
  userId: number;
  preferredCategories: string[];
  preferredSizes: string[];
  colorPreferences: string[];
  notificationPreferences: boolean;
}