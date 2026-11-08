import type {VerseRange} from '../../../types/quran-pager.types';

// Al-Fatiha's verse 1 is itself the Bismillah, and At-Tawbah has none at all.
const CHAPTERS_WITHOUT_DECORATIVE_BISMILLAH = new Set([1, 9]);

export function verseNumberFromKey(verseKey: string): number {
  return Number(verseKey.split(':')[1]);
}

/**
 * True when a line is the first line of a surah: it must start with that
 * surah's verse 1, AND with that verse's first word. Checking verseNumber
 * alone is not enough — a long verse 1 (e.g. An-Nisa's) wraps across
 * several lines, and every one of them "starts with verse 1"; only the
 * line that starts with word position 1 is the surah's actual first line.
 * The surah name header should always be shown on this line.
 */
export function isSurahStartLine(
  verseNumber: number | undefined,
  wordPosition: number | undefined,
): boolean {
  return verseNumber === 1 && wordPosition === 1;
}

/**
 * True when the decorative Bismillah artwork should be shown above a surah
 * start line. False for Al-Fatiha (verse 1 already *is* the Bismillah text,
 * so showing the artwork too would duplicate it) and for At-Tawbah (which
 * has no Bismillah in the mushaf at all).
 */
export function shouldShowBismillah(
  verseNumber: number | undefined,
  wordPosition: number | undefined,
  chapterId: number,
): boolean {
  return (
    isSurahStartLine(verseNumber, wordPosition) &&
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
