import {createSlice, PayloadAction} from '@reduxjs/toolkit';
import {
  MemorizationState,
  MemorizationProgress,
  SurahProgress,
} from '../../types/memorization.types';

const initialState: MemorizationState = {
  progress: {
    overallProgress: 2,
    totalMemorizedVerses: 13,
    totalVerses: 789,
    completedSurahs: 0,
    inProgressSurahs: 3,
    surahs: [
      {
        id: '1',
        number: 1,
        nameArabic: 'الفاتحة',
        nameEnglish: 'Al-Fatihah',
        type: 'Makkiyah',
        totalVerses: 7,
        memorizedVerses: 3,
        memorizedRanges: [],
        isExpanded: false,
      },
      {
        id: '2',
        number: 2,
        nameArabic: 'البقرة',
        nameEnglish: 'Al-Baqarah',
        type: 'Madaniyah',
        totalVerses: 286,
        memorizedVerses: 8,
        memorizedRanges: [
          {
            id: 'range-1',
            startVerse: 1,
            endVerse: 5,
            startText: 'الم... :من',
            endText: 'أُولئِكَ عَلَى هُدًى مِّن رَّبِّهِمْ... إلى .',
            wordCount: 36,
            verseCount: 5,
          },
          {
            id: 'range-2',
            startVerse: 12,
            endVerse: 14,
            startText: 'أَلَا إِنَّهُمْ هُمُ الْمُفْسِدُونَ وَلكِن.... : من .',
            endText: 'وَإِذَا لَقُوا الَّذِينَ آمَنُوا قَالُوا... إلى .',
            wordCount: 42,
            verseCount: 3,
          },
        ],
        isExpanded: true,
      },
      {
        id: '3',
        number: 3,
        nameArabic: 'آل عمران',
        nameEnglish: 'Ali Imran',
        type: 'Madaniyah',
        totalVerses: 200,
        memorizedVerses: 2,
        memorizedRanges: [],
        isExpanded: false,
      },
      {
        id: '4',
        number: 4,
        nameArabic: 'النساء',
        nameEnglish: 'An-Nisa',
        type: 'Madaniyah',
        totalVerses: 176,
        memorizedVerses: 0,
        memorizedRanges: [],
        isExpanded: false,
      },
    ],
    lastReviewDate: new Date().toISOString(),
  },
  isLoading: false,
  error: null,
};

const memorizationSlice = createSlice({
  name: 'memorization',
  initialState,
  reducers: {
    toggleSurahExpansion: (state, action: PayloadAction<string>) => {
      const surah = state.progress.surahs.find(s => s.id === action.payload);
      if (surah) {
        surah.isExpanded = !surah.isExpanded;
      }
    },
    updateMemorizedVerses: (
      state,
      action: PayloadAction<{surahId: string; memorizedVerses: number}>,
    ) => {
      const surah = state.progress.surahs.find(
        s => s.id === action.payload.surahId,
      );
      if (surah) {
        surah.memorizedVerses = action.payload.memorizedVerses;
        // Recalculate overall progress
        const totalMemorized = state.progress.surahs.reduce(
          (sum, s) => sum + s.memorizedVerses,
          0,
        );
        state.progress.totalMemorizedVerses = totalMemorized;
        state.progress.overallProgress = Math.round(
          (totalMemorized / state.progress.totalVerses) * 100,
        );
      }
    },
    addMemorizedRange: (
      state,
      action: PayloadAction<{surahId: string; range: any}>,
    ) => {
      const surah = state.progress.surahs.find(
        s => s.id === action.payload.surahId,
      );
      if (surah) {
        surah.memorizedRanges.push(action.payload.range);
      }
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.isLoading = action.payload;
    },
    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
    },
  },
});

export const {
  toggleSurahExpansion,
  updateMemorizedVerses,
  addMemorizedRange,
  setLoading,
  setError,
} = memorizationSlice.actions;

export default memorizationSlice.reducer;
