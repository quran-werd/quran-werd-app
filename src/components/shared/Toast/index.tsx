import React, {useEffect} from 'react';
import {View, StyleSheet} from 'react-native';
import Animated, {
  FadeInDown,
  FadeOutDown,
  useSharedValue,
  useAnimatedStyle,
  withRepeat,
  withTiming,
  Easing,
} from 'react-native-reanimated';
import Svg, {Path} from 'react-native-svg';
import {colors} from '../../../styles/colors';
import {radius} from '../../../styles/radius';
import {shadows} from '../../../styles/shadows';
import Typography from '../Typography';

interface ToastProps {
  visible: boolean;
  variant: 'pending' | 'merge';
  title: string;
  subtitle?: string;
}

// Gold dot with a soft ring that keeps pulsing while the app waits for the
// user to tap the end of the range.
function PendingIcon() {
  const pulse = useSharedValue(0);

  useEffect(() => {
    pulse.value = withRepeat(
      withTiming(1, {duration: 1200, easing: Easing.out(Easing.quad)}),
      -1,
      false,
    );
  }, [pulse]);

  const ringStyle = useAnimatedStyle(() => ({
    opacity: 0.55 * (1 - pulse.value),
    transform: [{scale: 1 + pulse.value * 1.2}],
  }));

  return (
    <View style={styles.icon}>
      <Animated.View style={[styles.pulseRing, ringStyle]} />
      <View style={styles.pendingDot} />
    </View>
  );
}

function MergeIcon() {
  return (
    <View style={[styles.icon, styles.mergeIcon]}>
      <Svg width={12} height={12} viewBox="0 0 16 16" fill="none">
        <Path
          d="M3.5 8.5l3 3 6-7"
          stroke={colors.mergeSuccessLight}
          strokeWidth={2}
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </Svg>
    </View>
  );
}

// Compact pill notification for range selection — pending end / merged.
export default function Toast({visible, variant, title, subtitle}: ToastProps) {
  const isPending = variant === 'pending';

  if (!visible) {
    return null;
  }

  return (
    <Animated.View
      entering={FadeInDown.springify().damping(22).stiffness(280)}
      exiting={FadeOutDown.duration(180)}
      style={[
        styles.pill,
        isPending ? styles.pillPending : styles.pillMerge,
        shadows.notificationToast,
      ]}>
      {isPending ? <PendingIcon /> : <MergeIcon />}
      <View>
        <Typography family="cairo" weight="semibold" style={styles.title}>
          {title}
        </Typography>
        {subtitle ? (
          <Typography family="cairo" color="muted" style={styles.subtitle}>
            {subtitle}
          </Typography>
        ) : null}
      </View>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  pill: {
    alignSelf: 'center',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingTop: 3,
    // Extra room under the text: Cairo glyphs sit low in their line box.
    paddingBottom: 7,
    paddingStart: 6,
    paddingEnd: 14,
    borderRadius: radius.full,
    borderWidth: 1,
    backgroundColor: 'rgba(19,29,48,0.96)',
  },
  pillPending: {
    borderColor: colors.goldBorderIntense,
  },
  pillMerge: {
    borderColor: 'rgba(98,200,122,0.4)',
  },
  icon: {
    width: 18,
    height: 18,
    alignItems: 'center',
    justifyContent: 'center',
  },
  pulseRing: {
    position: 'absolute',
    width: 12,
    height: 12,
    borderRadius: radius.full,
    backgroundColor: colors.primary,
  },
  pendingDot: {
    width: 10,
    height: 10,
    borderRadius: radius.full,
    backgroundColor: colors.primary,
    borderWidth: 2,
    borderColor: colors.primaryShimmer,
  },
  mergeIcon: {
    borderRadius: radius.full,
    backgroundColor: colors.mergeIconBg,
    borderWidth: 1,
    borderColor: 'rgba(98,200,122,0.45)',
  },
  title: {
    fontSize: 13,
    lineHeight: 20,
    color: colors.foreground,
  },
  subtitle: {
    fontSize: 11,
  },
});
