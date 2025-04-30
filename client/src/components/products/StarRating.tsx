import React from 'react';
import { StarRatingProps } from '@/types/component.types';
import { Star } from 'lucide-react';

// Import CSS
import './styles/StarRating.css';

export function StarRating({ 
  rating, 
  count = 0, 
  size = 'md', 
  showCount = false 
}: StarRatingProps) {
  // Create an array of 5 stars
  const stars = Array.from({ length: 5 }, (_, index) => {
    const starValue = index + 1;
    const isFilled = starValue <= Math.round(rating);
    
    return (
      <Star 
        key={index} 
        className={`star ${size === 'sm' ? 'star-sm' : size === 'lg' ? 'star-lg' : 'star-md'} ${isFilled ? '' : 'star-outline'}`}
        fill={isFilled ? 'currentColor' : 'none'}
      />
    );
  });

  return (
    <div className="star-rating-container">
      <div className="stars">
        {stars}
      </div>
      {showCount && count > 0 && (
        <span className="review-count">({count})</span>
      )}
    </div>
  );
}