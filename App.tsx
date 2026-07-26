/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */

import React, {useEffect, useState} from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {View, ActivityIndicator, StyleSheet} from 'react-native';
import notifee from '@notifee/react-native';
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

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={colors.primary} />
      </View>
    );
  }

  return <RootNavigator />;
}

function App(): React.JSX.Element {
  return (
    <Provider store={store}>
      <IconRegistry icons={EvaIconsPack} />
      <ApplicationProvider {...eva} theme={eva.light}>
        <NavigationContainer ref={navigationRef} linking={linking as any}>
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
