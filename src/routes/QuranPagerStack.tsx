import React from 'react';
import {createStackNavigator} from '@react-navigation/stack';
import QuranPager from '../components/QuranPager';

type QuranPagerStackParamList = {
  Pager: {initialPage?: number};
};

const Stack = createStackNavigator<QuranPagerStackParamList>();

export default function QuranPagerStack() {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: true,
        headerTitle: 'Quran',
        headerStyle: {
          backgroundColor: '#FFFCE7',
        },
        headerTintColor: '#333',
      }}>
      <Stack.Screen
        name="Pager"
        component={QuranPager}
        options={{headerShown: false}}
      />
    </Stack.Navigator>
  );
}
