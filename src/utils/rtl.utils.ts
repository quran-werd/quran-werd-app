import {I18nManager, Alert} from 'react-native';
import i18n from '../i18n';

export const isRTL = (): boolean => {
  return i18n.language === 'ar' || I18nManager.isRTL;
};

export const forceRTL = (): void => {
  if (!I18nManager.isRTL) {
    I18nManager.forceRTL(true);
  }
};

export const configureRTL = (): void => {
  const wasRTL = I18nManager.isRTL;
  I18nManager.forceRTL(true);
  I18nManager.allowRTL(true);

  if (!wasRTL && __DEV__) {
    Alert.alert(
      i18n.t('rtl.enabledTitle'),
      i18n.t('rtl.enabledMessage'),
      [{text: i18n.t('common.ok')}],
    );
  }
};
