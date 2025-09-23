import {useTranslation} from 'react-i18next';
import {I18nManager} from 'react-native';
import {Alert} from 'react-native';

export const useLanguage = () => {
  const {i18n, t} = useTranslation();

  const changeLanguage = (language: string) => {
    i18n.changeLanguage(language);
    
    const shouldBeRTL = language === 'ar';
    
    if (I18nManager.isRTL !== shouldBeRTL) {
      I18nManager.forceRTL(shouldBeRTL);
      
      Alert.alert(
        t('common.languageChanged'),
        t('common.restartRequired'),
        [
          {
            text: t('common.ok'),
            onPress: () => {
              // In a real app, you might want to restart the app
              // or handle the RTL change more gracefully
            },
          },
        ]
      );
    }
  };

  const currentLanguage = i18n.language;
  const isRTL = I18nManager.isRTL;

  return {
    currentLanguage,
    isRTL,
    changeLanguage,
    t,
  };
};
