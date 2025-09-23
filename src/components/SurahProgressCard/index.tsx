import React from 'react';
import {View, StyleSheet} from 'react-native';
import {useTranslation} from 'react-i18next';
import Card from '../shared/Card';
import Typography from '../shared/Typography';
import Badge from '../shared/Badge';
import {colors} from '../../styles/colors';
import {SurahProgress} from '../../types/memorization.types';
import MemorizedRangeItem from '../MemorizedRangeItem';

interface SurahProgressCardProps {
  surah: SurahProgress;
  onToggleExpansion: (surahId: string) => void;
}

export default function SurahProgressCard({
  surah,
  onToggleExpansion,
}: SurahProgressCardProps) {
  const {t} = useTranslation();
  const progressPercentage = Math.round(
    (surah.memorizedVerses / surah.totalVerses) * 100,
  );
  const surahType =
    surah.type === 'Makkiyah'
      ? t('memorization.surah.makkiyah')
      : t('memorization.surah.madaniyah');

  return (
    <Card style={styles.container} margin={8}>
      <Card
        onPress={() => onToggleExpansion(surah.id)}
        style={styles.header}
        padding={16}
        margin={0}
        shadow={false}>
        <Badge variant="light" size="medium" style={styles.surahNumber}>
          <Typography variant="small" weight="semibold" color="primary">
            {surah.number}
          </Typography>
        </Badge>
        <View style={styles.surahInfo}>
          <Typography variant="h3" style={styles.surahNameArabic}>
            {surah.nameArabic}
          </Typography>
          <View style={styles.surahTypeContainer}>
            <Typography variant="small" color="light" style={styles.surahType}>
              {surahType}
            </Typography>
            <Typography variant="small" color="light" style={styles.surahType}>
              {t('memorization.surah.verseCount', {
                memorized: surah.memorizedVerses,
                total: surah.totalVerses,
              })}
            </Typography>
          </View>
        </View>
        <View style={styles.progressInfo}>
          <Typography
            variant="h2"
            color="primary"
            style={styles.progressPercentage}>
            {progressPercentage}%
          </Typography>
          <Typography
            variant="small"
            color="secondary"
            style={styles.memorizedVerses}>
            {t('memorization.surah.memorizedVerses', {
              count: surah.memorizedVerses,
            })}
          </Typography>
          <Typography variant="small" color="light" style={styles.expandIcon}>
            {surah.isExpanded ? '▲' : '▼'}
          </Typography>
        </View>
      </Card>

      {surah.isExpanded && surah.memorizedRanges.length > 0 && (
        <View style={styles.expandedContent}>
          <Typography variant="h3" style={styles.rangesTitle}>
            {t('memorization.surah.memorizedRanges')}
          </Typography>
          {surah.memorizedRanges.map(range => (
            <MemorizedRangeItem key={range.id} range={range} />
          ))}
          <View style={styles.summary}>
            <Typography
              variant="body"
              weight="medium"
              color="primary"
              align="center"
              style={styles.summaryText}>
              {t('memorization.surah.rangesSummary', {
                rangeCount: surah.memorizedRanges.length,
                memorized: surah.memorizedVerses,
                total: surah.totalVerses,
              })}
            </Typography>
          </View>
        </View>
      )}
    </Card>
  );
}

const styles = StyleSheet.create({
  container: {
    // Card component handles styling
    padding: 0,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  surahTypeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  surahNumber: {
    marginRight: 12,
  },
  surahInfo: {
    flex: 1,
  },
  surahNameArabic: {
    marginBottom: 2,
  },
  surahType: {
    marginBottom: 4,
  },
  verseCount: {
    // Typography component handles styling
  },
  progressInfo: {
    alignItems: 'flex-end',
    justifyContent: 'center',
  },
  progressPercentage: {
    marginBottom: 6,
  },
  memorizedVerses: {
    marginBottom: 8,
  },
  expandIcon: {
    textAlign: 'center',
  },
  expandedContent: {
    paddingHorizontal: 16,
    paddingBottom: 16,
    borderTopWidth: 1,
    borderTopColor: colors.border,
  },
  rangesTitle: {
    marginBottom: 12,
    marginTop: 8,
  },
  summary: {
    marginTop: 16,
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: colors.border,
  },
  summaryText: {
    // Typography component handles styling
  },
});
