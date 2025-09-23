import React from 'react';
import {View, StyleSheet} from 'react-native';
import {useTranslation} from 'react-i18next';
import {Typography, Icon} from '../shared';
import {colors} from '../../styles/colors';

interface MemorizationHeaderProps {
  overallProgress: number;
  style?: any;
}

export const MemorizationHeader: React.FC<MemorizationHeaderProps> = ({
  overallProgress,
  style,
}) => {
  const {t} = useTranslation();

  return (
    <View style={[styles.header, style]}>
      <View style={styles.headerContent}>
        <Icon size={40} style={styles.headerIcon}>
          📊
        </Icon>
        <View style={styles.headerText}>
          <Typography variant="h2" weight="bold" style={styles.headerTitle}>
            {t('memorization.progress.title')}
          </Typography>
          <Typography
            variant="caption"
            color="secondary"
            style={styles.headerSubtitle}>
            {t('memorization.progress.subtitle')}
          </Typography>
        </View>
      </View>
      <View style={styles.progressBadge}>
        <Typography variant="body" weight="bold" color="white">
          {overallProgress}%
        </Typography>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 24,
    paddingHorizontal: 4,
    marginBottom: 8,
  },
  headerContent: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  headerIcon: {
    marginRight: 12,
  },
  headerText: {
    flex: 1,
  },
  headerTitle: {
    marginBottom: 4,
  },
  headerSubtitle: {
    // Typography component handles styling
  },
  progressBadge: {
    backgroundColor: colors.primary,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
  },
});
