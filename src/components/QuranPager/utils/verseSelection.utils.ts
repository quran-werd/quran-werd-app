import {Word, Verse, VerseRange} from '../../../types/quran-pager.types';
import {getVerseCount} from '../../../content/quran';

/**
 * Format a number with thousands separators (e.g., 1500 -> "1,500")
 */
export function formatNumberWithCommas(num: number): string {
  return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
}

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
 * Order two verse keys in mushaf order, so a range picked end-first
 * (e.g. "2:3" then "1:7") is treated the same as one picked start-first
 */
export function orderVerseKeys(
  keyA: string,
  keyB: string,
): [startKey: string, endKey: string] {
  const a = parseVerseKey(keyA);
  const b = parseVerseKey(keyB);
  const aFirst =
    a.chapterId < b.chapterId ||
    (a.chapterId === b.chapterId && a.verseNumber <= b.verseNumber);
  return aFirst ? [keyA, keyB] : [keyB, keyA];
}

/**
 * Split a range into one range per surah it covers, in mushaf order.
 * Surahs between the start and end surah are included in full.
 */
export function splitRangeBySurah(
  startKey: string,
  endKey: string,
): Array<{startKey: string; endKey: string; surahId: number}> {
  const [orderedStartKey, orderedEndKey] = orderVerseKeys(startKey, endKey);
  const start = parseVerseKey(orderedStartKey);
  const end = parseVerseKey(orderedEndKey);

  const ranges: Array<{startKey: string; endKey: string; surahId: number}> =
    [];
  for (let surahId = start.chapterId; surahId <= end.chapterId; surahId++) {
    const firstVerse = surahId === start.chapterId ? start.verseNumber : 1;
    const lastVerse =
      surahId === end.chapterId ? end.verseNumber : getVerseCount(surahId);
    ranges.push({
      startKey: `${surahId}:${firstVerse}`,
      endKey: `${surahId}:${lastVerse}`,
      surahId,
    });
  }
  return ranges;
}

/**
 * Generate all verse keys between start and end (inclusive), in either order
 */
export function getVersesInRange(startKey: string, endKey: string): string[] {
  const verses: string[] = [];
  splitRangeBySurah(startKey, endKey).forEach(range => {
    const first = parseVerseKey(range.startKey).verseNumber;
    const last = parseVerseKey(range.endKey).verseNumber;
    for (let v = first; v <= last; v++) {
      verses.push(`${range.surahId}:${v}`);
    }
  });
  return verses;
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
 * Only counts actual words (filters out markers like 'end', 'pause', etc.)
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
    if (verse && verse.words && Array.isArray(verse.words)) {
      // Only count actual words, filter out markers (end, pause, sajdah, rub-el-hizb)
      const actualWords = verse.words.filter(
        word => word && word.charTypeName === 'word',
      );
      wordCount += actualWords.length;
    }
  });

  return {
    verseCount: versesInRange.length,
    wordCount,
  };
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
    chapterNumber: range1.chapterNumber || range2.chapterNumber,
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

  // Sort ranges by surah, then by lowest verse (a range's keys may be stored
  // end-first, so its start key isn't necessarily its lowest verse)
  const lowestVerse = (range: VerseRange) =>
    Math.min(
      parseVerseKey(range.startVerseKey).verseNumber,
      parseVerseKey(range.endVerseKey).verseNumber,
    );
  const sorted = [...ranges].sort((a, b) => {
    if (a.surahId !== b.surahId) {
      return a.surahId - b.surahId;
    }
    return lowestVerse(a) - lowestVerse(b);
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
