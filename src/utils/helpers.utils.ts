import {getVerseCount} from '../content';
import {
  MemorizedRange,
  SaveMemorizationRange,
  MemorizationVerseRange,
} from '../types';

type RangeLike = MemorizationVerseRange | MemorizedRange | {from: number; to: number; startVerse?: number; endVerse?: number};

const getRangeBounds = (range: RangeLike) => {
  if ('from' in range && range.from !== undefined) {
    return {start: range.from, end: range.to};
  }
  const memRange = range as MemorizedRange;
  return {start: memRange.startVerse, end: memRange.endVerse};
};

export function getMemorizedVersesCountFromRanges(ranges: RangeLike[]) {
  return ranges.reduce((acc, range) => {
    const {start, end} = getRangeBounds(range);
    return acc + end - start + 1;
  }, 0);
}

export function getMemorizedPercentageFromRanges(
  surahNumber: number,
  ranges: RangeLike[],
) {
  const totalVerses = getVerseCount(surahNumber);
  const memorizedVerses = getMemorizedVersesCountFromRanges(ranges);
  if (totalVerses === 0) return 0;
  return Math.round((memorizedVerses / totalVerses) * 100);
}

export function mapMemorizedRangesToSaveMemorizationRequest(
  ranges: MemorizedRange[],
): SaveMemorizationRange[] {
  return ranges.map(range => ({
    chapterId: range.chapterNumber,
    startVerse: range.startVerse,
    endVerse: range.endVerse,
    wordsCount: range.wordsCount,
  }));
}

export function getChapterNumberFromVerseKey(verseKey: string): number {
  return parseInt(verseKey.split(':')[0], 10);
}

export function computeMemorizationTotals(
  ranges: Record<string, MemorizationVerseRange[]>,
) {
  let totalMemorizedVerses = 0;
  let completedSurahs = 0;
  let inProgressSurahs = 0;

  for (const [surahKey, surahRanges] of Object.entries(ranges)) {
    const surahNumber = Number(surahKey);
    const memorized = getMemorizedVersesCountFromRanges(surahRanges);
    totalMemorizedVerses += memorized;
    const total = getVerseCount(surahNumber);
    if (memorized >= total && total > 0) {
      completedSurahs += 1;
    } else if (memorized > 0) {
      inProgressSurahs += 1;
    }
  }

  return {totalMemorizedVerses, completedSurahs, inProgressSurahs};
}
