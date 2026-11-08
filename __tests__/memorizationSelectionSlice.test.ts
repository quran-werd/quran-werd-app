import reducer, {
  addVerseRange,
  setPendingStartVerse,
} from '../src/features/Memorization/memorizationSelectionSlice';
import {getAllSelectedVerseKeys} from '../src/components/QuranPager/utils/verseSelection.utils';

type State = ReturnType<typeof reducer>;

const initial = (): State => reducer(undefined, {type: '@@INIT'});

// Mirrors the UI: tap the first verse, then the second
const select = (state: State, first: string, second: string): State =>
  reducer(
    reducer(state, setPendingStartVerse(first)),
    addVerseRange({startKey: first, endKey: second}),
  );

const keys = (state: State) =>
  state.ranges.map(r => [r.startVerseKey, r.endVerseKey]);

describe('memorizationSelection addVerseRange', () => {
  it('stores a range picked end-first in start-first order', () => {
    const state = select(initial(), '1:6', '1:5');
    expect(keys(state)).toEqual([['1:5', '1:6']]);
    expect(state.pendingStartVerse).toBeNull();
  });

  it('selects only the picked verses for a cross-surah range picked end-first', () => {
    const state = select(initial(), '2:3', '1:7');
    expect(keys(state)).toEqual([
      ['1:7', '1:7'],
      ['2:1', '2:3'],
    ]);
    expect(getAllSelectedVerseKeys(state.ranges).size).toBe(4);
  });

  it('creates one range per surah, including middle surahs', () => {
    const state = select(initial(), '112:1', '114:6');
    expect(keys(state)).toEqual([
      ['112:1', '112:4'],
      ['113:1', '113:5'],
      ['114:1', '114:6'],
    ]);
  });

  it('merges single verses into an overlapping range picked end-first', () => {
    let state = select(initial(), '2:7', '2:7');
    state = select(state, '2:9', '2:9');
    state = select(state, '2:12', '2:6');
    expect(keys(state)).toEqual([['2:6', '2:12']]);
    expect(state.mergeEvent).not.toBeNull();
  });

  it('does not report a merge for disjoint ranges', () => {
    let state = select(initial(), '1:2', '1:3');
    state = select(state, '1:6', '1:7');
    expect(keys(state)).toEqual([
      ['1:2', '1:3'],
      ['1:6', '1:7'],
    ]);
    expect(state.mergeEvent).toBeNull();
  });
});
