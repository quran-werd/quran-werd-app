import React from 'react';
import {Text, TextStyle, StyleProp} from 'react-native';
import {colors} from '../../../styles/colors';
import {fontFamilies} from '../../../styles/typography';

type Variant = 'h1' | 'h2' | 'h3' | 'body' | 'caption' | 'small';
type Family = 'amiriQuran' | 'amiri' | 'amiriBold' | 'cairo';
type Weight = 'light' | 'regular' | 'semibold' | 'bold';
type Color =
  | 'foreground'
  | 'muted'
  | 'primary'
  | 'destructive'
  | 'dimmed'
  | 'white';

interface TypographyProps {
  children: React.ReactNode;
  variant?: Variant;
  family?: Family;
  color?: Color;
  weight?: Weight;
  align?: 'left' | 'center' | 'right';
  style?: StyleProp<TextStyle>;
  numberOfLines?: number;
  ellipsizeMode?: 'head' | 'middle' | 'tail' | 'clip';
}

const VARIANT_SIZES: Record<Variant, {fontSize: number; lineHeight: number}> =
  {
    h1: {fontSize: 24, lineHeight: 32},
    h2: {fontSize: 20, lineHeight: 28},
    h3: {fontSize: 18, lineHeight: 24},
    body: {fontSize: 16, lineHeight: 22},
    caption: {fontSize: 14, lineHeight: 20},
    small: {fontSize: 12, lineHeight: 16},
  };

const COLOR_MAP: Record<Color, string> = {
  foreground: colors.foreground,
  muted: colors.mutedForeground,
  primary: colors.primary,
  destructive: colors.destructive,
  dimmed: colors.dimmedForeground,
  white: colors.white,
};

function resolveFontFamily(family: Family, weight: Weight): string {
  if (family === 'amiri') {
    return weight === 'bold' || weight === 'semibold'
      ? fontFamilies.amiriBold
      : fontFamilies.amiri;
  }
  if (family === 'amiriBold') {
    return fontFamilies.amiriBold;
  }
  if (family === 'amiriQuran') {
    return fontFamilies.amiriQuran;
  }
  switch (weight) {
    case 'light':
      return fontFamilies.cairo.light;
    case 'semibold':
      return fontFamilies.cairo.semibold;
    case 'bold':
      return fontFamilies.cairo.bold;
    default:
      return fontFamilies.cairo.regular;
  }
}

export default function Typography({
  children,
  variant = 'body',
  family = 'cairo',
  color = 'foreground',
  weight = 'regular',
  align = 'left',
  style,
  numberOfLines,
  ellipsizeMode,
}: TypographyProps) {
  const {fontSize, lineHeight} = VARIANT_SIZES[variant];

  return (
    <Text
      style={[
        {
          fontFamily: resolveFontFamily(family, weight),
          fontSize,
          lineHeight,
          color: COLOR_MAP[color],
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
