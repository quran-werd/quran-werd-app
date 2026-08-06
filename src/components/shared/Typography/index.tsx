import React from 'react';
import {Text, TextStyle, StyleProp} from 'react-native';
import {colors} from '../../../styles/colors';
import {
  fontFamilies,
  typographyScale,
  getLineHeight,
  TypographyLevel,
  TypographyFamily,
} from '../../../styles/typography';

type Variant = TypographyLevel;
type Family = TypographyFamily;
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
  const fontSize = typographyScale[variant];
  const lineHeight = getLineHeight(fontSize, family);

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
