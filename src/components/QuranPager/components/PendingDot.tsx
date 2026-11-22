import React, {useEffect} from 'react';
import {StyleSheet} from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withRepeat,
  withTiming,
} from 'react-native-reanimated';
import {colors} from '../../../styles/colors';

export default function PendingDot() {
  const opacity = useSharedValue(1);

  useEffect(() => {
    opacity.value = withRepeat(withTiming(0.3, {duration: 750}), -1, true);
  }, [opacity]);

  const style = useAnimatedStyle(() => ({opacity: opacity.value}));

  return <Animated.View style={[styles.pendingDot, style]} />;
}

const styles = StyleSheet.create({
  pendingDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: colors.primary,
    marginHorizontal: 4,
  },
});
