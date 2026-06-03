export interface MemorizationVerseRange {
  from: number;
  to: number;
}

export interface MemorizedRange {
  id: string;
  startVerse: number;
  endVerse: number;
  startText: string;
  endText: string;
  wordsCount: number;
  versesCount: number;
  chapterNumber: number;
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

export type ServerMemorizationRanges = Record<string, MemorizationVerseRange[]>;

export interface MemorizationState {
  progress: MemorizationProgress;
  ranges: ServerMemorizationRanges;
  isLoading: boolean;
  error: string | null;
}

export interface SaveMemorizationRange {
  endVerse: number;
  chapterId: number;
  startVerse: number;
  wordsCount: number;
}
