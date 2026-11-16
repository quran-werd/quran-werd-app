import React, {useEffect, useState} from 'react';
import {StyleSheet, View} from 'react-native';
import Animated, {
  Easing,
  runOnJS,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';
import {selectIsAuthenticated} from '../../features/Auth/authSlice';
import {useAppSelector} from '../../store/hooks';
import {colors} from '../../styles/colors';
import SplashScreen from './index';
import {BrandMarkHeldContext} from './splashHandoff';

const HOLD_MS = 2800;
const EXIT_MS = 650;
const INCOMING_FADE_MS = 550;
const EASE_OUT_EXPO = Easing.bezier(0.16, 1, 0.3, 1);

interface SplashGateProps {
  appReady: boolean;
  children: React.ReactNode;
}

export default function SplashGate({appReady, children}: SplashGateProps) {
  const isAuthenticated = useAppSelector(selectIsAuthenticated);
  const [holdElapsed, setHoldElapsed] = useState(false);
  const [finished, setFinished] = useState(false);

  const exitProgress = useSharedValue(0);
  const incomingOpacity = useSharedValue(0);

  useEffect(() => {
    const timer = setTimeout(() => setHoldElapsed(true), HOLD_MS);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (!appReady || !holdElapsed) {
      return;
    }
    incomingOpacity.value = withTiming(1, {
      duration: INCOMING_FADE_MS,
      easing: EASE_OUT_EXPO,
    });
    exitProgress.value = withTiming(
      1,
      {duration: EXIT_MS, easing: EASE_OUT_EXPO},
      isDone => {
        if (isDone) {
          runOnJS(setFinished)(true);
        }
      },
    );
  }, [appReady, holdElapsed, exitProgress, incomingOpacity]);

  const incomingStyle = useAnimatedStyle(() => ({
    opacity: incomingOpacity.value,
  }));

  return (
    <View style={styles.root}>
      <BrandMarkHeldContext.Provider value={!finished}>
        <Animated.View style={[styles.root, incomingStyle]}>
          {appReady && children}
        </Animated.View>
      </BrandMarkHeldContext.Provider>
      {!finished && (
        <SplashScreen
          exitProgress={exitProgress}
          moveLogoToLogin={!isAuthenticated}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: colors.background,
  },
});
