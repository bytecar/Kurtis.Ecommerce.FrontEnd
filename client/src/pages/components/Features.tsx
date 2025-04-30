import React from 'react';
import { AnimatedHeading } from './AnimatedHeading';
import { 
  Truck, 
  RefreshCw, 
  ShieldCheck, 
  HeadphonesIcon 
} from 'lucide-react';

interface Feature {
  title: string;
  description: string;
  icon: string;
}

interface FeaturesProps {
  features: Feature[];
}

export const Features: React.FC<FeaturesProps> = ({ features }) => {
  const getIcon = (iconName: string) => {
    switch (iconName) {
      case 'truck':
        return <Truck className="feature-icon" />;
      case 'arrow-go-back':
        return <RefreshCw className="feature-icon" />;
      case 'secure-payment':
        return <ShieldCheck className="feature-icon" />;
      case 'customer-service-2':
        return <HeadphonesIcon className="feature-icon" />;
      default:
        return <Truck className="feature-icon" />;
    }
  };

  return (
    <section className="features-section">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <AnimatedHeading center>Why Choose Us</AnimatedHeading>
        </div>
        
        <div className="features-grid">
          {features.map((feature, index) => (
            <div key={index} className="feature-item">
              <div className="feature-icon-wrapper">
                {getIcon(feature.icon)}
              </div>
              <h3 className="feature-title">{feature.title}</h3>
              <p className="feature-description">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}