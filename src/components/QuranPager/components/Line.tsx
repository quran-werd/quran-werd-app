import React, {memo, useMemo} from 'react';
import {View, StyleSheet, Pressable} from 'react-native';
import {colors} from '../../../styles/colors';
import {Word} from '../types';
import Basmalah from './Basmalah';
import {getSurahNameArabic} from '../../../content';
import SurahHeader from './SurahHeader';
import WordComponent from './Word';
import {useLineSelection} from '../context';
import {useAppSelector, useAppDispatch} from '../../../store/hooks';
import {
  selectPendingStartVerse,
  selectRanges,
  setPendingStartVerse,
  addVerseRange,
  removeRange,
} from '../../../features/Memorization/verseSelectionSlice';
import {findSingleVerseRange} from '../utils/verseSelection.utils';

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
  selectionMode?: boolean;
  selectedVerseKeys?: Set<string>;
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
  selectionMode = false,
  selectedVerseKeys = new Set<string>(),
}) => {
  // Try to get line selection context (only available when not in selection mode)
  let toggleLineSelection: (lineKey: string) => void = () => {};
  let isSelectedFromContext: (lineKey: string) => boolean = () => false;
  try {
    const lineSelection = useLineSelection();
    toggleLineSelection = lineSelection.toggleLineSelection;
    isSelectedFromContext = lineSelection.isLineSelected;
  } catch (error) {
    // Context not available - fine
  }

  // Get verse selection state from Redux when in selection mode
  const dispatch = useAppDispatch();
  const pendingStartVerse = useAppSelector(selectPendingStartVerse);
  const ranges = useAppSelector(selectRanges);

  const isShowBismillah = words[0].verseNumber === 1;

  const chapterName = useMemo(
    () => getSurahNameArabic(words[0].chapterId),
    [words],
  );

  // Group words by verse for verse-level selection
  const wordsByVerse = useMemo(() => {
    const grouped: Record<string, Word[]> = {};
    words.forEach(word => {
      const verseKey = word.verseKey;
      if (!grouped[verseKey]) {
        grouped[verseKey] = [];
      }
      grouped[verseKey].push(word);
    });
    return grouped;
  }, [words]);

  // Handle verse press/tap in selection mode
  const handleVersePress = (verseKey: string) => {
    if (!selectionMode) {
      return;
    }

    // Check if this verse is already selected (part of any range)
    const isVerseAlreadySelected = selectedVerseKeys.has(verseKey);

    if (!pendingStartVerse) {
      // No pending start verse - check if this verse is already selected
      // Check if this verse is already selected in a single-verse range
      const singleVerseRange = findSingleVerseRange(verseKey, ranges);

      if (singleVerseRange) {
        // Verse is already selected in a single-verse range (third click)
        // Remove the single-verse range
        dispatch(removeRange(singleVerseRange.id));
      } else if (isVerseAlreadySelected) {
        // Verse is already selected in a range - ignore click
        // Don't allow clicking on already selected verses
        return;
      } else {
        // First click - set as start
        dispatch(setPendingStartVerse(verseKey));
      }
    } else {
      // Second click - create range
      dispatch(addVerseRange({startKey: pendingStartVerse, endKey: verseKey}));
    }
  };

  // Handle line press (for non-selection mode)
  const handleLinePress = () => {
    if (!selectionMode) {
      toggleLineSelection(lineKey);
    }
  };

  // Determine if a verse is selected using Redux selector
  const isVerseSelected = (verseKey: string): boolean => {
    if (selectionMode) {
      return selectedVerseKeys.has(verseKey);
    }
    return false;
  };

  // Determine if a verse is pending (waiting for end selection)
  const isVersePending = (verseKey: string): boolean => {
    if (!selectionMode) {
      return false;
    }
    return pendingStartVerse === verseKey;
  };

  // Determine if the entire line should be highlighted (for non-selection mode)
  const isLineHighlighted = useMemo(() => {
    if (selectionMode) {
      return false; // Don't use line highlighting in selection mode
    }

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
  }, [
    highlightedLineKeys,
    lineKey,
    isHighlighted,
    selectionMode,
    // isSelectedFromContext is from context and stable, but linter doesn't know that
  ]);

  // Determine if a word should be highlighted
  const isWordHighlighted = (word: Word): boolean => {
    if (highlightedWordIds) {
      return highlightedWordIds.has(word.id);
    }
    if (selectionMode) {
      // In selection mode, highlight based on verse selection
      return isVerseSelected(word.verseKey);
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
      {selectionMode ? (
        // In selection mode: render verses separately, each clickable
        <View style={styles.container}>
          <View style={styles.wordsContainer}>
            {Object.entries(wordsByVerse).map(
              ([verseKey, verseWords], verseIndex) => {
                const verseSelected = isVerseSelected(verseKey);
                const versePending = isVersePending(verseKey);

                return (
                  <Pressable
                    key={verseKey}
                    onPress={() => handleVersePress(verseKey)}
                    style={[
                      styles.verseContainer,
                      verseSelected && styles.verseHighlighted,
                      versePending && styles.versePending,
                    ]}>
                    {verseWords.map((word, wordIndex) => {
                      const shouldHighlight = isWordHighlighted(word);
                      const isFirstWordInVerse = wordIndex === 0;
                      const isFirstVerse = verseIndex === 0;

                      return (
                        <WordComponent
                          key={`${word.id}-${wordIndex}`}
                          word={word}
                          fontFamily={fontFamily}
                          fontSize={fontSize}
                          isHighlighted={shouldHighlight}
                          showSpaceBefore={
                            isFirstWordInVerse
                              ? isFirstVerse === false
                              : wordIndex > 0
                          }
                        />
                      );
                    })}
                  </Pressable>
                );
              },
            )}
          </View>
        </View>
      ) : (
        // Normal mode: render line as before
        <Pressable
          onPress={handleLinePress}
          style={[
            styles.container,
            isLineHighlighted && styles.lineHighlighted,
          ]}>
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
      )}
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

  // Compare selectedVerseKeys Sets (for selection mode)
  const prevVerseKeys = prevProps.selectedVerseKeys;
  const nextVerseKeys = nextProps.selectedVerseKeys;
  const verseKeysEqual: boolean =
    prevVerseKeys === nextVerseKeys ||
    (prevVerseKeys &&
      nextVerseKeys &&
      prevVerseKeys.size === nextVerseKeys.size &&
      [...prevVerseKeys].every(key => nextVerseKeys.has(key))) ||
    (!prevVerseKeys && !nextVerseKeys);

  return (
    prevProps.lineKey === nextProps.lineKey &&
    prevProps.words.length === nextProps.words.length &&
    prevProps.fontFamily === nextProps.fontFamily &&
    prevProps.fontSize === nextProps.fontSize &&
    prevProps.isHighlighted === nextProps.isHighlighted &&
    prevProps.selectionMode === nextProps.selectionMode &&
    wordIdsEqual &&
    lineKeysEqual &&
    verseKeysEqual
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
  verseContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingVertical: 2,
    paddingHorizontal: 2,
    borderRadius: 4,
  },
  verseHighlighted: {
    backgroundColor: colors.light,
  },
  versePending: {
    backgroundColor: colors.secondary,
    opacity: 0.5,
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
