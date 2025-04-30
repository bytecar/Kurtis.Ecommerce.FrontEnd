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

// Filter options
const categories = [
  { id: "kurtis", label: "Kurtis" },
  { id: "sarees", label: "Sarees" },
  { id: "lehengas", label: "Lehengas" },
  { id: "kurta-sets", label: "Kurta Sets" },
  { id: "gowns", label: "Gowns" },
  { id: "pants", label: "Pants" },
  { id: "tops", label: "Tops" },
];

const brands = [
  { id: "ethnic-bloom", label: "Ethnic Bloom" },
  { id: "royal-ethnix", label: "Royal Ethnix" },
  { id: "manyavar", label: "Manyavar" },
  { id: "saree-house", label: "Saree House" },
  { id: "fabindia", label: "FabIndia" },
  { id: "biba", label: "Biba" },
  { id: "kalyan", label: "Kalyan" },
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
    setSelectedSizes((prev) =>
      prev.includes(sizeId)
        ? prev.filter((id) => id !== sizeId)
        : [...prev, sizeId]
    );
  };

  // Handle rating selection
  const handleRatingChange = (ratingId: string) => {
    setSelectedRating(selectedRating === ratingId ? null : ratingId);
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
      onFilterChange({
        categories: selectedCategories,
        brands: selectedBrands,
        sizes: selectedSizes,
        rating: selectedRating,
        price: priceRange,
      });
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

  const FilterContent = () => (
    <div className={`flex flex-col space-y-6 ${className}`}>
      {/* Price Range */}
      <div className="mb-6">
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

      {/* Categories */}
      <Accordion type="single" collapsible defaultValue="categories">
        <AccordionItem value="categories" className="border-b">
          <AccordionTrigger className="font-medium text-base">
            Categories
          </AccordionTrigger>
          <AccordionContent>
            <div className="space-y-2">
              {categories.map((category) => (
                <div key={category.id} className="flex items-center space-x-2">
                  <Checkbox
                    id={`category-${category.id}`}
                    checked={selectedCategories.includes(category.id)}
                    onCheckedChange={() => handleCategoryChange(category.id)}
                  />
                  <Label
                    htmlFor={`category-${category.id}`}
                    className="text-sm cursor-pointer"
                  >
                    {category.label}
                  </Label>
                </div>
              ))}
            </div>
          </AccordionContent>
        </AccordionItem>
      </Accordion>

      {/* Brands */}
      <Accordion type="single" collapsible defaultValue="brands">
        <AccordionItem value="brands" className="border-b">
          <AccordionTrigger className="font-medium text-base">
            Brands
          </AccordionTrigger>
          <AccordionContent>
            <div className="space-y-2">
              {brands.map((brand) => (
                <div key={brand.id} className="flex items-center space-x-2">
                  <Checkbox
                    id={`brand-${brand.id}`}
                    checked={selectedBrands.includes(brand.id)}
                    onCheckedChange={() => handleBrandChange(brand.id)}
                  />
                  <Label
                    htmlFor={`brand-${brand.id}`}
                    className="text-sm cursor-pointer"
                  >
                    {brand.label}
                  </Label>
                </div>
              ))}
            </div>
          </AccordionContent>
        </AccordionItem>
      </Accordion>

      {/* Sizes */}
      <Accordion type="single" collapsible defaultValue="sizes">
        <AccordionItem value="sizes" className="border-b">
          <AccordionTrigger className="font-medium text-base">
            Sizes
          </AccordionTrigger>
          <AccordionContent>
            <div className="space-y-2">
              {sizes.map((size) => (
                <div key={size.id} className="flex items-center space-x-2">
                  <Checkbox
                    id={`size-${size.id}`}
                    checked={selectedSizes.includes(size.id)}
                    onCheckedChange={() => handleSizeChange(size.id)}
                  />
                  <Label
                    htmlFor={`size-${size.id}`}
                    className="text-sm cursor-pointer"
                  >
                    {size.label}
                  </Label>
                </div>
              ))}
            </div>
          </AccordionContent>
        </AccordionItem>
      </Accordion>

      {/* Customer Ratings */}
      <Accordion type="single" collapsible defaultValue="ratings">
        <AccordionItem value="ratings" className="border-b">
          <AccordionTrigger className="font-medium text-base">
            Customer Ratings
          </AccordionTrigger>
          <AccordionContent>
            <div className="space-y-2">
              {ratings.map((rating) => (
                <div key={rating.id} className="flex items-center space-x-2">
                  <Checkbox
                    id={`rating-${rating.id}`}
                    checked={selectedRating === rating.id}
                    onCheckedChange={() => handleRatingChange(rating.id)}
                  />
                  <Label
                    htmlFor={`rating-${rating.id}`}
                    className="text-sm cursor-pointer"
                  >
                    {rating.label}
                  </Label>
                </div>
              ))}
            </div>
          </AccordionContent>
        </AccordionItem>
      </Accordion>

      {/* Mobile Filter Buttons */}
      {isMobile && (
        <div className="flex gap-3 pt-4 border-t">
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
