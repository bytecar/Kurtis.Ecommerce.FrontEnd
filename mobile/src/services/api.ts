import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Create axios instance with default config
export const apiClient = axios.create({
  baseURL: 'https://api.kurtisandmore.com/api', // Replace with your actual API URL in production
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
    Accept: 'application/json',
  },
});

// Development endpoint
// For local development on iOS simulator
if (__DEV__) {
  apiClient.defaults.baseURL = 'http://localhost:5000/api';
}

// Request interceptor for API calls
apiClient.interceptors.request.use(
  async (config) => {
    const token = await AsyncStorage.getItem('auth_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor for API calls
apiClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    
    // Handle unauthorized errors (401)
    if (error.response?.status === 401 && !originalRequest._retry) {
      // Clear token if unauthorized
      await AsyncStorage.removeItem('auth_token');
    }
    
    return Promise.reject(error);
  }
);

// API services
export const productApi = {
  getProducts: async (params: any = {}) => {
    return apiClient.get('/products', { params });
  },
  
  getProduct: async (id: number) => {
    return apiClient.get(`/products/${id}`);
  },
  
  getFeatured: async () => {
    return apiClient.get('/products/featured');
  },
  
  getNewArrivals: async () => {
    return apiClient.get('/products/new');
  },
  
  searchProducts: async (query: string) => {
    return apiClient.get('/products/search', { params: { query } });
  },
};

export const authApi = {
  login: async (username: string, password: string) => {
    return apiClient.post('/login', { username, password });
  },
  
  register: async (userData: { username: string; password: string; email: string; fullName: string }) => {
    return apiClient.post('/register', userData);
  },
  
  logout: async () => {
    return apiClient.post('/logout');
  },
  
  getCurrentUser: async () => {
    return apiClient.get('/user');
  },
};

export const orderApi = {
  getOrders: async () => {
    return apiClient.get('/orders');
  },
  
  getOrder: async (id: number) => {
    return apiClient.get(`/orders/${id}`);
  },
  
  createOrder: async (orderData: any) => {
    return apiClient.post('/orders', orderData);
  },
};

export const wishlistApi = {
  getWishlist: async () => {
    return apiClient.get('/wishlist');
  },
  
  addToWishlist: async (productId: number) => {
    return apiClient.post('/wishlist', { productId });
  },
  
  removeFromWishlist: async (productId: number) => {
    return apiClient.delete(`/wishlist/${productId}`);
  },
};

export const reviewApi = {
  getProductReviews: async (productId: number) => {
    return apiClient.get(`/reviews/product/${productId}`);
  },
  
  addReview: async (review: { productId: number; rating: number; comment?: string }) => {
    return apiClient.post('/reviews', review);
  },
};