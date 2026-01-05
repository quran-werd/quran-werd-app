import {createSlice, PayloadAction} from '@reduxjs/toolkit';
import type {RootState} from '../../store';
import {
  MemorizationState,
  MemorizationProgress,
  ServerMemorizationRanges,
} from '../../types/memorization.types';
import {
  fetchMemorizations,
  fetchMemorizationByChapter,
  saveMemorization,
} from './memorizationAction';

const initialState: MemorizationState = {
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
    updateSurahProgress: (
      state,
      action: PayloadAction<{
        surahId: string;
        memorizedVerses: number;
        memorizedRanges: any[];
      }>,
    ) => {
      const surah = state.progress.surahs.find(
        s => s.id === action.payload.surahId,
      );
      if (surah) {
        surah.memorizedVerses = action.payload.memorizedVerses;
        surah.memorizedRanges = action.payload.memorizedRanges;
      }

      // Recalculate overall progress
      const totalMemorized = state.progress.surahs.reduce(
        (acc, s) => acc + s.memorizedVerses,
        0,
      );
      const totalVerses = state.progress.surahs.reduce(
        (acc, s) => acc + s.totalVerses,
        0,
      );

      state.progress.totalMemorizedVerses = totalMemorized;
      state.progress.totalVerses = totalVerses;
      state.progress.overallProgress = Math.round(
        (totalMemorized / totalVerses) * 100,
      );

      // Update completed and in-progress counts
      state.progress.completedSurahs = state.progress.surahs.filter(
        s => s.memorizedVerses === s.totalVerses,
      ).length;
      state.progress.inProgressSurahs = state.progress.surahs.filter(
        s => s.memorizedVerses > 0 && s.memorizedVerses < s.totalVerses,
      ).length;
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.isLoading = action.payload;
    },
    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
    },
  },
  extraReducers: builder => {
    // Fetch all memorizations
    builder.addCase(fetchMemorizations.pending, state => {
      state.isLoading = true;
      state.error = null;
    });
    builder.addCase(fetchMemorizations.fulfilled, (state, action) => {
      state.isLoading = false;
      state.ranges = action.payload as ServerMemorizationRanges;
      state.error = null;
    });
    builder.addCase(fetchMemorizations.rejected, (state, action) => {
      state.isLoading = false;
      state.error = action.payload as string;
    });

    // Fetch memorization by chapter
    builder.addCase(fetchMemorizationByChapter.pending, state => {
      state.isLoading = true;
      state.error = null;
    });
    builder.addCase(fetchMemorizationByChapter.rejected, (state, action) => {
      state.isLoading = false;
      state.error = action.payload as string;
    });

    // Save memorization
    builder.addCase(saveMemorization.pending, state => {
      state.isLoading = true;
      state.error = null;
    });
    builder.addCase(saveMemorization.fulfilled, (state, action) => {
      state.isLoading = false;
      state.ranges = action.payload as unknown as ServerMemorizationRanges;
      state.error = null;
    });
    builder.addCase(saveMemorization.rejected, (state, action) => {
      state.isLoading = false;
      state.error = action.payload as string;
    });
  },
});

export const {
  setProgress,
  toggleSurahExpansion,
  updateSurahProgress,
  setLoading,
  setError,
} = memorizationSlice.actions;

// Selectors
export const selectMemorization = (state: RootState) => state.memorization;
export const selectMemorizationProgress = (state: RootState) =>
  state.memorization.progress;
export const selectMemorizationRanges = (state: RootState) =>
  state.memorization.ranges;
export const selectMemorizationLoading = (state: RootState) =>
  state.memorization.isLoading;
export const selectMemorizationError = (state: RootState) =>
  state.memorization.error;

export default memorizationSlice.reducer;
