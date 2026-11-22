import React from 'react';
import {StyleSheet, View} from 'react-native';
import {LinearGradient} from 'expo-linear-gradient';
import Svg, {Circle, Defs, RadialGradient, Stop} from 'react-native-svg';
import AuthOrnament from '../icons/AuthOrnament';
import {colors} from '../../../styles/colors';
import {radius} from '../../../styles/radius';

const SIZE = 96;
const HALO_SIZE = 116;
// CSS `radial-gradient(circle, ... 70%)` measures from the farthest corner.
const HALO_FADE_RADIUS = (HALO_SIZE / 2) * Math.SQRT2 * 0.7;

// Unit-space endpoints equivalent to CSS `linear-gradient(145deg, ...)` on a square.
const DISC_GRADIENT_START = {x: 0.10058, y: -0.07042};
const DISC_GRADIENT_END = {x: 0.89942, y: 1.07042};

export default function BrandMark() {
  return (
    <View style={styles.container}>
      <Svg width={HALO_SIZE} height={HALO_SIZE} style={styles.halo} pointerEvents="none">
        <Defs>
          <RadialGradient
            id="brandMarkHalo"
            gradientUnits="userSpaceOnUse"
            cx={HALO_SIZE / 2}
            cy={HALO_SIZE / 2}
            r={HALO_FADE_RADIUS}>
            <Stop offset="0%" stopColor={colors.primary} stopOpacity={0.12} />
            <Stop offset="100%" stopColor={colors.primary} stopOpacity={0} />
          </RadialGradient>
        </Defs>
        <Circle
          cx={HALO_SIZE / 2}
          cy={HALO_SIZE / 2}
          r={HALO_SIZE / 2}
          fill="url(#brandMarkHalo)"
        />
      </Svg>
      <View style={styles.ring} />
      <View style={styles.disc}>
        <LinearGradient
          colors={['rgba(196,154,60,0.18)', 'rgba(196,154,60,0.06)']}
          start={DISC_GRADIENT_START}
          end={DISC_GRADIENT_END}
          style={StyleSheet.absoluteFillObject}
        />
      </View>
      <View style={StyleSheet.absoluteFillObject}>
        <AuthOrnament size={SIZE} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: SIZE,
    height: SIZE,
  },
  halo: {
    position: 'absolute',
    top: -10,
    left: -10,
  },
  ring: {
    ...StyleSheet.absoluteFillObject,
    borderRadius: radius.full,
    borderWidth: 1,
    borderColor: 'rgba(196,154,60,0.22)',
  },
  disc: {
    position: 'absolute',
    top: 10,
    left: 10,
    right: 10,
    bottom: 10,
    borderRadius: radius.full,
    borderWidth: 1,
    borderColor: 'rgba(196,154,60,0.3)',
    overflow: 'hidden',
  },
});
