import type {VerseRange} from '../../../types/quran-pager.types';

export function verseNumberFromKey(verseKey: string): number {
  return Number(verseKey.split(':')[1]);
}

export function isRangeEndpoint(
  verseKey: string,
  ranges: VerseRange[],
): boolean {
  return ranges.some(
    range => range.startVerseKey === verseKey || range.endVerseKey === verseKey,
  );
}
