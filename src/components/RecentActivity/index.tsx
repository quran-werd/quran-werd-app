import React from 'react';
import {View, StyleSheet} from 'react-native';
import {useTranslation} from 'react-i18next';
import {Card, Typography} from '../shared';
import {SectionHeader} from '../SectionHeader';

interface RecentActivityProps {
  onPress?: () => void;
  style?: any;
}

export const RecentActivity: React.FC<RecentActivityProps> = ({
  onPress,
  style,
}) => {
  const {t} = useTranslation();

  return (
    <View style={[styles.section, style]}>
      <SectionHeader
        icon="📅"
        title={t('memorization.progress.recentActivity')}
      />
      <Card
        onPress={onPress}
        style={styles.recentActivityCard}
        padding={16}
        margin={0}>
        <Typography
          variant="body"
          weight="medium"
          style={styles.recentActivityText}>
          {t('memorization.progress.lastReviewToday')}
        </Typography>
        <Typography
          variant="small"
          color="secondary"
          style={styles.recentActivitySubtext}>
          {t('memorization.progress.tapForDetails')}
        </Typography>
      </Card>
    </View>
  );
};

const styles = StyleSheet.create({
  section: {
    marginBottom: 28,
  },
  recentActivityCard: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  recentActivityText: {
    // Typography component handles styling
  },
  recentActivitySubtext: {
    // Typography component handles styling
  },
});
