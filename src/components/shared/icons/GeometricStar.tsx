import React from 'react';
import Svg, {Polygon, Line} from 'react-native-svg';
import {colors} from '../../../styles/colors';

interface GeometricStarProps {
  size?: number;
  color?: string;
}

const CENTER = 100;
// Tip distance of each nested diamond. The outermost one stays inside the
// 200-unit viewBox so no tip gets clipped.
const DIAMOND_RADII = [96, 72, 48, 24];
const OUTER_RADIUS = DIAMOND_RADII[0];

// Point at [radius] from the centre along ray [index] (0..7, 45° apart).
function rayPoint(index: number, radius: number) {
  const angle = (Math.PI / 4) * index;
  return {
    x: CENTER + Math.cos(angle) * radius,
    y: CENTER + Math.sin(angle) * radius,
  };
}

// Diamond with its tips on the four straight rays (0, 2, 4, 6).
function diamondPoints(radius: number) {
  return [0, 2, 4, 6]
    .map(index => {
      const {x, y} = rayPoint(index, radius);
      return `${x},${y}`;
    })
    .join(' ');
}

// Nested diamonds with eight rays from the centre. The straight rays end on
// the outer diamond's tips and the diagonal rays end on the middle of its
// edges, so every line meets the outline. See docs/design.md §4.1.
export default function GeometricStar({
  size = 96,
  color = colors.primary,
}: GeometricStarProps) {
  const stroke = {
    stroke: color,
    strokeWidth: 0.8,
    strokeOpacity: 0.07,
    strokeLinejoin: 'miter' as const,
  };

  return (
    <Svg width={size} height={size} viewBox="0 0 200 200">
      {DIAMOND_RADII.map(radius => (
        <Polygon
          key={radius}
          points={diamondPoints(radius)}
          fill="none"
          {...stroke}
        />
      ))}
      {Array.from({length: 8}).map((_, i) => {
        // A diagonal ray meets the diamond edge at radius·cos 45°.
        const length = i % 2 === 0 ? OUTER_RADIUS : OUTER_RADIUS * Math.SQRT1_2;
        const end = rayPoint(i, length);
        return (
          <Line
            key={i}
            x1={CENTER}
            y1={CENTER}
            x2={end.x}
            y2={end.y}
            {...stroke}
          />
        );
      })}
    </Svg>
  );
}
