/**
 * Types for the Mushaf Local Store — the on-device, runtime-built dataset
 * the QuranPager renders from. See CONTEXT.md ("Mushaf Local Store") and
 * docs/adr/0001-mushaf-local-store-built-on-first-launch.md.
 */

export type MushafWordCharType =
  | 'word'
  | 'end'
  | 'pause'
  | 'sajdah'
  | 'rub-el-hizb';

export interface MushafWord {
  id: number;
  position: number;
  codeV1?: string;
  textUthmani?: string;
  text?: string;
  pageNumber: number;
  lineNumber: number;
  verseKey: string;
  verseNumber: number;
  chapterId: number;
  charTypeName: MushafWordCharType;
}

export interface MushafAyahLocator {
  surah: number;
  ayah: number;
  page: number;
}

export type MushafRevelationPlace = 'meccan' | 'medinan';

export interface MushafSurahLocator {
  surah: number;
  nameArabic: string;
  startPage: number;
  endPage: number;
  ayahCount: number;
  type: MushafRevelationPlace;
}

export interface MushafPageSurahRange {
  surah: number;
  start: number;
  end: number;
}

export interface MushafLocalStoreData {
  version: number;
  pages: Record<number, MushafWord[]>;
  ayahText: Record<string, string>;
  ayahMap: Record<string, MushafAyahLocator>;
  surahMap: Record<number, MushafSurahLocator>;
  pageMap: Record<number, MushafPageSurahRange[]>;
}

export interface MushafLocalStoreMeta {
  version: number;
  complete: boolean;
}

export type MushafLocalStoreStatus = 'ready' | 'stale' | 'missing';

export type MushafLocalStoreBuildPhase =
  | 'checking'
  | 'downloading-chapters'
  | 'downloading-pages'
  | 'finalizing'
  | 'ready'
  | 'error';

export interface MushafLocalStoreBuildProgress {
  phase: MushafLocalStoreBuildPhase;
  pagesCompleted: number;
  totalPages: number;
  error?: string;
}
