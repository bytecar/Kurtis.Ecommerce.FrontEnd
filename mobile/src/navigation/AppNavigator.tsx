import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { useTheme } from 'react-native-paper';
import { Ionicons } from '@expo/vector-icons';

import { useAuth } from '@/contexts/AuthContext';

// Import screens
import HomeScreen from '@/screens/HomeScreen';
import ProductListingScreen from '@/screens/ProductListingScreen';
import ProductDetailScreen from '@/screens/ProductDetailScreen';
import CartScreen from '@/screens/CartScreen';
import WishlistScreen from '@/screens/WishlistScreen';
import ProfileScreen from '@/screens/ProfileScreen';
import AuthScreen from '@/screens/AuthScreen';
import OrdersScreen from '@/screens/OrdersScreen';
import OrderDetailScreen from '@/screens/OrderDetailScreen';
import SearchScreen from '@/screens/SearchScreen';
import SplashScreen from '@/screens/SplashScreen';

// Define types for our navigation
export type MainStackParamList = {
  Home: undefined;
  ProductListing: { category?: string; gender?: string; brand?: string; newArrivals?: boolean };
  ProductDetail: { productId: number };
  Cart: undefined;
  Wishlist: undefined;
  Profile: undefined;
  Orders: undefined;
  OrderDetail: { orderId: number };
  Search: undefined;
};

export type AuthStackParamList = {
  Auth: undefined;
};

export type RootStackParamList = {
  Splash: undefined;
  MainStack: undefined;
  AuthStack: undefined;
};

// Create the navigators
const Stack = createNativeStackNavigator<RootStackParamList>();
const MainStack = createNativeStackNavigator<MainStackParamList>();
const AuthStack = createNativeStackNavigator<AuthStackParamList>();
const Tab = createBottomTabNavigator<MainStackParamList>();

// Tab Navigator for main app sections
const TabNavigator = () => {
  const theme = useTheme();
  
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          let iconName: keyof typeof Ionicons.glyphMap = 'home';
          
          if (route.name === 'Home') {
            iconName = focused ? 'home' : 'home-outline';
          } else if (route.name === 'ProductListing') {
            iconName = focused ? 'grid' : 'grid-outline';
          } else if (route.name === 'Cart') {
            iconName = focused ? 'cart' : 'cart-outline';
          } else if (route.name === 'Wishlist') {
            iconName = focused ? 'heart' : 'heart-outline';
          } else if (route.name === 'Profile') {
            iconName = focused ? 'person' : 'person-outline';
          }
          
          return <Ionicons name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: theme.colors.primary,
        tabBarInactiveTintColor: theme.colors.onSurfaceVariant,
        tabBarStyle: {
          backgroundColor: theme.colors.surface,
          borderTopColor: theme.colors.border,
        },
        headerStyle: {
          backgroundColor: theme.colors.surface,
        },
        headerTintColor: theme.colors.onSurface,
        headerShadowVisible: false,
      })}
    >
      <Tab.Screen name="Home" component={HomeScreen} options={{ title: 'Home' }} />
      <Tab.Screen name="ProductListing" component={ProductListingScreen} options={{ title: 'Explore' }} />
      <Tab.Screen name="Cart" component={CartScreen} options={{ title: 'Cart' }} />
      <Tab.Screen name="Wishlist" component={WishlistScreen} options={{ title: 'Wishlist' }} />
      <Tab.Screen name="Profile" component={ProfileScreen} options={{ title: 'Profile' }} />
    </Tab.Navigator>
  );
};

// Main Navigator for authenticated users
const MainNavigator = () => {
  return (
    <MainStack.Navigator>
      <MainStack.Screen 
        name="Home" 
        component={TabNavigator} 
        options={{ headerShown: false }} 
      />
      <MainStack.Screen 
        name="ProductDetail" 
        component={ProductDetailScreen} 
        options={({ route }) => ({ title: 'Product Details' })}
      />
      <MainStack.Screen 
        name="Orders" 
        component={OrdersScreen} 
        options={{ title: 'My Orders' }}
      />
      <MainStack.Screen 
        name="OrderDetail" 
        component={OrderDetailScreen} 
        options={({ route }) => ({ title: 'Order #' + route.params.orderId })}
      />
      <MainStack.Screen 
        name="Search" 
        component={SearchScreen} 
        options={{ title: 'Search' }}
      />
    </MainStack.Navigator>
  );
};

// Auth Navigator for unauthenticated users
const AuthNavigator = () => {
  return (
    <AuthStack.Navigator screenOptions={{ headerShown: false }}>
      <AuthStack.Screen name="Auth" component={AuthScreen} />
    </AuthStack.Navigator>
  );
};

// Root Navigator that handles authentication state
const AppNavigator = () => {
  const { user, isLoading } = useAuth();

  if (isLoading) {
    return (
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        <Stack.Screen name="Splash" component={SplashScreen} />
      </Stack.Navigator>
    );
  }

  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      {user ? (
        <Stack.Screen name="MainStack" component={MainNavigator} />
      ) : (
        <Stack.Screen name="AuthStack" component={AuthNavigator} />
      )}
    </Stack.Navigator>
  );
};

export default AppNavigator;