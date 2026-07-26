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

export type ServerMemorizationRanges = Record<string, MemorizationVerseRange[]>;

export interface SaveMemorizationRange {
  endVerse: number;
  chapterId: number;
  startVerse: number;
  wordsCount: number;
}
