import React from 'react';
import {View, StyleSheet} from 'react-native';
import {Icon} from '@ui-kitten/components';
import {useTranslation} from 'react-i18next';
import {colors} from '../../styles/colors';
import ProgressCard from '../ProgressCard';

interface MemorizationSummaryProps {
  completedSurahs: number;
  inProgressSurahs: number;
  style?: any;
}

export const MemorizationSummary: React.FC<MemorizationSummaryProps> = ({
  completedSurahs,
  inProgressSurahs,
  style,
}) => {
  const {t} = useTranslation();

  return (
    <View style={[styles.summaryContainer, style]}>
      <ProgressCard
        title={t('memorization.progress.completedSurahs')}
        percentage={completedSurahs}
        value={`${completedSurahs}`}
        icon={
          <Icon
            name="book-outline"
            style={[styles.summaryIcon, {tintColor: colors.primary}]}
          />
        }
        style={styles.summaryCard}
      />
      <ProgressCard
        title={t('memorization.progress.inProgressSurahs')}
        percentage={inProgressSurahs}
        value={`${inProgressSurahs}`}
        icon={
          <Icon
            name="flag-outline"
            style={[styles.summaryIcon, {tintColor: colors.primary}]}
          />
        }
        style={styles.summaryCard}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  summaryContainer: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 28,
  },
  summaryCard: {
    flex: 1,
    marginVertical: 0,
  },
  summaryIcon: {
    width: 24,
    height: 24,
  },
});
