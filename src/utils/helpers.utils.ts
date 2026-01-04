import {SURAHS_INFO} from '../content';
import {MemorizedRange} from '../types';

export function getMemorizedVersesCountFromRanges(ranges: MemorizedRange[]) {
  return ranges.reduce((acc, range) => {
    return acc + range.endVerse - range.startVerse + 1;
  }, 0);
}

export function getMemorizedPercentageFromRanges(
  surahNumber: number,
  ranges: MemorizedRange[],
) {
  const totalVerses = SURAHS_INFO[surahNumber].aya;
  const memorizedVerses = getMemorizedVersesCountFromRanges(ranges);
  return Math.round((memorizedVerses / totalVerses) * 100);
}
