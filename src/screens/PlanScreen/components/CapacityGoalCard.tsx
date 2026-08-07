import React from 'react';
import {View, StyleSheet, TextInput, Pressable} from 'react-native';
import {useTranslation} from 'react-i18next';
import {LinearGradient} from 'expo-linear-gradient';
import Svg, {Line, Circle} from 'react-native-svg';
import Animated, {
  FadeIn,
  FadeOut,
  LinearTransition,
} from 'react-native-reanimated';
import Typography from '../../../components/shared/Typography';
import {colors} from '../../../styles/colors';
import {radius} from '../../../styles/radius';
import {spacing} from '../../../styles/spacing';
import {usePlanCapacity} from '../hooks/usePlanCapacity';

const DAY_INDEXES = [6, 0, 1, 2, 3, 4, 5]; // Sat..Fri, matching س ح ن ث ر خ ج

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

export default function CapacityGoalCard() {
  const {t} = useTranslation();
  const {
    mode,
    toggleMode,
    activeDays,
    toggleDay,
    displayValue,
    justSaved,
    error,
    perDayLabel,
    handleCapacityChange,
    handleUpdateCapacity,
  } = usePlanCapacity();

  return (
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
              onPress={toggleMode}
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
                    mode === 'weekly' ? colors.primary : colors.mutedForeground,
                }}>
                {mode === 'daily' ? t('plan.modeDaily') : t('plan.modeWeekly')}
              </Typography>
              <FilterIcon
                color={
                  mode === 'weekly' ? colors.primary : colors.mutedForeground
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
                variant="caption"
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
                  variant="caption"
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
              colors={['transparent', 'rgba(196,154,60,0.15)', 'transparent']}
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
                    t('plan.dayLabels', {returnObjects: true}) as string[]
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
                          colors={[colors.primaryHighlight, colors.primary]}
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
          <Typography variant="caption" color="muted">
            {error}
          </Typography>
        ) : null}
      </View>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
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
});
