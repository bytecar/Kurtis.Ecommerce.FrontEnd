import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useMutation, useQuery, useQueryClient } from 'react-query';

import { apiClient } from '@/services/api';
import { Product } from '@/types/product';
import { useAuth } from './AuthContext';
import { useToast } from '@/hooks/useToast';

type WishlistContextType = {
  items: Product[];
  isLoading: boolean;
  isInWishlist: (productId: number) => boolean;
  addToWishlist: (product: Product) => void;
  removeFromWishlist: (productId: number) => void;
  toggleWishlist: (product: Product) => void;
};

const WishlistContext = createContext<WishlistContextType | null>(null);

const WISHLIST_STORAGE_KEY = 'kurtis_and_more_wishlist';

export const WishlistProvider = ({ children }: { children: ReactNode }) => {
  const [localWishlist, setLocalWishlist] = useState<Product[]>([]);
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const { showToast } = useToast();

  // Fetch wishlist from API for logged-in users
  const { data: wishlistItems, isLoading: isLoadingWishlist } = useQuery<Product[]>(
    ['wishlist', user?.id],
    async () => {
      if (!user) return [];
      const response = await apiClient.get('/wishlist');
      return response.data;
    },
    {
      enabled: !!user,
      onError: (error) => {
        console.error('Error fetching wishlist:', error);
        showToast({
          message: 'Failed to load wishlist',
          type: 'error',
        });
      },
    }
  );

  // Add to wishlist mutation for logged-in users
  const addMutation = useMutation(
    (product: Product) => apiClient.post('/wishlist', { productId: product.id }),
    {
      onSuccess: () => {
        queryClient.invalidateQueries(['wishlist', user?.id]);
        showToast({
          message: 'Added to wishlist',
          type: 'success',
        });
      },
      onError: (error) => {
        console.error('Error adding to wishlist:', error);
        showToast({
          message: 'Failed to add to wishlist',
          type: 'error',
        });
      },
    }
  );

  // Remove from wishlist mutation for logged-in users
  const removeMutation = useMutation(
    (productId: number) => apiClient.delete(`/wishlist/${productId}`),
    {
      onSuccess: () => {
        queryClient.invalidateQueries(['wishlist', user?.id]);
        showToast({
          message: 'Removed from wishlist',
          type: 'success',
        });
      },
      onError: (error) => {
        console.error('Error removing from wishlist:', error);
        showToast({
          message: 'Failed to remove from wishlist',
          type: 'error',
        });
      },
    }
  );

  // Load local wishlist from AsyncStorage on mount
  useEffect(() => {
    const loadLocalWishlist = async () => {
      try {
        const storedWishlist = await AsyncStorage.getItem(WISHLIST_STORAGE_KEY);
        if (storedWishlist) {
          setLocalWishlist(JSON.parse(storedWishlist));
        }
      } catch (error) {
        console.error('Error loading wishlist from storage:', error);
      }
    };

    if (!user) {
      loadLocalWishlist();
    }
  }, [user]);

  // Save local wishlist to AsyncStorage when it changes
  useEffect(() => {
    if (!user && localWishlist.length > 0) {
      AsyncStorage.setItem(WISHLIST_STORAGE_KEY, JSON.stringify(localWishlist))
        .catch(error => console.error('Error saving wishlist to storage:', error));
    }
  }, [localWishlist, user]);

  // Determine if a product is in the wishlist
  const isInWishlist = (productId: number): boolean => {
    if (user && wishlistItems) {
      return wishlistItems.some(item => item.id === productId);
    }
    return localWishlist.some(item => item.id === productId);
  };

  // Add a product to the wishlist
  const addToWishlist = (product: Product) => {
    if (user) {
      addMutation.mutate(product);
    } else {
      if (!isInWishlist(product.id)) {
        setLocalWishlist(prev => [...prev, product]);
        showToast({
          message: 'Added to wishlist',
          type: 'success',
        });
      }
    }
  };

  // Remove a product from the wishlist
  const removeFromWishlist = (productId: number) => {
    if (user) {
      removeMutation.mutate(productId);
    } else {
      setLocalWishlist(prev => prev.filter(item => item.id !== productId));
      showToast({
        message: 'Removed from wishlist',
        type: 'success',
      });
    }
  };

  // Toggle a product in the wishlist
  const toggleWishlist = (product: Product) => {
    if (isInWishlist(product.id)) {
      removeFromWishlist(product.id);
    } else {
      addToWishlist(product);
    }
  };

  // Determine which wishlist items to use based on auth state
  const items = user ? (wishlistItems || []) : localWishlist;
  const isLoading = user ? isLoadingWishlist : false;

  return (
    <WishlistContext.Provider
      value={{
        items,
        isLoading,
        isInWishlist,
        addToWishlist,
        removeFromWishlist,
        toggleWishlist,
      }}
    >
      {children}
    </WishlistContext.Provider>
  );
};

export const useWishlist = () => {
  const context = useContext(WishlistContext);
  if (!context) {
    throw new Error('useWishlist must be used within a WishlistProvider');
  }
  return context;
};