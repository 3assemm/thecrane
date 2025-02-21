import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';
import ar from './locales/ar.json';
import en from './locales/en.json';

// Get stored language or default to English
const storedLang = localStorage.getItem('i18nextLng') || 'en';

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources: {
      en: { translation: en },
      ar: { translation: ar }
    },
    fallbackLng: 'en',
    lng: storedLang,
    interpolation: {
      escapeValue: false
    }
  });

// Set initial direction and language
document.documentElement.dir = storedLang === 'ar' ? 'rtl' : 'ltr';
document.documentElement.lang = storedLang;

export default i18n;
