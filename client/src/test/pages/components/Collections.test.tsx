import React from 'react';
import { render, screen } from '../../testUtils';
import { Collections } from '@/pages/components/Collections';

describe('Collections Component', () => {
  const mockCollections = [
    {
      name: 'Test Collection 1',
      description: 'Test Description 1',
      image: 'test-image-1.jpg',
      href: '/collections/test-1'
    },
    {
      name: 'Test Collection 2',
      description: 'Test Description 2',
      image: 'test-image-2.jpg',
      href: '/collections/test-2'
    }
  ];

  test('renders collections component with correct data', () => {
    render(<Collections collections={mockCollections} />);
    
    // Check if collection names and descriptions are rendered
    expect(screen.getByText('Test Collection 1')).toBeInTheDocument();
    expect(screen.getByText('Test Description 1')).toBeInTheDocument();
    expect(screen.getByText('Test Collection 2')).toBeInTheDocument();
    expect(screen.getByText('Test Description 2')).toBeInTheDocument();
    
    // Check if "Explore Now" button exists for each collection
    const exploreButtons = screen.getAllByText('Explore Now');
    expect(exploreButtons).toHaveLength(2);
    
    // Check if images are rendered with correct src
    const images = screen.getAllByRole('img');
    expect(images).toHaveLength(2);
    expect(images[0]).toHaveAttribute('src', 'test-image-1.jpg');
    expect(images[1]).toHaveAttribute('src', 'test-image-2.jpg');
  });

  test('has correct CSS classes for styling', () => {
    render(<Collections collections={mockCollections} />);
    
    // Check if the main section has the collections-section class
    const section = screen.getByText('Test Collection 1').closest('section');
    expect(section).toHaveClass('collections-section');
    
    // Check if container exists with correct class
    const container = section?.querySelector('.container');
    expect(container).toBeInTheDocument();
    
    // Check if collections grid exists with correct class
    const grid = section?.querySelector('.collections-grid');
    expect(grid).toBeInTheDocument();
    
    // Check if collection items have correct classes
    const collectionItems = screen.getAllByText('Explore Now').map(btn => 
      btn.closest('.collection-item')
    );
    
    expect(collectionItems[0]).toHaveClass('collection-item');
    expect(collectionItems[0]).toHaveClass('cursor-pointer');
  });

  test('renders correct number of collections', () => {
    render(<Collections collections={mockCollections} />);
    
    const collectionItems = screen.getAllByText('Explore Now').map(btn => 
      btn.closest('.collection-item')
    );
    
    expect(collectionItems).toHaveLength(2);
  });
});