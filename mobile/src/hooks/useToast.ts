import { useCallback } from 'react';
import { Platform } from 'react-native';

// For Toast we'd use react-native-toast-message in a real app
// This is a placeholder implementation for our code structure
export type ToastType = 'success' | 'error' | 'info' | 'warning';

export interface ToastOptions {
  message: string;
  type?: ToastType;
  duration?: number;
}

export const useToast = () => {
  const showToast = useCallback(({ message, type = 'info', duration = 3000 }: ToastOptions) => {
    if (Platform.OS === 'web') {
      // For web preview
      const style = type === 'error' ? 'background: #f44336; color: white;' : 
                   type === 'success' ? 'background: #4caf50; color: white;' : 
                   type === 'warning' ? 'background: #ff9800; color: white;' : 
                   'background: #2196f3; color: white;';
      
      console.log(`%c ${message} `, style);
    } else {
      // In a real app, we would use a toast library here
      console.log(`Toast [${type}]: ${message}`);
    }
  }, []);

  return { showToast };
};