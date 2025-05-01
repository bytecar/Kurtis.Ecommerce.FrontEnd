import React from 'react';
import { useTranslation } from 'react-i18next';
import { AnimatedHeading } from './AnimatedHeading';
import { Card, CardContent } from '@/components/ui/card';
import { 
  Truck, 
  ArrowLeftRight, 
  ShieldCheck, 
  Headphones,
  PackageOpen,
  CircleDollarSign,
  Award,
  Heart
} from 'lucide-react';

// Import CSS
import './styles/Features.css';

interface FeatureProps {
  features: {
    title: string;
    description: string;
    icon: string;
  }[];
}

export const Features: React.FC<FeatureProps> = ({ features }) => {
  const { t } = useTranslation();

  // Map icon names to components
  const getIconComponent = (iconName: string) => {
    switch (iconName) {
      case 'truck': return <Truck className="feature-icon" />;
      case 'arrow-go-back': return <ArrowLeftRight className="feature-icon" />;
      case 'secure-payment': return <ShieldCheck className="feature-icon" />;
      case 'customer-service-2': return <Headphones className="feature-icon" />;
      case 'package': return <PackageOpen className="feature-icon" />;
      case 'money': return <CircleDollarSign className="feature-icon" />;
      case 'award': return <Award className="feature-icon" />;
      case 'heart': return <Heart className="feature-icon" />;
      default: return <Award className="feature-icon" />;
    }
  };

  return (
    <section className="features-section">
      <div className="container mx-auto px-4">
        <AnimatedHeading center>{t('home.whyChooseUs')}</AnimatedHeading>
        
        <div className="features-grid">
          {features.map((feature, index) => (
            <Card key={index} className="feature-card">
              <CardContent className="p-6">
                <div className="feature-icon-container">
                  {getIconComponent(feature.icon)}
                </div>
                <h3 className="feature-title">{feature.title}</h3>
                <p className="feature-description">{feature.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};