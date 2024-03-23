import React from 'react';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import Chapters from '../components/Chapters';
import {BottomTabsScreenOptionsType} from '../types/react-navigation.types';

const Tab = createBottomTabNavigator();

export default function BottomTabs() {
  return (
    <Tab.Navigator screenOptions={screenOptions}>
      <Tab.Screen name="Chapters" component={Chapters} />
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
