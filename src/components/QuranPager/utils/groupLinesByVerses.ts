import {Verse, Word, LineData} from '../types';

/**
 * Groups verses into lines to match the Quran Page (Mushaf) layout
 * Matches quran.com-frontend-next ReadingView exactly
 *
 * Uses REAL line numbers from API (not simulated)
 *
 * The returning value is an object containing the page and line number as a key,
 * and array of words for the value. E.g.
 * {
 *  'Page1-Line2': [words],
 *  'Page1-Line3': [words]
 *  ...
 * }
 *
 * @param verses - Array of verses to group
 * @returns Record of line keys to words
 */
export const groupLinesByVerses = (
  verses: Verse[],
): Record<string, Word[]> => {
  const words: Word[] = verses.flatMap(verse => verse.words);

  // Groups the words based on their (page and) line number from API
  const lines: Record<string, Word[]> = {};

  words.forEach(word => {
    const lineKey = `Page${word.pageNumber}-Line${word.lineNumber}`;
    if (!lines[lineKey]) {
      lines[lineKey] = [];
    }
    lines[lineKey].push(word);
  });

  return lines;
};

/**
 * Converts grouped lines to an array of LineData objects
 * for easier iteration in React Native components
 *
 * @param verses - Array of verses to group
 * @returns Array of LineData objects
 */
export const getLineDataFromVerses = (verses: Verse[]): LineData[] => {
  const linesMap = groupLinesByVerses(verses);

  return Object.entries(linesMap).map(([lineKey, words]) => {
    const firstWord = words[0];
    return {
      lineKey,
      words,
      pageNumber: firstWord.pageNumber,
      lineNumber: firstWord.lineNumber,
    };
  });
};

