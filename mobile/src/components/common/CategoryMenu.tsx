import React from 'react';
import { ScrollView, StyleSheet, TouchableOpacity, View } from 'react-native';
import { Text, useTheme } from 'react-native-paper';
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';

// Define the categories for ethnic wear
const categories = [
  { id: 'kurta', name: 'Kurta', icon: 'shirt-outline' },
  { id: 'saree', name: 'Saree', icon: 'ribbon-outline' },
  { id: 'lehenga', name: 'Lehenga', icon: 'sparkles-outline' },
  { id: 'sherwani', name: 'Sherwani', icon: 'man-outline' },
  { id: 'anarkali', name: 'Anarkali', icon: 'flower-outline' },
  { id: 'accessories', name: 'Accessories', icon: 'apps-outline' },
  { id: 'jewelry', name: 'Jewelry', icon: 'diamond-outline' },
  { id: 'footwear', name: 'Footwear', icon: 'footsteps-outline' },
];

const CategoryMenu: React.FC = () => {
  const theme = useTheme();
  const navigation = useNavigation();

  const handleCategoryPress = (category: string) => {
    navigation.navigate({
      name: 'ProductListing' as never,
      params: { category } as never
    });
  };

  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={styles.container}
    >
      {categories.map((category) => (
        <TouchableOpacity
          key={category.id}
          style={styles.categoryItem}
          onPress={() => handleCategoryPress(category.name)}
        >
          <View style={[
            styles.iconContainer, 
            { backgroundColor: theme.colors.primaryContainer }
          ]}>
            <Ionicons
              name={category.icon as any}
              size={24}
              color={theme.colors.onPrimaryContainer}
            />
          </View>
          <Text
            style={[styles.categoryName, { color: theme.colors.onSurface }]}
            numberOfLines={1}
          >
            {category.name}
          </Text>
        </TouchableOpacity>
      ))}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingVertical: 8,
    paddingHorizontal: 4,
  },
  categoryItem: {
    alignItems: 'center',
    marginHorizontal: 8,
    width: 70,
  },
  iconContainer: {
    width: 56,
    height: 56,
    borderRadius: 28,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  categoryName: {
    fontSize: 12,
    textAlign: 'center',
  },
});

export default CategoryMenu;