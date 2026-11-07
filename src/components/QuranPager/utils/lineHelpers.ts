import type {VerseRange} from '../../../types/quran-pager.types';

// Al-Fatiha's verse 1 is itself the Bismillah, and At-Tawbah has none at all.
const CHAPTERS_WITHOUT_DECORATIVE_BISMILLAH = new Set([1, 9]);

export function verseNumberFromKey(verseKey: string): number {
  return Number(verseKey.split(':')[1]);
}

/**
 * True when a line is the first line of a surah (i.e. starts with that
 * surah's verse 1), regardless of which surah it is. The surah name header
 * should always be shown on this line.
 */
export function isSurahStartLine(verseNumber: number | undefined): boolean {
  return verseNumber === 1;
}

/**
 * True when the decorative Bismillah artwork should be shown above a surah
 * start line. False for Al-Fatiha (verse 1 already *is* the Bismillah text,
 * so showing the artwork too would duplicate it) and for At-Tawbah (which
 * has no Bismillah in the mushaf at all).
 */
export function shouldShowBismillah(
  verseNumber: number | undefined,
  chapterId: number,
): boolean {
  return (
    isSurahStartLine(verseNumber) &&
    !CHAPTERS_WITHOUT_DECORATIVE_BISMILLAH.has(chapterId)
  );
}

export function isRangeEndpoint(
  verseKey: string,
  ranges: VerseRange[],
): boolean {
  return ranges.some(
    range => range.startVerseKey === verseKey || range.endVerseKey === verseKey,
  );
}
