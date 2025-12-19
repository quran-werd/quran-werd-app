import React from 'react';
import {View, StyleSheet} from 'react-native';
import {useTranslation} from 'react-i18next';
import Card from '../shared/Card';
import Typography from '../shared/Typography';
import Badge from '../shared/Badge';
import {colors} from '../../styles/colors';
import {SurahProgress} from '../../types/memorization.types';
import MemorizedRangeItem from '../MemorizedRangeItem';
import SurahNumber from './components/SurahNumber';
import ProgressInfo from './components/ProgressInfo';

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
        <View style={styles.surahTypeContainer}>
          <SurahNumber surahNumber={surah.number} />

          <View style={styles.surahInfo}>
            <Typography variant="h3" style={styles.surahNameArabic}>
              {surah.nameArabic}
            </Typography>
            <Typography variant="small" color="light" style={styles.surahType}>
              {surahType}
            </Typography>
          </View>
        </View>

        <ProgressInfo
          progressPercentage={progressPercentage}
          memorizedVerses={surah.memorizedVerses}
        />

        <Typography variant="small" color="light" style={styles.expandIcon}>
          {surah.isExpanded ? '▲' : '▼'}
        </Typography>
      </Card>

      {surah.isExpanded && surah.memorizedRanges.length > 0 && (
        <View style={styles.expandedContent}>
          {/* <Typography variant="h3" style={styles.rangesTitle}>
            {t('memorization.surah.memorizedRanges')}
          </Typography> */}
          {surah.memorizedRanges.map(range => (
            <MemorizedRangeItem key={range.id} range={range} />
          ))}
          {/* <View style={styles.summary}>
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
          </View> */}
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
    justifyContent: 'space-between',
    gap: 16,
  },
  surahTypeContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
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
