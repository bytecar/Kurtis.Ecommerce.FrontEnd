import React from 'react';
import { render, screen } from '../../testUtils';
import { Hero } from '@/pages/components/Hero';

describe('Hero Component', () => {
  const mockProps = {
    title: 'Test Title',
    subtitle: 'Test Subtitle',
    image: 'test-image.jpg'
  };

  test('renders hero component with correct props', () => {
    render(<Hero {...mockProps} />);
    
    // Check if title and subtitle are rendered
    expect(screen.getByText('Test Title')).toBeInTheDocument();
    expect(screen.getByText('Test Subtitle')).toBeInTheDocument();
    
    // Check if the image is rendered with correct src
    const heroImage = screen.getByAltText('Hero image of ethnic fashion');
    expect(heroImage).toBeInTheDocument();
    expect(heroImage.getAttribute('src')).toBe('test-image.jpg');
    
    // Check if buttons are rendered
    expect(screen.getByText('Shop Now')).toBeInTheDocument();
    expect(screen.getByText('View Collections')).toBeInTheDocument();
  });

  test('has correct CSS classes for styling', () => {
    render(<Hero {...mockProps} />);
    
    // Check if the main section has the hero-section class
    const heroSection = screen.getByText('Test Title').closest('section');
    expect(heroSection).toHaveClass('hero-section');
    
    // Check if container exists with hero-container class
    const container = heroSection?.querySelector('.hero-container');
    expect(container).toBeInTheDocument();
    
    // Check if content exists with hero-content class
    expect(heroSection?.querySelector('.hero-content')).toBeInTheDocument();
    
    // Check if image container exists with hero-image-container class
    expect(heroSection?.querySelector('.hero-image-container')).toBeInTheDocument();
  });

  test('buttons have proper hover effects classes', () => {
    render(<Hero {...mockProps} />);
    
    const shopNowButton = screen.getByText('Shop Now');
    const viewCollectionsButton = screen.getByText('View Collections');
    
    // Check if the hover effect classes are applied
    expect(shopNowButton).toHaveClass('hover:scale-105');
    expect(shopNowButton).toHaveClass('hover:shadow-lg');
    expect(viewCollectionsButton).toHaveClass('hover:scale-105');
    expect(viewCollectionsButton).toHaveClass('hover:shadow-lg');
  });
});