export interface MemorizedRange {
  id: string;
  startVerse: number;
  endVerse: number;
  startText: string;
  endText: string;
  wordCount: number;
  verseCount: number;
}

export interface SurahProgress {
  id: string;
  number: number;
  nameArabic: string;
  nameEnglish: string;
  type: 'Makkiyah' | 'Madaniyah';
  totalVerses: number;
  memorizedVerses: number;
  memorizedRanges: MemorizedRange[];
  isExpanded?: boolean;
}

export interface MemorizationProgress {
  overallProgress: number;
  totalMemorizedVerses: number;
  totalVerses: number;
  completedSurahs: number;
  inProgressSurahs: number;
  surahs: SurahProgress[];
  lastReviewDate?: string;
}

export interface MemorizationState {
  progress: MemorizationProgress;
  isLoading: boolean;
  error: string | null;
}
