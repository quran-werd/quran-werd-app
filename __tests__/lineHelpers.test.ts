import {
  isSurahStartLine,
  shouldShowBismillah,
} from '../src/components/QuranPager/utils/lineHelpers';

describe('isSurahStartLine', () => {
  it('is true for a line starting at verse 1, word position 1', () => {
    expect(isSurahStartLine(1, 1)).toBe(true);
  });

  it('is false for any other verse number', () => {
    expect(isSurahStartLine(2, 1)).toBe(false);
    expect(isSurahStartLine(7, 1)).toBe(false);
  });

  it('is false when verseNumber is missing', () => {
    expect(isSurahStartLine(undefined, 1)).toBe(false);
  });

  it('is false for a later line of a long verse 1 (e.g. An-Nisa), even though verseNumber is still 1', () => {
    // An-Nisa's verse 1 wraps across several lines; only the line that
    // starts with the verse's first word (position 1) is the surah start.
    expect(isSurahStartLine(1, 12)).toBe(false);
    expect(isSurahStartLine(1, 25)).toBe(false);
  });

  it('is false when wordPosition is missing', () => {
    expect(isSurahStartLine(1, undefined)).toBe(false);
  });
});

describe('shouldShowBismillah', () => {
  it('is false for Al-Fatiha, whose verse 1 is itself the Bismillah', () => {
    expect(shouldShowBismillah(1, 1, 1)).toBe(false);
  });

  it('is false for At-Tawbah, which has no Bismillah at all', () => {
    expect(shouldShowBismillah(1, 1, 9)).toBe(false);
  });

  it('is true for every other surah start', () => {
    expect(shouldShowBismillah(1, 1, 2)).toBe(true); // Al-Baqarah
    expect(shouldShowBismillah(1, 1, 114)).toBe(true); // An-Nas
  });

  it('is false when the line is not a surah start, regardless of chapter', () => {
    expect(shouldShowBismillah(2, 1, 2)).toBe(false);
    expect(shouldShowBismillah(5, 1, 1)).toBe(false);
    expect(shouldShowBismillah(3, 1, 9)).toBe(false);
  });

  it('is false for later lines of a long verse 1, even for a surah that should show one', () => {
    // Regression: An-Nisa (chapter 4) verse 1 spans 3 lines; only the first
    // should get the surah header + Bismillah, not all three.
    expect(shouldShowBismillah(1, 1, 4)).toBe(true);
    expect(shouldShowBismillah(1, 12, 4)).toBe(false);
    expect(shouldShowBismillah(1, 25, 4)).toBe(false);
  });

  // Every chapter (other than 1 and 9) whose verse 1 spans multiple mushaf
  // lines, per the live Quran CDN word data (checked 2026-11-07). Each of
  // these showed the duplicated header + Bismillah before the position
  // check was added, since isSurahStartLine used to fire on every line.
  const CHAPTERS_WITH_MULTILINE_VERSE_ONE = [
    4, 5, 6, 8, 13, 14, 16, 17, 22, 24, 25, 33, 34, 35, 49, 58, 59, 60, 61,
    62, 63, 64, 65, 66, 71, 72, 98,
  ];

  it.each(CHAPTERS_WITH_MULTILINE_VERSE_ONE)(
    'shows the Bismillah only on the true first line of chapter %i, not later lines of its verse 1',
    chapterId => {
      expect(shouldShowBismillah(1, 1, chapterId)).toBe(true);
      expect(shouldShowBismillah(1, 2, chapterId)).toBe(false);
      expect(shouldShowBismillah(1, 10, chapterId)).toBe(false);
    },
  );
});
