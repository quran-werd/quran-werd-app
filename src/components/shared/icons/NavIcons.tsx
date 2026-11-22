import React from 'react';
import Svg, {Path, Circle, Line} from 'react-native-svg';
import {colors} from '../../../styles/colors';

interface NavIconProps {
  active?: boolean;
  size?: number;
}

const STROKE_WIDTH = 1.5;

function strokeColor(active?: boolean) {
  return active ? colors.primary : colors.mutedForeground;
}

export function HomeIcon({active, size = 20}: NavIconProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Path
        d="M4 11.5 12 4l8 7.5"
        stroke={strokeColor(active)}
        strokeWidth={STROKE_WIDTH}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <Path
        d="M6 10v9a1 1 0 0 0 1 1h10a1 1 0 0 0 1-1v-9"
        stroke={strokeColor(active)}
        strokeWidth={STROKE_WIDTH}
        fill={active ? 'rgba(196,154,60,0.15)' : 'none'}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <Path
        d="M10 20v-5a2 2 0 0 1 4 0v5"
        stroke={strokeColor(active)}
        strokeWidth={STROKE_WIDTH}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  );
}

export function BookIcon({active, size = 20}: NavIconProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Path
        d="M12 6c-1.6-1-3.9-1.5-6-1.5A2.5 2.5 0 0 0 3.5 7v11A2 2 0 0 1 6 16.5c1.9 0 3.9.4 6 1.5"
        stroke={strokeColor(active)}
        strokeWidth={STROKE_WIDTH}
        fill={active ? 'rgba(196,154,60,0.08)' : 'none'}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <Path
        d="M12 6c1.6-1 3.9-1.5 6-1.5A2.5 2.5 0 0 1 20.5 7v11A2 2 0 0 0 18 16.5c-1.9 0-3.9.4-6 1.5V6Z"
        stroke={strokeColor(active)}
        strokeWidth={STROKE_WIDTH}
        fill={active ? 'rgba(196,154,60,0.08)' : 'none'}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  );
}

export function CalendarIcon({active, size = 20}: NavIconProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Path
        d="M5 9h14M8 3v3M16 3v3"
        stroke={strokeColor(active)}
        strokeWidth={STROKE_WIDTH}
        strokeLinecap="round"
      />
      <Path
        d="M5 6.5A1.5 1.5 0 0 1 6.5 5h11A1.5 1.5 0 0 1 19 6.5V19a1.5 1.5 0 0 1-1.5 1.5h-11A1.5 1.5 0 0 1 5 19V6.5Z"
        stroke={strokeColor(active)}
        strokeWidth={STROKE_WIDTH}
        fill={active ? 'rgba(196,154,60,0.08)' : 'none'}
      />
      <Path
        d="M8 13h2M11 13h2M14 13h2M8 16h2M11 16h2"
        stroke={strokeColor(active)}
        strokeWidth={STROKE_WIDTH}
        strokeLinecap="round"
      />
    </Svg>
  );
}

export function SettingsIcon({active, size = 20}: NavIconProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Circle
        cx={12}
        cy={12}
        r={9}
        stroke={strokeColor(active)}
        strokeWidth={STROKE_WIDTH}
        fill={active ? 'rgba(196,154,60,0.08)' : 'none'}
      />
      <Circle cx={12} cy={12} r={3} stroke={strokeColor(active)} strokeWidth={STROKE_WIDTH} />
      {Array.from({length: 8}).map((_, i) => {
        const angle = (Math.PI / 4) * i;
        const inner = 9;
        const outer = 11.5;
        return (
          <Line
            key={i}
            x1={12 + Math.cos(angle) * inner}
            y1={12 + Math.sin(angle) * inner}
            x2={12 + Math.cos(angle) * outer}
            y2={12 + Math.sin(angle) * outer}
            stroke={strokeColor(active)}
            strokeWidth={STROKE_WIDTH}
            strokeLinecap="round"
          />
        );
      })}
    </Svg>
  );
}
