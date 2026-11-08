import React from 'react';
import {StyleProp, ViewStyle} from 'react-native';
import Svg, {Defs, RadialGradient, Stop, Rect} from 'react-native-svg';
import {colors} from '../../../styles/colors';

type GlowStop = {
  id: string;
  cx: string;
  cy: string;
  rx: string;
  ry: string;
  opacity: number;
  fadeOffset?: string;
};

interface ScreenGlowProps {
  stops: GlowStop[];
  width?: number | string;
  height?: number | string;
  style?: StyleProp<ViewStyle>;
}

export default function ScreenGlow({
  stops,
  width = '100%',
  height = '100%',
  style,
}: ScreenGlowProps) {
  return (
    <Svg style={style} pointerEvents="none" width={width} height={height}>
      <Defs>
        {stops.map(stop => (
          <RadialGradient
            key={stop.id}
            id={stop.id}
            cx={stop.cx}
            cy={stop.cy}
            rx={stop.rx}
            ry={stop.ry}>
            <Stop
              offset="0%"
              stopColor={colors.primary}
              stopOpacity={stop.opacity}
            />
            <Stop
              offset={stop.fadeOffset ?? '70%'}
              stopColor={colors.primary}
              stopOpacity={0}
            />
          </RadialGradient>
        ))}
      </Defs>
      {stops.map(stop => (
        <Rect
          key={stop.id}
          x={0}
          y={0}
          width={width}
          height={height}
          fill={`url(#${stop.id})`}
        />
      ))}
    </Svg>
  );
}
