import React, {useEffect} from 'react';
import {View, StyleSheet, SafeAreaView, Pressable} from 'react-native';
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
import Svg, {Defs, RadialGradient, Stop, Rect, Path} from 'react-native-svg';
import Typography from '../../components/shared/Typography';
import BasmalaSvg from '../../components/shared/icons/BasmalaSvg';
import AuthOrnament from '../../components/shared/icons/AuthOrnament';
import {colors} from '../../styles/colors';
import {radius} from '../../styles/radius';
import {getLineHeight} from '../../styles/typography';
import {clearError, selectAuth} from '../../features/Auth/authSlice';
import {signInWithGoogle} from '../../features/Auth/authAction';
import {useAppDispatch, useAppSelector} from '../../store/hooks';

const EASE_OUT_EXPO = Easing.bezier(0.16, 1, 0.3, 1).factory();

function AmbientGlow() {
  return (
    <Svg style={StyleSheet.absoluteFillObject} pointerEvents="none" width="100%" height="100%">
      <Defs>
        <RadialGradient id="authGlowTop" cx="50%" cy="0%" rx="70%" ry="45%">
          <Stop offset="0%" stopColor={colors.primary} stopOpacity={0.09} />
          <Stop offset="70%" stopColor={colors.primary} stopOpacity={0} />
        </RadialGradient>
        <RadialGradient id="authGlowBottom" cx="50%" cy="100%" rx="60%" ry="30%">
          <Stop offset="0%" stopColor={colors.primary} stopOpacity={0.05} />
          <Stop offset="60%" stopColor={colors.primary} stopOpacity={0} />
        </RadialGradient>
      </Defs>
      <Rect x={0} y={0} width="100%" height="100%" fill="url(#authGlowTop)" />
      <Rect x={0} y={0} width="100%" height="100%" fill="url(#authGlowBottom)" />
    </Svg>
  );
}

function GoogleLogo() {
  return (
    <Svg width={20} height={20} viewBox="0 0 24 24">
      <Path
        fill="#4285F4"
        d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
      />
      <Path
        fill="#34A853"
        d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.99.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
      />
      <Path
        fill="#FBBC05"
        d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
      />
      <Path
        fill="#EA4335"
        d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
      />
    </Svg>
  );
}

export default function AuthScreen() {
  const {t} = useTranslation();
  const dispatch = useAppDispatch();
  const auth = useAppSelector(selectAuth);

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

  const handleGoogleSignIn = () => {
    dispatch(clearError());
    dispatch(signInWithGoogle());
  };

  return (
    <SafeAreaView style={styles.container}>
      <AmbientGlow />

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

      <View style={styles.lowerSection}>
        <Animated.View entering={FadeIn.duration(500).delay(500)} style={styles.dividerRow}>
          <LinearGradient
            colors={['transparent', colors.goldWashStrong]}
            start={{x: 0, y: 0}}
            end={{x: 1, y: 0}}
            style={styles.dividerLine}
          />
          <Typography family="cairo" style={styles.dividerLabel}>
            {t('auth.journeyLabel')}
          </Typography>
          <LinearGradient
            colors={[colors.goldWashStrong, 'transparent']}
            start={{x: 0, y: 0}}
            end={{x: 1, y: 0}}
            style={styles.dividerLine}
          />
        </Animated.View>

        {auth.error ? (
          <Typography variant="caption" color="destructive" align="center">
            {auth.error}
          </Typography>
        ) : null}

        <Animated.View
          entering={FadeInDown.duration(550)
            .delay(600)
            .easing(EASE_OUT_EXPO)
            .withInitialValues({transform: [{translateY: 16}]})}>
          <Pressable
            onPress={handleGoogleSignIn}
            disabled={auth.loading}
            style={({pressed}) => [styles.googleButton, pressed && styles.googleButtonPressed]}>
            <GoogleLogo />
            <Typography family="cairo" weight="semibold" style={styles.googleButtonLabel}>
              {t('auth.googleSignIn')}
            </Typography>
          </Pressable>
        </Animated.View>

        <Animated.View entering={FadeIn.duration(400).delay(750)}>
          <Typography family="cairo" align="center" style={styles.legalNote}>
            {t('auth.legalNote')}
          </Typography>
        </Animated.View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
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
  lowerSection: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    paddingHorizontal: 28,
    paddingBottom: 64,
    gap: 16,
  },
  dividerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: colors.goldWashStrong,
  },
  dividerLabel: {
    fontSize: 11,
    color: 'rgba(138,154,184,0.75)',
    letterSpacing: 0.06 * 11,
  },
  googleButton: {
    direction: 'ltr',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 12,
    paddingVertical: 15,
    paddingHorizontal: 24,
    borderRadius: radius.xl,
    backgroundColor: colors.white,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.35,
    shadowRadius: 12,
    elevation: 4,
  },
  googleButtonPressed: {
    backgroundColor: '#F5F5F5',
  },
  googleButtonLabel: {
    fontSize: 15,
    letterSpacing: 0.01 * 15,
    color: '#1A1A1A',
  },
  legalNote: {
    fontSize: 11,
    color: 'rgba(138,154,184,0.75)',
    lineHeight: 11 * 1.6,
  },
});
