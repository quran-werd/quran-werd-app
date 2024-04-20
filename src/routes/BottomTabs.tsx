import React from 'react';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import {BottomTabsScreenOptionsType} from '../types/react-navigation.types';
import ChaptersStack from './ChaptersStack';

const Tab = createBottomTabNavigator();

export default function BottomTabs() {
  return (
    <Tab.Navigator screenOptions={screenOptions}>
      <Tab.Screen name="ChaptersStack" component={ChaptersStack} />
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
