import React from 'react';
import {View, StyleSheet, Pressable} from 'react-native';
import {useTranslation} from 'react-i18next';
import {useNavigation} from '@react-navigation/native';
import Svg, {Path} from 'react-native-svg';
import {LinearGradient} from 'expo-linear-gradient';
import Animated from 'react-native-reanimated';
import Typography from '../../../components/shared/Typography';
import Button from '../../../components/shared/Button';
import GeometricStar from '../../../components/shared/icons/GeometricStar';
import {colors} from '../../../styles/colors';
import {radius} from '../../../styles/radius';
import {spacing} from '../../../styles/spacing';
import {shadows} from '../../../styles/shadows';
import {
  pillEnter,
  pillExit,
  ctaEnter,
  ctaExit,
  nextWerdEnter,
  nextWerdExit,
} from '../../../styles/animations';
import {getSurahDisplayName} from '../../../content';
import {useTodayWerdSummary} from '../hooks/useTodayWerdSummary';

function CheckIcon({
  size = 14,
  color = colors.primary,
  strokeWidth = 2,
}: {
  size?: number;
  color?: string;
  strokeWidth?: number;
}) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Path
        d="M5 13l4 4L19 7"
        stroke={color}
        strokeWidth={strokeWidth}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  );
}

function ChevronIcon({size = 16}: {size?: number}) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Path
        d="M15 18l-6-6 6-6"
        stroke="rgba(196,154,60,0.5)"
        strokeWidth={1.75}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  );
}

export default function TodayWerdCard() {
  const {t} = useTranslation();
  const navigation = useNavigation<any>();
  const {
    werd,
    isCompleted,
    isFinished,
    isPlanComplete,
    ayahCount,
    juzOrdinal,
    pageNumber,
    nextWerd,
    formatNumber,
  } = useTodayWerdSummary();

  if (isPlanComplete) {
    return (
      <View style={styles.emptyWrap}>
        <Typography variant="subtitle" family="amiri" weight="bold" align="center">
          {t('home.planCompleteTitle')}
        </Typography>
        <Typography variant="body" color="muted" align="center">
          {t('home.planCompleteMessage')}
        </Typography>
        <Button
          title={t('home.generateNewPlan')}
          onPress={() => navigation.navigate('Plan')}
          fullWidth
          style={styles.emptyButton}
        />
      </View>
    );
  }

  if (!werd) {
    return (
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
    );
  }

  return (
    <View style={styles.wardCardWrap}>
      <View style={[styles.wardCard, shadows.homeWardCard]}>
        <LinearGradient
          colors={[colors.elevatedCard, colors.card, colors.elevatedCardEnd]}
          locations={[0, 0.6, 1]}
          start={{x: 0, y: 0}}
          end={{x: 1, y: 1}}
          style={StyleSheet.absoluteFillObject}
        />
        <LinearGradient
          colors={['transparent', colors.goldBorderIntense, 'transparent']}
          start={{x: 0, y: 0}}
          end={{x: 1, y: 0}}
          style={styles.wardCardHairline}
        />
        <View style={styles.wardCardStarDecoration} pointerEvents="none">
          <GeometricStar size={224} />
        </View>

        <View style={styles.wardCardInner}>
          <View style={styles.headerRow}>
            <Typography
              variant="heading"
              family="amiriBold"
              numberOfLines={1}
              style={styles.wardCardSurahName}>
              {getSurahDisplayName(werd.surah)}
            </Typography>

            <Animated.View
              key={isFinished ? 'finished' : isCompleted ? 'completed' : 'pending'}
              entering={pillEnter}
              exiting={pillExit}
              style={[
                styles.statusPill,
                isCompleted || isFinished
                  ? styles.statusPillCompleted
                  : styles.statusPillPending,
              ]}>
              {isCompleted || isFinished ? (
                <CheckIcon size={14} color={colors.primary} />
              ) : (
                <View style={styles.statusDot} />
              )}
              <Typography
                variant="caption"
                family="cairo"
                weight="semibold"
                style={
                  isCompleted || isFinished
                    ? styles.statusTextCompleted
                    : styles.statusTextPending
                }>
                {isFinished
                  ? t('home.statusFinished')
                  : isCompleted
                  ? t('home.statusCompleted')
                  : t('home.statusPending')}
              </Typography>
            </Animated.View>
          </View>

          <Typography family="cairo" color="muted" style={styles.wardCardRange}>
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
                {juzOrdinal}
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

          <View style={styles.ctaDivider}>
            {!isCompleted && !isFinished ? (
              <Animated.View key="pending" entering={ctaEnter} exiting={ctaExit}>
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
                key="done"
                entering={ctaEnter}
                exiting={ctaExit}
                style={styles.completionWrap}>
                <View style={styles.completionBadge}>
                  <CheckIcon size={12} color={colors.primary} strokeWidth={2.5} />
                </View>
                <Typography
                  variant="label"
                  family="cairo"
                  weight="semibold"
                  color="primary">
                  {isFinished
                    ? t('home.finishedMessage')
                    : t('home.completedMessage')}
                </Typography>
              </Animated.View>
            )}

            {isFinished ? (
              <Button
                title={t('home.viewPlan')}
                onPress={() => navigation.navigate('Plan')}
                variant="secondary"
                fullWidth
                style={styles.finishedButton}
              />
            ) : null}
          </View>

          {isCompleted && nextWerd ? (
            <Animated.View
              entering={nextWerdEnter}
              exiting={nextWerdExit}
              style={styles.nextWerdSection}>
              <View style={styles.nextWerdDivider} />
              <Typography
                variant="caption"
                family="cairo"
                weight="semibold"
                style={styles.nextWerdLabel}>
                {t('home.nextWerdLabel')}
              </Typography>
              <Pressable
                onPress={() =>
                  navigation.navigate('Revision', {
                    werdId: nextWerd._id,
                    surah: nextWerd.surah,
                    range: nextWerd.range,
                  })
                }
                style={({pressed}) => [
                  styles.nextWerdButton,
                  pressed && styles.nextWerdButtonPressed,
                ]}>
                <View style={styles.nextWerdTextBlock}>
                  <Typography
                    variant="body"
                    family="amiriBold"
                    align="right"
                    style={styles.nextWerdSurah}>
                    {getSurahDisplayName(nextWerd.surah)}
                  </Typography>
                  <Typography
                    variant="caption"
                    family="cairo"
                    align="right"
                    style={styles.nextWerdRange}>
                    {t('home.range', {
                      from: formatNumber(nextWerd.range.from),
                      to: formatNumber(nextWerd.range.to),
                    })}
                  </Typography>
                </View>
                <ChevronIcon />
              </Pressable>
            </Animated.View>
          ) : null}
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wardCardWrap: {
    paddingHorizontal: spacing[24],
  },
  wardCard: {
    borderRadius: radius.xl,
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
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: spacing[8],
    marginBottom: spacing[4],
  },
  statusPill: {
    flexDirection: 'row',
    alignItems: 'center',
    flexShrink: 0,
    gap: spacing[6],
    paddingHorizontal: spacing[12],
    paddingVertical: spacing[4],
    borderRadius: radius.full,
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
    flexShrink: 1,
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
    justifyContent: 'flex-end',
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
  ctaDivider: {
    marginTop: spacing[20],
    paddingTop: spacing[16],
    borderTopWidth: 1,
    borderTopColor: 'rgba(196,154,60,0.12)',
  },
  ctaHint: {
    marginTop: spacing[12],
  },
  completionWrap: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing[8],
    paddingVertical: spacing[8],
  },
  completionBadge: {
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: colors.goldTintMedium,
    borderWidth: 1,
    borderColor: colors.ring,
    alignItems: 'center',
    justifyContent: 'center',
  },
  finishedButton: {
    marginTop: spacing[12],
  },
  nextWerdSection: {
    marginTop: spacing[12],
  },
  nextWerdDivider: {
    height: 1,
    backgroundColor: 'rgba(196,154,60,0.12)',
    marginBottom: spacing[12],
  },
  nextWerdLabel: {
    fontSize: 10,
    color: 'rgba(138,154,184,0.6)',
    letterSpacing: 0.08 * 10,
    marginBottom: spacing[8],
  },
  nextWerdButton: {
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: spacing[16],
    paddingVertical: spacing[12],
    borderRadius: radius.md,
    borderWidth: 1.5,
    borderStyle: 'dashed',
    borderColor: 'rgba(196,154,60,0.28)',
    backgroundColor: 'rgba(196,154,60,0.04)',
  },
  nextWerdButtonPressed: {
    opacity: 0.6,
  },
  nextWerdTextBlock: {
    flexShrink: 1,
  },
  nextWerdSurah: {
    color: 'rgba(237,231,220,0.75)',
  },
  nextWerdRange: {
    fontSize: 11,
    color: 'rgba(138,154,184,0.7)',
    marginTop: 2,
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
