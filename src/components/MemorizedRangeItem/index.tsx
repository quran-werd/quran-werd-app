import React from 'react';
import {View, StyleSheet, Text} from 'react-native';
import {useTranslation} from 'react-i18next';
import {Icon, Button} from '@ui-kitten/components';
import {colors} from '../../styles/colors';
import {MemorizedRange} from '../../types/memorization.types';
import Card from '../shared/Card';
import Typography from '../shared/Typography';
import Badge from '../shared/Badge';
import {formatNumberWithCommas} from '../QuranPager/utils/verseSelection.utils';

interface MemorizedRangeItemProps {
  range: MemorizedRange;
  onDelete?: (rangeId: string) => void;
  showDeleteButton?: boolean;
}

const CloseIcon = (props: any) => <Icon {...props} name="close-outline" />;

export default function MemorizedRangeItem({
  range,
  onDelete,
  showDeleteButton = false,
}: MemorizedRangeItemProps) {
  const {t} = useTranslation();

  const handleDelete = () => {
    if (onDelete) {
      onDelete(range.id);
    }
  };

  return (
    <Card style={styles.container} padding={12} margin={8} shadow={false}>
      <View style={styles.rangeHeader}>
        <View style={styles.headerLeft}>
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
              {t('memorization.surah.wordCount', {
                count: formatNumberWithCommas(range.wordCount),
              })}
            </Typography>
            <Typography
              variant="small"
              color="secondary"
              style={styles.verseCount}>
              {t('memorization.surah.verseCountShort', {
                count: formatNumberWithCommas(range.verseCount),
              })}
            </Typography>
          </View>
        </View>
        {showDeleteButton && onDelete && (
          <Button
            appearance="ghost"
            status="danger"
            accessoryLeft={CloseIcon}
            onPress={handleDelete}
            style={styles.deleteButton}
            size="small"
          />
        )}
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
  headerLeft: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    flexWrap: 'wrap',
  },
  rangeBadge: {
    // Badge component handles styling
  },
  stats: {
    flexDirection: 'row',
    gap: 8,
  },
  deleteButton: {
    width: 32,
    height: 32,
    marginLeft: 8,
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
