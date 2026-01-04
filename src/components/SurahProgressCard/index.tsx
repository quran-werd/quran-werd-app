import React, {useMemo, useState} from 'react';
import {View, StyleSheet} from 'react-native';
import {useTranslation} from 'react-i18next';
import Card from '../shared/Card';
import Typography from '../shared/Typography';
import {colors} from '../../styles/colors';
import {MemorizedRange} from '../../types/memorization.types';
import MemorizedRangeItem from '../MemorizedRangeItem';
import SurahNumber from './components/SurahNumber';
import ProgressInfo from './components/ProgressInfo';
import {SURAHS_INFO} from '../../content';
import {
  getMemorizedPercentageFromRanges,
  getMemorizedVersesCountFromRanges,
} from '../../utils/helpers.utils';

interface SurahProgressCardProps {
  ranges: MemorizedRange[];
  surahNumber: number;
}

export default function SurahProgressCard({
  surahNumber,
  ranges,
}: SurahProgressCardProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  const {t} = useTranslation();

  const progressPercentage = useMemo(
    () => getMemorizedPercentageFromRanges(surahNumber, ranges),
    [surahNumber, ranges],
  );

  const memorizedVersesCount = useMemo(
    () => getMemorizedVersesCountFromRanges(ranges),
    [ranges],
  );

  const surahInfo = useMemo(() => SURAHS_INFO[surahNumber], [surahNumber]);

  const surahType =
    surahInfo.place === 'Makkah'
      ? t('memorization.surah.makkiyah')
      : t('memorization.surah.madaniyah');

  const handleToggleExpansion = () => setIsExpanded(!isExpanded);

  return (
    <Card style={styles.container} margin={8}>
      <Card
        onPress={handleToggleExpansion}
        style={styles.header}
        padding={16}
        margin={0}
        shadow={false}>
        <View style={styles.surahTypeContainer}>
          <SurahNumber surahNumber={surahNumber} />

          <View style={styles.surahInfo}>
            <Typography variant="h3" style={styles.surahNameArabic}>
              {surahInfo.arabic}
            </Typography>
            <Typography variant="small" color="light" style={styles.surahType}>
              {surahType}
            </Typography>
          </View>
        </View>

        <ProgressInfo
          progressPercentage={progressPercentage}
          memorizedVerses={memorizedVersesCount}
        />

        <Typography variant="small" color="light" style={styles.expandIcon}>
          {isExpanded ? '▲' : '▼'}
        </Typography>
      </Card>

      {isExpanded && ranges.length > 0 && (
        <View style={styles.expandedContent}>
          <Typography variant="h3" style={styles.rangesTitle}>
            {t('memorization.surah.memorizedRanges')}
          </Typography>

          {ranges.map(range => (
            <MemorizedRangeItem key={range.startVerse} range={range} />
          ))}

          <View style={styles.summary}>
            <Typography
              variant="caption"
              weight="normal"
              color="primary"
              align="center"
              style={styles.summaryText}>
              {t('memorization.surah.rangesSummary', {
                rangeCount: ranges.length,
                memorized: memorizedVersesCount,
                total: surahInfo.aya,
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
