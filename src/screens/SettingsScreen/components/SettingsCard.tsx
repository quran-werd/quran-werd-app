import React from 'react';
import {View, StyleSheet, StyleProp, ViewStyle} from 'react-native';
import {colors} from '../../../styles/colors';
import {radius} from '../../../styles/radius';

interface SettingsCardProps {
  children: React.ReactNode;
  style?: StyleProp<ViewStyle>;
}

export default function SettingsCard({children, style}: SettingsCardProps) {
  return <View style={[styles.card, style]}>{children}</View>;
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: 'rgba(19,29,48,0.85)',
    borderRadius: radius.lg,
    borderWidth: 1,
    borderColor: colors.goldBorderSubtle,
    overflow: 'hidden',
  },
});
