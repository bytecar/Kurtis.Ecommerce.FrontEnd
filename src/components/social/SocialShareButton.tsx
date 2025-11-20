import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
  FacebookShareButton,
  TwitterShareButton,
  WhatsappShareButton,
  PinterestShareButton,
  TelegramShareButton,
  FacebookIcon,
  TwitterIcon,
  WhatsappIcon,
  PinterestIcon,
  TelegramIcon,
} from 'react-share';
import { CopyIcon, CheckIcon, Share2Icon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { toast } from '@/hooks/use-toast';
import { logger, LogCategory } from '@/lib/logging';

export interface SocialShareButtonProps {
  url: string;
  title: string;
  description: string;
  imageUrl?: string;
  category?: string;
  occasion?: string; // e.g., "wedding", "festival", "diwali", "casual"
  region?: string; // e.g., "north-india", "south-india", "west-india", "east-india"
  className?: string;
  iconSize?: number;
  buttonSize?: 'sm' | 'default' | 'lg' | 'icon';
  variant?: 'default' | 'outline' | 'ghost';
}

/**
 * Social media sharing component with cultural context
 * 
 * Allows users to share products with culturally relevant hashtags and descriptions
 * based on the product's category, occasion, and region
 */
export const SocialShareButton: React.FC<SocialShareButtonProps> = ({
  url,
  title,
  description,
  imageUrl,
  category,
  occasion,
  region,
  className = '',
  iconSize = 32,
  buttonSize = 'default',
  variant = 'outline',
}) => {
  const { t, i18n } = useTranslation();
  const [copied, setCopied] = useState(false);
  
  // Generate culturally appropriate hashtags based on the product context
  const getContextualHashtags = (): string => {
    const hashtags: string[] = [];
    
    // Basic product category hashtags
    if (category) {
      hashtags.push(`#${category.replace(/\s+/g, '')}`);
      hashtags.push('#IndianFashion');
      hashtags.push('#EthnicWear');
    }
    
    // Occasion-based hashtags
    if (occasion) {
      const occasionTag = occasion.replace(/\s+/g, '');
      hashtags.push(`#${occasionTag}Fashion`);
      
      // Add specific occasion-related hashtags
      switch (occasion.toLowerCase()) {
        case 'wedding':
        case 'bridal':
          hashtags.push('#IndianWedding');
          hashtags.push('#BridalWear');
          hashtags.push('#WeddingSeason');
          break;
        case 'diwali':
        case 'festival':
          hashtags.push('#FestiveSeason');
          hashtags.push('#FestiveCollection');
          hashtags.push('#CelebrateDiwali');
          break;
        case 'holi':
          hashtags.push('#HoliCelebration');
          hashtags.push('#FestiveColors');
          break;
        case 'casual':
          hashtags.push('#CasualEthnic');
          hashtags.push('#EverydayStyle');
          break;
        case 'formal':
          hashtags.push('#FormalWear');
          hashtags.push('#ElegantStyle');
          break;
      }
    }
    
    // Region-specific hashtags
    if (region) {
      switch (region.toLowerCase()) {
        case 'north-india':
          hashtags.push('#NorthIndianFashion');
          hashtags.push('#PunjabiSuit');
          break;
        case 'south-india':
          hashtags.push('#SouthIndianFashion');
          hashtags.push('#KanjivaramSilk');
          hashtags.push('#PattuSaree');
          break;
        case 'west-india':
          hashtags.push('#WestIndianFashion');
          hashtags.push('#GujaratiStyle');
          hashtags.push('#BandhaniPrint');
          break;
        case 'east-india':
          hashtags.push('#EastIndianFashion');
          hashtags.push('#BengaliStyle');
          break;
      }
    }
    
    // Return a unique list of hashtags (up to 5)
    return [...new Set(hashtags)].slice(0, 5).join(' ');
  };
  
  // Generate culturally relevant sharing message
  const getSharingMessage = (): string => {
    let message = `${title} - ${description.substring(0, 80)}${description.length > 80 ? '...' : ''}`;
    
    // Add cultural context based on occasion
    if (occasion) {
      switch (occasion.toLowerCase()) {
        case 'wedding':
        case 'bridal':
          message += ` Perfect for wedding season! ✨👰`;
          break;
        case 'diwali':
          message += ` Light up your Diwali celebrations! ✨🪔`;
          break;
        case 'holi':
          message += ` Add colors to your Holi festival! 🎨🎭`;
          break;
        case 'festival':
          message += ` Celebrate festivals in style! ✨🎉`;
          break;
        case 'casual':
          message += ` Everyday ethnic elegance! 👗`;
          break;
      }
    }
    
    // Add region-specific context if available
    if (region) {
      switch (region.toLowerCase()) {
        case 'north-india':
          message += ` Beautiful North Indian craftsmanship.`;
          break;
        case 'south-india':
          message += ` Exquisite South Indian tradition.`;
          break;
        case 'west-india':
          message += ` Gorgeous Western Indian design.`;
          break;
        case 'east-india':
          message += ` Elegant Eastern Indian heritage.`;
          break;
      }
    }
    
    return message;
  };
  
  const sharingUrl = url;
  const sharingTitle = title;
  const sharingMessage = getSharingMessage();
  const hashtags = getContextualHashtags();
  
  const copyToClipboard = () => {
    const textToCopy = `${sharingTitle}\n${sharingMessage}\n${hashtags}\n${sharingUrl}`;
    
    navigator.clipboard.writeText(textToCopy)
      .then(() => {
        setCopied(true);
        toast({
          title: t('common.copied') || 'Copied!',
          description: t('social.linkCopied') || 'Link copied to clipboard',
        });
        
        // Log successful share
        logger.info('Product link copied to clipboard', LogCategory.UI, {
          productTitle: title,
          shareMethod: 'copy'
        });
        
        // Reset copy state after 2 seconds
        setTimeout(() => setCopied(false), 2000);
      })
      .catch(error => {
        toast({
          title: t('common.error') || 'Error',
          description: t('social.copyFailed') || 'Failed to copy link',
          variant: 'destructive',
        });
        
        logger.error('Failed to copy product link', LogCategory.UI, {
          error,
          productTitle: title
        });
      });
  };
  
  const handleShare = (platform: string) => {
    logger.info(`Product shared on ${platform}`, LogCategory.UI, {
      productTitle: title,
      shareMethod: platform,
      hashtags
    });
  };
  
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button 
          variant={variant} 
          size={buttonSize}
          className={`gap-2 ${className}`}
        >
          <Share2Icon className="h-4 w-4" />
          {buttonSize !== 'icon' && (t('social.share') || 'Share')}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-56">
        <div className="flex flex-col gap-2 p-2">
          <TooltipProvider>
            <div className="flex justify-between gap-2">
              <Tooltip>
                <TooltipTrigger asChild>
                  <FacebookShareButton
                    url={sharingUrl}
                    aria-description={sharingMessage}
                    hashtag={hashtags.split(' ')[0]}
                    onClick={() => handleShare('Facebook')}
                    className="rounded-full transition-transform hover:scale-110"
                  >
                    <FacebookIcon size={iconSize} round />
                  </FacebookShareButton>
                </TooltipTrigger>
                <TooltipContent>
                  <p>{t('social.shareOn', { platform: 'Facebook' }) || 'Share on Facebook'}</p>
                </TooltipContent>
              </Tooltip>
              
              <Tooltip>
                <TooltipTrigger asChild>
                  <TwitterShareButton
                    url={sharingUrl}
                    title={sharingMessage}
                    hashtags={hashtags.split(' ').map(tag => tag.replace('#', ''))}
                    onClick={() => handleShare('Twitter')}
                    className="rounded-full transition-transform hover:scale-110"
                  >
                    <TwitterIcon size={iconSize} round />
                  </TwitterShareButton>
                </TooltipTrigger>
                <TooltipContent>
                  <p>{t('social.shareOn', { platform: 'Twitter' }) || 'Share on Twitter'}</p>
                </TooltipContent>
              </Tooltip>
              
              <Tooltip>
                <TooltipTrigger asChild>
                  <WhatsappShareButton
                    url={sharingUrl}
                    title={`${sharingMessage} ${hashtags}`}
                    onClick={() => handleShare('WhatsApp')}
                    className="rounded-full transition-transform hover:scale-110"
                  >
                    <WhatsappIcon size={iconSize} round />
                  </WhatsappShareButton>
                </TooltipTrigger>
                <TooltipContent>
                  <p>{t('social.shareOn', { platform: 'WhatsApp' }) || 'Share on WhatsApp'}</p>
                </TooltipContent>
              </Tooltip>
            </div>
            
            <div className="flex justify-between gap-2 mt-2">
              {imageUrl && (
                <Tooltip>
                  <TooltipTrigger asChild>
                    <PinterestShareButton
                      url={sharingUrl}
                      media={imageUrl}
                      description={sharingMessage}
                      onClick={() => handleShare('Pinterest')}
                      className="rounded-full transition-transform hover:scale-110"
                    >
                      <PinterestIcon size={iconSize} round />
                    </PinterestShareButton>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>{t('social.shareOn', { platform: 'Pinterest' }) || 'Share on Pinterest'}</p>
                  </TooltipContent>
                </Tooltip>
              )}
              
              <Tooltip>
                <TooltipTrigger asChild>
                  <TelegramShareButton
                    url={sharingUrl}
                    title={`${sharingMessage} ${hashtags}`}
                    onClick={() => handleShare('Telegram')}
                    className="rounded-full transition-transform hover:scale-110"
                  >
                    <TelegramIcon size={iconSize} round />
                  </TelegramShareButton>
                </TooltipTrigger>
                <TooltipContent>
                  <p>{t('social.shareOn', { platform: 'Telegram' }) || 'Share on Telegram'}</p>
                </TooltipContent>
              </Tooltip>
              
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button 
                    variant="outline" 
                    size="icon" 
                    onClick={copyToClipboard}
                    className="rounded-full h-8 w-8 transition-transform hover:scale-110"
                  >
                    {copied ? (
                      <CheckIcon className="h-4 w-4 text-green-500" />
                    ) : (
                      <CopyIcon className="h-4 w-4" />
                    )}
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>{t('social.copyLink') || 'Copy Link'}</p>
                </TooltipContent>
              </Tooltip>
            </div>
          </TooltipProvider>
          
          {/* Display cultural hashtags */}
          <div className="mt-2 text-xs text-muted-foreground text-center">
            {hashtags}
          </div>
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default SocialShareButton;