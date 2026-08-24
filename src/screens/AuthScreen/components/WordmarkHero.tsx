import React, {useEffect} from 'react';
import {View, StyleSheet} from 'react-native';
import {useTranslation} from 'react-i18next';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withDelay,
  withTiming,
  Easing,
  FadeIn,
  FadeInDown,
} from 'react-native-reanimated';
import {LinearGradient} from 'expo-linear-gradient';
import Typography from '../../../components/shared/Typography';
import BasmalaSvg from '../../../components/shared/icons/BasmalaSvg';
import AuthOrnament from '../../../components/shared/icons/AuthOrnament';
import {colors} from '../../../styles/colors';
import {radius} from '../../../styles/radius';
import {getLineHeight} from '../../../styles/typography';

const EASE_OUT_EXPO = Easing.bezier(0.16, 1, 0.3, 1).factory();

export default function WordmarkHero() {
  const {t} = useTranslation();

  const underlineProgress = useSharedValue(0);
  const basmalaOpacity = useSharedValue(0);

  useEffect(() => {
    underlineProgress.value = withDelay(300, withTiming(1, {duration: 500}));
    basmalaOpacity.value = withDelay(250, withTiming(1, {duration: 600}));
  }, [underlineProgress, basmalaOpacity]);

  const underlineStyle = useAnimatedStyle(() => ({
    opacity: underlineProgress.value,
    transform: [{scaleX: underlineProgress.value}],
  }));
  const basmalaStyle = useAnimatedStyle(() => ({opacity: basmalaOpacity.value}));

  return (
    <View style={styles.upperSection}>
      <Animated.View
        entering={FadeIn.duration(700)
          .easing(EASE_OUT_EXPO)
          .withInitialValues({transform: [{scale: 0.85}]})}
        style={styles.ornamentContainer}>
        <View style={styles.ornamentGlowHalo} />
        <View style={styles.ornamentRingBorder} />
        <View style={styles.ornamentDisc}>
          <AuthOrnament size={96} />
        </View>
      </Animated.View>

      <Animated.View
        entering={FadeInDown.duration(550)
          .delay(150)
          .easing(EASE_OUT_EXPO)
          .withInitialValues({transform: [{translateY: 12}]})}>
        <Typography
          variant="heading"
          family="amiriBold"
          align="center"
          style={styles.appName}>
          {t('auth.appName')}
        </Typography>
      </Animated.View>

      <Animated.View style={[styles.underline, underlineStyle]}>
        <LinearGradient
          colors={['transparent', colors.primary, 'transparent']}
          start={{x: 0, y: 0}}
          end={{x: 1, y: 0}}
          style={StyleSheet.absoluteFillObject}
        />
      </Animated.View>

      <Animated.View style={[styles.basmalaWrap, basmalaStyle]}>
        <BasmalaSvg color={colors.primary} width={200} height={41} />
      </Animated.View>

      <Animated.View
        entering={FadeInDown.duration(500)
          .delay(350)
          .easing(EASE_OUT_EXPO)
          .withInitialValues({transform: [{translateY: 8}]})}>
        <Typography variant="body" color="muted" align="center" style={styles.subtitle}>
          {t('auth.subtitle')}
        </Typography>
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  upperSection: {
    marginTop: 120,
    alignItems: 'center',
  },
  ornamentContainer: {
    width: 96,
    height: 96,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 28,
  },
  ornamentGlowHalo: {
    position: 'absolute',
    top: -10,
    left: -10,
    right: -10,
    bottom: -10,
    borderRadius: radius.full,
    backgroundColor: 'rgba(196,154,60,0.12)',
  },
  ornamentRingBorder: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    borderRadius: radius.full,
    borderWidth: 1,
    borderColor: 'rgba(196,154,60,0.22)',
  },
  ornamentDisc: {
    position: 'absolute',
    top: 10,
    left: 10,
    right: 10,
    bottom: 10,
    borderRadius: radius.full,
    borderWidth: 1,
    borderColor: 'rgba(196,154,60,0.3)',
    backgroundColor: 'rgba(196,154,60,0.1)',
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
  },
  appName: {
    fontSize: 42,
    lineHeight: getLineHeight(42, 'amiriBold'),
    letterSpacing: 0.01 * 42,
    marginBottom: 6,
  },
  underline: {
    width: 40,
    height: 2,
    borderRadius: radius.full,
    overflow: 'hidden',
    marginBottom: 24,
  },
  basmalaWrap: {
    marginBottom: 20,
  },
  subtitle: {
    fontSize: 15,
    lineHeight: 15 * 1.7,
    maxWidth: 260,
    paddingHorizontal: 24,
  },
});
