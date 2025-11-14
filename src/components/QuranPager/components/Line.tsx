import React, {memo, useMemo} from 'react';
import {View, StyleSheet, Pressable} from 'react-native';
import {colors} from '../../../styles/colors';
import {Word} from '../types';
import Basmalah from './Basmalah';
import {getSurahNameArabic} from '../../../content';
import SurahHeader from './SurahHeader';
import WordComponent from './Word';
import {useLineSelection} from '../context';

interface LineProps {
  words: Word[];
  lineKey: string;
  pageNumber: number;
  lineNumber: number;
  fontFamily: string;
  fontSize?: number;
  isHighlighted?: boolean;
  highlightedWordIds?: Set<number>;
  highlightedLineKeys?: Set<string>;
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
  fontSize,
  isHighlighted = false,
  highlightedWordIds,
  highlightedLineKeys,
}) => {
  const {toggleLineSelection, isLineSelected: isSelectedFromContext} =
    useLineSelection();

  const isShowBismillah = words[0].verseNumber === 1;

  const chapterName = useMemo(
    () => getSurahNameArabic(words[0].chapterId),
    [words],
  );

  // Determine if the entire line should be highlighted
  // Check context selection first, then external props
  const isLineHighlighted = useMemo(() => {
    // Check if selected from context
    const selectedFromContext = isSelectedFromContext(lineKey);
    if (selectedFromContext) {
      return true;
    }

    // Check external highlightedLineKeys prop
    if (highlightedLineKeys) {
      return highlightedLineKeys.has(lineKey);
    }

    // Fallback to isHighlighted prop for backwards compatibility
    return isHighlighted;
  }, [highlightedLineKeys, lineKey, isHighlighted, isSelectedFromContext]);

  // Handle line press/tap
  const handleLinePress = () => {
    toggleLineSelection(lineKey);
  };

  // Determine if a word should be highlighted
  // Word highlighting takes precedence over line highlighting
  const isWordHighlighted = (word: Word): boolean => {
    if (highlightedWordIds) {
      return highlightedWordIds.has(word.id);
    }
    // If no specific word IDs provided, use line highlighting for words
    return isLineHighlighted;
  };

  return (
    <React.Fragment key={lineKey}>
      {isShowBismillah && (
        <View style={styles.bismillahContainer}>
          <SurahHeader name={chapterName} />
          <Basmalah />
        </View>
      )}
      <Pressable
        onPress={handleLinePress}
        style={[styles.container, isLineHighlighted && styles.lineHighlighted]}>
        <View style={styles.wordsContainer}>
          {words.map((word, index) => {
            const shouldHighlight = isWordHighlighted(word);

            return (
              <WordComponent
                key={`${word.id}-${index}`}
                word={word}
                fontFamily={fontFamily}
                fontSize={fontSize}
                isHighlighted={shouldHighlight}
                showSpaceBefore={index > 0}
              />
            );
          })}
        </View>
      </Pressable>
    </React.Fragment>
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
  // Compare highlightedWordIds Sets
  const prevWordIds = prevProps.highlightedWordIds;
  const nextWordIds = nextProps.highlightedWordIds;
  const wordIdsEqual: boolean =
    prevWordIds === nextWordIds ||
    (prevWordIds &&
      nextWordIds &&
      prevWordIds.size === nextWordIds.size &&
      [...prevWordIds].every(id => nextWordIds.has(id))) ||
    (!prevWordIds && !nextWordIds);

  // Compare highlightedLineKeys Sets
  const prevLineKeys = prevProps.highlightedLineKeys;
  const nextLineKeys = nextProps.highlightedLineKeys;
  const lineKeysEqual: boolean =
    prevLineKeys === nextLineKeys ||
    (prevLineKeys &&
      nextLineKeys &&
      prevLineKeys.size === nextLineKeys.size &&
      [...prevLineKeys].every(key => nextLineKeys.has(key))) ||
    (!prevLineKeys && !nextLineKeys);

  return (
    prevProps.lineKey === nextProps.lineKey &&
    prevProps.words.length === nextProps.words.length &&
    prevProps.fontFamily === nextProps.fontFamily &&
    prevProps.fontSize === nextProps.fontSize &&
    prevProps.isHighlighted === nextProps.isHighlighted &&
    wordIdsEqual &&
    lineKeysEqual
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
    justifyContent: 'space-between',
  },
  lineHighlighted: {
    backgroundColor: colors.light,
  },
  wordsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
  },
  bismillahContainer: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  chapterName: {
    fontFamily: 'surahnames',
    fontSize: 20,
    color: colors.text.primary,
    backgroundColor: colors.border,
  },
});

export default memo(Line, arePropsEqual);
