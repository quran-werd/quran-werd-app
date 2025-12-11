/**
 * Types for QuranPager components
 * Matches quran.com-frontend-next ReadingView structure exactly
 */

export interface Word {
  id: number;
  position: number;
  text?: string;
  textUthmani?: string;
  textIndopak?: string;
  verseKey: string;
  pageNumber: number;
  lineNumber: number;
  verseNumber?: number;
  chapterId: number;
  charTypeName: 'word' | 'end' | 'pause' | 'sajdah' | 'rub-el-hizb';
  codeV1?: string;
  codeV2?: string;
  audioUrl?: string;
  translation?: {
    text: string;
    languageName: string;
  };
  transliteration?: {
    text: string;
    languageName: string;
  };
  verse?: {
    verseNumber: number;
    verseKey: string;
    chapterId: number;
  };
}

export interface Verse {
  id: number;
  verseNumber: number;
  chapterId?: number;
  pageNumber: number;
  juzNumber?: number;
  hizbNumber?: number;
  rubElHizbNumber?: number;
  verseKey: string;
  words: Word[];
  textUthmani?: string;
  textUthmaniSimple?: string;
  textIndopak?: string;
  textImlaei?: string;
  translations?: any[];
  audio?: {
    url: string;
    segments?: any[];
  };
}

export interface PageData {
  pageNumber: number;
  verses: Verse[];
}

export interface LineData {
  lineKey: string;
  words: Word[];
  pageNumber: number;
  lineNumber: number;
}

export interface VerseRange {
  id: string;
  startVerseKey: string;
  endVerseKey: string;
  surahId: number;
  startSurahId?: number; // For ranges that span surahs
}

