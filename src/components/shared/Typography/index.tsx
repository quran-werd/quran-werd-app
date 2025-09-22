import React from 'react';
import {Text, StyleSheet, TextStyle} from 'react-native';
import {colors} from '../../../styles/colors';

interface TypographyProps {
  children: React.ReactNode;
  variant?: 'h1' | 'h2' | 'h3' | 'body' | 'caption' | 'small';
  color?: 'primary' | 'secondary' | 'light' | 'white';
  weight?: 'normal' | 'medium' | 'semibold' | 'bold';
  align?: 'left' | 'center' | 'right';
  style?: TextStyle;
  numberOfLines?: number;
  ellipsizeMode?: 'head' | 'middle' | 'tail' | 'clip';
}

export default function Typography({
  children,
  variant = 'body',
  color = 'primary',
  weight = 'normal',
  align = 'left',
  style,
  numberOfLines,
  ellipsizeMode,
}: TypographyProps) {
  const getVariantStyles = () => {
    switch (variant) {
      case 'h1':
        return {
          fontSize: 24,
          fontWeight: '700',
          lineHeight: 32,
        };
      case 'h2':
        return {
          fontSize: 20,
          fontWeight: '600',
          lineHeight: 28,
        };
      case 'h3':
        return {
          fontSize: 18,
          fontWeight: '600',
          lineHeight: 24,
        };
      case 'body':
        return {
          fontSize: 16,
          fontWeight: '400',
          lineHeight: 22,
        };
      case 'caption':
        return {
          fontSize: 14,
          fontWeight: '400',
          lineHeight: 20,
        };
      case 'small':
        return {
          fontSize: 12,
          fontWeight: '400',
          lineHeight: 16,
        };
      default:
        return {
          fontSize: 16,
          fontWeight: '400',
          lineHeight: 22,
        };
    }
  };

  const getColorStyles = () => {
    switch (color) {
      case 'primary':
        return colors.text.primary;
      case 'secondary':
        return colors.text.secondary;
      case 'light':
        return colors.text.light;
      case 'white':
        return colors.white;
      default:
        return colors.text.primary;
    }
  };

  const getWeightStyles = () => {
    switch (weight) {
      case 'normal':
        return '400';
      case 'medium':
        return '500';
      case 'semibold':
        return '600';
      case 'bold':
        return '700';
      default:
        return '400';
    }
  };

  const variantStyles = getVariantStyles();
  const colorValue = getColorStyles();
  const fontWeight = getWeightStyles();

  return (
    <Text
      style={[
        styles.text,
        {
          fontSize: variantStyles.fontSize,
          fontWeight: fontWeight,
          lineHeight: variantStyles.lineHeight,
          color: colorValue,
          textAlign: align,
        },
        style,
      ]}
      numberOfLines={numberOfLines}
      ellipsizeMode={ellipsizeMode}>
      {children}
    </Text>
  );
}

const styles = StyleSheet.create({
  text: {
    fontFamily: 'System',
  },
});
