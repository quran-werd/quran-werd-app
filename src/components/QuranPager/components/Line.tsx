import React, {memo} from 'react';
import {View, Text, StyleSheet} from 'react-native';
import {colors} from '../../../styles/colors';
import {Word} from '../types';

interface LineProps {
  words: Word[];
  lineKey: string;
  pageNumber: number;
  lineNumber: number;
  fontFamily: string;
  fontSize?: number;
  isHighlighted?: boolean;
}

/**
 * Line component - Renders a single line of Quranic text
 * Adapted from quran.com-frontend-next ReadingView/Line.tsx
 *
 * Each line contains multiple words that should be displayed together
 * as they appear in the physical Mushaf layout
 */
const Line: React.FC<LineProps> = ({
  words,
  lineKey,
  pageNumber: _pageNumber,
  lineNumber: _lineNumber,
  fontFamily,
  fontSize = 26,
  isHighlighted = false,
}) => {
  // Concatenate all words in the line with proper spacing
  // Use textUthmani for QCF fonts, fallback to text
  const lineText = words.map(word => word.codeV1).join(' ');

  return (
    <View
      style={[styles.container, isHighlighted && styles.highlighted]}
      key={lineKey}>
      <Text
        style={[
          styles.text,
          {
            fontFamily,
            fontSize,
          },
        ]}>
        {lineText}
      </Text>
    </View>
  );
};

/**
 * Custom comparison function for memoization
 * Only re-render if:
 * 1. lineKey changed
 * 2. Number of words changed
 * 3. Font changed
 * 4. Highlight state changed
 */
const arePropsEqual = (prevProps: LineProps, nextProps: LineProps): boolean => {
  return (
    prevProps.lineKey === nextProps.lineKey &&
    prevProps.words.length === nextProps.words.length &&
    prevProps.fontFamily === nextProps.fontFamily &&
    prevProps.fontSize === nextProps.fontSize &&
    prevProps.isHighlighted === nextProps.isHighlighted
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
    flex: 1,
    justifyContent: 'space-between',
  },
  highlighted: {
    backgroundColor: colors.light,
  },
  text: {
    textAlign: 'center',
    writingDirection: 'rtl',
    color: colors.text.primary,
  },
});

export default memo(Line, arePropsEqual);
