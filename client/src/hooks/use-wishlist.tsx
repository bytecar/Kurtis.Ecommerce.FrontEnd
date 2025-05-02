import { createContext, ReactNode, useContext, useEffect, useState, useCallback } from "react";
import { useAuth } from "@/hooks/use-auth";
import { useToast } from "@/hooks/use-toast";
import { apiRequest, queryClient, getQueryFn } from "@/lib/queryClient";
import { Product, Wishlist as WishlistType } from "@shared/schema";
import { useMutation, useQuery } from "@tanstack/react-query";

type WishlistContextType = {
  items: Product[];
  isLoading: boolean;
  isInWishlist: (productId: number) => boolean;
  addToWishlist: (product: Product) => void;
  removeFromWishlist: (productId: number) => void;
  toggleWishlist: (product: Product) => void;
};

const WishlistContext = createContext<WishlistContextType | null>(null);

export function WishlistProvider({ children }: { children: ReactNode }) {
  const { user } = useAuth();
  const { toast } = useToast();
  const [items, setItems] = useState<Product[]>([]);

  // Fetch wishlist from API if user is logged in
  const { data: wishlistItems, isLoading } = useQuery({
    queryKey: ["/api/wishlist"],
    queryFn: getQueryFn({ on401: "returnNull" }),
    enabled: !!user,
  });

  // Update local state when API data changes
  useEffect(() => {
    if (wishlistItems) {
      setItems(wishlistItems);
    }
  }, [wishlistItems]);

  // Add item to wishlist
  const addMutation = useMutation({
    mutationFn: async (productId: number) => {
      const res = await apiRequest("POST", "/api/wishlist", { productId });
      return await res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/wishlist"] });
    },
    onError: (error: Error) => {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  // Remove item from wishlist
  const removeMutation = useMutation({
    mutationFn: async (productId: number) => {
      const res = await apiRequest("DELETE", `/api/wishlist/${productId}`);
      return await res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/wishlist"] });
    },
    onError: (error: Error) => {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  // Check if product is in wishlist
  const isInWishlist = (productId: number) => {
    return items.some((item) => item.id === productId);
  };

  // Use callback to prevent dependency cycles
  const addToWishlist = useCallback((product: Product) => {
    if (user) {
      addMutation.mutate(product.id);
      toast({
        title: "Added to wishlist",
        description: `${product.name} has been added to your wishlist`,
      });
    } else {
      toast({
        title: "Login required",
        description: "Please login to save items to your wishlist",
        variant: "destructive",
      });
    }
  }, [user, addMutation, toast]);

  // Remove from wishlist
  const removeFromWishlist = useCallback((productId: number) => {
    if (user) {
      removeMutation.mutate(productId);
      toast({
        title: "Removed from wishlist",
        description: "Item has been removed from your wishlist",
      });
    }
  }, [user, removeMutation, toast]);

  // Toggle wishlist status - memoized to prevent dependency cycles
  const toggleWishlist = useCallback((product: Product) => {
    if (isInWishlist(product.id)) {
      removeFromWishlist(product.id);
    } else {
      addToWishlist(product);
    }
  }, [isInWishlist, removeFromWishlist, addToWishlist]);

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
}

export function useWishlist() {
  const context = useContext(WishlistContext);
  if (!context) {
    throw new Error("useWishlist must be used within a WishlistProvider");
  }
  return context;
}
