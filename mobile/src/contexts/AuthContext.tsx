import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useMutation, useQuery, useQueryClient } from 'react-query';

import { apiClient } from '@/services/api';
import { User } from '@/types/user';

type AuthContextType = {
  user: User | null;
  isLoading: boolean;
  error: Error | null;
  login: (credentials: { username: string; password: string }) => Promise<void>;
  register: (userData: { 
    username: string; 
    password: string; 
    email: string; 
    fullName: string;
  }) => Promise<void>;
  logout: () => Promise<void>;
};

const AuthContext = createContext<AuthContextType | null>(null);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [isLoading, setIsLoading] = useState(true);
  const queryClient = useQueryClient();

  // Fetch user data if token exists
  const { data: user, error } = useQuery<User, Error>(
    'user',
    async () => {
      const response = await apiClient.get('/user');
      return response.data;
    },
    {
      retry: false,
      onSettled: () => setIsLoading(false),
      onError: () => {
        // Clear any existing token if the user fetch fails
        AsyncStorage.removeItem('auth_token');
      }
    }
  );

  // Login mutation
  const loginMutation = useMutation(
    async (credentials: { username: string; password: string }) => {
      const response = await apiClient.post('/login', credentials);
      return response.data;
    },
    {
      onSuccess: async (data) => {
        await AsyncStorage.setItem('auth_token', data.token || 'token');
        queryClient.setQueryData('user', data);
      },
    }
  );

  // Register mutation
  const registerMutation = useMutation(
    async (userData: { username: string; password: string; email: string; fullName: string }) => {
      const response = await apiClient.post('/register', userData);
      return response.data;
    },
    {
      onSuccess: async (data) => {
        await AsyncStorage.setItem('auth_token', data.token || 'token');
        queryClient.setQueryData('user', data);
      },
    }
  );

  // Logout function
  const logout = async () => {
    try {
      await apiClient.post('/logout');
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      await AsyncStorage.removeItem('auth_token');
      queryClient.setQueryData('user', null);
      queryClient.invalidateQueries('user');
    }
  };

  // Set up API token when component mounts
  useEffect(() => {
    const setupTokenFromStorage = async () => {
      try {
        const token = await AsyncStorage.getItem('auth_token');
        if (token) {
          apiClient.defaults.headers.common['Authorization'] = `Bearer ${token}`;
        }
      } catch (error) {
        console.error('Error retrieving auth token:', error);
      } finally {
        setIsLoading(false);
      }
    };

    setupTokenFromStorage();
  }, []);

  return (
    <AuthContext.Provider
      value={{
        user: user || null,
        isLoading,
        error,
        login: loginMutation.mutateAsync,
        register: registerMutation.mutateAsync,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};