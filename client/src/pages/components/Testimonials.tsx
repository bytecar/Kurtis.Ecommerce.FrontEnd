import React from 'react';
import { Star } from 'lucide-react';
import { AnimatedHeading } from './AnimatedHeading';

interface Testimonial {
  text: string;
  name: string;
  location: string;
  image: string;
}

interface TestimonialsProps {
  testimonials: Testimonial[];
}

export const Testimonials: React.FC<TestimonialsProps> = ({ testimonials }) => {
  return (
    <section className="testimonials-section">
      <div className="container mx-auto px-4">
        <div className="testimonials-header">
          <AnimatedHeading center>What Our Customers Say</AnimatedHeading>
          <p className="testimonials-subtitle">
            Our customers love our products and service. Here's what they have to say about their experience shopping with us.
          </p>
        </div>
        
        <div className="testimonials-grid">
          {testimonials.map((testimonial, index) => (
            <div key={index} className="testimonial-card">
              <div className="testimonial-stars">
                {[...Array(5)].map((_, i) => (
                  <Star 
                    key={i} 
                    fill="currentColor" 
                    className="testimonial-star h-4 w-4"
                  />
                ))}
              </div>
              <p className="testimonial-text">{testimonial.text}</p>
              <div className="testimonial-author">
                <div className="testimonial-avatar">
                  <img 
                    src={testimonial.image} 
                    alt={testimonial.name}
                    className="testimonial-avatar-img" 
                  />
                </div>
                <div className="testimonial-info">
                  <h4>{testimonial.name}</h4>
                  <span className="testimonial-location">{testimonial.location}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}