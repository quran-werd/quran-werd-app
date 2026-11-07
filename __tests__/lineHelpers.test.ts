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
});
