import React, {useEffect, useCallback, useMemo} from 'react';
import {
  View,
  StyleSheet,
  SafeAreaView,
  RefreshControl,
  ScrollView,
} from 'react-native';
import {useTranslation} from 'react-i18next';
import {useNavigation} from '@react-navigation/native';
import Svg, {Defs, RadialGradient, Stop, Rect, Path} from 'react-native-svg';
import {LinearGradient} from 'expo-linear-gradient';
import Animated, {FadeIn, ZoomIn} from 'react-native-reanimated';
import Typography from '../../components/shared/Typography';
import Button from '../../components/shared/Button';
import GeometricStar from '../../components/shared/icons/GeometricStar';
import {colors} from '../../styles/colors';
import {radius} from '../../styles/radius';
import {spacing} from '../../styles/spacing';
import {shadows} from '../../styles/shadows';
import {useAppDispatch, useAppSelector} from '../../store/hooks';
import {fetchTodayWerd} from '../../features/RevisionLog/revisionLogAction';
import {
  selectTodayWerd,
  selectRevisionLogLoading,
} from '../../features/RevisionLog/revisionLogSlice';
import {fetchRevisionPlan} from '../../features/RevisionPlan/revisionPlanAction';
import {selectUser} from '../../features/Auth/authSlice';
import {
  getSurahNameArabic,
  getJuzNumber,
  getPageForVerse,
  toArabicNumerals,
} from '../../content';

function RadialGlow() {
  return (
    <Svg
      style={StyleSheet.absoluteFillObject}
      pointerEvents="none"
      width="100%"
      height="100%">
      <Defs>
        <RadialGradient id="homeGlow" cx="50%" cy="0%" rx="60%" ry="50%">
          <Stop offset="0%" stopColor={colors.primary} stopOpacity={0.07} />
          <Stop offset="70%" stopColor={colors.primary} stopOpacity={0} />
        </RadialGradient>
      </Defs>
      <Rect x={0} y={0} width="100%" height="100%" fill="url(#homeGlow)" />
    </Svg>
  );
}

function CheckIcon({
  size = 14,
  color = colors.primary,
}: {
  size?: number;
  color?: string;
}) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Path
        d="M5 13l4 4L19 7"
        stroke={color}
        strokeWidth={2}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  );
}

export default function HomeScreen() {
  const {t, i18n} = useTranslation();
  const navigation = useNavigation<any>();
  const dispatch = useAppDispatch();
  const today = useAppSelector(selectTodayWerd);
  const loading = useAppSelector(selectRevisionLogLoading);
  const user = useAppSelector(selectUser);

  const loadHome = useCallback(() => {
    dispatch(fetchTodayWerd());
    dispatch(fetchRevisionPlan());
  }, [dispatch]);

  useEffect(() => {
    loadHome();
  }, [loadHome]);

  const todayDate = useMemo(
    () =>
      new Intl.DateTimeFormat('ar', {
        weekday: 'long',
        day: 'numeric',
        month: 'long',
      }).format(new Date()),
    [],
  );

  const werd = today?.werd;
  const status = today?.status || 'pending';
  const isCompleted = status === 'completed';

  const ayahCount = werd ? werd.range.to - werd.range.from + 1 : 0;
  const juzNumber = werd ? getJuzNumber(werd.surah, werd.range.from) : 0;
  const pageNumber = werd ? getPageForVerse(werd.surah, werd.range.from) : 0;

  const formatNumber = useCallback(
    (num: number) =>
      i18n.language === 'ar' ? toArabicNumerals(num) : String(num),
    [i18n.language],
  );

  return (
    <SafeAreaView style={styles.container}>
      <RadialGlow />
      <ScrollView
        contentContainerStyle={styles.content}
        refreshControl={
          <RefreshControl refreshing={loading} onRefresh={loadHome} />
        }>
        <View style={styles.greetingBlock}>
          <Typography
            variant="body"
            family="cairo"
            color="muted"
            style={styles.dateLabel}>
            {todayDate}
          </Typography>
          <Typography variant="title" family="amiriBold">
            {t('home.greeting')}
            {'،\n'}
            {user?.name ? (
              <Typography
                variant="title"
                family="amiriBold"
                style={styles.greetingName}>
                {user.name}
              </Typography>
            ) : null}
          </Typography>
        </View>

        <View style={styles.divider} />

        <Typography family="cairo" color="muted" style={styles.werdLabel}>
          {t('home.title')}
        </Typography>

        {werd ? (
          <View style={styles.wardCardWrap}>
            <View style={[styles.wardCard, shadows.homeWardCard]}>
              <LinearGradient
                colors={[
                  colors.elevatedCard,
                  colors.card,
                  colors.elevatedCardEnd,
                ]}
                locations={[0, 0.6, 1]}
                start={{x: 0, y: 0}}
                end={{x: 1, y: 1}}
                style={StyleSheet.absoluteFillObject}
              />
              <LinearGradient
                colors={[
                  'transparent',
                  colors.goldBorderIntense,
                  'transparent',
                ]}
                start={{x: 0, y: 0}}
                end={{x: 1, y: 0}}
                style={styles.wardCardHairline}
              />
              <View style={styles.wardCardStarDecoration} pointerEvents="none">
                <GeometricStar size={224} />
              </View>

              <View style={styles.wardCardInner}>
                <Animated.View
                  key={status}
                  entering={FadeIn.duration(250)}
                  style={[
                    styles.statusPill,
                    isCompleted
                      ? styles.statusPillCompleted
                      : styles.statusPillPending,
                  ]}>
                  {isCompleted ? (
                    <CheckIcon size={14} color={colors.primary} />
                  ) : (
                    <View style={styles.statusDot} />
                  )}
                  <Typography
                    variant="caption"
                    family="cairo"
                    weight="semibold"
                    style={
                      isCompleted
                        ? styles.statusTextCompleted
                        : styles.statusTextPending
                    }>
                    {isCompleted
                      ? t('home.statusCompleted')
                      : t('home.statusPending')}
                  </Typography>
                </Animated.View>

                <Typography
                  variant="heading"
                  family="amiriBold"
                  style={styles.wardCardSurahName}>
                  {getSurahNameArabic(werd.surah)}
                </Typography>
                <Typography
                  family="cairo"
                  color="muted"
                  style={styles.wardCardRange}>
                  {t('home.range', {
                    from: formatNumber(werd.range.from),
                    to: formatNumber(werd.range.to),
                  })}
                </Typography>

                <View style={styles.innerDivider} />

                <View style={styles.statsRow}>
                  <View style={styles.statCol}>
                    <Typography
                      variant="caption"
                      family="cairo"
                      color="muted"
                      style={styles.statLabel}>
                      {t('home.stats.ayahCount')}
                    </Typography>
                    <Typography
                      variant="body"
                      family="cairo"
                      weight="semibold"
                      style={styles.statValue}>
                      {formatNumber(ayahCount)}
                    </Typography>
                  </View>
                  <View style={styles.statDivider} />
                  <View style={styles.statCol}>
                    <Typography
                      variant="caption"
                      family="cairo"
                      color="muted"
                      style={styles.statLabel}>
                      {t('home.stats.juz')}
                    </Typography>
                    <Typography
                      variant="body"
                      family="cairo"
                      weight="semibold"
                      style={styles.statValue}>
                      {formatNumber(juzNumber)}
                    </Typography>
                  </View>
                  <View style={styles.statDivider} />
                  <View style={styles.statCol}>
                    <Typography
                      variant="caption"
                      family="cairo"
                      color="muted"
                      style={styles.statLabel}>
                      {t('home.stats.page')}
                    </Typography>
                    <Typography
                      variant="body"
                      family="cairo"
                      weight="semibold"
                      style={styles.statValue}>
                      {formatNumber(pageNumber)}
                    </Typography>
                  </View>
                </View>
              </View>
            </View>

            <View style={styles.ctaWrap}>
              {status === 'pending' ? (
                <Animated.View entering={FadeIn.duration(300)}>
                  <Button
                    title={t('home.startRevision')}
                    onPress={() =>
                      navigation.navigate('Revision', {werdId: werd._id})
                    }
                    fullWidth
                  />
                  <Typography
                    variant="caption"
                    family="cairo"
                    color="muted"
                    align="center"
                    style={styles.ctaHint}>
                    {t('home.hint')}
                  </Typography>
                </Animated.View>
              ) : (
                <Animated.View
                  entering={FadeIn.duration(350)}
                  style={styles.completionWrap}>
                  <Animated.View
                    entering={ZoomIn.stiffness(200).damping(15).delay(100)}
                    style={styles.completionBadge}>
                    <CheckIcon size={28} color={colors.primary} />
                  </Animated.View>
                  <Typography
                    variant="subtitle"
                    family="amiriBold"
                    align="center">
                    {t('home.completed')}
                  </Typography>
                  <Typography
                    variant="body"
                    family="cairo"
                    color="muted"
                    align="center">
                    {t('home.completedSubMessage')}
                  </Typography>
                </Animated.View>
              )}
            </View>
          </View>
        ) : (
          <View style={styles.emptyWrap}>
            <Typography variant="body" color="muted" align="center">
              {t('home.noWerd')}
            </Typography>
            <Button
              title={t('home.addMemorization')}
              onPress={() => navigation.navigate('MemorizationStack')}
              variant="secondary"
              fullWidth
              style={styles.emptyButton}
            />
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {flex: 1, backgroundColor: colors.background},
  content: {paddingBottom: spacing[24]},
  greetingBlock: {
    paddingHorizontal: spacing[28],
    paddingTop: spacing[24],
    paddingBottom: spacing[8],
  },
  dateLabel: {
    fontSize: 14,
    marginBottom: spacing[4],
  },
  greetingName: {
    color: colors.primary,
  },
  divider: {
    height: 1,
    backgroundColor: colors.border,
    marginHorizontal: spacing[28],
  },
  werdLabel: {
    fontSize: 14,
    letterSpacing: 0.08 * 14,
    paddingHorizontal: spacing[28],
    marginTop: spacing[16],
    marginBottom: spacing[12],
  },
  wardCardWrap: {
    paddingHorizontal: spacing[24],
    gap: spacing[24],
  },
  wardCard: {
    borderRadius: radius.xl2,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: 'rgba(196,154,60,0.22)',
  },
  wardCardHairline: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: 1,
  },
  wardCardStarDecoration: {
    position: 'absolute',
    right: -32,
    bottom: -32,
    opacity: 0.6,
  },
  wardCardInner: {
    padding: spacing[24],
  },
  statusPill: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    gap: spacing[6],
    paddingHorizontal: spacing[12],
    paddingVertical: spacing[4],
    borderRadius: radius.full,
    marginBottom: spacing[20],
  },
  statusPillPending: {
    backgroundColor: colors.mutedTintMedium,
  },
  statusPillCompleted: {
    backgroundColor: colors.goldTintMedium,
  },
  statusDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: colors.mutedForeground,
  },
  statusTextPending: {
    color: colors.mutedForeground,
  },
  statusTextCompleted: {
    color: colors.primary,
  },
  wardCardSurahName: {
    marginBottom: spacing[4],
  },
  wardCardRange: {
    fontSize: 14,
    marginBottom: spacing[20],
  },
  innerDivider: {
    height: 1,
    backgroundColor: colors.goldBorderFaint,
    marginBottom: spacing[20],
  },
  statsRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  statCol: {
    alignItems: 'center',
    gap: 2,
  },
  statLabel: {
    fontSize: 11,
  },
  statValue: {
    fontSize: 15,
  },
  statDivider: {
    width: 1,
    height: 24,
    backgroundColor: colors.goldWashStrong,
    marginHorizontal: spacing[16],
  },
  ctaWrap: {
    minHeight: 56,
  },
  ctaHint: {
    marginTop: spacing[12],
  },
  completionWrap: {
    alignItems: 'center',
    gap: spacing[12],
    paddingTop: spacing[8],
  },
  completionBadge: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: colors.goldTintMedium,
    borderWidth: 1.5,
    borderColor: colors.goldBorderIntense,
    alignItems: 'center',
    justifyContent: 'center',
  },
  emptyWrap: {
    paddingHorizontal: spacing[24],
    gap: spacing[16],
    marginTop: spacing[24],
  },
  emptyButton: {
    marginTop: spacing[8],
  },
});
