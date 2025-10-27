import React from 'react';
import {Text, StyleSheet} from 'react-native';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import {useTranslation} from 'react-i18next';
import {BottomTabsScreenOptionsType} from '../types/react-navigation.types';
import {colors} from '../styles/colors';
import ChaptersStack from './ChaptersStack';
import QuranPagerStack from './QuranPagerStack';
import MemorizationProgress from '../screens/MemorizationProgress';

const Tab = createBottomTabNavigator();

// Icon components
const ChaptersIcon = ({focused}: {focused: boolean}) => (
  <Text style={focused ? iconStyles.iconFocused : iconStyles.iconUnfocused}>
    📖
  </Text>
);

const QuranIcon = ({focused}: {focused: boolean}) => (
  <Text style={focused ? iconStyles.iconFocused : iconStyles.iconUnfocused}>
    📖
  </Text>
);

const ProgressIcon = ({focused}: {focused: boolean}) => (
  <Text style={focused ? iconStyles.iconFocused : iconStyles.iconUnfocused}>
    📊
  </Text>
);

export default function BottomTabs() {
  const {t} = useTranslation();

  return (
    <Tab.Navigator screenOptions={screenOptions}>
      <Tab.Screen
        name="ChaptersStack"
        component={ChaptersStack}
        options={{
          title: t('tabs.chapters'),
          tabBarIcon: ChaptersIcon,
        }}
      />
      <Tab.Screen
        name="QuranPagerStack"
        component={QuranPagerStack}
        options={{
          title: 'Quran',
          tabBarIcon: QuranIcon,
        }}
      />
      <Tab.Screen
        name="MemorizationProgress"
        component={MemorizationProgress}
        options={{
          title: t('tabs.progress'),
          tabBarIcon: ProgressIcon,
        }}
      />
    </Tab.Navigator>
  );
}

const screenOptions: BottomTabsScreenOptionsType = () => ({
  headerShown: false,
  tabBarStyle: {
    backgroundColor: colors.white,
    borderTopWidth: 1,
    borderTopColor: colors.border,
    paddingTop: 8,
    paddingBottom: 8,
    height: 60,
    shadowColor: colors.shadow,
    shadowOffset: {
      width: 0,
      height: -2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
  },
  tabBarActiveTintColor: colors.primary,
  tabBarInactiveTintColor: colors.text.light,
  tabBarLabelStyle: {
    fontSize: 12,
    fontWeight: '600',
    marginTop: 4,
  },
});

const iconStyles = StyleSheet.create({
  iconFocused: {
    fontSize: 20,
    opacity: 1,
  },
  iconUnfocused: {
    fontSize: 20,
    opacity: 0.6,
  },
});
