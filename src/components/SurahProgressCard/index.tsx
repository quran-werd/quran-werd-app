import React from 'react';
import {View, StyleSheet} from 'react-native';
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
  const progressPercentage = Math.round(
    (surah.memorizedVerses / surah.totalVerses) * 100,
  );
  const arabicType = surah.type === 'Makkiyah' ? 'مكية' : 'مدنية';

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
          <Typography variant="small" color="light" style={styles.surahType}>
            {arabicType}
          </Typography>
          <Typography
            variant="caption"
            color="secondary"
            style={styles.verseCount}>
            آية {surah.memorizedVerses} / {surah.totalVerses}
          </Typography>
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
            آية محفوظة {surah.memorizedVerses}
          </Typography>
          <Typography variant="small" color="light" style={styles.expandIcon}>
            {surah.isExpanded ? '▲' : '▼'}
          </Typography>
        </View>
      </Card>

      {surah.isExpanded && surah.memorizedRanges.length > 0 && (
        <View style={styles.expandedContent}>
          <Typography variant="h3" style={styles.rangesTitle}>
            النطاقات المحفوظة
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
              مجموع النطاقات : {surah.memorizedRanges.length} • آيات محفوظة{' '}
              {surah.memorizedVerses} من {surah.totalVerses}
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
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
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
