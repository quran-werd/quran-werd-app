import React from 'react';
import {createStackNavigator} from '@react-navigation/stack';
import MyMemorizationsScreen from '../screens/MyMemorizationsScreen';
import MemorizationScreen from '../screens/MemorizationScreen';
import type {NativeStackScreenProps} from '@react-navigation/native-stack';

export type MemorizationStackParamList = {
  MyMemorizations: undefined;
  MemorizationScreen: {initialPage?: number};
};

export type MyMemorizationsScreenProps = NativeStackScreenProps<
  MemorizationStackParamList,
  'MyMemorizations'
>;

export type MemorizationScreenProps = NativeStackScreenProps<
  MemorizationStackParamList,
  'MemorizationScreen'
>;

const Stack = createStackNavigator<MemorizationStackParamList>();

export default function MemorizationStack() {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="MyMemorizations"
        component={MyMemorizationsScreen}
        options={{headerShown: false}}
      />
      <Stack.Screen
        name="MemorizationScreen"
        component={MemorizationScreen}
        options={{headerShown: false}}
      />
    </Stack.Navigator>
  );
}
