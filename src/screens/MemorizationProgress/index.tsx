import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  SafeAreaView,
  TouchableOpacity,
} from 'react-native';
import {useTranslation} from 'react-i18next';
import {useAppSelector, useAppDispatch} from '../../store/hooks';
import {toggleSurahExpansion} from '../../features/Memorization/memorizationSlice';
import {colors} from '../../styles/colors';
import {
  ProgressCard,
  SurahProgressCard,
  Card,
  Typography,
  Icon,
} from '../../components';

export default function MemorizationProgress() {
  const {progress} = useAppSelector(state => state.memorization);
  const dispatch = useAppDispatch();
  const {t} = useTranslation();

  const handleToggleSurah = (surahId: string) => {
    dispatch(toggleSurahExpansion(surahId));
  };

  const handleRecentActivityPress = () => {
    // Navigate to detailed review screen
    console.log('Navigate to review details');
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.header}>
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
              {progress.overallProgress}%
            </Typography>
          </View>
        </View>

        {/* Main Progress Card */}
        <ProgressCard
          title={t('memorization.progress.title')}
          subtitle={t('memorization.progress.totalMemorizedVerses', {
            memorized: progress.totalMemorizedVerses,
            total: progress.totalVerses,
          })}
          percentage={progress.overallProgress}
          value={t('memorization.progress.memorizedVersesValue', {
            count: progress.totalMemorizedVerses,
          })}
          icon={<Text style={styles.progressIcon}>📈</Text>}
          style={styles.mainProgressCard}
        />

        {/* Summary Cards */}
        <View style={styles.summaryContainer}>
          <ProgressCard
            title={t('memorization.progress.completedSurahs')}
            percentage={progress.completedSurahs}
            value={`${progress.completedSurahs}`}
            icon={<Text style={styles.summaryIcon}>📖</Text>}
            style={styles.summaryCard}
          />
          <ProgressCard
            title={t('memorization.progress.inProgressSurahs')}
            percentage={progress.inProgressSurahs}
            value={`${progress.inProgressSurahs}`}
            icon={<Text style={styles.summaryIcon}>🎯</Text>}
            style={styles.summaryCard}
          />
        </View>

        {/* Recent Activity */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Typography variant="body" style={styles.sectionIcon}>
              📅
            </Typography>
            <Typography
              variant="h3"
              weight="semibold"
              style={styles.sectionTitle}>
              {t('memorization.progress.recentActivity')}
            </Typography>
          </View>
          <Card
            onPress={handleRecentActivityPress}
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

        {/* Surah Details */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Typography variant="body" style={styles.sectionIcon}>
              📚
            </Typography>
            <Typography
              variant="h3"
              weight="semibold"
              style={styles.sectionTitle}>
              {t('memorization.progress.surahDetails')}
            </Typography>
          </View>
          {progress.surahs.map(surah => (
            <SurahProgressCard
              key={surah.id}
              surah={surah}
              onToggleExpansion={handleToggleSurah}
            />
          ))}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  scrollView: {
    flex: 1,
    paddingHorizontal: 16,
  },
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
  mainProgressCard: {
    marginBottom: 20,
  },
  progressIcon: {
    fontSize: 24,
  },
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
    fontSize: 20,
  },
  section: {
    marginBottom: 28,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
    paddingHorizontal: 4,
  },
  sectionIcon: {
    marginRight: 8,
  },
  sectionTitle: {
    // Typography component handles styling
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
