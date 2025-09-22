import i18n from 'i18next';
import {initReactI18next} from 'react-i18next';
import {getLocales} from 'react-native-localize';

// Import translation files
import ar from './translations/ar.json';
import en from './translations/en.json';

const resources = {
  ar: {
    translation: ar,
  },
  en: {
    translation: en,
  },
};

const deviceLocales = getLocales();
const defaultLanguage = 'ar'; // Force Arabic as default

i18n
  .use(initReactI18next)
  .init({
    compatibilityJSON: 'v3',
    resources,
    lng: defaultLanguage,
    fallbackLng: 'ar',
    debug: __DEV__,
    
    interpolation: {
      escapeValue: false, // React already escapes values
    },
    
    react: {
      useSuspense: false,
    },
  });

export default i18n;
