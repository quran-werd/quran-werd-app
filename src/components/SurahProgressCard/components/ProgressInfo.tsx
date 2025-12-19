import React from 'react';
import {View, StyleSheet} from 'react-native';
import {useTranslation} from 'react-i18next';
import Typography from '../../shared/Typography';

interface ProgressInfoProps {
  progressPercentage: number;
  memorizedVerses: number;
}

export default function ProgressInfo({
  progressPercentage,
  memorizedVerses,
}: ProgressInfoProps) {
  const {t} = useTranslation();

  return (
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
          count: memorizedVerses,
        })}
      </Typography>
    </View>
  );
}

const styles = StyleSheet.create({
  progressInfo: {
    flex: 1,
    alignItems: 'flex-end',
    justifyContent: 'center',
  },
  progressPercentage: {
    marginBottom: 6,
  },
  memorizedVerses: {
    marginBottom: 8,
  },
});
