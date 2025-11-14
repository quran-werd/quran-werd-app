import React from 'react';
import {Text, StyleSheet, ScrollView, SafeAreaView, TouchableOpacity} from 'react-native';
import {useTranslation} from 'react-i18next';
import {useNavigation} from '@react-navigation/native';
import {useAppSelector, useAppDispatch} from '../../store/hooks';
import {toggleSurahExpansion} from '../../features/Memorization/memorizationSlice';
import {colors} from '../../styles/colors';
import {
  ProgressCard,
  MemorizationHeader,
  MemorizationSummary,
  RecentActivity,
  SurahDetailsList,
} from '../../components';
import {MemorizationProgressProps} from '../../routes/MemorizationStack';

export default function MemorizationProgress() {
  const {progress} = useAppSelector(state => state.memorization);
  const dispatch = useAppDispatch();
  const {t} = useTranslation();
  const navigation = useNavigation<MemorizationProgressProps['navigation']>();

  const handleToggleSurah = (surahId: string) => {
    dispatch(toggleSurahExpansion(surahId));
  };

  const handleRecentActivityPress = () => {
    // Navigate to detailed review screen
    console.log('Navigate to review details');
  };

  const handleAddMemorizationPress = () => {
    navigation.navigate('MemorizationSelection', {initialPage: 1});
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollViewContent}
        showsVerticalScrollIndicator={false}>
        <MemorizationHeader overallProgress={progress.overallProgress} />

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

        <MemorizationSummary
          completedSurahs={progress.completedSurahs}
          inProgressSurahs={progress.inProgressSurahs}
        />

        <RecentActivity onPress={handleRecentActivityPress} />

        <TouchableOpacity
          onPress={handleAddMemorizationPress}
          style={styles.addButton}>
          <Text style={styles.addButtonText}>
            {t('memorization.addRange', 'Add Memorization Range')}
          </Text>
        </TouchableOpacity>

        <SurahDetailsList
          surahs={progress.surahs}
          onToggleExpansion={handleToggleSurah}
        />
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
  },
  scrollViewContent: {
    paddingHorizontal: 16,
  },
  mainProgressCard: {
    marginBottom: 20,
  },
  progressIcon: {
    fontSize: 24,
  },
  addButton: {
    backgroundColor: colors.primary,
    borderRadius: 12,
    paddingVertical: 16,
    paddingHorizontal: 24,
    alignItems: 'center',
    marginVertical: 16,
    marginHorizontal: 16,
  },
  addButtonText: {
    color: colors.white,
    fontSize: 16,
    fontWeight: '600',
  },
});
