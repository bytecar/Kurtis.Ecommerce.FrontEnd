import React from 'react';
import { render, screen } from '../../testUtils';
import { FeaturedProducts } from '@/pages/components/FeaturedProducts';

// Mock the ProductGrid component since we're testing FeaturedProducts in isolation
jest.mock('@/components/products/ProductGrid', () => ({
  ProductGrid: ({ products, isLoading, emptyMessage }) => (
    <div data-testid="product-grid" data-loading={isLoading} data-empty-message={emptyMessage}>
      {isLoading ? 'Loading...' : `Showing ${products?.length || 0} products`}
    </div>
  )
}));

describe('FeaturedProducts Component', () => {
  const mockProducts = [
    {
      id: 1,
      name: 'Test Product 1',
      description: 'Test Description 1',
      price: 100,
      discountedPrice: 80,
      brand: 'Test Brand',
      category: 'Kurta',
      gender: 'Women',
      imageUrls: ['test-image-1.jpg'],
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      id: 2,
      name: 'Test Product 2',
      description: 'Test Description 2',
      price: 150,
      discountedPrice: null,
      brand: 'Test Brand 2',
      category: 'Saree',
      gender: 'Women',
      imageUrls: ['test-image-2.jpg'],
      createdAt: new Date(),
      updatedAt: new Date()
    }
  ];

  test('renders featured products component with heading', () => {
    render(<FeaturedProducts products={mockProducts} isLoading={false} />);
    
    // Check if "Featured Products" heading is rendered
    expect(screen.getByText('Featured Products')).toBeInTheDocument();
    
    // Check if "View All" link is rendered
    expect(screen.getByText('View All')).toBeInTheDocument();
    
    // Check if ProductGrid is rendered with proper props
    const productGrid = screen.getByTestId('product-grid');
    expect(productGrid).toBeInTheDocument();
    expect(productGrid).toHaveTextContent('Showing 2 products');
    expect(productGrid).toHaveAttribute('data-loading', 'false');
    expect(productGrid).toHaveAttribute('data-empty-message', 'No featured products available at the moment.');
  });

  test('shows loading state when isLoading is true', () => {
    render(<FeaturedProducts products={[]} isLoading={true} />);
    
    const productGrid = screen.getByTestId('product-grid');
    expect(productGrid).toHaveAttribute('data-loading', 'true');
    expect(productGrid).toHaveTextContent('Loading...');
  });

  test('has correct CSS classes for styling', () => {
    render(<FeaturedProducts products={mockProducts} isLoading={false} />);
    
    // Check if the main section has the featured-section class
    const section = screen.getByText('Featured Products').closest('section');
    expect(section).toHaveClass('featured-section');
    
    // Check if container exists
    const container = section?.querySelector('.container');
    expect(container).toBeInTheDocument();
    
    // Check if header exists with section-header class
    const header = section?.querySelector('.section-header');
    expect(header).toBeInTheDocument();
    
    // Check if view all link has correct classes
    const viewAllLink = screen.getByText('View All').closest('.view-all-link');
    expect(viewAllLink).toBeInTheDocument();
  });
});