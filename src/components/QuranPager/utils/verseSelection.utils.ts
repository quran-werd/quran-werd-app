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
export function getVersesInRange(startKey: string, endKey: string): string[] {
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
 * Prioritizes readable Arabic text over QCF font codes
 */
export function getVerseTextFromWords(words: Word[]): string {
  if (words.length === 0) {
    return '';
  }
  // Use textUthmani (Uthmani Arabic) first, then plain text, avoid codeV1 (QCF codes)
  // textUthmani is the standard readable Arabic text format
  return words
    .map(word => word.textUthmani || word.text || '')
    .filter(text => text.trim().length > 0) // Filter out empty strings
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
  const versesInRange = getVersesInRange(
    range.startVerseKey,
    range.endVerseKey,
  );
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

/**
 * Check if two ranges overlap or are adjacent
 */
function rangesOverlapOrAdjacent(
  range1: VerseRange,
  range2: VerseRange,
): boolean {
  const r1Start = parseVerseKey(range1.startVerseKey);
  const r1End = parseVerseKey(range1.endVerseKey);
  const r2Start = parseVerseKey(range2.startVerseKey);
  const r2End = parseVerseKey(range2.endVerseKey);

  // Must be in same surah to merge
  if (range1.surahId !== range2.surahId) {
    return false;
  }

  // Normalize ranges (start <= end)
  const r1Min = Math.min(r1Start.verseNumber, r1End.verseNumber);
  const r1Max = Math.max(r1Start.verseNumber, r1End.verseNumber);
  const r2Min = Math.min(r2Start.verseNumber, r2End.verseNumber);
  const r2Max = Math.max(r2Start.verseNumber, r2End.verseNumber);

  // Check if ranges overlap (one contains the other or they intersect)
  const overlaps =
    (r1Min <= r2Min && r2Min <= r1Max) || (r2Min <= r1Min && r1Min <= r2Max);

  // Check if ranges are adjacent (gap of exactly 1 verse)
  const isAdjacent =
    r1Max + 1 === r2Min ||
    r2Max + 1 === r1Min ||
    r1Min - 1 === r2Max ||
    r2Min - 1 === r1Max;

  return overlaps || isAdjacent;
}

/**
 * Merge two overlapping or adjacent ranges into one
 */
function mergeRanges(range1: VerseRange, range2: VerseRange): VerseRange {
  const r1Start = parseVerseKey(range1.startVerseKey);
  const r1End = parseVerseKey(range1.endVerseKey);
  const r2Start = parseVerseKey(range2.startVerseKey);
  const r2End = parseVerseKey(range2.endVerseKey);

  // Get min and max verse numbers
  const r1Min = Math.min(r1Start.verseNumber, r1End.verseNumber);
  const r1Max = Math.max(r1Start.verseNumber, r1End.verseNumber);
  const r2Min = Math.min(r2Start.verseNumber, r2End.verseNumber);
  const r2Max = Math.max(r2Start.verseNumber, r2End.verseNumber);

  const minVerse = Math.min(r1Min, r2Min);
  const maxVerse = Math.max(r1Max, r2Max);

  const surahId = range1.surahId;
  const startVerseKey = `${surahId}:${minVerse}`;
  const endVerseKey = `${surahId}:${maxVerse}`;

  // Use the newer range's ID (or range1 if they're equal)
  const id = range1.id > range2.id ? range1.id : range2.id;

  return {
    id,
    startVerseKey,
    endVerseKey,
    surahId,
    startSurahId: range1.startSurahId || range2.startSurahId,
  };
}

/**
 * Merge overlapping and adjacent ranges in a list of ranges
 * Returns a new array with merged ranges
 */
export function mergeOverlappingRanges(ranges: VerseRange[]): VerseRange[] {
  if (ranges.length <= 1) {
    return ranges;
  }

  // Sort ranges by surah, then by start verse
  const sorted = [...ranges].sort((a, b) => {
    const aStart = parseVerseKey(a.startVerseKey);
    const bStart = parseVerseKey(b.startVerseKey);
    if (a.surahId !== b.surahId) {
      return a.surahId - b.surahId;
    }
    return aStart.verseNumber - bStart.verseNumber;
  });

  const merged: VerseRange[] = [];
  let current = sorted[0];

  for (let i = 1; i < sorted.length; i++) {
    const next = sorted[i];

    if (rangesOverlapOrAdjacent(current, next)) {
      // Merge current with next
      current = mergeRanges(current, next);
    } else {
      // No overlap/adjacency - add current and move to next
      merged.push(current);
      current = next;
    }
  }

  // Don't forget the last range
  merged.push(current);

  return merged;
}

/**
 * Check if a range is a single-verse range (start === end)
 */
export function isSingleVerseRange(range: VerseRange): boolean {
  return range.startVerseKey === range.endVerseKey;
}

/**
 * Find a single-verse range that contains the given verse key
 */
export function findSingleVerseRange(
  verseKey: string,
  ranges: VerseRange[],
): VerseRange | undefined {
  return ranges.find(
    range => isSingleVerseRange(range) && range.startVerseKey === verseKey,
  );
}
