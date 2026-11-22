import React from 'react';
import {StyleSheet} from 'react-native';
import Svg, {Circle, Defs, G, RadialGradient, Rect, Stop} from 'react-native-svg';
import {colors} from '../../../styles/colors';

const GLOW_CENTER_COLOR = '#1A2640';

const RINGS = [
  {radius: 260, strokeWidth: 0.6},
  {radius: 210, strokeWidth: 0.4},
  {radius: 160, strokeWidth: 0.3},
];

export default function SplashBackdrop() {
  return (
    <>
      <Svg style={StyleSheet.absoluteFillObject} width="100%" height="100%">
        <Defs>
          <RadialGradient id="splashGlow" cx="50%" cy="38%" rx="70%" ry="60%">
            <Stop offset="0%" stopColor={GLOW_CENTER_COLOR} />
            <Stop offset="100%" stopColor={colors.background} />
          </RadialGradient>
        </Defs>
        <Rect x={0} y={0} width="100%" height="100%" fill="url(#splashGlow)" />
      </Svg>
      <Svg
        style={StyleSheet.absoluteFillObject}
        width="100%"
        height="100%"
        viewBox="0 0 375 812"
        preserveAspectRatio="xMidYMid slice"
        fill="none">
        <G opacity={0.1}>
          {RINGS.map(ring => (
            <Circle
              key={ring.radius}
              cx={187}
              cy={380}
              r={ring.radius}
              stroke={colors.primary}
              strokeWidth={ring.strokeWidth}
            />
          ))}
        </G>
      </Svg>
    </>
  );
}
