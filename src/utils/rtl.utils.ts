import {I18nManager} from 'react-native';
import i18n from '../i18n';

/**
 * Check if the current language is RTL
 */
export const isRTL = (): boolean => {
  return i18n.language === 'ar' || I18nManager.isRTL;
};

/**
 * Force RTL layout for the app
 */
export const forceRTL = (): void => {
  if (!I18nManager.isRTL) {
    I18nManager.forceRTL(true);
  }
};

/**
 * Enable RTL for Arabic language
 */
export const configureRTL = (): void => {
  const currentLang = i18n.language;
  
  if (currentLang === 'ar') {
    forceRTL();
  } else {
    // For non-RTL languages, we could disable RTL if needed
    // but since we're defaulting to Arabic, we'll keep RTL enabled
    if (!I18nManager.isRTL) {
      I18nManager.forceRTL(true);
    }
  }
};
