import React from 'react';
import {View, StyleSheet, Text} from 'react-native';
import {useTranslation} from 'react-i18next';
import {colors} from '../../styles/colors';
import {MemorizedRange} from '../../types/memorization.types';
import Card from '../shared/Card';
import Typography from '../shared/Typography';
import Badge from '../shared/Badge';

interface MemorizedRangeItemProps {
  range: MemorizedRange;
}

export default function MemorizedRangeItem({range}: MemorizedRangeItemProps) {
  const {t} = useTranslation();

  return (
    <Card style={styles.container} padding={12} margin={8} shadow={false}>
      <View style={styles.rangeHeader}>
        <Badge variant="light" size="medium" style={styles.rangeBadge}>
          <Typography variant="small" weight="bold" color="primary">
            {t('memorization.surah.verseRange', {
              startVerse: range.startVerse,
              endVerse: range.endVerse,
            })}
          </Typography>
        </Badge>
        <View style={styles.stats}>
          <Typography
            variant="small"
            color="secondary"
            style={styles.wordCount}>
            {t('memorization.surah.wordCount', {count: range.wordCount})}
          </Typography>
          <Typography
            variant="small"
            color="secondary"
            style={styles.verseCount}>
            {t('memorization.surah.verseCountShort', {count: range.verseCount})}
          </Typography>
        </View>
      </View>
      <View style={styles.textContainer}>
        <Typography
          variant="caption"
          style={styles.startText}
          numberOfLines={1}
          ellipsizeMode="tail">
          <Text style={styles.prefixText}>
            {t('memorization.surah.from')}
            {': '}
          </Text>
          {range.startText}
        </Typography>
        <Typography
          variant="caption"
          style={styles.endText}
          numberOfLines={1}
          ellipsizeMode="tail">
          <Text style={styles.prefixText}>
            {t('memorization.surah.to')}
            {': '}
          </Text>
          {range.endText}
        </Typography>
      </View>
    </Card>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.background,
  },
  rangeHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  rangeBadge: {
    // Badge component handles styling
  },
  stats: {
    flexDirection: 'row',
    gap: 8,
  },
  wordCount: {
    // Typography component handles styling
  },
  verseCount: {
    // Typography component handles styling
  },
  textContainer: {
    gap: 6,
    marginTop: 4,
  },
  startText: {
    // Typography component handles styling
  },
  endText: {
    // Typography component handles styling
  },
  prefixText: {
    color: colors.text.light,
  },
});
