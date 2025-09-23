/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */

import React, {useEffect} from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {I18nManager} from 'react-native';
import Routes from './src/routes';
import {Provider} from 'react-redux';
import {store} from './src/store';

import * as eva from '@eva-design/eva';
import {ApplicationProvider} from '@ui-kitten/components';

// Initialize i18n
import './src/i18n';
import {configureRTL} from './src/utils/rtl.utils';

function App(): React.JSX.Element {
  useEffect(() => {
    // Configure RTL layout for Arabic
    configureRTL();
  }, []);

  return (
    <Provider store={store}>
      <ApplicationProvider {...eva} theme={eva.light}>
        <NavigationContainer>
          <Routes />
        </NavigationContainer>
      </ApplicationProvider>
    </Provider>
  );
}

export default App;
