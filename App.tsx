/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */

import React, {useEffect, useState} from 'react';
import {DarkTheme, NavigationContainer, Theme} from '@react-navigation/native';
import {View, ActivityIndicator, StyleSheet} from 'react-native';
import notifee from '@notifee/react-native';
import {useFonts} from 'expo-font';
import {
  Cairo_300Light,
  Cairo_400Regular,
  Cairo_600SemiBold,
  Cairo_700Bold,
} from '@expo-google-fonts/cairo';
import {Amiri_400Regular, Amiri_700Bold} from '@expo-google-fonts/amiri';
import {AmiriQuran_400Regular} from '@expo-google-fonts/amiri-quran';
import RootNavigator, {linking} from './src/navigation';
import {navigationRef} from './src/navigation/navigationRef';
import {Provider} from 'react-redux';
import {store} from './src/store';

import * as eva from '@eva-design/eva';
import {ApplicationProvider, IconRegistry} from '@ui-kitten/components';
import {EvaIconsPack} from '@ui-kitten/eva-icons';

import './src/i18n';
import {configureRTL} from './src/utils/rtl.utils';
import {loadAuthData} from './src/utils/storage/auth.storage';
import {restoreSession} from './src/features/Auth/authAction';
import {colors} from './src/styles/colors';
import {useAppDispatch} from './src/store/hooks';
import {
  handleNotificationEvent,
  handleNotificationPress,
  scheduleDailyWerdNotification,
} from './src/services/notifications.service';

function AppContent(): React.JSX.Element {
  const dispatch = useAppDispatch();
  const [isLoading, setIsLoading] = useState(true);
  const [fontsLoaded, fontError] = useFonts({
    Cairo_300Light,
    Cairo_400Regular,
    Cairo_600SemiBold,
    Cairo_700Bold,
    Amiri_400Regular,
    Amiri_700Bold,
    AmiriQuran_400Regular,
  });

  useEffect(() => {
    configureRTL();

    const bootstrap = async () => {
      try {
        const authData = await loadAuthData();
        if (authData?.isAuthenticated && authData.token) {
          await dispatch(restoreSession(authData.token)).unwrap();
        }
      } catch {
        // session invalid — user will see auth screen
      } finally {
        setIsLoading(false);
      }
    };

    bootstrap();
    scheduleDailyWerdNotification().catch(console.error);
  }, [dispatch]);

  useEffect(() => {
    if (isLoading) {
      return;
    }

    const handleInitialNotification = async () => {
      const initial = await notifee.getInitialNotification();
      if (initial) {
        await handleNotificationPress(initial.notification);
      }
    };

    handleInitialNotification();

    return notifee.onForegroundEvent(handleNotificationEvent);
  }, [isLoading]);

  if (isLoading || (!fontsLoaded && !fontError)) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={colors.primary} />
      </View>
    );
  }

  return <RootNavigator />;
}

const navigationTheme: Theme = {
  ...DarkTheme,
  colors: {
    ...DarkTheme.colors,
    background: colors.background,
    card: colors.background,
  },
};

function App(): React.JSX.Element {
  return (
    <Provider store={store}>
      <IconRegistry icons={EvaIconsPack} />
      <ApplicationProvider {...eva} theme={eva.light}>
        <NavigationContainer
          ref={navigationRef}
          linking={linking as any}
          theme={navigationTheme}>
          <AppContent />
        </NavigationContainer>
      </ApplicationProvider>
    </Provider>
  );
}

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.background,
  },
});

export default App;
