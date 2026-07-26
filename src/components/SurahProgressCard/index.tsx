import React, {useMemo, useState} from 'react';
import {View, StyleSheet} from 'react-native';
import {useTranslation} from 'react-i18next';
import Card from '../shared/Card';
import Typography from '../shared/Typography';
import {colors} from '../../styles/colors';
import {MemorizationVerseRange} from '../../types/memorization.types';
import MemorizedRangeItem from '../MemorizedRangeItem';
import SurahNumber from './components/SurahNumber';
import ProgressInfo from './components/ProgressInfo';
import {SURAHS_INFO} from '../../content';
import {
  getMemorizedPercentageFromRanges,
  getMemorizedVersesCountFromRanges,
} from '../../utils/helpers.utils';

interface SurahProgressCardProps {
  ranges: MemorizationVerseRange[];
  surahNumber: number;
  onDeleteRange?: (range: MemorizationVerseRange) => void;
}

export default function SurahProgressCard({
  surahNumber,
  ranges,
  onDeleteRange,
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

  const surahInfo = useMemo(() => SURAHS_INFO[surahNumber - 1], [surahNumber]);

  const surahType =
    surahInfo.place === 'Makkah'
      ? t('memorization.surah.makkiyah')
      : t('memorization.surah.madaniyah');

  return (
    <Card style={styles.container} margin={8}>
      <Card
        onPress={() => setIsExpanded(!isExpanded)}
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
            <MemorizedRangeItem
              key={`${range.from}-${range.to}`}
              range={{
                id: `${surahNumber}-${range.from}-${range.to}`,
                startVerse: range.from,
                endVerse: range.to,
                startText: '',
                endText: '',
                wordsCount: 0,
                versesCount: range.to - range.from + 1,
                chapterNumber: surahNumber,
              }}
              surahNumber={surahNumber}
              showDeleteButton={!!onDeleteRange}
              onDelete={() => onDeleteRange?.(range)}
            />
          ))}
        </View>
      )}
    </Card>
  );
}

const styles = StyleSheet.create({
  container: {padding: 0},
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
  surahInfo: {flex: 1},
  surahNameArabic: {marginBottom: 2},
  surahType: {marginBottom: 4},
  expandIcon: {textAlign: 'center'},
  expandedContent: {
    paddingHorizontal: 16,
    paddingBottom: 16,
    borderTopWidth: 1,
    borderTopColor: colors.border,
  },
  rangesTitle: {marginBottom: 12, marginTop: 8},
});
