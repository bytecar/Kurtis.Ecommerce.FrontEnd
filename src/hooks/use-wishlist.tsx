import { ReactNode, useEffect, useState, useCallback } from "react";
import { useAuth } from "@/hooks/use-auth";
import { useToast } from "@/hooks/use-toast";
import { queryClient } from "@/lib/queryClient";
import { useMutation, useQuery } from "@tanstack/react-query";
import { WishlistAPI } from "../services/wishlist.service";
import { createContext, useContext } from "react";
import { Product } from "@/shared/schema";


type WishlistContextType = {
    items: Product[];
    isLoading: boolean;
    isInWishlist: (productId: number) => boolean;
    addToWishlist: (product: Product) => void;
    removeFromWishlist: (productId: number) => void;
    toggleWishlist: (product: Product) => void;
};

export const WishlistContext = createContext<WishlistContextType | null>(null);

export function useWishlist() {
    const context = useContext(WishlistContext);
    if (!context) {
        throw new Error("useWishlist must be used within a WishlistProvider");
    }
    return context;
}

export  function WishlistProvider({ children }: { children: ReactNode; }) {
    const { user } = useAuth();
    const { toast } = useToast();
    const [items, setItems] = useState<Product[]>([]);

    // Fetch wishlist from API if user is logged in
    const { data: wishlistItems=[], isLoading } = useQuery<Product[]>({
        queryKey: ["/api/wishlist"],
        queryFn: () => WishlistAPI.getWishlist(),
        enabled: !!user,
    });

    useEffect(() => {
        if (!wishlistItems) return;

        setItems(prev => {
            if (prev === wishlistItems) return prev; // same reference

            const identical =
                prev.length === wishlistItems.length &&
                prev.every((p, i) => p.id === wishlistItems[i].id);

            return identical ? prev : wishlistItems;
        });
    }, [wishlistItems]);


    // Add item to wishlist
    const addMutation = useMutation({
        mutationFn: async (productId: number) => {
            const res = await WishlistAPI.addToWishlist(Number(user?.id), productId);
            return await res.data.json();
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
            // No need to parse response as server returns 204 No Content
            const res = await WishlistAPI.removeFromWishlist(Number(user?.id), productId);
            return null; // Just return null, no need to parse response
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["/api/wishlist"] });
        },
        onError: (error: Error) => {
            console.error("Failed to remove from wishlist:", error);
            toast({
                title: "Error removing from wishlist",
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
