import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { AlertCircle, CheckCircle2, MailCheck } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

// Import CSS
import './styles/Newsletter.css';

export const Newsletter: React.FC = () => {
  const { t } = useTranslation();
  const { toast } = useToast();
  const [email, setEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email || !email.includes('@')) {
      toast({
        title: t('newsletter.invalidEmail'),
        description: t('newsletter.pleaseEnterValid'),
        variant: "destructive"
      });
      return;
    }
    
    setIsSubmitting(true);
    
    // Simulate API call
    setTimeout(() => {
      setIsSubmitting(false);
      setEmail('');
      toast({
        title: t('newsletter.thankYou'),
        description: t('newsletter.successfullySubscribed'),
        variant: "default"
      });
    }, 1000);
  };
  
  return (
    <section className="newsletter-section">
      <div className="newsletter-container">
        <div className="newsletter-content">
          <div className="newsletter-icon-container">
            <MailCheck className="newsletter-icon" />
          </div>
          <h2 className="newsletter-title">{t('newsletter.title')}</h2>
          <p className="newsletter-subtitle">{t('newsletter.subtitle')}</p>
          
          <form onSubmit={handleSubmit} className="newsletter-form">
            <div className="newsletter-input-group">
              <Input
                type="email"
                placeholder={t('newsletter.emailPlaceholder')}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="newsletter-input"
                disabled={isSubmitting}
              />
              <Button 
                type="submit" 
                className="newsletter-button"
                disabled={isSubmitting}
              >
                {isSubmitting ? t('common.submitting') : t('newsletter.subscribe')}
              </Button>
            </div>
          </form>
         <p className="newsletter-privacy">{t('newsletter.privacyNotice')}</p>
        </div>
        
        <div className="newsletter-decoration">
          <div className="decoration-circle decoration-circle-1"></div>
          <div className="decoration-circle decoration-circle-2"></div>
          <div className="decoration-circle decoration-circle-3"></div>
        </div>
      </div>
    </section>
  );
};