import React from 'react';
import {View, Text, StyleSheet, ViewStyle} from 'react-native';
import {colors} from '../../../styles/colors';

interface IconProps {
  children: React.ReactNode;
  size?: number;
  backgroundColor?: string;
  color?: string;
  style?: ViewStyle;
  circular?: boolean;
}

export default function Icon({
  children,
  size = 32,
  backgroundColor = colors.light,
  color = colors.primary,
  style,
  circular = false,
}: IconProps) {
  return (
    <View
      style={[
        styles.container,
        {
          width: size,
          height: size,
          backgroundColor,
          borderRadius: circular ? size / 2 : 8,
        },
        style,
      ]}>
      <Text style={[styles.icon, {color, fontSize: size * 0.5}]}>
        {children}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  icon: {
    textAlign: 'center',
  },
});
