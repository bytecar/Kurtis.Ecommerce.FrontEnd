import React from 'react';
import { View, ScrollView, StyleSheet, RefreshControl } from 'react-native';
import { useTheme, Text, Button, Card } from 'react-native-paper';
import { useNavigation } from '@react-navigation/native';
import { useQuery } from 'react-query';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';

import { productApi } from '@/services/api';
import { Product } from '@/types/product';
import HeroCarousel from '@/components/common/HeroCarousel';
import ProductCard from '@/components/products/ProductCard';
import CategoryMenu from '@/components/common/CategoryMenu';
import CollectionPreview from '@/components/common/CollectionPreview';
import { useAuth } from '@/contexts/AuthContext';

const HomeScreen = () => {
  const theme = useTheme();
  const navigation = useNavigation();
  const { user } = useAuth();

  // Fetch featured products
  const { 
    data: featuredProducts, 
    isLoading: featuredLoading,
    refetch: refetchFeatured
  } = useQuery<Product[]>('featuredProducts', async () => {
    const response = await productApi.getFeatured();
    return response.data;
  });

  // Fetch new arrivals
  const { 
    data: newProducts, 
    isLoading: newLoading,
    refetch: refetchNew
  } = useQuery<Product[]>('newProducts', async () => {
    const response = await productApi.getNewArrivals();
    return response.data;
  });

  const handleRefresh = () => {
    refetchFeatured();
    refetchNew();
  };

  return (
    <SafeAreaView style={styles.safeArea} edges={['right', 'left']}>
      <ScrollView
        style={[styles.container, { backgroundColor: theme.colors.background }]}
        refreshControl={
          <RefreshControl
            refreshing={featuredLoading || newLoading}
            onRefresh={handleRefresh}
            colors={[theme.colors.primary]}
            tintColor={theme.colors.primary}
          />
        }
      >
        {/* Hero Carousel */}
        <HeroCarousel />

        {/* Welcome Message */}
        <View style={styles.welcomeSection}>
          <Text style={[styles.welcomeTitle, { color: theme.colors.onBackground }]}>
            {user ? `Welcome back, ${user.fullName.split(' ')[0]}!` : 'Welcome to Kurtis & More!'}
          </Text>
          <Text style={[styles.welcomeSubtitle, { color: theme.colors.onSurfaceVariant }]}>
            Discover the latest in ethnic fashion
          </Text>
        </View>

        {/* Categories */}
        <View style={styles.sectionContainer}>
          <Text style={[styles.sectionTitle, { color: theme.colors.onBackground }]}>
            Shop by Category
          </Text>
          <CategoryMenu />
        </View>

        {/* Featured Products */}
        <View style={styles.sectionContainer}>
          <View style={styles.sectionHeader}>
            <Text style={[styles.sectionTitle, { color: theme.colors.onBackground }]}>
              Featured Products
            </Text>
            <Button
              mode="text"
              onPress={() => navigation.navigate('ProductListing' as never)}
              labelStyle={{ color: theme.colors.primary }}
            >
              View All
            </Button>
          </View>

          <ScrollView 
            horizontal 
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.productsScrollContent}
          >
            {featuredLoading ? (
              // Placeholder cards for loading state
              [...Array(4)].map((_, index) => (
                <Card
                  key={`featured-loading-${index}`}
                  style={[styles.productCardPlaceholder, { backgroundColor: theme.colors.surfaceVariant }]}
                />
              ))
            ) : featuredProducts && featuredProducts.length > 0 ? (
              featuredProducts.map((product) => (
                <ProductCard
                  key={`featured-${product.id}`}
                  product={product}
                  style={styles.productCard}
                />
              ))
            ) : (
              <Text style={{ color: theme.colors.onSurfaceVariant, padding: 16 }}>
                No featured products available
              </Text>
            )}
          </ScrollView>
        </View>

        {/* Collections */}
        <View style={styles.sectionContainer}>
          <Text style={[styles.sectionTitle, { color: theme.colors.onBackground }]}>
            Collections
          </Text>
          <CollectionPreview />
        </View>

        {/* New Arrivals */}
        <View style={styles.sectionContainer}>
          <View style={styles.sectionHeader}>
            <Text style={[styles.sectionTitle, { color: theme.colors.onBackground }]}>
              New Arrivals
            </Text>
            <Button
              mode="text"
              onPress={() => navigation.navigate({
                name: 'ProductListing' as never,
                params: { newArrivals: true } as never
              })}
              labelStyle={{ color: theme.colors.primary }}
            >
              View All
            </Button>
          </View>

          <ScrollView 
            horizontal 
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.productsScrollContent}
          >
            {newLoading ? (
              // Placeholder cards for loading state
              [...Array(4)].map((_, index) => (
                <Card
                  key={`new-loading-${index}`}
                  style={[styles.productCardPlaceholder, { backgroundColor: theme.colors.surfaceVariant }]}
                />
              ))
            ) : newProducts && newProducts.length > 0 ? (
              newProducts.map((product) => (
                <ProductCard
                  key={`new-${product.id}`}
                  product={product}
                  style={styles.productCard}
                  showNewBadge
                />
              ))
            ) : (
              <Text style={{ color: theme.colors.onSurfaceVariant, padding: 16 }}>
                No new products available
              </Text>
            )}
          </ScrollView>
        </View>

        {/* Browse by Gender */}
        <View style={[styles.sectionContainer, styles.genderSection]}>
          <Text style={[styles.sectionTitle, { color: theme.colors.onBackground, marginBottom: 16 }]}>
            Browse by Gender
          </Text>
          
          <View style={styles.genderCards}>
            <Card
              style={[styles.genderCard, { backgroundColor: theme.colors.primaryContainer }]}
              onPress={() => navigation.navigate({
                name: 'ProductListing' as never,
                params: { gender: 'Women' } as never
              })}
            >
              <Card.Content style={styles.genderCardContent}>
                <Ionicons name="woman-outline" size={32} color={theme.colors.onPrimaryContainer} />
                <Text style={[styles.genderText, { color: theme.colors.onPrimaryContainer }]}>Women</Text>
              </Card.Content>
            </Card>
            
            <Card
              style={[styles.genderCard, { backgroundColor: theme.colors.secondaryContainer }]}
              onPress={() => navigation.navigate({
                name: 'ProductListing' as never,
                params: { gender: 'Men' } as never
              })}
            >
              <Card.Content style={styles.genderCardContent}>
                <Ionicons name="man-outline" size={32} color={theme.colors.onSecondaryContainer} />
                <Text style={[styles.genderText, { color: theme.colors.onSecondaryContainer }]}>Men</Text>
              </Card.Content>
            </Card>
          </View>
        </View>

        {/* Bottom Spacer */}
        <View style={styles.bottomSpacer} />
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
  },
  container: {
    flex: 1,
  },
  welcomeSection: {
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 8,
  },
  welcomeTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  welcomeSubtitle: {
    fontSize: 16,
  },
  sectionContainer: {
    marginTop: 24,
    paddingHorizontal: 16,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 12,
  },
  productsScrollContent: {
    paddingRight: 16,
  },
  productCard: {
    width: 160,
    marginRight: 12,
  },
  productCardPlaceholder: {
    width: 160,
    height: 240,
    marginRight: 12,
  },
  genderSection: {
    marginVertical: 24,
  },
  genderCards: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  genderCard: {
    flex: 1,
    marginHorizontal: 4,
  },
  genderCardContent: {
    alignItems: 'center',
    padding: 16,
  },
  genderText: {
    marginTop: 8,
    fontSize: 16,
    fontWeight: '500',
  },
  bottomSpacer: {
    height: 24,
  },
});

export default HomeScreen;