import React, {memo} from 'react';
import {Text, StyleSheet} from 'react-native';
import {colors} from '../../../styles/colors';
import {Word as WordType} from '../../../types/quran-pager.types';

interface WordProps {
  word: WordType;
  fontFamily: string;
  fontSize?: number;
  isHighlighted?: boolean;
  showSpaceBefore?: boolean;
}

/**
 * Word component - Renders a single Quranic word
 * Handles individual word highlighting and text display
 */
const Word: React.FC<WordProps> = ({
  word,
  fontFamily,
  fontSize,
  isHighlighted = false,
  showSpaceBefore = false,
}) => {
  const wordText = word.codeV1 || word.textUthmani || word.text || '';

  return (
    <Text
      style={[
        styles.text,
        {
          fontFamily,
          fontSize,
        },
        isHighlighted && styles.wordHighlighted,
      ]}>
      {showSpaceBefore ? ' ' : ''}
      {wordText}
    </Text>
  );
};

const styles = StyleSheet.create({
  text: {
    textAlign: 'center',
    writingDirection: 'rtl',
    color: colors.text.primary,
  },
  wordHighlighted: {
    backgroundColor: colors.light,
  },
});

export default memo(Word);
