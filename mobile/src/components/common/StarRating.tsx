import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Text, useTheme } from 'react-native-paper';
import { Ionicons } from '@expo/vector-icons';

interface StarRatingProps {
  rating: number;
  showValue?: boolean;
  size?: number;
  max?: number;
}

const StarRating: React.FC<StarRatingProps> = ({ 
  rating, 
  showValue = true, 
  size = 16, 
  max = 5 
}) => {
  const theme = useTheme();
  const filledStars = Math.floor(rating);
  const halfStar = rating % 1 >= 0.5;
  const emptyStars = max - filledStars - (halfStar ? 1 : 0);

  return (
    <View style={styles.container}>
      <View style={styles.starsContainer}>
        {/* Render filled stars */}
        {Array.from({ length: filledStars }).map((_, index) => (
          <Ionicons
            key={`star-filled-${index}`}
            name="star"
            size={size}
            color={theme.colors.rating}
            style={styles.star}
          />
        ))}

        {/* Render half star if needed */}
        {halfStar && (
          <Ionicons
            key="star-half"
            name="star-half"
            size={size}
            color={theme.colors.rating}
            style={styles.star}
          />
        )}

        {/* Render empty stars */}
        {Array.from({ length: emptyStars }).map((_, index) => (
          <Ionicons
            key={`star-empty-${index}`}
            name="star-outline"
            size={size}
            color={theme.colors.rating}
            style={styles.star}
          />
        ))}
      </View>

      {/* Display numeric rating if requested */}
      {showValue && (
        <Text style={[styles.ratingText, { color: theme.colors.onSurfaceVariant, fontSize: size - 2 }]}>
          {rating.toFixed(1)}
        </Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  starsContainer: {
    flexDirection: 'row',
  },
  star: {
    marginRight: 2,
  },
  ratingText: {
    marginLeft: 4,
  },
});

export default StarRating;