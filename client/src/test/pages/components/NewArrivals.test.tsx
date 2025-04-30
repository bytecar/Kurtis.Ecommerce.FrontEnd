import React from 'react';
import { render, screen } from '../../testUtils';
import { NewArrivals } from '@/pages/components/NewArrivals';

// Mock the ProductCard component since we're testing NewArrivals in isolation
jest.mock('@/components/products/ProductCard', () => ({
  ProductCard: ({ product, onQuickView }) => (
    <div 
      data-testid="product-card" 
      data-product-id={product.id}
      onClick={() => onQuickView(product)}
    >
      {product.name}
    </div>
  )
}));

// Mock carousel components
jest.mock('@/components/ui/carousel', () => ({
  Carousel: ({ children }) => <div data-testid="carousel">{children}</div>,
  CarouselContent: ({ children }) => <div data-testid="carousel-content">{children}</div>,
  CarouselItem: ({ children, className }) => <div data-testid="carousel-item" className={className}>{children}</div>,
  CarouselPrevious: () => <button data-testid="carousel-previous">Previous</button>,
  CarouselNext: () => <button data-testid="carousel-next">Next</button>,
}));

describe('NewArrivals Component', () => {
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

  test('renders new arrivals component with heading', () => {
    render(<NewArrivals products={mockProducts} isLoading={false} />);
    
    // Check if "New Arrivals" heading is rendered
    expect(screen.getByText('New Arrivals')).toBeInTheDocument();
    
    // Check if "View All" link is rendered
    expect(screen.getByText('View All')).toBeInTheDocument();
    
    // Check if carousel components are rendered
    expect(screen.getByTestId('carousel')).toBeInTheDocument();
    expect(screen.getByTestId('carousel-content')).toBeInTheDocument();
    expect(screen.getAllByTestId('carousel-item').length).toBe(2);
    expect(screen.getByTestId('carousel-previous')).toBeInTheDocument();
    expect(screen.getByTestId('carousel-next')).toBeInTheDocument();
  });

  test('renders products correctly', () => {
    render(<NewArrivals products={mockProducts} isLoading={false} />);
    
    // Check if all product cards are rendered
    const productCards = screen.getAllByTestId('product-card');
    expect(productCards.length).toBe(2);
    expect(productCards[0]).toHaveTextContent('Test Product 1');
    expect(productCards[1]).toHaveTextContent('Test Product 2');
    
    // Check if product IDs are correctly set
    expect(productCards[0]).toHaveAttribute('data-product-id', '1');
    expect(productCards[1]).toHaveAttribute('data-product-id', '2');
  });

  test('shows skeletons when loading', () => {
    render(<NewArrivals products={[]} isLoading={true} />);
    
    // We're using the shadcn Skeleton component which we haven't mocked
    // Instead, we can check if the loading carousel is rendered
    const carouselItems = screen.getAllByTestId('carousel-item');
    expect(carouselItems.length).toBe(6); // 6 skeleton items
  });

  test('handles empty products array', () => {
    render(<NewArrivals products={[]} isLoading={false} />);
    
    // Should render the carousel but with no items
    expect(screen.getByTestId('carousel')).toBeInTheDocument();
    expect(screen.queryAllByTestId('product-card').length).toBe(0);
  });
});