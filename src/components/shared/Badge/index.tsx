import React from 'react';
import {View, Text, StyleSheet, ViewStyle} from 'react-native';
import {colors} from '../../../styles/colors';

interface BadgeProps {
  children: React.ReactNode;
  variant?: 'primary' | 'secondary' | 'light';
  size?: 'small' | 'medium' | 'large';
  style?: ViewStyle;
  textColor?: string;
}

export default function Badge({
  children,
  variant = 'light',
  size = 'medium',
  style,
  textColor,
}: BadgeProps) {
  const getVariantStyles = () => {
    switch (variant) {
      case 'primary':
        return {
          backgroundColor: colors.primary,
          textColor: colors.white,
        };
      case 'secondary':
        return {
          backgroundColor: colors.secondary,
          textColor: colors.white,
        };
      case 'light':
      default:
        return {
          backgroundColor: colors.light,
          textColor: colors.primary,
        };
    }
  };

  const getSizeStyles = () => {
    switch (size) {
      case 'small':
        return {
          paddingHorizontal: 6,
          paddingVertical: 3,
          fontSize: 10,
          borderRadius: 4,
        };
      case 'large':
        return {
          paddingHorizontal: 12,
          paddingVertical: 8,
          fontSize: 14,
          borderRadius: 10,
        };
      case 'medium':
      default:
        return {
          paddingHorizontal: 10,
          paddingVertical: 6,
          fontSize: 12,
          borderRadius: 8,
        };
    }
  };

  const variantStyles = getVariantStyles();
  const sizeStyles = getSizeStyles();

  return (
    <View
      style={[
        styles.container,
        {
          backgroundColor: variantStyles.backgroundColor,
          paddingHorizontal: sizeStyles.paddingHorizontal,
          paddingVertical: sizeStyles.paddingVertical,
          borderRadius: sizeStyles.borderRadius,
        },
        style,
      ]}>
      <Text
        style={[
          styles.text,
          {
            fontSize: sizeStyles.fontSize,
            color: textColor || variantStyles.textColor,
          },
        ]}>
        {children}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  text: {
    fontWeight: '700',
    textAlign: 'center',
  },
});
