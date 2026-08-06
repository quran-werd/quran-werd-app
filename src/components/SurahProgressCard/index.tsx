import React, {useEffect, useMemo, useState} from 'react';
import {View, Pressable, StyleSheet} from 'react-native';
import {useTranslation} from 'react-i18next';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  FadeIn,
  FadeOut,
  LinearTransition,
} from 'react-native-reanimated';
import {LinearGradient} from 'expo-linear-gradient';
import Svg, {Path} from 'react-native-svg';
import Typography from '../shared/Typography';
import {colors} from '../../styles/colors';
import {radius} from '../../styles/radius';
import {shadows} from '../../styles/shadows';
import {MemorizationVerseRange} from '../../types/memorization.types';
import MemorizedRangeItem from '../MemorizedRangeItem';
import SurahNumber from './components/SurahNumber';
import {SURAHS_INFO} from '../../content';
import {
  getMemorizedPercentageFromRanges,
  getMemorizedVersesCountFromRanges,
} from '../../utils/helpers.utils';

interface SurahProgressCardProps {
  ranges: MemorizationVerseRange[];
  surahNumber: number;
  onDeleteRange?: (range: MemorizationVerseRange) => void;
}

function ChevronDown({open}: {open: boolean}) {
  const rotation = useSharedValue(open ? 180 : 0);

  useEffect(() => {
    rotation.value = withTiming(open ? 180 : 0, {duration: 300});
  }, [open, rotation]);

  const style = useAnimatedStyle(() => ({
    transform: [{rotate: `${rotation.value}deg`}],
  }));

  return (
    <Animated.View style={style}>
      <Svg width={16} height={16} viewBox="0 0 24 24" fill="none">
        <Path
          d="M6 9l6 6 6-6"
          stroke={colors.mutedForeground}
          strokeWidth={1.5}
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </Svg>
    </Animated.View>
  );
}

export default function SurahProgressCard({
  surahNumber,
  ranges,
  onDeleteRange,
}: SurahProgressCardProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const {t} = useTranslation();

  const progressPercentage = useMemo(
    () => getMemorizedPercentageFromRanges(surahNumber, ranges),
    [surahNumber, ranges],
  );

  const memorizedVersesCount = useMemo(
    () => getMemorizedVersesCountFromRanges(ranges),
    [ranges],
  );

  const surahInfo = useMemo(() => SURAHS_INFO[surahNumber - 1], [surahNumber]);

  return (
    <Animated.View
      layout={LinearTransition}
      style={[
        styles.container,
        {
          borderColor: isExpanded ? colors.goldBorderStrong : 'rgba(196,154,60,0.14)',
        },
        isExpanded ? shadows.surahCardExpanded : shadows.surahCardDefault,
      ]}>
      <LinearGradient
        colors={[colors.elevatedCard, colors.card]}
        start={{x: 0, y: 0}}
        end={{x: 1, y: 1}}
        style={StyleSheet.absoluteFillObject}
      />
      <LinearGradient
        colors={['transparent', 'rgba(196,154,60,0.25)', 'transparent']}
        start={{x: 0, y: 0}}
        end={{x: 1, y: 0}}
        style={styles.hairline}
      />
      <Pressable style={styles.header} onPress={() => setIsExpanded(prev => !prev)}>
        <SurahNumber surahNumber={surahNumber} />
        <View style={styles.surahInfo}>
          <Typography variant="subtitle" family="amiriBold" style={styles.surahName}>
            {surahInfo.arabic}
          </Typography>
          <Typography family="cairo" style={styles.surahMeta}>
            {t('memorization.surah.verseCount', {
              memorized: memorizedVersesCount,
              total: surahInfo.aya,
            })}
          </Typography>
        </View>
        <ChevronDown open={isExpanded} />
      </Pressable>

      <View style={styles.progressTrack}>
        <LinearGradient
          colors={
            progressPercentage >= 90
              ? [colors.primary, '#D4B86A']
              : ['rgba(196,154,60,0.45)', 'rgba(196,154,60,0.75)']
          }
          start={{x: 0, y: 0}}
          end={{x: 1, y: 0}}
          style={[styles.progressFill, {width: `${Math.min(progressPercentage, 100)}%`}]}
        />
      </View>

      {isExpanded && ranges.length > 0 && (
        <Animated.View
          entering={FadeIn.duration(280)}
          exiting={FadeOut.duration(200)}
          style={styles.expandedContent}>
          <View style={styles.expandedDivider} />
          {ranges.map(range => (
            <MemorizedRangeItem
              key={`${range.from}-${range.to}`}
              range={{
                id: `${surahNumber}-${range.from}-${range.to}`,
                startVerse: range.from,
                endVerse: range.to,
                startText: '',
                endText: '',
                wordsCount: 0,
                versesCount: range.to - range.from + 1,
                chapterNumber: surahNumber,
              }}
              surahNumber={surahNumber}
              showDeleteButton={!!onDeleteRange}
              onDelete={() => onDeleteRange?.(range)}
            />
          ))}
        </Animated.View>
      )}
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    borderRadius: radius.xl,
    borderWidth: 1,
    overflow: 'hidden',
    marginBottom: 12,
  },
  hairline: {
    height: 1,
    width: '100%',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingTop: 16,
    paddingBottom: 12,
    paddingHorizontal: 16,
  },
  surahInfo: {flex: 1, gap: 2},
  surahName: {
    color: colors.foreground,
  },
  surahMeta: {
    fontSize: 11,
    color: colors.mutedForeground,
  },
  progressTrack: {
    height: 3,
    borderRadius: radius.full,
    backgroundColor: 'rgba(196,154,60,0.1)',
    marginHorizontal: 16,
    marginBottom: 12,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    borderRadius: radius.full,
  },
  expandedContent: {
    paddingHorizontal: 12,
    paddingBottom: 12,
    gap: 8,
    overflow: 'hidden',
  },
  expandedDivider: {
    height: 1,
    backgroundColor: colors.goldBorderFaint,
    marginBottom: 4,
  },
});
