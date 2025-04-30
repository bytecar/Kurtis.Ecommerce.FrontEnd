import React from 'react';
import { Link } from 'wouter';
import { AnimatedHeading } from './AnimatedHeading';

interface Collection {
  name: string;
  description: string;
  image: string;
  href: string;
}

interface CollectionsProps {
  collections: Collection[];
}

export const Collections: React.FC<CollectionsProps> = ({ collections }) => {
  return (
    <section className="collections-section">
      <div className="container mx-auto px-4">
        <div className="section-header">
          <AnimatedHeading>Collections</AnimatedHeading>
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
                    Explore Now
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