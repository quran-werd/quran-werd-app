import React from 'react';
import {View, Pressable, StyleSheet} from 'react-native';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {BlurView} from 'expo-blur';
import {BottomTabBarProps} from '@react-navigation/bottom-tabs';
import {useTranslation} from 'react-i18next';
import {colors} from '../../../styles/colors';
import {radius} from '../../../styles/radius';
import Typography from '../Typography';
import {
  HomeIcon,
  BookIcon,
  CalendarIcon,
  SettingsIcon,
} from '../icons/NavIcons';

const ICONS: Record<string, (props: {active: boolean}) => React.ReactElement> =
  {
    Home: ({active}) => <HomeIcon active={active} />,
    MemorizationStack: ({active}) => <BookIcon active={active} />,
    Plan: ({active}) => <CalendarIcon active={active} />,
    Settings: ({active}) => <SettingsIcon active={active} />,
  };

const LABEL_KEYS: Record<string, string> = {
  Home: 'tabs.home',
  MemorizationStack: 'tabs.memorization',
  Plan: 'tabs.plan',
  Settings: 'tabs.settings',
};

// Floating blurred pill bottom nav — see docs/design.md §2.1.
export default function BottomNav({state, navigation}: BottomTabBarProps) {
  const {t} = useTranslation();
  const insets = useSafeAreaInsets();

  return (
    <View style={[styles.wrap, {marginBottom: insets.bottom + 12}]}>
      <BlurView intensity={30} tint="dark" style={styles.blur}>
        <View style={styles.tabsRow}>
          {state.routes.map((route, index) => {
            const focused = state.index === index;
            const IconComponent = ICONS[route.name];

            const onPress = () => {
              const event = navigation.emit({
                type: 'tabPress',
                target: route.key,
                canPreventDefault: true,
              });
              if (!focused && !event.defaultPrevented) {
                navigation.navigate(route.name);
              }
            };

            return (
              <Pressable key={route.key} onPress={onPress} style={styles.tab}>
                {IconComponent ? <IconComponent active={focused} /> : null}
                <Typography
                  variant="caption"
                  family="cairo"
                  weight={focused ? 'semibold' : 'regular'}
                  color={focused ? 'primary' : 'muted'}
                  style={[styles.label, !focused && styles.labelInactive]}>
                  {t(LABEL_KEYS[route.name] ?? route.name)}
                </Typography>
              </Pressable>
            );
          })}
        </View>
      </BlurView>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    backgroundColor: colors.background,
    marginHorizontal: 16,
    borderRadius: radius.xl,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: colors.goldBorderFaint,
  },
  blur: {
    backgroundColor: 'rgba(19,29,48,0.97)',
  },
  tabsRow: {
    flexDirection: 'row',
    paddingTop: 8,
  },
  tab: {
    flex: 1,
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 12,
    paddingVertical: 4,
  },
  label: {
    fontSize: 10,
  },
  labelInactive: {
    opacity: 0.45,
  },
});
