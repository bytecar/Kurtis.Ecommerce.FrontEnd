import React, { useState } from 'react';
import { Link } from 'wouter';
import { Button } from '@/components/ui/button';
<<<<<<< HEAD
import { HeroProps } from '@/shared/types/component.types';
=======
import { HeroProps } from '@shared/types/component.types';
>>>>>>> fc6a7514ce55db2e4e35223257173877c0e98758
import { useTranslation } from 'react-i18next';
import { ChevronLeft, ChevronRight } from 'lucide-react';

// Import CSS
import './styles/Hero.css';

const heroImages = [
  "https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?auto=format&fit=crop&q=80&w=1000",
  "https://images.unsplash.com/photo-1610030469668-3a0bd5e08696?auto=format&fit=crop&q=80&w=1000",
  "https://images.unsplash.com/photo-1591213954196-2d0ccb3f8d4c?auto=format&fit=crop&q=80&w=1000",
  "https://images.unsplash.com/photo-1617627143750-d86bc21e4e90?auto=format&fit=crop&q=80&w=1000"
];

export const Hero: React.FC<HeroProps> = ({ title, subtitle, image }) => {
  const { t } = useTranslation();
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  const nextImage = () => {
    setCurrentImageIndex((prev) => (prev + 1) % heroImages.length);
  };

  const prevImage = () => {
    setCurrentImageIndex((prev) => (prev - 1 + heroImages.length) % heroImages.length);
  };

  const goToImage = (index: number) => {
    setCurrentImageIndex(index);
  };

  return (
    <section className="hero-section">
      <div className="container mx-auto hero-container">
        <div className="hero-content">
          <h1 className="hero-title">{title}</h1>
          <p className="hero-subtitle">{subtitle}</p>
          <div className="hero-buttons">
            <Button 
              size="lg" 
              className="transition-all duration-300 transform hover:scale-105 hover:shadow-lg"
            >
              {t('home.shopNow')}
            </Button>
            <Link href="/collections">
              <Button
                variant="outline"
                size="lg"
                className="transition-all duration-300 transform hover:scale-105 hover:shadow-lg"
              >
                {t('home.viewCollections')}
              </Button>
            </Link>
          </div>
        </div>
        
        <div className="hero-image-container">
          <img
            src={heroImages[currentImageIndex]}
            alt={t('home.heroImageAlt', 'Hero image of ethnic fashion')}
            className="hero-image"
          />
          
          {/* Navigation Buttons */}
          <button
            onClick={prevImage}
            className="hero-nav-button hero-nav-prev"
            aria-label="Previous image"
          >
            <ChevronLeft className="h-5 w-5" />
          </button>
          <button
            onClick={nextImage}
            className="hero-nav-button hero-nav-next"
            aria-label="Next image"
          >
            <ChevronRight className="h-5 w-5" />
          </button>

          {/* Bottom Dot Navigation */}
          <div className="hero-dots-container">
            {heroImages.map((_, index) => (
              <button
                key={index}
                onClick={() => goToImage(index)}
                className={`hero-dot ${index === currentImageIndex ? 'hero-dot-active' : ''}`}
                aria-label={`Go to image ${index + 1}`}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}