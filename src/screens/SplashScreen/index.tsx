import React, {useEffect} from 'react';
import {LayoutChangeEvent, StyleSheet, View} from 'react-native';
import Animated, {
  Easing,
  SharedValue,
  useAnimatedStyle,
  useSharedValue,
  withDelay,
  withTiming,
  WithTimingConfig,
} from 'react-native-reanimated';
import {LinearGradient} from 'expo-linear-gradient';
import BrandMark from '../../components/shared/BrandMark';
import Typography from '../../components/shared/Typography';
import {colors} from '../../styles/colors';
import {radius} from '../../styles/radius';
import {getLineHeight} from '../../styles/typography';
import LoadingDots from './components/LoadingDots';
import SplashBackdrop from './components/SplashBackdrop';
import {LOGIN_BRAND_MARK_TOP} from './splashHandoff';

const WORDMARK = 'حافظ';
const TAGLINE = 'راجع • احفظ • تذكّر';

const WORDMARK_SIZE = 56;
const GOLD_CLEAR = 'rgba(196,154,60,0)';

const EASE_OUT_QUINT = Easing.bezier(0.22, 1, 0.36, 1);
const EASE_OUT_EXPO = Easing.bezier(0.16, 1, 0.3, 1);
const EASE_OUT = Easing.bezier(0, 0, 0.58, 1);
const EASE_IN_OUT = Easing.bezier(0.42, 0, 0.58, 1);

function useEntrance(
  delay: number,
  duration: number,
  easing: WithTimingConfig['easing'],
) {
  const progress = useSharedValue(0);

  useEffect(() => {
    progress.value = withDelay(delay, withTiming(1, {duration, easing}));
  }, [delay, duration, easing, progress]);

  return progress;
}

function useFadeOut(exitProgress: SharedValue<number>) {
  return useAnimatedStyle(() => ({opacity: 1 - exitProgress.value}));
}

interface SplashScreenProps {
  exitProgress: SharedValue<number>;
  moveLogoToLogin: boolean;
}

export default function SplashScreen({
  exitProgress,
  moveLogoToLogin,
}: SplashScreenProps) {
  const logoIn = useEntrance(0, 700, EASE_OUT_QUINT);
  const wordmarkIn = useEntrance(250, 650, EASE_OUT_QUINT);
  const underlineIn = useEntrance(400, 500, EASE_OUT_EXPO);
  const taglineIn = useEntrance(520, 600, EASE_OUT);
  const bottomIn = useEntrance(900, 500, EASE_IN_OUT);

  const logoTop = useSharedValue(0);
  const onLogoLayout = (event: LayoutChangeEvent) => {
    logoTop.value = event.nativeEvent.layout.y;
  };

  const backdropFade = useFadeOut(exitProgress);
  const textFade = useFadeOut(exitProgress);

  const logoStyle = useAnimatedStyle(() => ({
    opacity: logoIn.value * (moveLogoToLogin ? 1 : 1 - exitProgress.value),
    transform: [
      {
        translateY: moveLogoToLogin
          ? exitProgress.value * (LOGIN_BRAND_MARK_TOP - logoTop.value)
          : 0,
      },
      {scale: 0.7 + 0.3 * logoIn.value},
    ],
  }));
  const wordmarkStyle = useAnimatedStyle(() => ({
    opacity: wordmarkIn.value,
    transform: [{translateY: 16 * (1 - wordmarkIn.value)}],
  }));
  const underlineStyle = useAnimatedStyle(() => ({
    opacity: underlineIn.value,
    transform: [{scaleX: underlineIn.value}],
  }));
  const taglineStyle = useAnimatedStyle(() => ({
    opacity: taglineIn.value,
    transform: [{translateY: 10 * (1 - taglineIn.value)}],
  }));
  const bottomStyle = useAnimatedStyle(() => ({opacity: bottomIn.value}));

  return (
    <View style={styles.container}>
      <Animated.View style={[StyleSheet.absoluteFillObject, backdropFade]}>
        <SplashBackdrop />
        <Animated.View style={[styles.bottomGroup, bottomStyle]}>
          <LinearGradient
            colors={[GOLD_CLEAR, colors.ring, GOLD_CLEAR]}
            start={{x: 0, y: 0}}
            end={{x: 1, y: 0}}
            style={styles.divider}
          />
          <LoadingDots />
        </Animated.View>
      </Animated.View>

      <View style={styles.stack}>
        <Animated.View style={[styles.logo, logoStyle]} onLayout={onLogoLayout}>
          <BrandMark />
        </Animated.View>

        <Animated.View style={[styles.textGroup, textFade]}>
          <Animated.View style={[styles.wordmarkBox, wordmarkStyle]}>
            <Typography
              variant="heading"
              family="amiriBold"
              align="center"
              style={styles.wordmark}>
              {WORDMARK}
            </Typography>
          </Animated.View>

          <Animated.View style={[styles.underline, underlineStyle]}>
            <LinearGradient
              colors={[GOLD_CLEAR, colors.primary, GOLD_CLEAR]}
              start={{x: 0, y: 0}}
              end={{x: 1, y: 0}}
              style={StyleSheet.absoluteFillObject}
            />
          </Animated.View>

          <Animated.View style={taglineStyle}>
            <Typography variant="label" align="center" style={styles.tagline}>
              {TAGLINE}
            </Typography>
          </Animated.View>
        </Animated.View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    ...StyleSheet.absoluteFillObject,
    zIndex: 10,
  },
  stack: {
    ...StyleSheet.absoluteFillObject,
    alignItems: 'center',
    justifyContent: 'center',
  },
  logo: {
    width: 96,
    height: 96,
    marginBottom: 28,
  },
  textGroup: {
    alignItems: 'center',
  },
  // Keeps the spec's 56px line box while the glyphs get a line height Amiri doesn't clip at.
  wordmarkBox: {
    height: WORDMARK_SIZE,
    justifyContent: 'center',
  },
  wordmark: {
    fontSize: WORDMARK_SIZE,
    lineHeight: getLineHeight(WORDMARK_SIZE, 'amiriBold'),
    letterSpacing: 0.01 * WORDMARK_SIZE,
  },
  underline: {
    width: 48,
    height: 2,
    marginTop: 10,
    marginBottom: 14,
    borderRadius: radius.full,
    overflow: 'hidden',
  },
  tagline: {
    lineHeight: undefined,
    letterSpacing: 0.08 * 14,
    color: 'rgba(196,154,60,0.6)',
  },
  bottomGroup: {
    position: 'absolute',
    bottom: 96,
    left: 0,
    right: 0,
    alignItems: 'center',
    gap: 16,
  },
  divider: {
    width: 80,
    height: 1,
  },
});
