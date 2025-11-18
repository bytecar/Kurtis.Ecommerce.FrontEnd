import { useState, useEffect, useCallback, useMemo } from "react";
import { useLocation } from "wouter";
import { useQuery } from "@tanstack/react-query";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { FilterIcon, Loader2 } from "lucide-react";

// Types for category and brand data
interface CategoryData {
  id: number;
  name: string;
  label: string;
  gender: string | null;
}

interface BrandData {
  id: number;
  name: string;
  label: string;
}

// Placeholder data while loading
const placeholderCategories = [
  { id: "loading", name: "loading", label: "Loading...", gender: null },
];

const placeholderBrands = [
  { id: "loading", name: "loading", label: "Loading..." },
];

const sizes = [
  { id: "xs", label: "XS" },
  { id: "s", label: "S" },
  { id: "m", label: "M" },
  { id: "l", label: "L" },
  { id: "xl", label: "XL" },
  { id: "xxl", label: "XXL" },
];

// Rating filters
const ratings = [
  { id: "4-up", label: "4★ & Above" },
  { id: "3-up", label: "3★ & Above" },
  { id: "2-up", label: "2★ & Above" },
  { id: "1-up", label: "1★ & Above" },
];

interface ProductFiltersProps {
  className?: string;
  onFilterChange?: (filters: any) => void;
  isMobile?: boolean;
}

export function ProductFilters({
  className,
  onFilterChange,
  isMobile = false,
}: ProductFiltersProps) {
  const [, navigate] = useLocation();
  const [priceRange, setPriceRange] = useState([500, 5000]);
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [selectedBrands, setSelectedBrands] = useState<string[]>([]);
  const [selectedSizes, setSelectedSizes] = useState<string[]>([]);
  const [selectedRating, setSelectedRating] = useState<string | null>(null);
  const [open, setOpen] = useState(false);

  // Fetch categories from the server
  const { data: categoriesData = [], isLoading: isCategoriesLoading } =
    useQuery<CategoryData[]>({
      queryKey: ["/api/categories"],
    });

  // Fetch brands from the server
  const { data: brandsData = [], isLoading: isBrandsLoading } = useQuery<
    BrandData[]
  >({
    queryKey: ["/api/brands"],
  });

  // Use the fetched data or placeholders while loading
  const categories = isCategoriesLoading
    ? placeholderCategories
    : categoriesData;
  const brands = isBrandsLoading ? placeholderBrands : brandsData;

  // Track accordion state for collapsibility
  const [openAccordions, setOpenAccordions] = useState({
    categories: true,
    brands: true,
    sizes: true,
    ratings: true,
  });

  // Toggle accordion state
  const toggleAccordion = (accordionId: keyof typeof openAccordions) => {
    setOpenAccordions((prev) => ({
      ...prev,
      [accordionId]: !prev[accordionId],
    }));
  };

  // Handle category selection - memoized to prevent recreation on every render
  const handleCategoryChange = useCallback((categoryId: string) => {
    setSelectedCategories((prev) =>
      prev.includes(categoryId)
        ? prev.filter((id) => id !== categoryId)
        : [...prev, categoryId],
    );
  }, []);

  // Handle brand selection - memoized to prevent recreation on every render
  const handleBrandChange = useCallback((brandId: string) => {
    setSelectedBrands((prev) =>
      prev.includes(brandId)
        ? prev.filter((id) => id !== brandId)
        : [...prev, brandId],
    );
  }, []);

  // Handle size selection - memoized to prevent recreation on every render
  const handleSizeChange = useCallback((sizeId: string) => {
    setSelectedSizes((prev) => {
      const newSizes = prev.includes(sizeId)
        ? prev.filter((id) => id !== sizeId)
        : [...prev, sizeId];
      return newSizes;
    });
  }, []);

  // Handle rating selection - memoized to prevent recreation on every render
  const handleRatingChange = useCallback((ratingId: string) => {
    const newRating = selectedRating === ratingId ? null : ratingId;
    setSelectedRating(newRating);
  }, [selectedRating]);

  // Create a memoized filters object to avoid unnecessary re-renders
  const currentFilters = useMemo(() => ({
    categories: selectedCategories,
    brands: selectedBrands,
    sizes: selectedSizes,
    rating: selectedRating,
    price: priceRange,
  }), [selectedCategories, selectedBrands, selectedSizes, selectedRating, priceRange]);
  
  // Apply filters - memoized to prevent recreating function on every render
  const applyFilters = useCallback(() => {
    if (onFilterChange) {
      onFilterChange(currentFilters);
    }
    setOpen(false);
  }, [onFilterChange, currentFilters, setOpen]);

  // Reset filters - memoized to prevent recreating function on every render
  const resetFilters = useCallback(() => {
    setSelectedCategories([]);
    setSelectedBrands([]);
    setSelectedSizes([]);
    setSelectedRating(null);
    setPriceRange([500, 5000]);

    if (onFilterChange) {
      onFilterChange({
        categories: [],
        brands: [],
        sizes: [],
        rating: null,
        price: [500, 5000],
      });
    }
    setOpen(false);
  }, [onFilterChange, setOpen]);

  // This effect runs only when the filters actually change, not on every render
  useEffect(() => {
    // Only update filters when component is in desktop mode to avoid 
    // continuously updating as the user makes selections in mobile
    if (!isMobile && onFilterChange) {
      // Using a small timeout to debounce frequent changes
      // This significantly improves performance when using filters
      const timer = setTimeout(() => {
        onFilterChange(currentFilters);
      }, 200);
      
      return () => clearTimeout(timer);
    }
  }, [currentFilters, isMobile, onFilterChange]);

  // Category filter section - memoized to prevent unnecessary rerenders
  const CategoryFilter = useMemo(() => (
    <div className="border-b pb-4">
      <button
        className="w-full flex justify-between items-center py-2 font-medium text-base"
        onClick={() => toggleAccordion("categories")}
      >
        Categories
        <span>{openAccordions.categories ? "▲" : "▼"}</span>
      </button>

      {openAccordions.categories && (
        <div className="space-y-2 mt-2">
          {isCategoriesLoading ? (
            <div className="flex items-center justify-center py-2">
              <Loader2 className="h-4 w-4 animate-spin mr-2" />
              <span className="text-sm">Loading categories...</span>
            </div>
          ) : (
            categoriesData.map((category) => (
              <div
                key={category.id}
                className="flex items-center space-x-2 cursor-pointer"
              >
                <Checkbox
                  id={`category-${category.id}`}
                  checked={selectedCategories.includes(category.name)}
                  onCheckedChange={() => handleCategoryChange(category.name)}
                  className="cursor-pointer"
                />
                <Label
                  htmlFor={`category-${category.id}`}
                  className="text-sm cursor-pointer w-full"
                >
                  {category.label}
                </Label>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  ), [openAccordions.categories, isCategoriesLoading, categoriesData, selectedCategories, handleCategoryChange]);

  // Brand filter section - memoized to prevent unnecessary rerenders
  const BrandFilter = useMemo(() => (
    <div className="border-b pb-4">
      <button
        className="w-full flex justify-between items-center py-2 font-medium text-base"
        onClick={() => toggleAccordion("brands")}
      >
        Brands
        <span>{openAccordions.brands ? "▲" : "▼"}</span>
      </button>

      {openAccordions.brands && (
        <div className="space-y-2 mt-2">
          {isBrandsLoading ? (
            <div className="flex items-center justify-center py-2">
              <Loader2 className="h-4 w-4 animate-spin mr-2" />
              <span className="text-sm">Loading brands...</span>
            </div>
          ) : (
            brandsData.map((brand) => (
              <div
                key={brand.id}
                className="flex items-center space-x-2 cursor-pointer"
              >
                <Checkbox
                  id={`brand-${brand.id}`}
                  checked={selectedBrands.includes(brand.id.toString())}
                  onCheckedChange={() => handleBrandChange(brand.id.toString())}
                  className="cursor-pointer"
                />
                <Label
                  htmlFor={`brand-${brand.id}`}
                  className="text-sm cursor-pointer w-full"
                >
                  {brand.label}
                </Label>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  ), [openAccordions.brands, isBrandsLoading, brandsData, selectedBrands, handleBrandChange]);

  // Size filter section - memoized to prevent unnecessary rerenders
  const SizeFilter = useMemo(() => (
    <div className="border-b pb-4">
      <button
        className="w-full flex justify-between items-center py-2 font-medium text-base"
        onClick={() => toggleAccordion("sizes")}
      >
        Sizes
        <span>{openAccordions.sizes ? "▲" : "▼"}</span>
      </button>

      {openAccordions.sizes && (
        <div className="space-y-2 mt-2">
          {sizes.map((size) => (
            <div
              key={size.id}
              className="flex items-center space-x-2 cursor-pointer"
            >
              <Checkbox
                id={`size-${size.id}`}
                checked={selectedSizes.includes(size.id)}
                onCheckedChange={() => handleSizeChange(size.id)}
                className="cursor-pointer"
              />
              <Label
                htmlFor={`size-${size.id}`}
                className="text-sm cursor-pointer w-full"
              >
                {size.label}
              </Label>
            </div>
          ))}
        </div>
      )}
    </div>
  ), [openAccordions.sizes, sizes, selectedSizes, handleSizeChange]);

  // Rating filter section - memoized to prevent unnecessary rerenders
  const RatingFilter = useMemo(() => (
    <div className="border-b pb-4">
      <button
        className="w-full flex justify-between items-center py-2 font-medium text-base"
        onClick={() => toggleAccordion("ratings")}
      >
        Customer Ratings
        <span>{openAccordions.ratings ? "▲" : "▼"}</span>
      </button>

      {openAccordions.ratings && (
        <div className="space-y-2 mt-2">
          {ratings.map((rating) => (
            <div
              key={rating.id}
              className="flex items-center space-x-2 cursor-pointer"
            >
              <Checkbox
                id={`rating-${rating.id}`}
                checked={selectedRating === rating.id}
                onCheckedChange={() => handleRatingChange(rating.id)}
                className="cursor-pointer"
              />
              <Label
                htmlFor={`rating-${rating.id}`}
                className="text-sm cursor-pointer w-full"
              >
                {rating.label}
              </Label>
            </div>
          ))}
        </div>
      )}
    </div>
  ), [openAccordions.ratings, ratings, selectedRating, handleRatingChange]);

  // FilterContent also memoized to prevent unnecessary rerenders
  const FilterContent = useMemo(() => (
    <div className={`flex flex-col space-y-4 ${className}`}>
      {/* Price Range */}
      <div className="mb-4 border-b pb-4">
        <h3 className="font-medium text-base mb-3">Price Range</h3>
        <Slider
          defaultValue={priceRange}
          min={500}
          max={10000}
          step={100}
          value={priceRange}
          onValueChange={setPriceRange}
          className="mb-4"
        />
        <div className="flex justify-between text-sm text-gray-600">
          <span>₹{priceRange[0]}</span>
          <span>₹{priceRange[1]}</span>
        </div>
      </div>

      {/* Filter sections - using fragments here since these are already ReactNodes from useMemo */}
      {CategoryFilter}
      {BrandFilter}
      {SizeFilter}
      {RatingFilter}

      {/* Mobile Filter Buttons */}
      {isMobile && (
        <div className="flex gap-3 pt-4 border-t mt-4">
          <Button variant="outline" className="flex-1" onClick={resetFilters}>
            Reset
          </Button>
          <Button className="flex-1" onClick={applyFilters}>
            Apply Filters
          </Button>
        </div>
      )}
    </div>
  ), [className, priceRange, setPriceRange, CategoryFilter, BrandFilter, SizeFilter, RatingFilter, isMobile, resetFilters, applyFilters]);

  // Mobile view with sheet
  if (isMobile) {
    return (
      <Sheet open={open} onOpenChange={setOpen}>
        <SheetTrigger asChild>
          <Button variant="outline" size="sm" className="flex gap-2">
            <FilterIcon size={16} />
            Filters
          </Button>
        </SheetTrigger>
        <SheetContent
          side="left"
          className="w-[300px] sm:w-[400px] overflow-y-auto"
        >
          <h2 className="text-lg font-medium mb-4">Filter Products</h2>
          {FilterContent}
        </SheetContent>
      </Sheet>
    );
  }

  // Desktop view
  return FilterContent;
}
