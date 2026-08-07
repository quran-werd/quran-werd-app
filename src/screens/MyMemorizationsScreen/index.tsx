import React, {useEffect, useMemo} from 'react';
import {StyleSheet, ScrollView, View, Pressable} from 'react-native';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {useTranslation} from 'react-i18next';
import {useNavigation} from '@react-navigation/native';
import Svg, {Path} from 'react-native-svg';
import {LinearGradient} from 'expo-linear-gradient';
import ScreenGlow from '../../components/shared/icons/ScreenGlow';
import {useAppSelector, useAppDispatch} from '../../store/hooks';
import {selectMemorizationRanges} from '../../features/Memorization/memorizationSlice';
import {colors} from '../../styles/colors';
import {radius} from '../../styles/radius';
import {spacing} from '../../styles/spacing';
import {shadows} from '../../styles/shadows';
import Typography from '../../components/shared/Typography';
import {SurahDetailsList, ScreenTitle} from '../../components';
import {
  fetchMemorizations,
  removeMemorizationRange,
} from '../../features/Memorization/memorizationAction';
import {MemorizationVerseRange} from '../../types/memorization.types';
import {computeMemorizationTotals} from '../../utils/helpers.utils';
import {toArabicNumerals} from '../../content';

function PlusIcon() {
  return (
    <Svg width={16} height={16} viewBox="0 0 24 24" fill="none">
      <Path
        d="M12 5v14M5 12h14"
        stroke={colors.primary}
        strokeWidth={2}
        strokeLinecap="round"
      />
    </Svg>
  );
}

function BookIcon() {
  return (
    <Svg width={40} height={40} viewBox="0 0 24 24" fill="none">
      <Path
        d="M12 6c-1.5-1.2-3.5-2-6-2-1 0-2 .1-3 .4v14c1-.3 2-.4 3-.4 2.5 0 4.5.8 6 2 1.5-1.2 3.5-2 6-2 1 0 2 .1 3 .4V4.4c-1-.3-2-.4-3-.4-2.5 0-4.5.8-6 2z"
        stroke={colors.primary}
        strokeWidth={1.3}
        fill="rgba(196,154,60,0.08)"
      />
      <Path d="M12 6v14" stroke={colors.primary} strokeWidth={1.3} />
      <Path
        d="M5 8h3M5 11h3M16 8h3M16 11h3"
        stroke={colors.primary}
        strokeWidth={1}
        strokeLinecap="round"
      />
    </Svg>
  );
}

export default function MyMemorizationsScreen() {
  const ranges = useAppSelector(selectMemorizationRanges);
  const dispatch = useAppDispatch();
  const {t} = useTranslation();
  const navigation = useNavigation<any>();
  const insets = useSafeAreaInsets();

  useEffect(() => {
    dispatch(fetchMemorizations());
  }, [dispatch]);

  const handleDeleteRange = (surah: number, range: MemorizationVerseRange) => {
    dispatch(removeMemorizationRange({surah, from: range.from, to: range.to}));
  };

  const surahCount = Object.keys(ranges).length;
  const hasRanges = surahCount > 0;

  const totals = useMemo(() => computeMemorizationTotals(ranges), [ranges]);

  return (
    <View style={styles.container}>
      <ScreenGlow
        style={StyleSheet.absoluteFillObject}
        stops={[
          {
            id: 'memGlow',
            cx: '50%',
            cy: '0%',
            rx: '70%',
            ry: '30%',
            opacity: 0.05,
          },
        ]}
      />
      <View style={[styles.header, {paddingTop: insets.top + spacing[16]}]}>
        <View style={styles.headerTextWrap}>
          <ScreenTitle>{t('memorization.screenTitle')}</ScreenTitle>
          {hasRanges ? (
            <Typography family="cairo" style={styles.subtitle}>
              {t('memorization.subtitle', {
                verses: toArabicNumerals(totals.totalMemorizedVerses),
                surahs: toArabicNumerals(surahCount),
              })}
            </Typography>
          ) : null}
        </View>
        <Pressable
          style={styles.addButton}
          onPress={() =>
            navigation.navigate('MemorizationScreen', {initialPage: 1})
          }>
          <PlusIcon />
          <Typography
            family="cairo"
            weight="semibold"
            style={styles.addButtonText}>
            {t('memorization.addButton')}
          </Typography>
        </Pressable>
      </View>
      <View style={styles.divider} />

      {hasRanges ? (
        <ScrollView
          style={styles.scrollView}
          contentContainerStyle={styles.scrollViewContent}
          showsVerticalScrollIndicator={false}>
          <SurahDetailsList surahs={ranges} onDeleteRange={handleDeleteRange} />
        </ScrollView>
      ) : (
        <View style={styles.empty}>
          <View style={styles.emptyIconWrap}>
            <BookIcon />
          </View>
          <View style={styles.emptyTextBlock}>
            <Typography variant="subtitle" family="amiriBold" align="center">
              {t('memorization.emptyTitle')}
            </Typography>
            <Typography
              family="cairo"
              color="muted"
              align="center"
              style={styles.emptyBody}>
              {t('memorization.emptyBodyLine1')}
              {'\n'}
              {t('memorization.emptyBodyLine2')}
            </Typography>
          </View>
          <Pressable
            style={styles.emptyCta}
            onPress={() =>
              navigation.navigate('MemorizationScreen', {initialPage: 1})
            }>
            <LinearGradient
              colors={[colors.primaryHighlight, colors.primary]}
              start={{x: 0, y: 0}}
              end={{x: 1, y: 1}}
              style={styles.emptyCtaGradient}>
              <Typography
                family="cairo"
                weight="semibold"
                style={styles.emptyCtaText}>
                {t('memorization.emptyCta')}
              </Typography>
            </LinearGradient>
          </Pressable>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {flex: 1, backgroundColor: colors.background},
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    paddingHorizontal: spacing[24],
    paddingBottom: spacing[16],
  },
  headerTextWrap: {
    flex: 1,
  },
  subtitle: {
    fontSize: 13,
    color: colors.mutedForeground,
    marginTop: 2,
  },
  addButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: spacing[16],
    paddingVertical: spacing[8],
    borderRadius: radius.md,
    backgroundColor: 'rgba(196,154,60,0.12)',
    borderWidth: 1,
    borderColor: 'rgba(196,154,60,0.25)',
  },
  addButtonText: {
    fontSize: 13,
    color: colors.primary,
  },
  divider: {
    height: 1,
    marginHorizontal: spacing[24],
    backgroundColor: colors.border,
  },
  scrollView: {flex: 1},
  scrollViewContent: {
    paddingHorizontal: spacing[24],
    paddingBottom: spacing[8],
    paddingTop: spacing[24],
  },
  empty: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: spacing[16],
    paddingTop: 64,
    gap: spacing[20],
  },
  emptyIconWrap: {
    width: 80,
    height: 80,
    borderRadius: radius.xl,
    backgroundColor: 'rgba(196,154,60,0.08)',
    borderWidth: 1,
    borderColor: 'rgba(196,154,60,0.15)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  emptyTextBlock: {
    gap: spacing[8],
    paddingHorizontal: spacing[16],
  },
  emptyBody: {
    fontSize: 14,
    lineHeight: 14 * 1.7,
  },
  emptyCta: {
    borderRadius: radius.xl,
    overflow: 'hidden',
    ...shadows.saveButton,
  },
  emptyCtaGradient: {
    paddingVertical: spacing[14],
    paddingHorizontal: spacing[32],
  },
  emptyCtaText: {
    fontSize: 15,
    color: colors.background,
  },
});
