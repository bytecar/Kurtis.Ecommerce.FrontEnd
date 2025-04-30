import React, { useState, useRef, useEffect } from 'react';
import { View, StyleSheet, Dimensions, Image, TouchableOpacity } from 'react-native';
import { Text, useTheme, Button } from 'react-native-paper';
import { useNavigation } from '@react-navigation/native';
import Animated, {
  useSharedValue,
  useAnimatedScrollHandler,
  useAnimatedStyle,
  interpolate,
  Extrapolate,
} from 'react-native-reanimated';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

interface CarouselSlide {
  id: number;
  title: string;
  subtitle: string;
  buttonText: string;
  actionParams: any;
  imageUri: string;
}

// Carousel data would typically come from an API
const carouselData: CarouselSlide[] = [
  {
    id: 1,
    title: 'Festival Collection',
    subtitle: 'Celebrate in style with our festive collection',
    buttonText: 'Shop Now',
    actionParams: { category: 'Festival' },
    imageUri: 'https://example.com/festival-collection.jpg', // Placeholder URL
  },
  {
    id: 2,
    title: 'Summer Specials',
    subtitle: 'Light & comfortable ethnic wear for summer',
    buttonText: 'Explore',
    actionParams: { category: 'Summer' },
    imageUri: 'https://example.com/summer-collection.jpg', // Placeholder URL
  },
  {
    id: 3,
    title: 'New Arrivals',
    subtitle: 'Discover the latest trends in ethnic fashion',
    buttonText: 'View All',
    actionParams: { newArrivals: true },
    imageUri: 'https://example.com/new-arrivals.jpg', // Placeholder URL
  },
];

const HeroCarousel: React.FC = () => {
  const theme = useTheme();
  const navigation = useNavigation();
  const [currentIndex, setCurrentIndex] = useState(0);
  const scrollX = useSharedValue(0);
  const flatListRef = useRef<Animated.FlatList<CarouselSlide>>(null);
  
  // Auto-scroll functionality
  useEffect(() => {
    const timer = setInterval(() => {
      if (currentIndex < carouselData.length - 1) {
        flatListRef.current?.scrollToOffset({
          offset: (currentIndex + 1) * SCREEN_WIDTH,
          animated: true,
        });
      } else {
        flatListRef.current?.scrollToOffset({
          offset: 0,
          animated: true,
        });
      }
    }, 5000); // Change slide every 5 seconds
    
    return () => clearInterval(timer);
  }, [currentIndex]);
  
  const scrollHandler = useAnimatedScrollHandler({
    onScroll: (event) => {
      scrollX.value = event.contentOffset.x;
    },
  });
  
  const handleActionPress = (params: any) => {
    navigation.navigate({
      name: 'ProductListing' as never,
      params: params as never,
    });
  };
  
  const renderItem = ({ item }: { item: CarouselSlide }) => {
    return (
      <View style={styles.slide}>
        <View style={styles.imageContainer}>
          {/* In a full implementation, we'd use actual images from the backend */}
          <View style={[styles.imagePlaceholder, { backgroundColor: theme.colors.primary }]}>
            <Text style={[styles.placeholderText, { color: theme.colors.onPrimary }]}>
              {item.title[0]}
            </Text>
          </View>
          <View style={styles.overlay} />
        </View>
        <View style={styles.textContainer}>
          <Text style={[styles.title, { color: theme.colors.background }]}>{item.title}</Text>
          <Text style={[styles.subtitle, { color: theme.colors.background }]}>
            {item.subtitle}
          </Text>
          <Button
            mode="contained"
            onPress={() => handleActionPress(item.actionParams)}
            style={[styles.button, { backgroundColor: theme.colors.background }]}
            labelStyle={{ color: theme.colors.primary }}
          >
            {item.buttonText}
          </Button>
        </View>
      </View>
    );
  };
  
  const renderDotIndicator = () => {
    return (
      <View style={styles.dotContainer}>
        {carouselData.map((_, index) => {
          const animatedDotStyle = useAnimatedStyle(() => {
            const inputRange = [
              (index - 1) * SCREEN_WIDTH,
              index * SCREEN_WIDTH,
              (index + 1) * SCREEN_WIDTH,
            ];
            
            const width = interpolate(
              scrollX.value,
              inputRange,
              [8, 16, 8],
              Extrapolate.CLAMP
            );
            
            const opacity = interpolate(
              scrollX.value,
              inputRange,
              [0.5, 1, 0.5],
              Extrapolate.CLAMP
            );
            
            return {
              width,
              opacity,
            };
          });
          
          return (
            <Animated.View
              key={`dot-${index}`}
              style={[
                styles.dot,
                { backgroundColor: theme.colors.background },
                animatedDotStyle,
              ]}
            />
          );
        })}
      </View>
    );
  };
  
  return (
    <View style={styles.container}>
      <Animated.FlatList
        ref={flatListRef}
        data={carouselData}
        renderItem={renderItem}
        keyExtractor={(item) => `slide-${item.id}`}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        onScroll={scrollHandler}
        scrollEventThrottle={16}
        onMomentumScrollEnd={(event) => {
          const index = Math.round(event.nativeEvent.contentOffset.x / SCREEN_WIDTH);
          setCurrentIndex(index);
        }}
      />
      {renderDotIndicator()}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    height: 200,
    position: 'relative',
  },
  slide: {
    width: SCREEN_WIDTH,
    height: 200,
    position: 'relative',
  },
  imageContainer: {
    ...StyleSheet.absoluteFillObject,
  },
  imagePlaceholder: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'center',
    alignItems: 'center',
  },
  placeholderText: {
    fontSize: 80,
    fontWeight: 'bold',
    opacity: 0.5,
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
  },
  textContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
    zIndex: 1,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 8,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 16,
    marginBottom: 16,
    textAlign: 'center',
  },
  button: {
    borderRadius: 20,
    paddingHorizontal: 16,
  },
  dotContainer: {
    position: 'absolute',
    bottom: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
  },
  dot: {
    height: 8,
    borderRadius: 4,
    marginHorizontal: 4,
  },
});

export default HeroCarousel;