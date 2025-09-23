import {I18nManager, Alert} from 'react-native';
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
  const wasRTL = I18nManager.isRTL;

  // Force RTL to true since we default to Arabic
  I18nManager.forceRTL(true);
  I18nManager.allowRTL(true);

  console.log('RTL configured - was:', wasRTL, 'now:', I18nManager.isRTL);

  // If RTL wasn't enabled before, show restart message
  if (!wasRTL && __DEV__) {
    Alert.alert(
      'RTL Enabled',
      'Please restart the app to apply RTL layout changes',
      [{text: 'OK'}],
    );
  }
};
