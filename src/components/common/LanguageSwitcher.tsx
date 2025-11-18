import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';
import { CheckIcon, GlobeIcon } from 'lucide-react';

// Available languages
const languages = [
  { code: 'en', label: 'English' },
  { code: 'hi', label: 'हिंदी' }, // Hindi
  { code: 'kn', label: 'ಕನ್ನಡ' }, // Kannada
  { code: 'te', label: 'తెలుగు' }, // Telugu
];

const LanguageSwitcher: React.FC = () => {
  const { i18n, t } = useTranslation();
  const [isOpen, setIsOpen] = useState(false);

  const changeLanguage = async (lng: string) => {
    await i18n.changeLanguage(lng);
    localStorage.setItem('kurtisAndMore_i18nextLng', lng);
    setIsOpen(false);
  };

  const currentLanguage = languages.find(lang => lang.code === i18n.language) || languages[0];

  return (
    <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="sm" className="flex items-center gap-1 h-9 px-2">
          <GlobeIcon className="h-4 w-4" />
          <span className="hidden md:inline-block">{currentLanguage.label}</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-40">
        {languages.map((language) => (
          <DropdownMenuItem
            key={language.code}
            className="flex justify-between items-center cursor-pointer"
            onClick={() => changeLanguage(language.code)}
          >
            <span>{t(`settings.languages.${language.code}`)} ({language.label})</span>
            {i18n.language === language.code && (
              <CheckIcon className="h-4 w-4" />
            )}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default LanguageSwitcher;