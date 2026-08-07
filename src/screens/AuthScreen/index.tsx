import React from 'react';
import {View, StyleSheet, SafeAreaView} from 'react-native';
import {colors} from '../../styles/colors';
import ScreenGlow from '../../components/shared/icons/ScreenGlow';
import WordmarkHero from './components/WordmarkHero';
import GoogleSignInSection from './components/GoogleSignInSection';

export default function AuthScreen() {
  return (
    <SafeAreaView style={styles.container}>
      <ScreenGlow
        style={StyleSheet.absoluteFillObject}
        stops={[
          {id: 'authGlowTop', cx: '50%', cy: '0%', rx: '70%', ry: '45%', opacity: 0.09},
          {
            id: 'authGlowBottom',
            cx: '50%',
            cy: '100%',
            rx: '60%',
            ry: '30%',
            opacity: 0.05,
            fadeOffset: '60%',
          },
        ]}
      />

      <WordmarkHero />

      <View style={styles.lowerSection}>
        <GoogleSignInSection />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
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
});
