import {Word, Verse, VerseRange} from '../types';
import {getVerseCount} from '../../../content/quran';

/**
 * Parse a verse key string (e.g., "2:5") into chapterId and verseNumber
 * This is exported for use in context as well
 */
export function parseVerseKey(verseKey: string): {
  chapterId: number;
  verseNumber: number;
} {
  const [chapterId, verseNumber] = verseKey.split(':').map(Number);
  return {chapterId, verseNumber};
}

/**
 * Generate all verse keys between start and end (inclusive)
 */
export function getVersesInRange(
  startKey: string,
  endKey: string,
): string[] {
  const start = parseVerseKey(startKey);
  const end = parseVerseKey(endKey);

  const verses: string[] = [];

  // If same surah
  if (start.chapterId === end.chapterId) {
    const minVerse = Math.min(start.verseNumber, end.verseNumber);
    const maxVerse = Math.max(start.verseNumber, end.verseNumber);
    for (let v = minVerse; v <= maxVerse; v++) {
      verses.push(`${start.chapterId}:${v}`);
    }
  } else {
    // Cross surah range - split into two parts
    const startSurahLastVerse = getVerseCount(start.chapterId);
    // Add verses from start surah
    for (let v = start.verseNumber; v <= startSurahLastVerse; v++) {
      verses.push(`${start.chapterId}:${v}`);
    }
    // Add verses from end surah
    for (let v = 1; v <= end.verseNumber; v++) {
      verses.push(`${end.chapterId}:${v}`);
    }
  }

  return verses;
}

/**
 * Split a range that crosses surah boundaries into multiple ranges
 * Returns array of ranges, each within a single surah
 */
export function splitRangeBySurah(
  startKey: string,
  endKey: string,
): Array<{startKey: string; endKey: string; surahId: number}> {
  const start = parseVerseKey(startKey);
  const end = parseVerseKey(endKey);

  // Same surah - return single range
  if (start.chapterId === end.chapterId) {
    return [
      {
        startKey,
        endKey,
        surahId: start.chapterId,
      },
    ];
  }

  // Cross surah - split into two ranges
  const startSurahLastVerse = getVerseCount(start.chapterId);
  const startSurahLastKey = `${start.chapterId}:${startSurahLastVerse}`;
  const endSurahFirstKey = `${end.chapterId}:1`;

  return [
    {
      startKey,
      endKey: startSurahLastKey,
      surahId: start.chapterId,
    },
    {
      startKey: endSurahFirstKey,
      endKey,
      surahId: end.chapterId,
    },
  ];
}

/**
 * Extract verse text from words array
 */
export function getVerseTextFromWords(words: Word[]): string {
  if (words.length === 0) return '';
  // Use codeV1 for QCF fonts, fallback to textUthmani or text
  return words
    .map(word => word.codeV1 || word.textUthmani || word.text || '')
    .join(' ')
    .trim();
}

/**
 * Calculate statistics for a verse range
 */
export function calculateRangeStats(
  range: VerseRange,
  verses: Verse[],
): {verseCount: number; wordCount: number} {
  const versesInRange = getVersesInRange(range.startVerseKey, range.endVerseKey);
  let wordCount = 0;

  versesInRange.forEach(verseKey => {
    const verse = verses.find(v => v.verseKey === verseKey);
    if (verse) {
      wordCount += verse.words.length;
    }
  });

  return {
    verseCount: versesInRange.length,
    wordCount,
  };
}

/**
 * Check if a verse key falls within any of the selected ranges
 */
export function isVerseInRanges(
  verseKey: string,
  ranges: VerseRange[],
): boolean {
  return ranges.some(range => {
    const versesInRange = getVersesInRange(
      range.startVerseKey,
      range.endVerseKey,
    );
    return versesInRange.includes(verseKey);
  });
}

/**
 * Get all verse keys that are selected in the given ranges
 */
export function getAllSelectedVerseKeys(ranges: VerseRange[]): Set<string> {
  const verseKeys = new Set<string>();
  ranges.forEach(range => {
    const versesInRange = getVersesInRange(
      range.startVerseKey,
      range.endVerseKey,
    );
    versesInRange.forEach(key => verseKeys.add(key));
  });
  return verseKeys;
}
