import React, {useEffect} from 'react';
import {StyleSheet, View} from 'react-native';
import Animated, {
  cancelAnimation,
  Easing,
  useAnimatedStyle,
  useSharedValue,
  withDelay,
  withRepeat,
  withSequence,
  withTiming,
} from 'react-native-reanimated';
import {colors} from '../../../styles/colors';
import {radius} from '../../../styles/radius';

const HALF_CYCLE_MS = 600;
const DOT_DELAYS_MS = [0, 220, 440];
const EASE_IN_OUT = Easing.bezier(0.42, 0, 0.58, 1);

function Dot({delay}: {delay: number}) {
  const opacity = useSharedValue(0.2);

  useEffect(() => {
    const timing = {duration: HALF_CYCLE_MS, easing: EASE_IN_OUT};
    opacity.value = withDelay(
      delay,
      withRepeat(withSequence(withTiming(1, timing), withTiming(0.2, timing)), -1),
    );
    return () => cancelAnimation(opacity);
  }, [delay, opacity]);

  const style = useAnimatedStyle(() => ({opacity: opacity.value}));

  return <Animated.View style={[styles.dot, style]} />;
}

export default function LoadingDots() {
  return (
    <View style={styles.row}>
      {DOT_DELAYS_MS.map(delay => (
        <Dot key={delay} delay={delay} />
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    gap: 8,
  },
  dot: {
    width: 5,
    height: 5,
    borderRadius: radius.full,
    backgroundColor: colors.primary,
  },
});
