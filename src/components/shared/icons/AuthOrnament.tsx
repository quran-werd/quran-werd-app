import React from 'react';
import Svg, {Polygon, Line} from 'react-native-svg';
import {colors} from '../../../styles/colors';

interface AuthOrnamentProps {
  size?: number;
  color?: string;
}

function octagonPoints(radius: number) {
  return Array.from({length: 8}, (_, i) => {
    const angle = (Math.PI / 4) * i - Math.PI / 2;
    const x = 80 + Math.cos(angle) * radius;
    const y = 80 + Math.sin(angle) * radius;
    return `${x.toFixed(2)},${y.toFixed(2)}`;
  }).join(' ');
}

// Login screen ornament — octagons + rotated squares + radial spokes + centre diamond.
export default function AuthOrnament({size = 96, color = colors.primary}: AuthOrnamentProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 160 160" fill="none">
      <Polygon points={octagonPoints(62)} stroke={color} strokeWidth={0.7} strokeOpacity={0.18} />
      <Polygon
        points="36,36 124,36 124,124 36,124"
        rotation={45}
        origin="80,80"
        stroke={color}
        strokeWidth={0.7}
        strokeOpacity={0.14}
      />
      <Polygon
        points="36,36 124,36 124,124 36,124"
        stroke={color}
        strokeWidth={0.7}
        strokeOpacity={0.14}
      />
      <Polygon points={octagonPoints(32)} stroke={color} strokeWidth={0.7} strokeOpacity={0.22} />
      {Array.from({length: 8}).map((_, i) => {
        const angle = (Math.PI / 4) * i;
        const x1 = 80 + Math.cos(angle) * 32;
        const y1 = 80 + Math.sin(angle) * 32;
        const x2 = 80 + Math.cos(angle) * 62;
        const y2 = 80 + Math.sin(angle) * 62;
        return (
          <Line
            key={i}
            x1={x1}
            y1={y1}
            x2={x2}
            y2={y2}
            stroke={color}
            strokeWidth={0.5}
            strokeOpacity={0.12}
          />
        );
      })}
      <Polygon
        points="66,66 94,66 94,94 66,94"
        rotation={45}
        origin="80,80"
        stroke={color}
        strokeWidth={0.7}
        strokeOpacity={0.28}
      />
    </Svg>
  );
}
