import React from 'react';
import { StyleSheet, View, ViewStyle } from 'react-native';
import { Card, Text, Badge, useTheme } from 'react-native-paper';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';

import { Product } from '@/types/product';
import { useWishlist } from '@/contexts/WishlistContext';
import StarRating from '@/components/common/StarRating';

interface ProductCardProps {
  product: Product;
  style?: ViewStyle;
  showNewBadge?: boolean;
}

const ProductCard: React.FC<ProductCardProps> = ({ 
  product, 
  style, 
  showNewBadge = false 
}) => {
  const theme = useTheme();
  const navigation = useNavigation();
  const { isInWishlist, toggleWishlist } = useWishlist();
  
  const isDiscounted = product.discountedPrice !== null;
  const isNew = showNewBadge || 
    (product.createdAt && new Date(product.createdAt).getTime() > Date.now() - (7 * 24 * 60 * 60 * 1000));
  
  const handlePress = () => {
    navigation.navigate({
      name: 'ProductDetail' as never,
      params: { productId: product.id } as never
    });
  };
  
  const handleWishlistToggle = () => {
    toggleWishlist(product);
  };
  
  // Format price with rupee symbol
  const formatPrice = (price: number) => `₹${price.toLocaleString('en-IN')}`;

  return (
    <Card style={[styles.card, style]} onPress={handlePress}>
      <View style={styles.imageContainer}>
        {/* Implement image component with proper loading */}
        <Card.Cover 
          source={{ uri: product.imageUrls[0] || 'https://via.placeholder.com/300x400' }} 
          style={styles.image} 
          resizeMode="cover"
        />
        
        {/* Wishlist button */}
        <View style={styles.wishlistButton}>
          <Ionicons 
            name={isInWishlist(product.id) ? "heart" : "heart-outline"} 
            size={22} 
            color={isInWishlist(product.id) ? theme.colors.wishlistActive : theme.colors.wishlistInactive}
            onPress={(e) => {
              e.stopPropagation();
              handleWishlistToggle();
            }}
          />
        </View>
        
        {/* Discount or New badge */}
        {isDiscounted && (
          <Badge style={[styles.discountBadge, { backgroundColor: theme.colors.productSale }]}>
            {Math.round(((product.price - (product.discountedPrice || 0)) / product.price) * 100)}% OFF
          </Badge>
        )}
        
        {isNew && !isDiscounted && (
          <Badge style={[styles.newBadge, { backgroundColor: theme.colors.productNew }]}>
            NEW
          </Badge>
        )}
      </View>
      
      <Card.Content style={styles.content}>
        <Text 
          style={[styles.brand, { color: theme.colors.onSurfaceVariant }]} 
          numberOfLines={1}
        >
          {product.brand}
        </Text>
        
        <Text 
          style={[styles.title, { color: theme.colors.onSurface }]} 
          numberOfLines={2}
        >
          {product.name}
        </Text>
        
        <View style={styles.priceContainer}>
          {isDiscounted ? (
            <>
              <Text style={[styles.discountedPrice, { color: theme.colors.onSurface }]}>
                {formatPrice(product.discountedPrice || 0)}
              </Text>
              <Text style={[styles.originalPrice, { color: theme.colors.onSurfaceVariant }]}>
                {formatPrice(product.price)}
              </Text>
            </>
          ) : (
            <Text style={[styles.price, { color: theme.colors.onSurface }]}>
              {formatPrice(product.price)}
            </Text>
          )}
        </View>
        
        {/* Star rating - would be real in full implementation */}
        <StarRating rating={4.5} size={14} />
      </Card.Content>
    </Card>
  );
};

const styles = StyleSheet.create({
  card: {
    overflow: 'hidden',
  },
  imageContainer: {
    position: 'relative',
  },
  image: {
    height: 180,
  },
  wishlistButton: {
    position: 'absolute',
    top: 8,
    right: 8,
    backgroundColor: 'rgba(255, 255, 255, 0.8)',
    borderRadius: 20,
    width: 32,
    height: 32,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1,
  },
  discountBadge: {
    position: 'absolute',
    top: 8,
    left: 8,
  },
  newBadge: {
    position: 'absolute',
    top: 8,
    left: 8,
  },
  content: {
    paddingVertical: 8,
    paddingHorizontal: 10,
  },
  brand: {
    fontSize: 12,
    marginBottom: 2,
  },
  title: {
    fontSize: 14,
    fontWeight: '500',
    marginBottom: 6,
    minHeight: 40,
  },
  priceContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  price: {
    fontSize: 14,
    fontWeight: '600',
  },
  discountedPrice: {
    fontSize: 14,
    fontWeight: '600',
    marginRight: 6,
  },
  originalPrice: {
    fontSize: 12,
    textDecorationLine: 'line-through',
  },
});

export default ProductCard;