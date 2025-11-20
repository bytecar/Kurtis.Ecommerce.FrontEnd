import React from 'react';
import { Link } from 'wouter';
<<<<<<< HEAD
import { CollectionsProps } from '@/shared/types/component.types';
import { AnimatedHeading } from './AnimatedHeading.js';
=======
import { CollectionsProps } from '@shared/types/component.types';
import { AnimatedHeading } from './AnimatedHeading';
>>>>>>> fc6a7514ce55db2e4e35223257173877c0e98758
import { useTranslation } from 'react-i18next';

// Import CSS
import './styles/Collections.css';

export const Collections: React.FC<CollectionsProps> = ({ collections }) => {
  // Get translation function
  const { t } = useTranslation();
  
  return (
    <section className="collections-section">
      <div className="container mx-auto px-4">
        <div className="section-header">
          <AnimatedHeading>{t('home.collections', 'Collections')}</AnimatedHeading>
        </div>
        
        <div className="collections-grid">
          {collections.map((collection, index) => (
            <Link key={index} href={collection.href}>
              <div className="collection-item cursor-pointer">
                <img 
                  src={collection.image}
                  alt={collection.name}
                  className="collection-image"
                />
                <div className="collection-overlay"></div>
                <div className="collection-content">
                  <h3 className="collection-title">{collection.name}</h3>
                  <p className="collection-description">{collection.description}</p>
                  <span className="collection-button">
                    {t('collections.explore', 'Explore Now')}
                  </span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}