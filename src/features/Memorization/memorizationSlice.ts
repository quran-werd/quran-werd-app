import {createSlice, PayloadAction} from '@reduxjs/toolkit';
import {
  MemorizationState,
  MemorizationProgress,
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
            startText: 'الم ذَٰلِكَ الْكِتَابُ لَا رَيْبَ فِيهِ',
            endText:
              'أُولَـٰئِكَ عَلَىٰ هُدًى مِّن رَّبِّهِمْ وَأُولَـٰئِكَ هُمُ الْمُفْلِحُونَ',
            wordCount: 36,
            verseCount: 5,
          },
          {
            id: 'range-2',
            startVerse: 12,
            endVerse: 14,
            startText:
              'أَلَا إِنَّهُمْ هُمُ الْمُفْسِدُونَ وَلَـٰكِن لَّا يَشْعُرُونَ',
            endText: 'وَإِذَا لَقُوا الَّذِينَ آمَنُوا قَالُوا آمَنَّا',
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
        nameEnglish: 'Ali-Imran',
        type: 'Madaniyah',
        totalVerses: 200,
        memorizedVerses: 2,
        memorizedRanges: [],
        isExpanded: false,
      },
    ],
    lastReviewDate: '2024-03-15',
  },
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
});

export const {
  setProgress,
  toggleSurahExpansion,
  updateSurahProgress,
  setLoading,
  setError,
} = memorizationSlice.actions;

export default memorizationSlice.reducer;
