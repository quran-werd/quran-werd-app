/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */

import React from 'react';
import {NavigationContainer} from '@react-navigation/native';
import Routes from './src/routes';
import {Provider} from 'react-redux';
import {store} from './src/store';

import * as eva from '@eva-design/eva';
import {ApplicationProvider} from '@ui-kitten/components';

function App(): React.JSX.Element {
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
