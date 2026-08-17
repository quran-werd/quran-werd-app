import React from 'react';
import {View, StyleSheet} from 'react-native';
import {useTranslation} from 'react-i18next';
import {useNavigation} from '@react-navigation/native';
import Svg, {Path} from 'react-native-svg';
import {LinearGradient} from 'expo-linear-gradient';
import Animated, {FadeIn, ZoomIn} from 'react-native-reanimated';
import Typography from '../../../components/shared/Typography';
import Button from '../../../components/shared/Button';
import GeometricStar from '../../../components/shared/icons/GeometricStar';
import {colors} from '../../../styles/colors';
import {radius} from '../../../styles/radius';
import {spacing} from '../../../styles/spacing';
import {shadows} from '../../../styles/shadows';
import {getSurahNameArabic} from '../../../content';
import {useTodayWerdSummary} from '../hooks/useTodayWerdSummary';

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

export default function TodayWerdCard() {
  const {t} = useTranslation();
  const navigation = useNavigation<any>();
  const {
    werd,
    status,
    isCompleted,
    isFinished,
    ayahCount,
    juzNumber,
    pageNumber,
    formatNumber,
  } = useTodayWerdSummary();

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
          <Animated.View
            key={status}
            entering={FadeIn.duration(250)}
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

          <Typography
            variant="heading"
            family="amiriBold"
            style={styles.wardCardSurahName}>
            {getSurahNameArabic(werd.surah)}
          </Typography>
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
              onPress={() => navigation.navigate('Revision', {werdId: werd._id})}
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
        ) : isFinished ? (
          <Animated.View
            entering={FadeIn.duration(350)}
            style={styles.completionWrap}>
            <Animated.View
              entering={ZoomIn.stiffness(200).damping(15).delay(100)}
              style={styles.completionBadge}>
              <CheckIcon size={28} color={colors.primary} />
            </Animated.View>
            <Typography variant="subtitle" family="amiriBold" align="center">
              {t('home.finished')}
            </Typography>
            <Typography variant="body" family="cairo" color="muted" align="center">
              {t('home.finishedSubMessage')}
            </Typography>
            <Button
              title={t('home.viewPlan')}
              onPress={() => navigation.navigate('Plan')}
              variant="secondary"
              fullWidth
              style={styles.finishedButton}
            />
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
            <Typography variant="subtitle" family="amiriBold" align="center">
              {t('home.completed')}
            </Typography>
            <Typography variant="body" family="cairo" color="muted" align="center">
              {t('home.completedSubMessage')}
            </Typography>
          </Animated.View>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
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
  finishedButton: {
    marginTop: spacing[12],
  },
});
