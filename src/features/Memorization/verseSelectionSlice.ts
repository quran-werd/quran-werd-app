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
  history: Array<{
    ranges: VerseRange[];
    pendingStartVerse: string | null;
  }>; // History stack for undo (snapshots without history field to avoid circular reference)
  future: Array<{
    ranges: VerseRange[];
    pendingStartVerse: string | null;
  }>; // Future stack for redo
}

const initialState: VerseSelectionState = {
  ranges: [],
  pendingStartVerse: null,
  history: [],
  future: [],
};

// Helper function to save current state to history before mutation
const saveToHistory = (state: VerseSelectionState) => {
  // Clear future stack when performing a new action (can't redo after new action)
  state.future = [];

  // Save a snapshot of the current state (excluding history to avoid circular reference)
  // We only need ranges and pendingStartVerse for undo functionality
  const stateSnapshot = {
    ranges: state.ranges.map(range => ({...range})),
    pendingStartVerse: state.pendingStartVerse,
  };
  state.history.push(stateSnapshot);
  // Limit history to last 50 actions to prevent memory issues
  if (state.history.length > 50) {
    state.history.shift();
  }
};

export const verseSelectionSlice = createSlice({
  name: 'verseSelection',
  initialState,
  reducers: {
    setPendingStartVerse: (state, action: PayloadAction<string | null>) => {
      // Only save to history if actually changing
      if (state.pendingStartVerse !== action.payload) {
        saveToHistory(state);
        state.pendingStartVerse = action.payload;
      }
    },
    addVerseRange: (
      state,
      action: PayloadAction<{startKey: string; endKey: string}>,
    ) => {
      saveToHistory(state);
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
      saveToHistory(state);
      state.ranges = state.ranges.filter(range => range.id !== action.payload);
    },
    clearRanges: state => {
      saveToHistory(state);
      state.ranges = [];
      state.pendingStartVerse = null;
    },
    undo: state => {
      if (state.history.length > 0) {
        // Save current state to future stack for redo
        const currentStateSnapshot = {
          ranges: state.ranges.map(range => ({...range})),
          pendingStartVerse: state.pendingStartVerse,
        };
        state.future.push(currentStateSnapshot);

        // Restore previous state from history
        const previousState = state.history.pop()!;
        state.ranges = previousState.ranges.map(range => ({...range}));
        state.pendingStartVerse = previousState.pendingStartVerse;
      }
    },
    redo: state => {
      if (state.future.length > 0) {
        // Save current state back to history
        const currentStateSnapshot = {
          ranges: state.ranges.map(range => ({...range})),
          pendingStartVerse: state.pendingStartVerse,
        };
        state.history.push(currentStateSnapshot);

        // Restore future state
        const futureState = state.future.pop()!;
        state.ranges = futureState.ranges.map(range => ({...range}));
        state.pendingStartVerse = futureState.pendingStartVerse;
      }
    },
  },
});

export const {
  setPendingStartVerse,
  addVerseRange,
  removeRange,
  clearRanges,
  undo,
  redo,
} = verseSelectionSlice.actions;

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

// Selector to check if undo is available
export const selectCanUndo = (state: RootState): boolean => {
  return state.verseSelection.history.length > 0;
};

// Selector to check if redo is available
export const selectCanRedo = (state: RootState): boolean => {
  return state.verseSelection.future.length > 0;
};

export default verseSelectionSlice.reducer;
