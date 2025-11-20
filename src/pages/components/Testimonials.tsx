import React from 'react';
import { useTranslation } from 'react-i18next';
import { AnimatedHeading } from './AnimatedHeading.js';
import { Card, CardContent } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Quote } from 'lucide-react';

// Import CSS
import './styles/Testimonials.css';

interface TestimonialProps {
  testimonials: {
    text: string;
    name: string;
    location: string;
    image: string;
  }[];
}

export const Testimonials: React.FC<TestimonialProps> = ({ testimonials }) => {
  const { t } = useTranslation();

  return (
    <section className="testimonials-section">
      <div className="container mx-auto px-4">
        <AnimatedHeading center>{t('home.testimonials')}</AnimatedHeading>
        
        <div className="testimonials-grid">
          {testimonials.map((testimonial, index) => (
            <Card key={index} className="testimonial-card">
              <CardContent className="p-6">
                <div className="flex items-start mb-4">
                  <Avatar className="testimonial-avatar">
                    <AvatarImage src={testimonial.image} alt={testimonial.name} />
                    <AvatarFallback>{testimonial.name.charAt(0)}</AvatarFallback>
                  </Avatar>
                  <div className="ml-4">
                    <h3 className="font-medium">{testimonial.name}</h3>
                    <p className="text-sm text-muted-foreground">{testimonial.location}</p>
                  </div>
                  <Quote className="ml-auto h-6 w-6 text-primary opacity-50" />
                </div>
                <p className="testimonial-text">{testimonial.text}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};