import {getVerseCount} from '../content';
import {MemorizedRange, SaveMemorizationRange} from '../types';

export function getMemorizedVersesCountFromRanges(ranges: MemorizedRange[]) {
  return ranges.reduce((acc, range) => {
    return acc + range.endVerse - range.startVerse + 1;
  }, 0);
}

export function getMemorizedPercentageFromRanges(
  surahNumber: number,
  ranges: MemorizedRange[],
) {
  const totalVerses = getVerseCount(surahNumber);
  const memorizedVerses = getMemorizedVersesCountFromRanges(ranges);
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
  return parseInt(verseKey.split(':')[0]);
}
