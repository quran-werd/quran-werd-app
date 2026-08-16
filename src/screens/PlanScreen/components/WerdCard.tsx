import React, {useEffect, useState} from 'react';
import {View, StyleSheet, Pressable} from 'react-native';
import {useTranslation} from 'react-i18next';
import {LinearGradient} from 'expo-linear-gradient';
import Animated, {
  FadeInDown,
  FadeIn,
  FadeOut,
  LinearTransition,
} from 'react-native-reanimated';
import Typography from '../../../components/shared/Typography';
import VerseRangeRow from '../../../components/shared/VerseRangeRow';
import AnimatedChevron from '../../../components/shared/icons/AnimatedChevron';
import {colors} from '../../../styles/colors';
import {radius} from '../../../styles/radius';
import {spacing} from '../../../styles/spacing';
import {shadows} from '../../../styles/shadows';
import {getSurahNameArabic, toArabicNumerals} from '../../../content';
import {fetchAyahByKey} from '../../../services/clients/quranCdnClient';
import type {Werd} from '../../../services/revisionPlan.service';

function verseCount(werd: Werd) {
  return werd.range.to - werd.range.from + 1;
}

interface WerdCardProps {
  werd: Werd;
  isToday: boolean;
  index: number;
  completedCount: number;
}

export default function WerdCard({
  werd,
  isToday,
  completedCount,
  index,
}: WerdCardProps) {
  const {t} = useTranslation();
  const [open, setOpen] = useState(false);
  const [fromText, setFromText] = useState<string | null>(null);
  const [toText, setToText] = useState<string | null>(null);
  const hasRange = werd.range.to !== werd.range.from;

  useEffect(() => {
    if (open && fromText === null) {
      fetchAyahByKey(werd.surah, werd.range.from).then(setFromText);
      if (hasRange) {
        fetchAyahByKey(werd.surah, werd.range.to).then(setToText);
      }
    }
  }, [open, fromText, hasRange, werd.surah, werd.range.from, werd.range.to]);

  return (
    <Animated.View
      entering={FadeInDown.delay(index * 40).duration(250)}
      layout={LinearTransition}>
      <View
        style={[
          styles.werdCard,
          {
            borderColor: isToday
              ? 'rgba(196,154,60,0.45)'
              : open
              ? 'rgba(196,154,60,0.28)'
              : colors.goldBorderSubtle,
            backgroundColor: isToday ? 'rgba(30,26,20,1)' : colors.card,
          },
          isToday && shadows.todayWerdCard,
        ]}>
        {isToday ? (
          <LinearGradient
            colors={[
              'transparent',
              colors.primary,
              colors.primaryShimmer,
              'transparent',
            ]}
            locations={[0, 0.3, 0.6, 1]}
            start={{x: 0, y: 0}}
            end={{x: 1, y: 0}}
            style={styles.todayBar}
          />
        ) : null}
        <Pressable
          style={styles.werdHeader}
          onPress={() => setOpen(prev => !prev)}>
          <View
            style={[
              styles.werdBadge,
              isToday ? styles.werdBadgeToday : styles.werdBadgeDefault,
            ]}>
            <Typography
              variant="caption"
              family="cairo"
              weight="bold"
              style={
                isToday
                  ? styles.werdBadgeTextToday
                  : styles.werdBadgeTextDefault
              }>
              {toArabicNumerals(werd.order + completedCount)}
            </Typography>
          </View>
          <View style={styles.werdTextWrap}>
            <View style={styles.werdTitleRow}>
              <Typography
                variant="body"
                family="amiri"
                weight="bold"
                style={{
                  fontSize: 16,
                  color: isToday ? colors.foreground : 'rgba(237,231,220,0.8)',
                }}>
                {getSurahNameArabic(werd.surah)}
              </Typography>
              {isToday ? (
                <View style={styles.todayPill}>
                  <Typography
                    variant="caption"
                    family="cairo"
                    weight="semibold"
                    style={[styles.todayPillText, {fontSize: 10}]}>
                    {t('plan.today')}
                  </Typography>
                </View>
              ) : null}
            </View>
            <Typography
              family="cairo"
              style={{
                fontSize: 11,
                color: isToday
                  ? 'rgba(212,200,185,0.55)'
                  : colors.mutedForeground,
              }}>
              {t('plan.verseRange', {
                from: toArabicNumerals(werd.range.from),
                to: toArabicNumerals(werd.range.to),
                n: toArabicNumerals(verseCount(werd)),
              })}
            </Typography>
          </View>
          <AnimatedChevron expanded={open} />
        </Pressable>
        {open ? (
          <Animated.View
            entering={FadeIn.duration(280)}
            exiting={FadeOut.duration(200)}
            style={styles.werdExpanded}>
            <View style={styles.werdInnerCard}>
              <View style={styles.versePreviewBlock}>
                <VerseRangeRow
                  verseNumber={werd.range.from}
                  tone={hasRange ? 'from' : 'single'}
                  text={fromText}
                />
                {hasRange ? (
                  <VerseRangeRow
                    verseNumber={werd.range.to}
                    tone="to"
                    text={toText}
                  />
                ) : null}
              </View>
            </View>
          </Animated.View>
        ) : null}
      </View>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  werdCard: {
    borderRadius: radius.lg,
    borderWidth: 1,
    overflow: 'hidden',
  },
  todayBar: {
    height: 2,
    width: '100%',
  },
  werdHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing[12],
    padding: spacing[12],
  },
  werdBadge: {
    width: 36,
    height: 36,
    borderRadius: radius.full,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
  },
  werdBadgeToday: {
    backgroundColor: 'rgba(212,200,185,0.1)',
    borderColor: 'rgba(212,200,185,0.22)',
  },
  werdBadgeDefault: {
    backgroundColor: colors.mutedTintFaint,
    borderColor: colors.mutedBorderSubtle,
  },
  werdBadgeTextToday: {
    color: 'rgba(212,200,185,0.75)',
  },
  werdBadgeTextDefault: {
    color: colors.mutedForeground,
  },
  werdTextWrap: {
    flex: 1,
    gap: 2,
  },
  werdTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing[8],
  },
  todayPill: {
    paddingVertical: 1,
    paddingHorizontal: spacing[8] - 1,
    borderRadius: 20,
    backgroundColor: 'rgba(212,200,185,0.07)',
    borderWidth: 1,
    borderColor: 'rgba(212,200,185,0.2)',
  },
  todayPillText: {
    color: 'rgba(212,200,185,0.75)',
  },
  werdExpanded: {
    paddingHorizontal: spacing[12],
    paddingBottom: spacing[12],
    borderTopWidth: 1,
    borderTopColor: colors.goldBorderFaint,
  },
  werdInnerCard: {
    marginTop: spacing[10],
    borderRadius: radius.tiny,
    overflow: 'hidden',
    backgroundColor: 'rgba(12,18,32,0.6)',
    borderWidth: 1,
    borderColor: colors.goldBorderFaint,
  },
  versePreviewBlock: {
    padding: spacing[10],
    gap: spacing[8],
    backgroundColor: 'rgba(15,12,8,0.45)',
  },
});
