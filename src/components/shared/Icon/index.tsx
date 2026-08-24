import React from 'react';
import {View, StyleSheet, ViewStyle} from 'react-native';
import {Icon as EvaIcon} from '@ui-kitten/components';
import {colors} from '../../../styles/colors';

interface IconProps {
  name?: string;
  children?: React.ReactNode;
  size?: number;
  backgroundColor?: string;
  color?: string;
  style?: ViewStyle;
  circular?: boolean;
}

export default function Icon({
  name,
  children,
  size = 32,
  backgroundColor = colors.mutedTintSubtle,
  color = colors.primary,
  style,
  circular = false,
}: IconProps) {
  const iconSize = size * 0.55;

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
      {name ? (
        <EvaIcon
          name={name}
          style={{width: iconSize, height: iconSize, tintColor: color}}
        />
      ) : (
        children
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
    alignItems: 'center',
  },
});
