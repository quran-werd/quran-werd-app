/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */

import React, {useEffect, useState} from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {I18nManager, View, ActivityIndicator, StyleSheet} from 'react-native';
import Routes from './src/routes';
import {Provider} from 'react-redux';
import {store} from './src/store';

import * as eva from '@eva-design/eva';
import {ApplicationProvider, IconRegistry} from '@ui-kitten/components';
import {EvaIconsPack} from '@ui-kitten/eva-icons';

// Initialize i18n
import './src/i18n';
import {configureRTL} from './src/utils/rtl.utils';
import {loadAuthData} from './src/utils/storage/auth.storage';
import {setAuthData} from './src/features/Auth/authSlice';
import {setAuthToken} from './src/api/clients/werdApiClient';
import {colors} from './src/styles/colors';
import {useAppDispatch} from './src/store/hooks';

function AppContent(): React.JSX.Element {
  const dispatch = useAppDispatch();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Configure RTL layout for Arabic
    configureRTL();

    // Load persisted auth data
    const loadPersistedAuth = async () => {
      try {
        const authData = await loadAuthData();
        if (authData && authData.isAuthenticated) {
          // Restore auth state
          dispatch(setAuthData(authData));
          // Set token in API client
          if (authData.accessToken) {
            setAuthToken(authData.accessToken);
          }
        }
      } catch (error) {
        console.error('Failed to load persisted auth:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadPersistedAuth();
  }, [dispatch]);

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={colors.primary} />
      </View>
    );
  }

  return <Routes />;
}

function App(): React.JSX.Element {
  return (
    <Provider store={store}>
      <IconRegistry icons={EvaIconsPack} />
      <ApplicationProvider {...eva} theme={eva.light}>
        <NavigationContainer>
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
