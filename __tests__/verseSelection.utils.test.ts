import {
  getVersesInRange,
  mergeOverlappingRanges,
  orderVerseKeys,
  splitRangeBySurah,
} from '../src/components/QuranPager/utils/verseSelection.utils';
import {VerseRange} from '../src/types/quran-pager.types';

const range = (id: string, startKey: string, endKey: string): VerseRange => {
  const surahId = Number(startKey.split(':')[0]);
  return {
    id,
    startVerseKey: startKey,
    endVerseKey: endKey,
    surahId,
    chapterNumber: surahId,
  };
};

describe('orderVerseKeys', () => {
  it('keeps keys already in mushaf order', () => {
    expect(orderVerseKeys('1:5', '1:6')).toEqual(['1:5', '1:6']);
    expect(orderVerseKeys('1:7', '2:3')).toEqual(['1:7', '2:3']);
  });

  it('swaps keys picked end-first', () => {
    expect(orderVerseKeys('1:6', '1:5')).toEqual(['1:5', '1:6']);
    expect(orderVerseKeys('2:3', '1:7')).toEqual(['1:7', '2:3']);
  });

  it('compares verse numbers numerically, not as strings', () => {
    expect(orderVerseKeys('2:10', '2:9')).toEqual(['2:9', '2:10']);
  });
});

describe('splitRangeBySurah', () => {
  it('returns a single range within one surah', () => {
    expect(splitRangeBySurah('1:2', '1:5')).toEqual([
      {startKey: '1:2', endKey: '1:5', surahId: 1},
    ]);
  });

  it('splits a two-surah range picked end-first', () => {
    expect(splitRangeBySurah('2:3', '1:7')).toEqual([
      {startKey: '1:7', endKey: '1:7', surahId: 1},
      {startKey: '2:1', endKey: '2:3', surahId: 2},
    ]);
  });

  it('includes every surah between start and end in full', () => {
    expect(splitRangeBySurah('112:1', '114:6')).toEqual([
      {startKey: '112:1', endKey: '112:4', surahId: 112},
      {startKey: '113:1', endKey: '113:5', surahId: 113},
      {startKey: '114:1', endKey: '114:6', surahId: 114},
    ]);
  });
});

describe('getVersesInRange', () => {
  it('lists verses for a range picked end-first', () => {
    expect(getVersesInRange('1:6', '1:5')).toEqual(['1:5', '1:6']);
  });

  it('lists only the selected verses across surahs picked end-first', () => {
    expect(getVersesInRange('2:3', '1:7')).toEqual([
      '1:7',
      '2:1',
      '2:2',
      '2:3',
    ]);
  });

  it('does not skip a middle surah', () => {
    const verses = getVersesInRange('112:1', '114:6');
    expect(verses).toHaveLength(4 + 5 + 6);
    expect(verses).toContain('113:1');
    expect(verses).toContain('113:5');
  });
});

describe('mergeOverlappingRanges', () => {
  it('merges adjacent ranges', () => {
    const merged = mergeOverlappingRanges([
      range('a', '1:2', '1:3'),
      range('b', '1:4', '1:4'),
      range('c', '1:5', '1:6'),
    ]);
    expect(merged).toHaveLength(1);
    expect(merged[0]).toMatchObject({startVerseKey: '1:2', endVerseKey: '1:6'});
  });

  it('keeps separate surahs separate', () => {
    const merged = mergeOverlappingRanges([
      range('a', '1:7', '1:7'),
      range('b', '2:1', '2:3'),
    ]);
    expect(merged).toHaveLength(2);
  });

  it('absorbs a single verse inside a range stored end-first', () => {
    const merged = mergeOverlappingRanges([
      range('a', '2:7', '2:7'),
      range('b', '2:9', '2:9'),
      range('c', '2:12', '2:6'),
    ]);
    expect(merged).toHaveLength(1);
    expect(merged[0]).toMatchObject({
      startVerseKey: '2:6',
      endVerseKey: '2:12',
    });
  });
});
