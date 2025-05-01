import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { Product } from "@shared/schema";
import { useLocation } from "wouter";
import { ProductGrid } from "@/components/products/product-grid";
import { ProductFilters } from "@/components/products/product-filters";
import { useToast } from "@/hooks/use-toast";
import { useIsMobile } from "@/hooks/use-mobile";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { AlertTriangle, ChevronLeft, FilterIcon, SlidersHorizontal } from "lucide-react";

// Helper to extract query params
const getQueryParams = (location: string) => {
  const searchParams = new URLSearchParams(location.split("?")[1] || "");
  return {
    query: searchParams.get("q") || "",
    category: searchParams.get("category") || "",
    brand: searchParams.get("brand") || "",
    collection: searchParams.get("collection") || "",
  };
};

export default function ProductListing() {
  const location = useLocation()[0];
  const [, navigate] = useLocation();
  const { toast } = useToast();
  const isMobile = useIsMobile();
  
  // Extracting gender/search type from URL path
  const genderPath = location.split("/")[2] || "women";
  const isSearch = genderPath === "search";
  
  // Extract query params from URL
  const { query, category, brand, collection } = getQueryParams(location);
  
  // Local filter state
  const [filters, setFilters] = useState({
    categories: category ? [category] : [],
    brands: brand ? [brand] : [],
    sizes: [],
    rating: null,
    price: [500, 5000] as [number, number],
  });
  
  // Set page title
  useEffect(() => {
    const title = isSearch
      ? `Search: ${query} | Kurtis & More`
      : `${genderPath.charAt(0).toUpperCase() + genderPath.slice(1)}'s Ethnic Wear | Kurtis & More`;
    document.title = title;
  }, [genderPath, isSearch, query]);

  // Build API query string
  const buildQueryString = () => {
    const params = new URLSearchParams();
    
    if (isSearch && query) {
      params.append("q", query);
    } else {
      params.append("gender", genderPath);
    }
    
    if (filters.categories.length > 0) {
      filters.categories.forEach(cat => params.append("category", cat));
    }
    
    if (filters.brands.length > 0) {
      filters.brands.forEach(b => params.append("brand", b));
    }
    
    if (filters.sizes.length > 0) {
      filters.sizes.forEach(size => params.append("size", size));
    }
    
    if (filters.rating) {
      params.append("rating", filters.rating);
    }
    
    params.append("minPrice", filters.price[0].toString());
    params.append("maxPrice", filters.price[1].toString());
    
    if (collection) {
      params.append("collection", collection);
    }
    
    console.log("Built query string:", params.toString());
    return params.toString();
  };

  // Fetch products
  const {
    data: products,
    isLoading,
    isError,
    error,
  } = useQuery<Product[]>({
    queryKey: [`/api/products?${buildQueryString()}`],
  });

  // Handle filter changes
  const handleFilterChange = (newFilters: any) => {
    setFilters(newFilters);
  };

  // Get page heading
  const getPageHeading = () => {
    if (isSearch) {
      return `Search Results: ${query}`;
    }
    
    if (collection) {
      return `${collection.charAt(0).toUpperCase() + collection.slice(1)} Collection`;
    }
    
    if (genderPath === "sale") {
      return "Sale Items";
    }
    
    if (genderPath === "new") {
      return "New Arrivals";
    }
    
    if (genderPath === "featured") {
      return "Featured Products";
    }
    
    return `${genderPath.charAt(0).toUpperCase() + genderPath.slice(1)}'s Ethnic Wear`;
  };

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Breadcrumbs */}
      <div className="flex items-center text-sm text-muted-foreground mb-6">
        <a href="/" className="hover:text-primary">Home</a>
        <ChevronLeft className="h-4 w-4 mx-2 rotate-[-90deg]" />
        <span className="font-medium text-foreground">{getPageHeading()}</span>
      </div>
      
      <div className="mb-6">
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-serif font-bold text-center w-full md:text-left md:w-auto">{getPageHeading()}</h1>
          
          {isMobile && (
            <ProductFilters
              isMobile={true}
              onFilterChange={handleFilterChange}
            />
          )}
        </div>
        {products && (
          <p className="text-muted-foreground mt-1 text-center md:text-left">
            {products.length} {products.length === 1 ? 'product' : 'products'} found
          </p>
        )}
      </div>
      
      <div className="flex flex-col md:flex-row gap-8">
        {/* Filters - Desktop */}
        <div className="hidden md:block w-64 shrink-0">
          <div className="sticky top-24">
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-medium text-lg">Filters</h2>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setFilters({
                  categories: [],
                  brands: [],
                  sizes: [],
                  rating: null,
                  price: [500, 5000],
                })}
              >
                Reset
              </Button>
            </div>
            <Separator className="mb-4" />
            <ProductFilters
              onFilterChange={handleFilterChange}
            />
          </div>
        </div>
        
        {/* Product Grid */}
        <div className="flex-1">
          {isError ? (
            <div className="rounded-lg border p-8 text-center">
              <AlertTriangle className="mx-auto h-12 w-12 text-destructive mb-4" />
              <h3 className="text-lg font-medium mb-2">Unable to load products</h3>
              <p className="text-muted-foreground mb-4">
                {error instanceof Error ? error.message : "An unknown error occurred"}
              </p>
              <Button onClick={() => window.location.reload()}>
                Try Again
              </Button>
            </div>
          ) : (
            <ProductGrid 
              products={products || []} 
              isLoading={isLoading}
              emptyMessage={
                isSearch
                  ? `No products found for "${query}". Try a different search term or browse our categories.`
                  : "No products found matching your filters. Try adjusting your selections."
              }
            />
          )}
        </div>
      </div>
    </div>
  );
}
