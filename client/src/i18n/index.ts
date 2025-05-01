import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';
import Backend from 'i18next-http-backend';

// Import translations directly
import enTranslation from './locales/en.json';
import hiTranslation from './locales/hi.json';
import knTranslation from './locales/kn.json';
import teTranslation from './locales/te.json';

// Define resources with the translations
const resources = {
  en: {
    translation: enTranslation
  },
  hi: {
    translation: hiTranslation
  },
  kn: {
    translation: knTranslation
  },
  te: {
    translation: teTranslation
  }
};

i18n
  // pass the i18n instance to react-i18next.
  .use(initReactI18next)
  // detect user language
  .use(LanguageDetector)
  // load translation using http -> see /public/locales (only used as fallback)
  .use(Backend)
  // init i18next
  // for all options read: https://www.i18next.com/overview/configuration-options
  .init({
    resources,
    fallbackLng: 'en',
    debug: import.meta.env.DEV, // Enable debugging in development mode
    
    interpolation: {
      escapeValue: false, // not needed for react as it escapes by default
    },
    
    // Set detection options
    detection: {
      order: ['localStorage', 'navigator'],
      lookupLocalStorage: 'kurtisAndMore_i18nextLng',
      caches: ['localStorage'],
    },
    
    react: {
      useSuspense: true,
    },
    
    // Fix to ensure translations are always loaded
    partialBundledLanguages: false,
    load: 'all',
  });

export default i18n;