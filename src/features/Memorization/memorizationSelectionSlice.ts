import {createSlice, PayloadAction, createSelector} from '@reduxjs/toolkit';
import type {RootState} from '../../store';
import {VerseRange} from '../../types/quran-pager.types';
import {
  splitRangeBySurah,
  parseVerseKey,
  getAllSelectedVerseKeys,
  mergeOverlappingRanges,
} from '../../components/QuranPager/utils/verseSelection.utils';
import {getChapterNumberFromVerseKey} from '../../utils/helpers.utils';

interface MemorizationSelectionState {
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
  mergeEvent: {id: number} | null; // Transient flag consumed by the merge-success toast (docs/design.md §2.13)
}

const initialState: MemorizationSelectionState = {
  ranges: [],
  pendingStartVerse: null,
  history: [],
  future: [],
  mergeEvent: null,
};

// Helper function to save current state to history before mutation
const saveToHistory = (state: MemorizationSelectionState) => {
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

export const memorizationSelectionSlice = createSlice({
  name: 'memorizationSelection',
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
          chapterNumber: getChapterNumberFromVerseKey(splitRange.startKey),
          surahId: splitRange.surahId,
          // If this is a cross-surah range, track the original start surah
          startSurahId:
            splitRange.surahId !== startParsed.chapterId
              ? startParsed.chapterId
              : undefined,
        });
      });

      const countBeforeMerge = state.ranges.length;

      // Merge overlapping and adjacent ranges
      state.ranges = mergeOverlappingRanges(state.ranges);

      if (state.ranges.length < countBeforeMerge) {
        state.mergeEvent = {id: Date.now()};
      }

      // Clear pending start after range is created
      state.pendingStartVerse = null;
    },
    clearMergeEvent: state => {
      state.mergeEvent = null;
    },
    clearRanges: state => {
      state.ranges = [];
      state.pendingStartVerse = null;
      state.history = [];
      state.future = [];
    },
    removeRange: (state, action: PayloadAction<string>) => {
      saveToHistory(state);
      state.ranges = state.ranges.filter(range => range.id !== action.payload);
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
  undo,
  redo,
  clearMergeEvent,
  clearRanges,
} = memorizationSelectionSlice.actions;

// Selectors
export const selectRanges = (state: RootState) =>
  state.memorizationSelection.ranges;

export const selectPendingStartVerse = (state: RootState) =>
  state.memorizationSelection.pendingStartVerse;

export const selectMergeEvent = (state: RootState) =>
  state.memorizationSelection.mergeEvent;

// Memoized selector that only recomputes when ranges change
// This prevents unnecessary re-renders by returning the same Set reference
// when the ranges haven't changed
export const selectSelectedVerseKeys = createSelector(
  [selectRanges],
  (ranges: VerseRange[]): Set<string> => {
    return getAllSelectedVerseKeys(ranges);
  },
);

// Selector to check if undo is available
export const selectCanUndo = (state: RootState): boolean => {
  return state.memorizationSelection.history.length > 0;
};

// Selector to check if redo is available
export const selectCanRedo = (state: RootState): boolean => {
  return state.memorizationSelection.future.length > 0;
};

export default memorizationSelectionSlice.reducer;
