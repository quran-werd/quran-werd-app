import React from 'react';
import {View, StyleSheet} from 'react-native';
import {useTranslation} from 'react-i18next';
import {colors} from '../../styles/colors';
import {radius} from '../../styles/radius';
import {toArabicNumerals} from '../../content';
import Typography from './Typography';

interface VerseRangeRowProps {
  verseNumber: number;
  tone: 'from' | 'to' | 'single';
  text: string | null;
}

export default function VerseRangeRow({
  verseNumber,
  tone,
  text,
}: VerseRangeRowProps) {
  const {t} = useTranslation();
  const isTo = tone === 'to';
  const label = isTo ? t('common.to') : t(`common.${tone}`);

  return (
    <View style={styles.row}>
      <View
        style={[
          styles.badge,
          isTo ? styles.badgeTo : styles.badgeFrom,
        ]}>
        <Typography
          family="cairo"
          weight="bold"
          style={isTo ? styles.badgeTextTo : styles.badgeTextFrom}>
          {toArabicNumerals(verseNumber)}
        </Typography>
      </View>
      <Typography family="cairo" style={styles.label}>
        {label}
      </Typography>
      {text ? (
        <Typography
          family="amiriQuran"
          numberOfLines={1}
          style={styles.text}>
          {text}
        </Typography>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  badge: {
    width: 20,
    height: 20,
    borderRadius: radius.full,
    alignItems: 'center',
    justifyContent: 'center',
  },
  badgeFrom: {
    backgroundColor: 'rgba(196,154,60,0.12)',
  },
  badgeTo: {
    backgroundColor: colors.mutedTintSubtle,
  },
  badgeTextFrom: {
    color: colors.primary,
    fontSize: 8,
    lineHeight: 20,
  },
  badgeTextTo: {
    color: colors.mutedForeground,
    fontSize: 8,
    lineHeight: 20,
  },
  label: {
    fontSize: 10,
    color: colors.mutedForeground,
  },
  text: {
    flex: 1,
    fontSize: 12,
    color: colors.dimmedForeground,
  },
});
