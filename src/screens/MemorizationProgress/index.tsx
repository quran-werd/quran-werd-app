import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  SafeAreaView,
  TouchableOpacity,
} from 'react-native';
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
                تقدم الحفظ
              </Typography>
              <Typography
                variant="caption"
                color="secondary"
                style={styles.headerSubtitle}>
                رحلة حفظ القرآن الكريم
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
          title="تقدم الحفظ"
          subtitle={`من ${progress.totalVerses} آية محفوظة ${progress.totalMemorizedVerses}`}
          percentage={progress.overallProgress}
          value={`${progress.totalMemorizedVerses} آية محفوظة`}
          icon={<Text style={styles.progressIcon}>📈</Text>}
          style={styles.mainProgressCard}
        />

        {/* Summary Cards */}
        <View style={styles.summaryContainer}>
          <ProgressCard
            title="سورة مكتملة"
            percentage={progress.completedSurahs}
            value={`${progress.completedSurahs}`}
            icon={<Text style={styles.summaryIcon}>📖</Text>}
            style={styles.summaryCard}
          />
          <ProgressCard
            title="قيد الحفظ"
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
              النشاط الأخير
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
              آخر مراجعة اليوم
            </Typography>
            <Typography
              variant="small"
              color="secondary"
              style={styles.recentActivitySubtext}>
              انقر على السور لرؤية التفاصيل
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
              تفصيل السور
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
