import React, {useEffect, useState, useCallback, useMemo} from 'react';
import {
  View,
  StyleSheet,
  SafeAreaView,
  FlatList,
  TextInput,
  RefreshControl,
  Pressable,
} from 'react-native';
import {useTranslation} from 'react-i18next';
import {LinearGradient} from 'expo-linear-gradient';
import Svg, {
  Defs,
  RadialGradient,
  Stop,
  Rect,
  Path,
  Circle,
  Line,
} from 'react-native-svg';
import Animated, {
  FadeInDown,
  FadeIn,
  FadeOut,
  LinearTransition,
  useSharedValue,
  useAnimatedStyle,
  withTiming,
} from 'react-native-reanimated';
import Typography from '../../components/shared/Typography';
import {colors} from '../../styles/colors';
import {radius} from '../../styles/radius';
import {spacing} from '../../styles/spacing';
import {shadows} from '../../styles/shadows';
import {useAppDispatch, useAppSelector} from '../../store/hooks';
import {
  fetchRevisionPlan,
  generatePlan,
  updateCapacity,
} from '../../features/RevisionPlan/revisionPlanAction';
import {
  selectRevisionPlan,
  selectRevisionPlanLoading,
  selectRevisionPlanError,
} from '../../features/RevisionPlan/revisionPlanSlice';
import {selectTodayWerd} from '../../features/RevisionLog/revisionLogSlice';
import {getSurahNameArabic, toArabicNumerals} from '../../content';
import {fetchAyahByKey} from '../../services/clients/quranCdnClient';
import type {Werd} from '../../services/revisionPlan.service';

type CapacityMode = 'daily' | 'weekly';
const DEFAULT_CAPACITY = 20;
const DAY_INDEXES = [6, 0, 1, 2, 3, 4, 5]; // Sat..Fri, matching س ح ن ث ر خ ج
const DEFAULT_ACTIVE_DAYS = new Set([6, 0, 1, 2, 3]); // Sat, Sun, Mon, Tue, Wed

function verseCount(werd: Werd) {
  return werd.range.to - werd.range.from + 1;
}

function AmbientGlow() {
  return (
    <Svg
      style={styles.ambientGlow}
      pointerEvents="none"
      width="200"
      height="60">
      <Defs>
        <RadialGradient id="planHeaderGlow" cx="50%" cy="0%" rx="50%" ry="90%">
          <Stop offset="0%" stopColor={colors.primary} stopOpacity={0.07} />
          <Stop offset="70%" stopColor={colors.primary} stopOpacity={0} />
        </RadialGradient>
      </Defs>
      <Rect x={0} y={0} width="200" height="60" fill="url(#planHeaderGlow)" />
    </Svg>
  );
}

function FilterIcon({color}: {color: string}) {
  return (
    <Svg width={13} height={13} viewBox="0 0 16 16" fill="none">
      <Line
        x1={2}
        y1={4}
        x2={14}
        y2={4}
        stroke={color}
        strokeWidth={1.5}
        strokeLinecap="round"
      />
      <Line
        x1={2}
        y1={8}
        x2={14}
        y2={8}
        stroke={color}
        strokeWidth={1.5}
        strokeLinecap="round"
      />
      <Line
        x1={2}
        y1={12}
        x2={14}
        y2={12}
        stroke={color}
        strokeWidth={1.5}
        strokeLinecap="round"
      />
      <Circle cx={10} cy={4} r={2} fill={color} />
      <Circle cx={5} cy={8} r={2} fill={color} />
      <Circle cx={10} cy={12} r={2} fill={color} />
    </Svg>
  );
}

function ChevronIcon({expanded}: {expanded: boolean}) {
  const rotation = useSharedValue(expanded ? 180 : 0);

  useEffect(() => {
    rotation.value = withTiming(expanded ? 180 : 0, {duration: 300});
  }, [expanded, rotation]);

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

function EmptyIcon() {
  return (
    <Svg width={44} height={44} viewBox="0 0 48 48" fill="none">
      <Path
        d="M8 40V12a4 4 0 0 1 4-4h24a4 4 0 0 1 4 4v28l-8-4-8 4-8-4-8 4z"
        stroke="rgba(196,154,60,0.5)"
        strokeWidth={1.5}
      />
      <Path
        d="M16 18h16"
        stroke="rgba(196,154,60,0.4)"
        strokeWidth={1.5}
        strokeLinecap="round"
      />
      <Path
        d="M16 24h10"
        stroke="rgba(196,154,60,0.4)"
        strokeWidth={1.5}
        strokeLinecap="round"
      />
    </Svg>
  );
}

function EmptyState({
  onGenerate,
  loading,
}: {
  onGenerate: () => void;
  loading: boolean;
}) {
  const {t} = useTranslation();
  return (
    <View style={styles.emptyState}>
      <View style={styles.emptyCircleWrap}>
        <View style={styles.emptyDashedRing} />
        <View style={styles.emptyCircle}>
          <EmptyIcon />
        </View>
      </View>
      <View style={styles.emptyTextBlock}>
        <Typography
          variant="h3"
          family="amiri"
          weight="bold"
          align="center"
          style={styles.emptyTitle}>
          {t('plan.emptyTitle')}
        </Typography>
        <Typography
          variant="small"
          family="cairo"
          color="muted"
          align="center"
          style={styles.emptyBody}>
          {t('plan.emptyBodyLine1')}
          {'\n'}
          {t('plan.emptyBodyLine2')}
        </Typography>
      </View>
      <Pressable
        onPress={onGenerate}
        disabled={loading}
        style={styles.emptyCta}>
        <LinearGradient
          colors={[colors.primaryHighlight, colors.primary]}
          start={{x: 0, y: 0}}
          end={{x: 1, y: 1}}
          style={styles.emptyCtaGradient}>
          <Typography
            variant="body"
            family="cairo"
            weight="semibold"
            style={[styles.emptyCtaText, {fontSize: 15}]}>
            {t('plan.generate')}
          </Typography>
        </LinearGradient>
      </Pressable>
    </View>
  );
}

function VerseRow({
  number,
  circleBg,
  numberColor,
  label,
  labelColor,
  text,
  textColor,
}: {
  number: number;
  circleBg: string;
  numberColor: string;
  label: string;
  labelColor: string;
  text: string | null;
  textColor: string;
}) {
  return (
    <View style={styles.verseRow}>
      <View style={[styles.verseCircle, {backgroundColor: circleBg}]}>
        <Typography
          family="cairo"
          weight="bold"
          style={{fontSize: 10, color: numberColor}}>
          {toArabicNumerals(number)}
        </Typography>
      </View>
      <View style={styles.verseTextWrap}>
        <Typography style={[styles.verseLabel, {color: labelColor}]}>
          {label}
        </Typography>
        {text ? (
          <Typography
            family="amiriQuran"
            numberOfLines={1}
            style={[styles.verseText, {color: textColor}]}>
            {text}
          </Typography>
        ) : null}
      </View>
    </View>
  );
}

function WerdCard({
  werd,
  isToday,
  index,
}: {
  werd: Werd;
  isToday: boolean;
  index: number;
}) {
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
            backgroundColor: isToday ? 'rgba(30,26,20,0.6)' : colors.card,
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
              variant="small"
              family="cairo"
              weight="bold"
              style={
                isToday
                  ? styles.werdBadgeTextToday
                  : styles.werdBadgeTextDefault
              }>
              {toArabicNumerals(werd.order)}
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
                    variant="small"
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
          <ChevronIcon expanded={open} />
        </Pressable>
        {open ? (
          <Animated.View
            entering={FadeIn.duration(280)}
            exiting={FadeOut.duration(200)}
            style={styles.werdExpanded}>
            <View style={styles.werdInnerCard}>
              <View style={styles.versePreviewBlock}>
                <VerseRow
                  number={werd.range.from}
                  circleBg="rgba(196,154,60,0.12)"
                  numberColor={colors.primary}
                  label={
                    hasRange
                      ? t('plan.verseLabelFrom')
                      : t('plan.verseLabelSingle')
                  }
                  labelColor={colors.mutedForeground}
                  text={fromText}
                  textColor={colors.foreground}
                />
                {hasRange ? (
                  <VerseRow
                    number={werd.range.to}
                    circleBg="rgba(138,154,184,0.1)"
                    numberColor={colors.mutedForeground}
                    label={t('plan.verseLabelTo')}
                    labelColor={colors.mutedForeground}
                    text={toText}
                    textColor={colors.dimmedForeground}
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

export default function PlanScreen() {
  const {t} = useTranslation();
  const dispatch = useAppDispatch();
  const plan = useAppSelector(selectRevisionPlan);
  const loading = useAppSelector(selectRevisionPlanLoading);
  const error = useAppSelector(selectRevisionPlanError);
  const today = useAppSelector(selectTodayWerd);
  const [capacity, setCapacity] = useState(String(DEFAULT_CAPACITY));
  const [justSaved, setJustSaved] = useState(false);
  const [mode, setMode] = useState<CapacityMode>('daily');
  const [activeDays, setActiveDays] =
    useState<Set<number>>(DEFAULT_ACTIVE_DAYS);

  const loadPlan = useCallback(() => {
    dispatch(fetchRevisionPlan());
  }, [dispatch]);

  useEffect(() => {
    loadPlan();
  }, [loadPlan]);

  useEffect(() => {
    if (plan?.dailyCapacity) {
      setCapacity(String(plan.dailyCapacity));
    }
  }, [plan?.dailyCapacity]);

  const dailyCapacityValue = parseInt(capacity, 10) || 0;
  const displayValue =
    mode === 'daily' ? dailyCapacityValue : dailyCapacityValue * 7;

  const handleCapacityChange = (value: string) => {
    setJustSaved(false);
    if (mode === 'daily') {
      setCapacity(value);
    } else {
      const weekly = parseInt(value, 10) || 0;
      setCapacity(String(Math.max(1, Math.round(weekly / 7))));
    }
  };

  const handleGenerate = () => {
    dispatch(generatePlan(DEFAULT_CAPACITY));
  };

  const handleUpdateCapacity = async () => {
    const value = parseInt(capacity, 10);
    if (value > 0) {
      setJustSaved(false);
      try {
        await dispatch(updateCapacity(value)).unwrap();
        setJustSaved(true);
      } catch {
        // error surfaced via selectRevisionPlanError
      }
    }
  };

  const toggleDay = (dayIndex: number) => {
    setActiveDays(prev => {
      const next = new Set(prev);
      if (next.has(dayIndex)) {
        next.delete(dayIndex);
      } else {
        next.add(dayIndex);
      }
      return next.size > 0 ? next : prev;
    });
  };

  const perDayLabel = useMemo(() => {
    const weekly = dailyCapacityValue * 7;
    const perDay = activeDays.size > 0 ? weekly / activeDays.size : weekly;
    const rounded = Math.round(perDay * 2) / 2;
    return toArabicNumerals(rounded);
  }, [dailyCapacityValue, activeDays]);

  const totals = useMemo(() => {
    const awrad = plan?.awrad ?? [];
    return {
      werds: awrad.length,
      verses: awrad.reduce((sum, w) => sum + verseCount(w), 0),
    };
  }, [plan?.awrad]);

  const awrad = plan?.awrad ?? [];

  if (!plan) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.header}>
          <AmbientGlow />
          <View style={styles.headerRow}>
            <Typography
              variant="h2"
              family="amiri"
              weight="bold"
              style={styles.headerTitle}>
              {t('plan.title')}
            </Typography>
          </View>
        </View>
        <EmptyState onGenerate={handleGenerate} loading={loading} />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <FlatList
        data={awrad}
        keyExtractor={item => item._id}
        refreshControl={
          <RefreshControl refreshing={loading} onRefresh={loadPlan} />
        }
        ListHeaderComponent={
          <View>
            <View style={styles.header}>
              <AmbientGlow />
              <View style={styles.headerRow}>
                <Typography
                  variant="h2"
                  family="amiri"
                  weight="bold"
                  style={styles.headerTitle}>
                  {t('plan.title')}
                </Typography>
                {awrad.length > 0 ? (
                  <Typography
                    family="cairo"
                    color="muted"
                    style={styles.werdCountLabel}>
                    {t('plan.werdCount', {n: toArabicNumerals(awrad.length)})}
                  </Typography>
                ) : null}
              </View>
            </View>

            <Animated.View layout={LinearTransition} style={styles.goalCard}>
              <LinearGradient
                colors={['transparent', colors.primary, 'transparent']}
                locations={[0, 0.4, 1]}
                start={{x: 0, y: 0}}
                end={{x: 1, y: 0}}
                style={styles.goalCardTopBar}
              />
              <View style={styles.goalCardBody}>
                <View style={styles.goalCardRow}>
                  <View
                    style={[
                      styles.capacityInputWrap,
                      {
                        borderColor:
                          mode === 'weekly'
                            ? 'rgba(196,154,60,0.35)'
                            : 'rgba(196,154,60,0.2)',
                      },
                    ]}>
                    <TextInput
                      style={styles.capacityInput}
                      value={String(displayValue)}
                      onChangeText={handleCapacityChange}
                      keyboardType="number-pad"
                    />
                    <Pressable
                      onPress={() =>
                        setMode(prev => (prev === 'daily' ? 'weekly' : 'daily'))
                      }
                      style={[
                        styles.modeToggle,
                        mode === 'weekly'
                          ? styles.modeToggleWeekly
                          : styles.modeToggleDaily,
                      ]}>
                      <Typography
                        family="cairo"
                        style={{
                          fontSize: 12,
                          color:
                            mode === 'weekly'
                              ? colors.primary
                              : colors.mutedForeground,
                        }}>
                        {mode === 'daily'
                          ? t('plan.modeDaily')
                          : t('plan.modeWeekly')}
                      </Typography>
                      <FilterIcon
                        color={
                          mode === 'weekly'
                            ? colors.primary
                            : colors.mutedForeground
                        }
                      />
                    </Pressable>
                  </View>
                  <Pressable
                    onPress={handleUpdateCapacity}
                    style={[
                      styles.updateButton,
                      justSaved && styles.updateButtonSaved,
                    ]}>
                    {justSaved ? (
                      <Typography
                        variant="small"
                        family="cairo"
                        weight="bold"
                        style={[styles.updateButtonTextSaved, {fontSize: 11}]}>
                        {t('plan.updated')}
                      </Typography>
                    ) : (
                      <LinearGradient
                        colors={[colors.primaryHighlight, colors.primary]}
                        start={{x: 0, y: 0}}
                        end={{x: 1, y: 1}}
                        style={styles.updateButtonGradient}>
                        <Typography
                          variant="small"
                          family="cairo"
                          weight="bold"
                          style={[styles.updateButtonText, {fontSize: 11}]}>
                          {t('plan.updateCapacity')}
                        </Typography>
                      </LinearGradient>
                    )}
                  </Pressable>
                </View>

                {mode === 'weekly' ? (
                  <Animated.View
                    entering={FadeIn.duration(250)}
                    exiting={FadeOut.duration(250)}
                    layout={LinearTransition}
                    style={styles.dayPickerWrap}>
                    <LinearGradient
                      colors={[
                        'transparent',
                        'rgba(196,154,60,0.15)',
                        'transparent',
                      ]}
                      start={{x: 0, y: 0}}
                      end={{x: 1, y: 0}}
                      style={styles.dayPickerSeparator}
                    />
                    <View style={styles.dayPickerRow}>
                      <Typography
                        family="cairo"
                        weight="bold"
                        style={styles.perDayLabel}>
                        {perDayLabel} {t('plan.modeDaily')}
                      </Typography>
                      <View style={styles.dayButtonsRow}>
                        {DAY_INDEXES.map((dayIndex, i) => {
                          const active = activeDays.has(dayIndex);
                          const label = (
                            t('plan.dayLabels', {
                              returnObjects: true,
                            }) as string[]
                          )[i];
                          return (
                            <Pressable
                              key={dayIndex}
                              onPress={() => toggleDay(dayIndex)}
                              style={[
                                styles.dayButton,
                                active
                                  ? styles.dayButtonActive
                                  : styles.dayButtonInactive,
                              ]}>
                              {active ? (
                                <LinearGradient
                                  colors={[
                                    colors.primaryHighlight,
                                    colors.primary,
                                  ]}
                                  style={StyleSheet.absoluteFillObject}
                                  start={{x: 0, y: 0}}
                                  end={{x: 1, y: 1}}
                                />
                              ) : null}
                              <Typography
                                family="cairo"
                                weight="bold"
                                style={{
                                  fontSize: 10,
                                  color: active
                                    ? colors.background
                                    : colors.mutedForeground,
                                }}>
                                {label}
                              </Typography>
                            </Pressable>
                          );
                        })}
                      </View>
                    </View>
                  </Animated.View>
                ) : null}

                {error ? (
                  <Typography variant="small" color="muted">
                    {error}
                  </Typography>
                ) : null}
              </View>
            </Animated.View>

            {awrad.length > 0 ? (
              <Typography family="cairo" style={styles.sectionLabel}>
                {t('plan.sectionLabel')}
              </Typography>
            ) : null}
          </View>
        }
        renderItem={({item, index}) => (
          <View style={styles.werdCardWrap}>
            <WerdCard
              werd={item}
              isToday={today?.werd?._id === item._id}
              index={index}
            />
          </View>
        )}
        ListFooterComponent={
          totals.werds > 0 ? (
            <View style={styles.summaryFooter}>
              <Typography
                family="cairo"
                align="center"
                style={styles.summaryText}>
                {t('plan.summaryDays', {n: toArabicNumerals(totals.werds)})}
              </Typography>
            </View>
          ) : null
        }
        contentContainerStyle={styles.list}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {flex: 1, backgroundColor: colors.background},
  list: {paddingBottom: spacing[24]},
  header: {
    paddingHorizontal: spacing[20],
    paddingTop: 40,
    paddingBottom: spacing[12],
    borderBottomWidth: 1,
    borderBottomColor: colors.goldBorderSubtle,
  },
  ambientGlow: {
    position: 'absolute',
    top: 0,
    left: '50%',
    marginLeft: -100,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'baseline',
    justifyContent: 'space-between',
  },
  headerTitle: {
    fontSize: 22,
    lineHeight: 22 * 1.2,
  },
  werdCountLabel: {
    fontSize: 11,
  },
  emptyState: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: spacing[32],
    gap: spacing[24],
  },
  emptyCircleWrap: {
    width: 100,
    height: 100,
    alignItems: 'center',
    justifyContent: 'center',
  },
  emptyDashedRing: {
    position: 'absolute',
    top: -8,
    left: -8,
    right: -8,
    bottom: -8,
    borderRadius: 58,
    borderWidth: 1,
    borderColor: 'rgba(196,154,60,0.12)',
    borderStyle: 'dashed',
  },
  emptyCircle: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: 'rgba(196,154,60,0.06)',
    borderWidth: 1,
    borderColor: 'rgba(196,154,60,0.15)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  emptyTextBlock: {
    gap: spacing[8],
  },
  emptyTitle: {
    fontSize: 20,
    lineHeight: 20 * 1.3,
  },
  emptyBody: {
    fontSize: 13,
    lineHeight: 13 * 1.7,
  },
  emptyCta: {
    borderRadius: radius.md,
    overflow: 'hidden',
    ...shadows.primaryCta,
  },
  emptyCtaGradient: {
    paddingVertical: spacing[14] - 1,
    paddingHorizontal: spacing[32],
  },
  emptyCtaText: {
    color: colors.background,
  },
  goalCard: {
    borderRadius: radius.xl,
    backgroundColor: colors.card,
    borderWidth: 1,
    borderColor: colors.goldWashStrong,
    marginHorizontal: spacing[16],
    marginTop: spacing[12],
    overflow: 'hidden',
  },
  goalCardTopBar: {
    height: 2,
    width: '100%',
  },
  goalCardBody: {
    paddingVertical: spacing[8] - 1,
    paddingHorizontal: spacing[10],
    gap: spacing[8],
  },
  goalCardRow: {
    flexDirection: 'row',
    gap: spacing[10],
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  capacityInputWrap: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing[8],
    paddingVertical: spacing[12],
    paddingHorizontal: spacing[10],
    borderRadius: radius.xxs,
    backgroundColor: 'rgba(8,14,24,0.7)',
    borderWidth: 1,
  },
  capacityInput: {
    width: 36,
    fontSize: 14,
    fontWeight: '700',
    color: colors.foreground,
    textAlign: 'center',
    padding: 0,
  },
  modeToggle: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    paddingVertical: spacing[4],
    paddingHorizontal: spacing[8],
    borderRadius: 7,
    borderWidth: 1,
  },
  modeToggleDaily: {
    backgroundColor: colors.mutedTintFaint,
    borderColor: 'rgba(138,154,184,0.2)',
  },
  modeToggleWeekly: {
    backgroundColor: 'rgba(196,154,60,0.12)',
    borderColor: 'rgba(196,154,60,0.4)',
  },
  updateButton: {
    borderRadius: radius.xxs,
    overflow: 'hidden',
    flexShrink: 0,
    shadowColor: colors.primary,
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.25,
    shadowRadius: 8,
    elevation: 3,
  },
  updateButtonGradient: {
    paddingVertical: spacing[14] - 1,
    paddingHorizontal: spacing[12],
    alignItems: 'center',
  },
  updateButtonSaved: {
    backgroundColor: 'rgba(61,166,90,0.12)',
    borderWidth: 1,
    borderColor: 'rgba(61,166,90,0.35)',
    paddingVertical: spacing[14] - 1,
    paddingHorizontal: spacing[12],
    alignItems: 'center',
  },
  updateButtonText: {
    color: colors.background,
  },
  updateButtonTextSaved: {
    color: colors.mergeSuccess,
  },
  dayPickerWrap: {
    paddingTop: spacing[6],
  },
  dayPickerSeparator: {
    height: 1,
    marginBottom: spacing[6],
  },
  dayPickerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
  },
  dayButtonsRow: {
    flex: 1,
    flexDirection: 'row',
    gap: 3,
    paddingVertical: spacing[2],
  },
  dayButton: {
    flex: 1,
    aspectRatio: 1,
    borderRadius: 999,
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
    borderWidth: 1,
  },
  dayButtonActive: {
    borderColor: 'rgba(196,154,60,0.5)',
  },
  dayButtonInactive: {
    backgroundColor: colors.mutedTintFaint,
    borderColor: colors.mutedBorderSubtle,
  },
  perDayLabel: {
    fontSize: 9,
    color: colors.primary,
    flexShrink: 0,
  },
  sectionLabel: {
    fontSize: 11,
    color: 'rgba(138,154,184,0.45)',
    letterSpacing: 0.04 * 11,
    paddingHorizontal: spacing[16] + spacing[4],
    paddingTop: spacing[16],
    marginBottom: spacing[8],
  },
  werdCardWrap: {
    paddingHorizontal: spacing[16],
    paddingBottom: spacing[6],
  },
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
  verseRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing[8],
  },
  verseCircle: {
    width: 24,
    height: 24,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  verseTextWrap: {
    flex: 1,
    gap: 2,
  },
  verseLabel: {
    fontSize: 10,
  },
  verseText: {
    fontSize: 14,
    lineHeight: 14 * 1.6,
  },
  summaryFooter: {
    marginHorizontal: spacing[16],
    marginTop: spacing[16],
    paddingVertical: spacing[12],
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: 'rgba(138,154,184,0.1)',
    borderStyle: 'dashed',
    backgroundColor: 'rgba(138,154,184,0.04)',
  },
  summaryText: {
    fontSize: 12,
    color: 'rgba(138,154,184,0.5)',
  },
});
