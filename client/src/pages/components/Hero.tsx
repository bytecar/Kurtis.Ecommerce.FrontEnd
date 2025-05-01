import React from 'react';
import { Link } from 'wouter';
import { Button } from '@/components/ui/button';
import { HeroProps } from '@/types/component.types';
import { useTranslation } from 'react-i18next';

// Import CSS
import './styles/Hero.css';

export const Hero: React.FC<HeroProps> = ({ title, subtitle, image }) => {
  // The HTML structure is maintained in './html/Hero.html'
  const { t } = useTranslation();
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
            src={image}
            alt={t('home.heroImageAlt', 'Hero image of ethnic fashion')}
            className="hero-image"
          />
        </div>
      </div>
    </section>
  );
}