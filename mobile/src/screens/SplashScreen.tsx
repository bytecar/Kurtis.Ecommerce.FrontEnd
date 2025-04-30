import React, { useEffect } from 'react';
import { View, StyleSheet, Image, Text, Animated, Easing } from 'react-native';
import { useTheme } from 'react-native-paper';

const SplashScreen: React.FC = () => {
  const theme = useTheme();
  const opacity = new Animated.Value(0);
  const scale = new Animated.Value(0.8);

  useEffect(() => {
    Animated.parallel([
      Animated.timing(opacity, {
        toValue: 1,
        duration: 1000,
        easing: Easing.ease,
        useNativeDriver: true,
      }),
      Animated.timing(scale, {
        toValue: 1,
        duration: 1000,
        easing: Easing.ease,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <Animated.View
        style={[
          styles.logoContainer,
          {
            opacity,
            transform: [{ scale }],
          },
        ]}
      >
        {/* Replace with your actual logo */}
        <View style={[styles.logoPlaceholder, { backgroundColor: theme.colors.primary }]}>
          <Text style={[styles.logoText, { color: theme.colors.onPrimary }]}>K&M</Text>
        </View>
        <Text style={[styles.appName, { color: theme.colors.onBackground }]}>
          Kurtis & More
        </Text>
        <Text style={[styles.tagline, { color: theme.colors.onSurfaceVariant }]}>
          Ethnic Fashion Redefined
        </Text>
      </Animated.View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  logoContainer: {
    alignItems: 'center',
  },
  logoPlaceholder: {
    width: 120,
    height: 120,
    borderRadius: 60,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  logoText: {
    fontSize: 42,
    fontWeight: 'bold',
  },
  appName: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  tagline: {
    fontSize: 16,
    marginBottom: 24,
  },
});

export default SplashScreen;