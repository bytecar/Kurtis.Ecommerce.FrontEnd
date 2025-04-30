import React from 'react';
import { View, StyleSheet, ImageBackground, TouchableOpacity } from 'react-native';
import { Text, useTheme } from 'react-native-paper';
import { useNavigation } from '@react-navigation/native';

interface Collection {
  id: string;
  title: string;
  description: string;
  imageUrl: string;
  actionParams: any;
}

// Collections would typically come from an API in a real implementation
const collections: Collection[] = [
  {
    id: 'wedding',
    title: 'Wedding Collection',
    description: 'Elegant ensembles for the perfect celebration',
    imageUrl: 'https://example.com/wedding-collection.jpg',
    actionParams: { category: 'Wedding' },
  },
  {
    id: 'traditional',
    title: 'Traditional',
    description: 'Timeless classics from across India',
    imageUrl: 'https://example.com/traditional-collection.jpg',
    actionParams: { category: 'Traditional' },
  },
  {
    id: 'fusion',
    title: 'Indo-Western Fusion',
    description: 'Where tradition meets modern style',
    imageUrl: 'https://example.com/fusion-collection.jpg',
    actionParams: { category: 'Fusion' },
  },
];

const CollectionPreview: React.FC = () => {
  const theme = useTheme();
  const navigation = useNavigation();

  const handleCollectionPress = (params: any) => {
    navigation.navigate({
      name: 'ProductListing' as never,
      params: params as never,
    });
  };

  return (
    <View style={styles.container}>
      {collections.map((collection) => (
        <TouchableOpacity
          key={collection.id}
          style={styles.collectionCard}
          onPress={() => handleCollectionPress(collection.actionParams)}
        >
          {/* In a real implementation, this would use actual images */}
          <View 
            style={[
              styles.imagePlaceholder, 
              { backgroundColor: theme.colors.surfaceVariant }
            ]}
          >
            <Text 
              style={[
                styles.collectionInitial, 
                { color: theme.colors.onSurfaceVariant }
              ]}
            >
              {collection.title[0]}
            </Text>
            <View style={styles.overlay} />
            <View style={styles.textContainer}>
              <Text style={[styles.title, { color: theme.colors.background }]}>
                {collection.title}
              </Text>
              <Text style={[styles.description, { color: theme.colors.background }]}>
                {collection.description}
              </Text>
            </View>
          </View>
        </TouchableOpacity>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginVertical: 8,
  },
  collectionCard: {
    height: 180,
    borderRadius: 8,
    overflow: 'hidden',
    marginBottom: 16,
  },
  imagePlaceholder: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
  },
  collectionInitial: {
    fontSize: 80,
    fontWeight: 'bold',
    opacity: 0.3,
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0, 0, 0, 0.4)',
  },
  textContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    padding: 16,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  description: {
    fontSize: 14,
  },
});

export default CollectionPreview;