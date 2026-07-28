import React, {useEffect} from 'react';
import {Pressable, StyleSheet} from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
} from 'react-native-reanimated';
import {LinearGradient} from 'expo-linear-gradient';
import {colors} from '../../../styles/colors';
import {shadows} from '../../../styles/shadows';

interface SettingsToggleProps {
  value: boolean;
  onValueChange: (value: boolean) => void;
}

// Track is 46px wide with 3px padding on each side; thumb is 21px, so the
// thumb travels (46 - 3*2 - 21) = 19px between its off/on positions.
const THUMB_TRAVEL = 19;

// Settings on/off toggle — see docs/design.md §2.14.
export default function SettingsToggle({value, onValueChange}: SettingsToggleProps) {
  const progress = useSharedValue(value ? 1 : 0);

  useEffect(() => {
    progress.value = withTiming(value ? 1 : 0, {duration: 220});
  }, [value, progress]);

  const thumbStyle = useAnimatedStyle(() => ({
    transform: [{translateX: progress.value * THUMB_TRAVEL}],
  }));

  return (
    <Pressable
      onPress={() => onValueChange(!value)}
      style={[styles.track, value ? styles.trackOn : styles.trackOff]}>
      {value ? (
        <LinearGradient
          colors={[colors.primary, '#A07A28']}
          start={{x: 0, y: 0}}
          end={{x: 1, y: 1}}
          style={StyleSheet.absoluteFillObject}
        />
      ) : null}
      <Animated.View style={[styles.thumb, shadows.toggleThumb, thumbStyle]} />
    </Pressable>
  );
}

const styles = StyleSheet.create({
  track: {
    width: 46,
    height: 27,
    borderRadius: 14,
    padding: 3,
    justifyContent: 'center',
    overflow: 'hidden',
  },
  trackOff: {
    backgroundColor: 'rgba(42,61,92,0.9)',
    borderWidth: 1,
    borderColor: 'rgba(138,154,184,0.18)',
  },
  trackOn: {
    backgroundColor: colors.primary,
    borderWidth: 1,
    borderColor: 'rgba(196,154,60,0.45)',
  },
  thumb: {
    width: 21,
    height: 21,
    borderRadius: 21 / 2,
    backgroundColor: colors.foreground,
  },
});
