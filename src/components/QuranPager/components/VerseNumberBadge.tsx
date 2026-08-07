import React from 'react';
import {View, Text, StyleSheet} from 'react-native';
import {colors} from '../../../styles/colors';
import {radius} from '../../../styles/radius';
import {fontFamilies} from '../../../styles/typography';

export type BadgeState = 'normal' | 'pending' | 'endpoint';

interface VerseNumberBadgeProps {
  number: number;
  state: BadgeState;
}

export default function VerseNumberBadge({
  number,
  state,
}: VerseNumberBadgeProps) {
  const badgeStyle =
    state === 'pending'
      ? styles.verseBadge_pending
      : state === 'endpoint'
        ? styles.verseBadge_endpoint
        : styles.verseBadge_normal;
  const textStyle =
    state === 'pending'
      ? styles.verseBadgeText_pending
      : state === 'endpoint'
        ? styles.verseBadgeText_endpoint
        : styles.verseBadgeText_normal;

  return (
    <View style={[styles.verseBadge, badgeStyle]}>
      <Text style={[styles.verseBadgeText, textStyle]}>{number}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  verseBadge: {
    width: 22,
    height: 22,
    borderRadius: radius.full,
    alignItems: 'center',
    justifyContent: 'center',
    marginHorizontal: 4,
  },
  verseBadge_normal: {
    borderWidth: 1,
    borderColor: 'rgba(139,105,20,0.4)',
  },
  verseBadge_pending: {
    borderWidth: 1.5,
    borderColor: 'rgba(196,154,60,0.7)',
  },
  verseBadge_endpoint: {
    backgroundColor: colors.rangeEndpointBg,
    borderWidth: 1.5,
    borderColor: colors.rangeEndpointBorder,
  },
  verseBadgeText: {
    fontFamily: fontFamilies.cairo.bold,
    fontSize: 10,
  },
  verseBadgeText_normal: {
    color: colors.mushafBrown,
  },
  verseBadgeText_pending: {
    color: colors.primary,
  },
  verseBadgeText_endpoint: {
    color: colors.rangeEndpointText,
  },
});
