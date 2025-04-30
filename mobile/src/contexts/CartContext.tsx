import React, { createContext, useContext, useReducer, useEffect, ReactNode } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Product } from '@/types/product';

export type CartItem = {
  product: Product;
  size: string;
  quantity: number;
};

type CartState = {
  items: CartItem[];
  isLoading: boolean;
};

type CartAction =
  | { type: 'SET_CART'; payload: CartItem[] }
  | { type: 'ADD_ITEM'; payload: CartItem }
  | { type: 'UPDATE_QUANTITY'; payload: { productId: number; size: string; quantity: number } }
  | { type: 'REMOVE_ITEM'; payload: { productId: number; size: string } }
  | { type: 'CLEAR_CART' }
  | { type: 'SET_LOADING'; payload: boolean };

type CartContextType = {
  items: CartItem[];
  isLoading: boolean;
  totalItems: number;
  totalPrice: number;
  addItem: (product: Product, size: string, quantity: number) => void;
  updateQuantity: (productId: number, size: string, quantity: number) => void;
  removeItem: (productId: number, size: string) => void;
  clearCart: () => void;
};

const CartContext = createContext<CartContextType | null>(null);

const CART_STORAGE_KEY = 'kurtis_and_more_cart';

const cartReducer = (state: CartState, action: CartAction): CartState => {
  switch (action.type) {
    case 'SET_CART':
      return {
        ...state,
        items: action.payload,
        isLoading: false,
      };
    case 'ADD_ITEM': {
      const existingItemIndex = state.items.findIndex(
        item => item.product.id === action.payload.product.id && item.size === action.payload.size
      );

      if (existingItemIndex >= 0) {
        // If item already exists, update quantity
        const updatedItems = [...state.items];
        updatedItems[existingItemIndex].quantity += action.payload.quantity;
        return { ...state, items: updatedItems };
      } else {
        // Else add new item
        return { ...state, items: [...state.items, action.payload] };
      }
    }
    case 'UPDATE_QUANTITY': {
      const { productId, size, quantity } = action.payload;
      
      if (quantity <= 0) {
        // If quantity is 0 or less, remove the item
        return {
          ...state,
          items: state.items.filter(
            item => !(item.product.id === productId && item.size === size)
          ),
        };
      }
      
      const updatedItems = state.items.map(item => {
        if (item.product.id === productId && item.size === size) {
          return { ...item, quantity };
        }
        return item;
      });

      return { ...state, items: updatedItems };
    }
    case 'REMOVE_ITEM': {
      const { productId, size } = action.payload;
      return {
        ...state,
        items: state.items.filter(
          item => !(item.product.id === productId && item.size === size)
        ),
      };
    }
    case 'CLEAR_CART':
      return { ...state, items: [] };
    case 'SET_LOADING':
      return { ...state, isLoading: action.payload };
    default:
      return state;
  }
};

export const CartProvider = ({ children }: { children: ReactNode }) => {
  const [state, dispatch] = useReducer(cartReducer, {
    items: [],
    isLoading: true,
  });

  // Calculate total items and price
  const totalItems = state.items.reduce((total, item) => total + item.quantity, 0);
  const totalPrice = state.items.reduce(
    (total, item) => total + (item.product.discountedPrice || item.product.price) * item.quantity,
    0
  );

  // Load cart from AsyncStorage on mount
  useEffect(() => {
    const loadCart = async () => {
      try {
        const storedCart = await AsyncStorage.getItem(CART_STORAGE_KEY);
        if (storedCart) {
          dispatch({ type: 'SET_CART', payload: JSON.parse(storedCart) });
        }
      } catch (error) {
        console.error('Error loading cart from storage:', error);
      } finally {
        dispatch({ type: 'SET_LOADING', payload: false });
      }
    };

    loadCart();
  }, []);

  // Save cart to AsyncStorage when it changes
  useEffect(() => {
    if (!state.isLoading) {
      AsyncStorage.setItem(CART_STORAGE_KEY, JSON.stringify(state.items))
        .catch(error => console.error('Error saving cart to storage:', error));
    }
  }, [state.items, state.isLoading]);

  // Add item to cart
  const addItem = (product: Product, size: string, quantity: number) => {
    dispatch({
      type: 'ADD_ITEM',
      payload: { product, size, quantity },
    });
  };

  // Update item quantity
  const updateQuantity = (productId: number, size: string, quantity: number) => {
    dispatch({
      type: 'UPDATE_QUANTITY',
      payload: { productId, size, quantity },
    });
  };

  // Remove item from cart
  const removeItem = (productId: number, size: string) => {
    dispatch({
      type: 'REMOVE_ITEM',
      payload: { productId, size },
    });
  };

  // Clear cart
  const clearCart = () => {
    dispatch({ type: 'CLEAR_CART' });
  };

  return (
    <CartContext.Provider
      value={{
        items: state.items,
        isLoading: state.isLoading,
        totalItems,
        totalPrice,
        addItem,
        updateQuantity,
        removeItem,
        clearCart,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};