import React from 'react';
import {
  createBottomTabNavigator,
  BottomTabBarProps,
} from '@react-navigation/bottom-tabs';
import {getFocusedRouteNameFromRoute} from '@react-navigation/native';
import BottomNav from '../components/shared/BottomNav';
import HomeScreen from '../screens/HomeScreen';
import MemorizationStack from './MemorizationStack';
import PlanScreen from '../screens/PlanScreen';
import SettingsScreen from '../screens/SettingsScreen';
import {colors} from '../styles/colors';

const Tab = createBottomTabNavigator();

// MemorizationScreen (the full-screen QuranViewer) is nested inside the
// MemorizationStack tab, so React Navigation keeps this tab's bar mounted
// by default — hide it explicitly to match design.md's "no BottomNav on
// QuranViewer" requirement.
const renderTabBar = (props: BottomTabBarProps) => {
  const activeRoute = props.state.routes[props.state.index];
  const focusedRouteName =
    getFocusedRouteNameFromRoute(activeRoute) ?? activeRoute.name;
  if (focusedRouteName === 'MemorizationScreen') {
    return null;
  }
  return <BottomNav {...props} />;
};

export default function MainTabs() {
  return (
    <Tab.Navigator
      screenOptions={{headerShown: false}}
      sceneContainerStyle={{backgroundColor: colors.background}}
      tabBar={renderTabBar}>
      <Tab.Screen name="Home" component={HomeScreen} />
      <Tab.Screen name="MemorizationStack" component={MemorizationStack} />
      <Tab.Screen name="Plan" component={PlanScreen} />
      <Tab.Screen name="Settings" component={SettingsScreen} />
    </Tab.Navigator>
  );
}
