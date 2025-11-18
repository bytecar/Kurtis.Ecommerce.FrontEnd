import { useState } from "react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { 
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

export type SizeOption = {
  value: string;
  label: string;
  available: boolean;
  inventory?: number;
};

interface SizeSelectorProps {
  sizes: SizeOption[];
  selectedSize: string | null;
  onSizeSelect: (size: string) => void;
  showInventory?: boolean;
  className?: string;
}

export function SizeSelector({
  sizes,
  selectedSize,
  onSizeSelect,
  showInventory = false,
  className,
}: SizeSelectorProps) {
  return (
    <div className={cn("flex flex-wrap gap-2", className)}>
      {sizes.map((size) => (
        <TooltipProvider key={size.value}>
          <Tooltip>
            <TooltipTrigger asChild>
              <div>
                <Button
                  variant={selectedSize === size.value ? "default" : "outline"}
                  size="sm"
                  className={cn(
                    "h-10 w-10 rounded-full",
                    !size.available && "opacity-50 cursor-not-allowed bg-gray-100"
                  )}
                  onClick={() => size.available && onSizeSelect(size.value)}
                  disabled={!size.available}
                >
                  {size.label}
                </Button>
              </div>
            </TooltipTrigger>
            <TooltipContent side="top">
              {size.available ? (
                showInventory && size.inventory !== undefined ? (
                  size.inventory > 5 ? (
                    "In Stock"
                  ) : (
                    `Only ${size.inventory} left`
                  )
                ) : (
                  "Available"
                )
              ) : (
                "Out of Stock"
              )}
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      ))}
    </div>
  );
}
