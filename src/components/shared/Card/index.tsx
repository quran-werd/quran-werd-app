import React from 'react';
import {View, TouchableOpacity, ViewStyle} from 'react-native';
import {colors} from '../../../styles/colors';
import {radius} from '../../../styles/radius';

interface CardProps {
  children: React.ReactNode;
  onPress?: () => void;
  style?: ViewStyle | ViewStyle[];
  padding?: number;
  backgroundColor?: string;
  borderRadius?: number;
}

// Thin, style-agnostic base — each consumer supplies its own design.md
// recipe (SurahCard, RangeCard, Werd Card, etc.) via `style`.
export default function Card({
  children,
  onPress,
  style,
  padding = 16,
  backgroundColor = colors.card,
  borderRadius = radius.xl,
}: CardProps) {
  const cardStyle = [{padding, backgroundColor, borderRadius}, style];

  if (onPress) {
    return (
      <TouchableOpacity style={cardStyle} onPress={onPress} activeOpacity={0.85}>
        {children}
      </TouchableOpacity>
    );
  }

  return <View style={cardStyle}>{children}</View>;
}
