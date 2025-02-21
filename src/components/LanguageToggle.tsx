import React from 'react';
import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import { Globe } from 'lucide-react';

/**
 * @file LanguageToggle.tsx
 *
 * @description This file contains the `LanguageToggle` component, which allows users to switch
 * between English and Arabic languages. It uses the `react-i18next` library for internationalization.
 *
 * @module LanguageToggle
 */

/**
 * LanguageToggle component - allows users to switch between English and Arabic languages.
 *
 * @returns {React.ReactElement} The LanguageToggle component.
 */
export const LanguageToggle = () => {
  const { i18n } = useTranslation();

  /**
   * Toggles the application language between English and Arabic.
   */
  const toggleLanguage = () => {
    i18n.changeLanguage(i18n.language === 'en' ? 'ar' : 'en');
  };

  return (
    <motion.button
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.9 }}
      onClick={toggleLanguage}
      className="flex items-center gap-2 text-white hover:text-yellow-400 transition-colors"
      title="Toggle Language"
    >
      <Globe className="w-5 h-5" />
      {/* Display "AR" when the current language is English, and "EN" when it's Arabic */}
      <span>{i18n.language === 'en' ? 'AR' : 'EN'}</span>
    </motion.button>
  );
};
