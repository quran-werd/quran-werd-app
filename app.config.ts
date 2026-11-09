import type {ExpoConfig} from 'expo/config';

const GOOGLE_IOS_CLIENT_ID = process.env.GOOGLE_IOS_CLIENT_ID ?? '';
const iosUrlScheme = GOOGLE_IOS_CLIENT_ID
  ? `com.googleusercontent.apps.${
      GOOGLE_IOS_CLIENT_ID.split('.apps.googleusercontent.com')[0]
    }`
  : undefined;

const plugins: NonNullable<ExpoConfig['plugins']> = [
  'expo-asset',
  ['expo-font', {fonts: ['./assets/fonts/qcf/v1']}],
  '@react-native-community/datetimepicker',
  ['expo-build-properties', {android: {usesCleartextTraffic: true}}],
  './plugins/withNotifeeAndroidMavenRepo',
];

if (iosUrlScheme) {
  plugins.push([
    '@react-native-google-signin/google-signin',
    {iosUrlScheme},
  ]);
}

const config: ExpoConfig = {
  name: 'QuranWerd',
  slug: 'quranwerd',
  version: '1.0.0',
  orientation: 'default',
  icon: './assets/icon.png',
  userInterfaceStyle: 'automatic',
  splash: {
    backgroundColor: '#0C1220',
    image: './assets/icon.png',
    resizeMode: 'contain',
  },
  ios: {
    bundleIdentifier: 'com.quranwerd.app',
    infoPlist: {
      CFBundleLocalizations: ['ar', 'en'],
      NSAppTransportSecurity: {
        NSAllowsArbitraryLoads: false,
        NSAllowsLocalNetworking: true,
      },
      ITSAppUsesNonExemptEncryption: false,
    },
  },
  android: {
    package: 'com.quranwerd',
    allowBackup: false,
    edgeToEdgeEnabled: true,
    adaptiveIcon: {
      foregroundImage: './assets/icon.png',
      backgroundColor: '#0C1220',
    },
  },
  plugins,
  extra: {
    apiBaseUrl: process.env.API_BASE_URL,
    googleIosClientId: GOOGLE_IOS_CLIENT_ID,
    googleWebClientId: process.env.GOOGLE_WEB_CLIENT_ID,
    devNotificationTime: process.env.DEV_NOTIFICATION_TIME,
    authMockLogin: process.env.AUTH_MOCK_LOGIN,
    authMockEmail: process.env.AUTH_MOCK_EMAIL,
    authMockName: process.env.AUTH_MOCK_NAME,
    authMockGoogleId: process.env.AUTH_MOCK_GOOGLE_ID,
    eas: {
      projectId: 'e5d14982-53b5-4aff-91e8-1997cef3235d',
    },
  },
};

export default config;
