import { createContext, ReactNode, useContext, useEffect, useState } from "react";
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

  // Add product to recently viewed
  const addMutation = useMutation({
    mutationFn: async (productId: number) => {
      if (user) {
        await apiRequest("POST", "/api/recently-viewed", { productId });
        return queryClient.invalidateQueries({ queryKey: ["/api/recently-viewed"] });
      } else {
        // For guests, handle locally
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
          // Check if product already exists in the list
          const existingProductIndex = prevItems.findIndex(item => item.id === productId);
          
          // If product exists, don't modify the state to prevent re-renders
          if (existingProductIndex === 0) {
            return prevItems;
          }
          
          // Remove existing instance of the product if it exists elsewhere in the list
          const filteredItems = existingProductIndex > 0 
            ? [...prevItems.slice(0, existingProductIndex), ...prevItems.slice(existingProductIndex + 1)]
            : [...prevItems];
          
          // Add product to the beginning of the array
          const newItems = [data, ...filteredItems].slice(0, MAX_ITEMS);
          
          // Save to local storage
          localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(newItems));
          
          return newItems;
        });
      }
    }
  });

  const addToRecentlyViewed = (productId: number) => {
    addMutation.mutate(productId);
  };

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
