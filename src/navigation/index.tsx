import React from 'react';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import AuthScreen from '../screens/AuthScreen';
import MainTabs from './MainTabs';
import RevisionScreen from '../screens/RevisionScreen';
import {useAppSelector} from '../store/hooks';
import {selectIsAuthenticated} from '../features/Auth/authSlice';

export type RootStackParamList = {
  Auth: undefined;
  Main: undefined;
  Revision: {werdId?: string};
};

const Stack = createNativeStackNavigator<RootStackParamList>();

const linking = {
  prefixes: ['quranwerd://'],
  config: {
    screens: {
      Revision: 'revision',
      Main: {
        screens: {
          Home: 'home',
          MemorizationStack: 'memorization',
          Plan: 'plan',
        },
      },
    },
  },
};

export {linking};

export default function RootNavigator() {
  const isAuthenticated = useAppSelector(selectIsAuthenticated);

  return (
    <Stack.Navigator screenOptions={{headerShown: false}}>
      {!isAuthenticated ? (
        <Stack.Screen name="Auth" component={AuthScreen} />
      ) : (
        <>
          <Stack.Screen name="Main" component={MainTabs} />
          <Stack.Screen name="Revision" component={RevisionScreen} />
        </>
      )}
    </Stack.Navigator>
  );
}
