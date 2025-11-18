import { Star, StarHalf } from "lucide-react";
import { cn } from "@/lib/utils";

interface StarRatingProps {
  rating: number;
  count?: number;
  showCount?: boolean;
  size?: "sm" | "md" | "lg";
  className?: string;
  interactive?: boolean;
  onRatingChange?: (rating: number) => void;
}

export function StarRating({
  rating,
  count,
  showCount = false,
  size = "md",
  className,
  interactive = false,
  onRatingChange,
}: StarRatingProps) {
  const stars = [];
  const fullStars = Math.floor(rating);
  const hasHalfStar = rating % 1 >= 0.5;
  
  // Size classes
  const starSizes = {
    sm: "h-3 w-3",
    md: "h-4 w-4",
    lg: "h-5 w-5",
  };
  
  const containerClasses = {
    sm: "text-xs gap-0.5",
    md: "text-sm gap-1",
    lg: "text-base gap-1",
  };
  
  // Generate stars
  for (let i = 1; i <= 5; i++) {
    if (interactive) {
      stars.push(
        <button
          key={i}
          className="text-amber-400 hover:scale-110 transition-transform"
          onClick={() => onRatingChange && onRatingChange(i)}
          aria-label={`Rate ${i} stars`}
        >
          <Star
            className={cn(starSizes[size], i <= fullStars ? "fill-current" : "fill-none")}
          />
        </button>
      );
    } else {
      if (i <= fullStars) {
        stars.push(
          <Star
            key={i}
            className={cn(starSizes[size], "fill-current text-amber-400")}
          />
        );
      } else if (i === fullStars + 1 && hasHalfStar) {
        stars.push(
          <StarHalf
            key={i}
            className={cn(starSizes[size], "fill-current text-amber-400")}
          />
        );
      } else {
        stars.push(
          <Star
            key={i}
            className={cn(starSizes[size], "text-amber-400")}
          />
        );
      }
    }
  }

  return (
    <div className={cn("flex items-center", containerClasses[size], className)}>
      <div className="flex">
        {stars}
      </div>
      {showCount && count !== undefined && (
        <span className="text-muted-foreground ml-1">({count})</span>
      )}
    </div>
  );
}
