import React from 'react';
import {createStackNavigator} from '@react-navigation/stack';
import MemorizationProgress from '../screens/MemorizationProgress';
import MemorizationSelection from '../screens/MemorizationSelection';
import type {NativeStackScreenProps} from '@react-navigation/native-stack';

export type MemorizationStackParamList = {
  MemorizationProgress: undefined;
  MemorizationSelection: {initialPage?: number};
};

export type MemorizationProgressProps = NativeStackScreenProps<
  MemorizationStackParamList,
  'MemorizationProgress'
>;

export type MemorizationSelectionProps = NativeStackScreenProps<
  MemorizationStackParamList,
  'MemorizationSelection'
>;

const Stack = createStackNavigator<MemorizationStackParamList>();

function MemorizationStack() {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="MemorizationProgress"
        component={MemorizationProgress}
        options={{
          headerShown: false,
        }}
      />
      <Stack.Screen
        name="MemorizationSelection"
        component={MemorizationSelection}
        options={{
          headerShown: false,
        }}
      />
    </Stack.Navigator>
  );
}

export default MemorizationStack;
