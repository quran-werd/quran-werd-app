import React from 'react';
import {View, Text, StyleSheet} from 'react-native';
import {colors} from '../../styles/colors';
import {MemorizedRange} from '../../types/memorization.types';
import Card from '../shared/Card';
import Typography from '../shared/Typography';
import Badge from '../shared/Badge';

interface MemorizedRangeItemProps {
  range: MemorizedRange;
}

export default function MemorizedRangeItem({range}: MemorizedRangeItemProps) {
  return (
    <Card style={styles.container} padding={12} margin={8} shadow={false}>
      <View style={styles.rangeHeader}>
        <Badge variant="light" size="medium" style={styles.rangeBadge}>
          <Typography variant="small" weight="bold" color="primary">
            آية {range.startVerse}-{range.endVerse}
          </Typography>
        </Badge>
        <View style={styles.stats}>
          <Typography
            variant="small"
            color="secondary"
            style={styles.wordCount}>
            ك {range.wordCount}
          </Typography>
          <Typography
            variant="small"
            color="secondary"
            style={styles.verseCount}>
            آ {range.verseCount}
          </Typography>
        </View>
      </View>
      <View style={styles.textContainer}>
        <Typography variant="body" style={styles.startText}>
          {range.startText}
        </Typography>
        <Typography variant="body" style={styles.endText}>
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
});
