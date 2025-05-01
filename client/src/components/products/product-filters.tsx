import { useState, useEffect } from "react";
import { useLocation } from "wouter";
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
import { FilterIcon } from "lucide-react";

// Filter options - Make sure IDs match the exact values stored in the database
const categories = [
  { id: "kurtis", label: "Kurtis" },
  { id: "sarees", label: "Sarees" },
  { id: "lehengas", label: "Lehengas" },
  { id: "salwar_kameez", label: "Salwar Kameez" },
  { id: "anarkali_suits", label: "Anarkali Suits" },
  { id: "palazzo_suits", label: "Palazzo Suits" },
  { id: "gowns", label: "Gowns" },
  { id: "kurtas", label: "Kurtas" },
  { id: "nehru_jackets", label: "Nehru Jackets" },
  { id: "jewelry", label: "Jewelry" },
  { id: "footwear", label: "Footwear" },
];

const brands = [
  { id: "Fabindia", label: "Fabindia" },
  { id: "Biba", label: "Biba" },
  { id: "W", label: "W" },
  { id: "Global Desi", label: "Global Desi" },
  { id: "Manyavar", label: "Manyavar" },
  { id: "Ritu Kumar", label: "Ritu Kumar" },
  { id: "House of Masaba", label: "House of Masaba" },
  { id: "Anita Dongre", label: "Anita Dongre" },
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
  
  // Track accordion state for collapsibility
  const [openAccordions, setOpenAccordions] = useState({
    categories: true,
    brands: true,
    sizes: true,
    ratings: true
  });

  // Toggle accordion state
  const toggleAccordion = (accordionId: keyof typeof openAccordions) => {
    setOpenAccordions((prev) => ({
      ...prev,
      [accordionId]: !prev[accordionId],
    }));
  };

  // Handle category selection
  const handleCategoryChange = (categoryId: string) => {
    setSelectedCategories((prev) =>
      prev.includes(categoryId)
        ? prev.filter((id) => id !== categoryId)
        : [...prev, categoryId]
    );
  };

  // Handle brand selection
  const handleBrandChange = (brandId: string) => {
    setSelectedBrands((prev) =>
      prev.includes(brandId)
        ? prev.filter((id) => id !== brandId)
        : [...prev, brandId]
    );
  };

  // Handle size selection
  const handleSizeChange = (sizeId: string) => {
    setSelectedSizes((prev) => {
      const newSizes = prev.includes(sizeId)
        ? prev.filter((id) => id !== sizeId)
        : [...prev, sizeId];
      return newSizes;
    });
  };

  // Handle rating selection
  const handleRatingChange = (ratingId: string) => {
    const newRating = selectedRating === ratingId ? null : ratingId;
    setSelectedRating(newRating);
  };

  // Apply filters
  const applyFilters = () => {
    if (onFilterChange) {
      onFilterChange({
        categories: selectedCategories,
        brands: selectedBrands,
        sizes: selectedSizes,
        rating: selectedRating,
        price: priceRange,
      });
    }
    setOpen(false);
  };

  // Reset filters
  const resetFilters = () => {
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
  };

  useEffect(() => {
    if (!isMobile && onFilterChange) {
      const filterData = {
        categories: selectedCategories,
        brands: selectedBrands,
        sizes: selectedSizes,
        rating: selectedRating,
        price: priceRange,
      };
      onFilterChange(filterData);
    }
  }, [
    selectedCategories,
    selectedBrands,
    selectedSizes,
    selectedRating,
    priceRange,
    isMobile,
    onFilterChange,
  ]);

  // Category filter section
  const CategoryFilter = () => (
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
          {categories.map((category) => (
            <div 
              key={category.id} 
              className="flex items-center space-x-2 cursor-pointer"
            >
              <Checkbox
                id={`category-${category.id}`}
                checked={selectedCategories.includes(category.id)}
                onCheckedChange={() => handleCategoryChange(category.id)}
                className="cursor-pointer"
              />
              <Label
                htmlFor={`category-${category.id}`}
                className="text-sm cursor-pointer w-full"
                onClick={() => handleCategoryChange(category.id)}
              >
                {category.label}
              </Label>
            </div>
          ))}
        </div>
      )}
    </div>
  );

  // Brand filter section
  const BrandFilter = () => (
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
          {brands.map((brand) => (
            <div 
              key={brand.id} 
              className="flex items-center space-x-2 cursor-pointer"
            >
              <Checkbox
                id={`brand-${brand.id}`}
                checked={selectedBrands.includes(brand.id)}
                onCheckedChange={() => handleBrandChange(brand.id)}
                className="cursor-pointer"
              />
              <Label
                htmlFor={`brand-${brand.id}`}
                className="text-sm cursor-pointer w-full"
                onClick={() => handleBrandChange(brand.id)}
              >
                {brand.label}
              </Label>
            </div>
          ))}
        </div>
      )}
    </div>
  );

  // Size filter section
  const SizeFilter = () => (
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
                onClick={() => handleSizeChange(size.id)}
              >
                {size.label}
              </Label>
            </div>
          ))}
        </div>
      )}
    </div>
  );

  // Rating filter section
  const RatingFilter = () => (
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
                onClick={() => handleRatingChange(rating.id)}
              >
                {rating.label}
              </Label>
            </div>
          ))}
        </div>
      )}
    </div>
  );

  const FilterContent = () => (
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

      {/* Filter sections */}
      <CategoryFilter />
      <BrandFilter />
      <SizeFilter />
      <RatingFilter />

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
  );

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
        <SheetContent side="left" className="w-[300px] sm:w-[400px] overflow-y-auto">
          <h2 className="text-lg font-medium mb-4">Filter Products</h2>
          <FilterContent />
        </SheetContent>
      </Sheet>
    );
  }

  // Desktop view
  return <FilterContent />;
}
