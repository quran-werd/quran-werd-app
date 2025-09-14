import React from 'react';
import {Text} from 'react-native';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import {BottomTabsScreenOptionsType} from '../types/react-navigation.types';
import ChaptersStack from './ChaptersStack';
import MemorizationProgress from '../screens/MemorizationProgress';

const Tab = createBottomTabNavigator();

export default function BottomTabs() {
  return (
    <Tab.Navigator screenOptions={screenOptions}>
      <Tab.Screen
        name="ChaptersStack"
        component={ChaptersStack}
        options={{
          title: 'السور',
          tabBarIcon: () => <Text style={{fontSize: 20}}>📖</Text>,
        }}
      />
      <Tab.Screen
        name="MemorizationProgress"
        component={MemorizationProgress}
        options={{
          title: 'التقدم',
          tabBarIcon: () => <Text style={{fontSize: 20}}>📊</Text>,
        }}
      />
    </Tab.Navigator>
  );
}

const screenOptions: BottomTabsScreenOptionsType = ({route}) => ({
  tabBarIcon: ({focused, color, size}) => {
    // You can return any component that you like here!
    return null;
  },
  headerShown: false,
  tabBarStyle: {
    backgroundColor: '#343a40',
  },
  tabBarActiveTintColor: 'tomato',
  tabBarInactiveTintColor: 'gray',
});
