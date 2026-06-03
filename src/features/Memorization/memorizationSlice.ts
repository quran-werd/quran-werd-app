import {createSlice, PayloadAction} from '@reduxjs/toolkit';
import type {RootState} from '../../store';
import {
  MemorizationProgress,
  MemorizedRange,
  VerseRange,
} from '../../types/memorization.types';
import {
  fetchMemorizations,
  addMemorizationRange,
  removeMemorizationRange,
  MemorizationRanges,
} from './memorizationAction';

const initialState: {
  progress: MemorizationProgress;
  ranges: MemorizationRanges;
  isLoading: boolean;
  error: string | null;
} = {
  progress: {
    overallProgress: 0,
    totalMemorizedVerses: 0,
    totalVerses: 0,
    completedSurahs: 0,
    inProgressSurahs: 0,
    surahs: [],
    lastReviewDate: '',
  },
  ranges: {},
  isLoading: false,
  error: null,
};

export const memorizationSlice = createSlice({
  name: 'memorization',
  initialState,
  reducers: {
    setProgress: (state, action: PayloadAction<MemorizationProgress>) => {
      state.progress = action.payload;
    },
    toggleSurahExpansion: (state, action: PayloadAction<string>) => {
      const surah = state.progress.surahs.find(s => s.id === action.payload);
      if (surah) {
        surah.isExpanded = !surah.isExpanded;
      }
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.isLoading = action.payload;
    },
    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
    },
  },
  extraReducers: builder => {
    const handleRangesFulfilled = (
      state: typeof initialState,
      ranges: MemorizationRanges,
    ) => {
      state.isLoading = false;
      state.ranges = ranges;
      state.error = null;
    };

    builder
      .addCase(fetchMemorizations.pending, state => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchMemorizations.fulfilled, (state, action) => {
        handleRangesFulfilled(state, action.payload);
      })
      .addCase(fetchMemorizations.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      .addCase(addMemorizationRange.pending, state => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(addMemorizationRange.fulfilled, (state, action) => {
        handleRangesFulfilled(state, action.payload);
      })
      .addCase(addMemorizationRange.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      .addCase(removeMemorizationRange.pending, state => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(removeMemorizationRange.fulfilled, (state, action) => {
        handleRangesFulfilled(state, action.payload);
      })
      .addCase(removeMemorizationRange.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      });
  },
});

export const {setProgress, toggleSurahExpansion, setLoading, setError} =
  memorizationSlice.actions;

export const selectMemorization = (state: RootState) => state.memorization;
export const selectMemorizationRanges = (state: RootState) =>
  state.memorization.ranges;
export const selectMemorizationLoading = (state: RootState) =>
  state.memorization.isLoading;
export const selectMemorizationError = (state: RootState) =>
  state.memorization.error;

export default memorizationSlice.reducer;
