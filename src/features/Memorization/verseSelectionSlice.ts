import {createSlice, PayloadAction, createSelector} from '@reduxjs/toolkit';
import type {RootState} from '../../store';
import {VerseRange} from '../../components/QuranPager/types';
import {
  splitRangeBySurah,
  parseVerseKey,
  getAllSelectedVerseKeys,
  mergeOverlappingRanges,
  findSingleVerseRange,
} from '../../components/QuranPager/utils/verseSelection.utils';

interface VerseSelectionState {
  ranges: VerseRange[];
  pendingStartVerse: string | null;
}

const initialState: VerseSelectionState = {
  ranges: [],
  pendingStartVerse: null,
};

export const verseSelectionSlice = createSlice({
  name: 'verseSelection',
  initialState,
  reducers: {
    setPendingStartVerse: (state, action: PayloadAction<string | null>) => {
      state.pendingStartVerse = action.payload;
    },
    addVerseRange: (
      state,
      action: PayloadAction<{startKey: string; endKey: string}>,
    ) => {
      const {startKey, endKey} = action.payload;
      const splitRanges = splitRangeBySurah(startKey, endKey);
      const startParsed = parseVerseKey(startKey);

      splitRanges.forEach(splitRange => {
        // Generate unique ID for the range
        const id = `${splitRange.startKey}-${
          splitRange.endKey
        }-${Date.now()}-${Math.random()}`;
        state.ranges.push({
          id,
          startVerseKey: splitRange.startKey,
          endVerseKey: splitRange.endKey,
          surahId: splitRange.surahId,
          // If this is a cross-surah range, track the original start surah
          startSurahId:
            splitRange.surahId !== startParsed.chapterId
              ? startParsed.chapterId
              : undefined,
        });
      });

      // Merge overlapping and adjacent ranges
      state.ranges = mergeOverlappingRanges(state.ranges);

      // Clear pending start after range is created
      state.pendingStartVerse = null;
    },
    removeRange: (state, action: PayloadAction<string>) => {
      state.ranges = state.ranges.filter(range => range.id !== action.payload);
    },
    clearRanges: state => {
      state.ranges = [];
      state.pendingStartVerse = null;
    },
  },
});

export const {setPendingStartVerse, addVerseRange, removeRange, clearRanges} =
  verseSelectionSlice.actions;

// Selectors
export const selectRanges = (state: RootState) => state.verseSelection.ranges;

export const selectPendingStartVerse = (state: RootState) =>
  state.verseSelection.pendingStartVerse;

// Memoized selector that only recomputes when ranges change
// This prevents unnecessary re-renders by returning the same Set reference
// when the ranges haven't changed
export const selectSelectedVerseKeys = createSelector(
  [selectRanges],
  (ranges: VerseRange[]): Set<string> => {
    return getAllSelectedVerseKeys(ranges);
  },
);

// Memoized selector for checking if a specific verse is selected
// This selector factory returns a memoized selector per verseKey
export const selectIsVerseSelected = (verseKey: string) =>
  createSelector([selectSelectedVerseKeys], (selectedKeys: Set<string>) => {
    return selectedKeys.has(verseKey);
  });

// Selector to find a single-verse range for a given verse key
export const selectSingleVerseRangeForVerse = (verseKey: string) =>
  createSelector([selectRanges], (ranges: VerseRange[]): VerseRange | null => {
    const found = findSingleVerseRange(verseKey, ranges);
    return found || null;
  });

export default verseSelectionSlice.reducer;
