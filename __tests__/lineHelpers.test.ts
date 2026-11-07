import {
  isSurahStartLine,
  shouldShowBismillah,
} from '../src/components/QuranPager/utils/lineHelpers';

describe('isSurahStartLine', () => {
  it('is true for a line starting at verse 1', () => {
    expect(isSurahStartLine(1)).toBe(true);
  });

  it('is false for any other verse number', () => {
    expect(isSurahStartLine(2)).toBe(false);
    expect(isSurahStartLine(7)).toBe(false);
  });

  it('is false when verseNumber is missing', () => {
    expect(isSurahStartLine(undefined)).toBe(false);
  });
});

describe('shouldShowBismillah', () => {
  it('is false for Al-Fatiha, whose verse 1 is itself the Bismillah', () => {
    expect(shouldShowBismillah(1, 1)).toBe(false);
  });

  it('is false for At-Tawbah, which has no Bismillah at all', () => {
    expect(shouldShowBismillah(1, 9)).toBe(false);
  });

  it('is true for every other surah start', () => {
    expect(shouldShowBismillah(1, 2)).toBe(true); // Al-Baqarah
    expect(shouldShowBismillah(1, 114)).toBe(true); // An-Nas
  });

  it('is false when the line is not a surah start, regardless of chapter', () => {
    expect(shouldShowBismillah(2, 2)).toBe(false);
    expect(shouldShowBismillah(5, 1)).toBe(false);
    expect(shouldShowBismillah(3, 9)).toBe(false);
  });
});
