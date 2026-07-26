import React, {useEffect, useMemo} from 'react';
import {
  StyleSheet,
  ScrollView,
  SafeAreaView,
  TouchableOpacity,
  Text,
} from 'react-native';
import {Icon} from '@ui-kitten/components';
import {useTranslation} from 'react-i18next';
import {useNavigation} from '@react-navigation/native';
import {useAppSelector, useAppDispatch} from '../../store/hooks';
import {selectMemorizationRanges} from '../../features/Memorization/memorizationSlice';
import {colors} from '../../styles/colors';
import {
  ProgressCard,
  MemorizationHeader,
  MemorizationSummary,
  SurahDetailsList,
} from '../../components';
import {
  fetchMemorizations,
  removeMemorizationRange,
} from '../../features/Memorization/memorizationAction';
import {computeMemorizationTotals} from '../../utils/helpers.utils';
import {MemorizationVerseRange} from '../../types/memorization.types';

export default function MyMemorizationsScreen() {
  const ranges = useAppSelector(selectMemorizationRanges);
  const dispatch = useAppDispatch();
  const {t} = useTranslation();
  const navigation = useNavigation<any>();

  const totals = useMemo(() => computeMemorizationTotals(ranges), [ranges]);

  const overallProgress = useMemo(() => {
    const surahCount = Object.keys(ranges).length;
    if (surahCount === 0) return 0;
    return Math.round(
      (totals.completedSurahs / Math.max(surahCount, 1)) * 100,
    );
  }, [ranges, totals.completedSurahs]);

  useEffect(() => {
    dispatch(fetchMemorizations());
  }, [dispatch]);

  const handleDeleteRange = (surah: number, range: MemorizationVerseRange) => {
    dispatch(
      removeMemorizationRange({surah, from: range.from, to: range.to}),
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollViewContent}
        showsVerticalScrollIndicator={false}>
        <MemorizationHeader overallProgress={overallProgress} />

        <ProgressCard
          title={t('memorization.progress.title')}
          subtitle={t('memorization.progress.memorizedVersesValue', {
            count: totals.totalMemorizedVerses,
          })}
          percentage={overallProgress}
          value={t('memorization.progress.memorizedVersesValue', {
            count: totals.totalMemorizedVerses,
          })}
          icon={
            <Icon
              name="trending-up-outline"
              style={[styles.progressIcon, {tintColor: colors.primary}]}
            />
          }
          style={styles.mainProgressCard}
        />

        <MemorizationSummary
          completedSurahs={totals.completedSurahs}
          inProgressSurahs={totals.inProgressSurahs}
        />

        <TouchableOpacity
          onPress={() =>
            navigation.navigate('MemorizationScreen', {initialPage: 1})
          }
          style={styles.addButton}>
          <Text style={styles.addButtonText}>
            {t('memorization.progress.addRange')}
          </Text>
        </TouchableOpacity>

        <SurahDetailsList
          surahs={ranges}
          onDeleteRange={handleDeleteRange}
        />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {flex: 1, backgroundColor: colors.background},
  scrollView: {flex: 1},
  scrollViewContent: {paddingHorizontal: 16},
  mainProgressCard: {marginBottom: 20},
  progressIcon: {width: 28, height: 28},
  addButton: {
    backgroundColor: colors.primary,
    borderRadius: 12,
    paddingVertical: 16,
    paddingHorizontal: 24,
    alignItems: 'center',
    marginVertical: 16,
    marginHorizontal: 16,
  },
  addButtonText: {color: colors.white, fontSize: 16, fontWeight: '600'},
});
