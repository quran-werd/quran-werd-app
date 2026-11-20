import React from 'react';
import Svg, {Rect, Line} from 'react-native-svg';
import {colors} from '../../../styles/colors';

interface GeometricStarProps {
  size?: number;
  color?: string;
}

// Layered nested squares + radial lines — see docs/design.md §4.1.
export default function GeometricStar({
  size = 96,
  color = colors.primary,
}: GeometricStarProps) {
  const squares = [200, 150, 100, 60];
  const center = 100;

  return (
    <Svg width={size} height={size} viewBox="0 0 200 200">
      {squares.map(dimension => (
        <Rect
          key={dimension}
          x={center - dimension / 2}
          y={center - dimension / 2}
          width={dimension}
          height={dimension}
          rotation={45}
          origin={`${center}, ${center}`}
          stroke={color}
          strokeWidth={0.8}
          strokeOpacity={0.07}
          fill="none"
        />
      ))}
      {Array.from({length: 8}).map((_, i) => {
        const angle = (Math.PI / 4) * i;
        const x2 = center + Math.cos(angle) * 100;
        const y2 = center + Math.sin(angle) * 100;
        return (
          <Line
            key={i}
            x1={center}
            y1={center}
            x2={x2}
            y2={y2}
            stroke={color}
            strokeWidth={0.8}
            strokeOpacity={0.07}
          />
        );
      })}
    </Svg>
  );
}
