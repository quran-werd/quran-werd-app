import React, {memo, useMemo} from 'react';
import {View, StyleSheet} from 'react-native';
import {colors} from '../../../styles/colors';
import {Word} from '../types';
import Basmalah from './Basmalah';
import {getSurahNameArabic} from '../../../content';
import SurahHeader from './SurahHeader';
import WordComponent from './Word';

interface LineProps {
  words: Word[];
  lineKey: string;
  pageNumber: number;
  lineNumber: number;
  fontFamily: string;
  fontSize?: number;
  isHighlighted?: boolean;
  highlightedWordIds?: Set<number>;
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
}) => {
  const isShowBismillah = words[0].verseNumber === 1;

  const chapterName = useMemo(
    () => getSurahNameArabic(words[0].chapterId),
    [words],
  );

  // Determine if a word should be highlighted
  const isWordHighlighted = (word: Word): boolean => {
    if (highlightedWordIds) {
      return highlightedWordIds.has(word.id);
    }
    // Fallback to line-level highlighting for backwards compatibility
    return isHighlighted;
  };

  return (
    <React.Fragment key={lineKey}>
      {isShowBismillah && (
        <View style={styles.bismillahContainer}>
          <SurahHeader name={chapterName} />
          <Basmalah />
        </View>
      )}
      <View style={styles.container}>
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
      </View>
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
  const prevIds = prevProps.highlightedWordIds;
  const nextIds = nextProps.highlightedWordIds;
  const idsEqual: boolean =
    prevIds === nextIds ||
    (prevIds &&
      nextIds &&
      prevIds.size === nextIds.size &&
      [...prevIds].every(id => nextIds.has(id))) ||
    (!prevIds && !nextIds);

  return (
    prevProps.lineKey === nextProps.lineKey &&
    prevProps.words.length === nextProps.words.length &&
    prevProps.fontFamily === nextProps.fontFamily &&
    prevProps.fontSize === nextProps.fontSize &&
    prevProps.isHighlighted === nextProps.isHighlighted &&
    idsEqual
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
    justifyContent: 'space-between',
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
