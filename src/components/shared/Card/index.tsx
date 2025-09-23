import React from 'react';
import {View, StyleSheet, TouchableOpacity, ViewStyle} from 'react-native';
import {colors} from '../../../styles/colors';

interface CardProps {
  children: React.ReactNode;
  onPress?: () => void;
  style?: ViewStyle;
  padding?: number;
  margin?: number;
  shadow?: boolean;
  borderRadius?: number;
}

export default function Card({
  children,
  onPress,
  style,
  padding = 16,
  margin = 8,
  shadow = true,
  borderRadius = 16,
}: CardProps) {
  const cardStyle = [
    styles.container,
    {
      padding,
      marginVertical: margin,
      borderRadius,
      ...(shadow && styles.shadow),
    },
    style,
  ];

  if (onPress) {
    return (
      <TouchableOpacity style={cardStyle} onPress={onPress} activeOpacity={0.8}>
        {children}
      </TouchableOpacity>
    );
  }

  return <View style={cardStyle}>{children}</View>;
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.white,
  },
  shadow: {
    shadowColor: colors.shadow,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 2,
  },
});
