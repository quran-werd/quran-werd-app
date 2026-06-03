import React from 'react';
import {Text, StyleSheet} from 'react-native';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import {useTranslation} from 'react-i18next';
import {colors} from '../styles/colors';
import HomeScreen from '../screens/HomeScreen';
import MemorizationStack from './MemorizationStack';
import PlanScreen from '../screens/PlanScreen';

const Tab = createBottomTabNavigator();

const HomeIcon = ({focused}: {focused: boolean}) => (
  <Text style={focused ? iconStyles.iconFocused : iconStyles.iconUnfocused}>
    🏠
  </Text>
);

const MemIcon = ({focused}: {focused: boolean}) => (
  <Text style={focused ? iconStyles.iconFocused : iconStyles.iconUnfocused}>
    📊
  </Text>
);

const PlanIcon = ({focused}: {focused: boolean}) => (
  <Text style={focused ? iconStyles.iconFocused : iconStyles.iconUnfocused}>
    📋
  </Text>
);

export default function MainTabs() {
  const {t} = useTranslation();

  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarStyle: styles.tabBar,
        tabBarActiveTintColor: colors.primary,
        tabBarInactiveTintColor: colors.text.light,
      }}>
      <Tab.Screen
        name="Home"
        component={HomeScreen}
        options={{
          title: t('tabs.home'),
          tabBarIcon: HomeIcon,
        }}
      />
      <Tab.Screen
        name="MemorizationStack"
        component={MemorizationStack}
        options={{
          title: t('tabs.memorization'),
          tabBarIcon: MemIcon,
        }}
      />
      <Tab.Screen
        name="Plan"
        component={PlanScreen}
        options={{
          title: t('tabs.plan'),
          tabBarIcon: PlanIcon,
        }}
      />
    </Tab.Navigator>
  );
}

const styles = StyleSheet.create({
  tabBar: {
    backgroundColor: colors.white,
    borderTopWidth: 1,
    borderTopColor: colors.border,
    height: 60,
    paddingTop: 8,
    paddingBottom: 8,
  },
});

const iconStyles = StyleSheet.create({
  iconFocused: {fontSize: 20, opacity: 1},
  iconUnfocused: {fontSize: 20, opacity: 0.6},
});
