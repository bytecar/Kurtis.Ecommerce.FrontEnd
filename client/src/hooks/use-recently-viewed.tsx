import { createContext, ReactNode, useContext, useEffect, useState, useRef, useCallback } from "react";
import { useAuth } from "@/hooks/use-auth";
import { apiRequest, queryClient, getQueryFn } from "@/lib/queryClient";
import { Product } from "@shared/schema";
import { useMutation, useQuery } from "@tanstack/react-query";

type RecentlyViewedContextType = {
  items: Product[];
  isLoading: boolean;
  addToRecentlyViewed: (productId: number) => void;
};

const LOCAL_STORAGE_KEY = "kurtisnmore_recently_viewed";
const MAX_ITEMS = 10;

const RecentlyViewedContext = createContext<RecentlyViewedContextType | null>(null);

export function RecentlyViewedProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<Product[]>([]);
  const { user } = useAuth();

  // Fetch recently viewed products from API if user is logged in
  const { data: apiItems, isLoading } = useQuery({
    queryKey: ["/api/recently-viewed"],
    queryFn: getQueryFn({ on401: "returnNull" }),
    enabled: !!user,
  });

  // Load recently viewed from local storage for guests
  useEffect(() => {
    if (!user) {
      const savedItems = localStorage.getItem(LOCAL_STORAGE_KEY);
      if (savedItems) {
        try {
          setItems(JSON.parse(savedItems));
        } catch (error) {
          console.error("Failed to parse recently viewed from storage:", error);
        }
      }
    }
  }, [user]);

  // Update state from API data for logged-in users
  useEffect(() => {
    if (user && apiItems) {
      setItems(apiItems);
    }
  }, [user, apiItems]);

  // Cache of already added product IDs to prevent duplicate API calls
  const addedProductsRef = useRef<Set<number>>(new Set());

  // Add product to recently viewed
  const addMutation = useMutation({
    mutationFn: async (productId: number) => {
      // Skip if we already added this product in the current session
      if (addedProductsRef.current.has(productId)) {
        console.log(`Product ${productId} already in recently viewed cache, skipping API call`);
        return null;
      }

      // Add to our cache
      addedProductsRef.current.add(productId);

      if (user) {
        await apiRequest("POST", "/api/recently-viewed", { productId });
        return queryClient.invalidateQueries({ queryKey: ["/api/recently-viewed"] });
      } else {
        // For guests, check if we already have the product data
        const existingItem = items.find(item => item.id === productId);
        if (existingItem) {
          return existingItem;
        }
        
        // Only fetch if we don't have the data
        try {
          const response = await fetch(`/api/products/${productId}`);
          if (!response.ok) {
            throw new Error(`Failed to fetch product: ${response.status}`);
          }
          return await response.json();
        } catch (error) {
          console.error("Error fetching product for recently viewed:", error);
          return null;
        }
      }
    },
    onSuccess: (data, productId) => {
      if (!user && data) {
        setItems(prevItems => {
          // Move existing item to front or add new item
          const newItems = [
            data,
            ...prevItems.filter(item => item.id !== productId)
          ].slice(0, MAX_ITEMS);
          
          // Save to local storage
          localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(newItems));
          
          return newItems;
        });
      }
    }
  });

  // Memoize the function to prevent dependency cycles
  const addToRecentlyViewed = useCallback((productId: number) => {
    addMutation.mutate(productId);
  }, [addMutation]);

  return (
    <RecentlyViewedContext.Provider
      value={{
        items,
        isLoading,
        addToRecentlyViewed,
      }}
    >
      {children}
    </RecentlyViewedContext.Provider>
  );
}

export function useRecentlyViewed() {
  const context = useContext(RecentlyViewedContext);
  if (!context) {
    throw new Error("useRecentlyViewed must be used within a RecentlyViewedProvider");
  }
  return context;
}
