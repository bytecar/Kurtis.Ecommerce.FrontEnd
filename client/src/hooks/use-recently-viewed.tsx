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
        const product = await fetch(`/api/products/${productId}`).then(res => res.json());
        return product;
      }
    },
    onSuccess: (data, productId) => {
      if (!user && data) {
        setItems(prevItems => {
          // Remove existing instance of the product if it exists
          const filteredItems = prevItems.filter(item => item.id !== productId);
          
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
