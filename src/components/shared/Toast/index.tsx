import React from 'react';
import {View, StyleSheet} from 'react-native';
import Animated, {FadeInUp, FadeOutUp} from 'react-native-reanimated';
import {LinearGradient} from 'expo-linear-gradient';
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

// Pending-range / merge-success notification toasts — see docs/design.md §2.13.
export default function Toast({visible, variant, title, subtitle}: ToastProps) {
  const isPending = variant === 'pending';

  if (!visible) {
    return null;
  }

  return (
    <Animated.View
      entering={FadeInUp.springify().damping(26).stiffness(320)}
      exiting={FadeOutUp}
      style={[
        styles.container,
        isPending ? shadows.notificationToast : shadows.mergeNotification,
      ]}>
      <LinearGradient
        colors={
          isPending
            ? ['rgba(30,22,8,0.97)', 'rgba(20,15,5,0.97)']
            : ['rgba(8,22,12,0.97)', 'rgba(5,18,8,0.97)']
        }
        style={styles.gradient}>
        <LinearGradient
          colors={
            isPending
              ? [colors.primary, colors.primaryShimmer, colors.primary]
              : [colors.mergeSuccess, colors.mergeSuccessLight, colors.mergeSuccess]
          }
          start={{x: 0, y: 0}}
          end={{x: 1, y: 0}}
          style={styles.accentBar}
        />
        <View style={styles.content}>
          <View
            style={[
              styles.iconCircle,
              {
                backgroundColor: isPending ? colors.goldTintMedium : colors.mergeIconBg,
                borderColor: isPending
                  ? colors.goldBorderIntense
                  : 'rgba(80,160,100,0.35)',
              },
            ]}>
            <View
              style={[
                styles.dot,
                {backgroundColor: isPending ? colors.primary : colors.mergeSuccess},
              ]}
            />
          </View>
          <View style={styles.textWrap}>
            <Typography color="foreground" weight="semibold" variant="small">
              {title}
            </Typography>
            {subtitle ? (
              <Typography color="muted" variant="small">
                {subtitle}
              </Typography>
            ) : null}
          </View>
        </View>
      </LinearGradient>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    borderRadius: radius.lg,
    overflow: 'hidden',
  },
  gradient: {
    overflow: 'hidden',
    borderRadius: radius.lg,
  },
  accentBar: {
    height: 3,
    width: '100%',
  },
  content: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    padding: 10,
    paddingHorizontal: 14,
  },
  iconCircle: {
    width: 32,
    height: 32,
    borderRadius: radius.full,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: radius.full,
  },
  textWrap: {
    flex: 1,
  },
});
