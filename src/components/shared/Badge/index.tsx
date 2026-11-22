import React from 'react';
import {View, Text, ViewStyle, TextStyle} from 'react-native';
import {colors} from '../../../styles/colors';
import {radius} from '../../../styles/radius';
import {fontFamilies} from '../../../styles/typography';

interface BadgeProps {
  children: React.ReactNode;
  size?: number;
  backgroundColor?: string;
  borderColor?: string;
  textColor?: string;
  fontSize?: number;
  style?: ViewStyle;
  textStyle?: TextStyle;
}

// Thin circular/pill container — each consumer supplies its exact
// design.md recipe (surah number badge, verse number badge, range circle,
// today-werd label pill, etc.) via props/style rather than a variant enum.
export default function Badge({
  children,
  size = 24,
  backgroundColor = colors.goldTintMedium,
  borderColor,
  textColor = colors.primary,
  fontSize = 11,
  style,
  textStyle,
}: BadgeProps) {
  return (
    <View
      style={[
        {
          width: size,
          height: size,
          borderRadius: radius.full,
          backgroundColor,
          borderWidth: borderColor ? 1 : 0,
          borderColor,
          alignItems: 'center',
          justifyContent: 'center',
        },
        style,
      ]}>
      <Text
        style={[
          {
            fontFamily: fontFamilies.cairo.bold,
            fontSize,
            color: textColor,
            textAlign: 'center',
          },
          textStyle,
        ]}>
        {children}
      </Text>
    </View>
  );
}
