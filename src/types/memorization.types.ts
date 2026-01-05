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

// Server response format: { [chapterNumber: number]: MemorizedRange[] }
export type ServerMemorizationRanges = {
  [chapterNumber: number]: MemorizedRange[];
};

export interface MemorizationState {
  progress: MemorizationProgress;
  ranges: ServerMemorizationRanges;
  isLoading: boolean;
  error: string | null;
}

export interface SaveMemorizationRequest {
  ranges: SaveMemorizationRange[];
}

export interface SaveMemorizationRange {
  endVerse: number;
  chapterId: number;
  startVerse: number;
  wordsCount: number;
}
