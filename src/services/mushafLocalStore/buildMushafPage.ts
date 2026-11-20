import {fetchPageVerses} from '../clients/quranCdnClient';
import {transformApiVersesResponse} from '../transformers';
import {getVerseTextFromWords} from '../../components/QuranPager/utils/verseSelection.utils';
import {ApiVersesResponse} from '../../types/api-response.types';
import {
  MushafAyahLocator,
  MushafPageSurahRange,
  MushafWord,
} from '../../types/mushaf-local-store.types';

export interface MushafPageBuildResult {
  pageNumber: number;
  words: MushafWord[];
  ayahText: Record<string, string>;
  ayahMap: Record<string, MushafAyahLocator>;
  pageSurahRanges: MushafPageSurahRange[];
}

/**
 * Fetches one mushaf page from the Quran.com CDN and reduces it to what the
 * Mushaf Local Store persists: word-level glyph/layout data, ayah text, and
 * this page's slice of the ayah/surah locator maps.
 */
export const buildMushafPage = async (
  pageNumber: number,
): Promise<MushafPageBuildResult> => {
  const response = (await fetchPageVerses(pageNumber)) as ApiVersesResponse;
  const verses = transformApiVersesResponse(response);

  const words: MushafWord[] = [];
  const ayahText: Record<string, string> = {};
  const ayahMap: Record<string, MushafAyahLocator> = {};
  const rangeByChapter = new Map<number, {start: number; end: number}>();

  for (const verse of verses) {
    const chapterId = verse.chapterId ?? 0;

    ayahText[verse.verseKey] = getVerseTextFromWords(verse.words);
    ayahMap[verse.verseKey] = {
      surah: chapterId,
      ayah: verse.verseNumber,
      page: pageNumber,
    };

    const existingRange = rangeByChapter.get(chapterId);
    if (!existingRange) {
      rangeByChapter.set(chapterId, {
        start: verse.verseNumber,
        end: verse.verseNumber,
      });
    } else {
      existingRange.start = Math.min(existingRange.start, verse.verseNumber);
      existingRange.end = Math.max(existingRange.end, verse.verseNumber);
    }

    for (const word of verse.words) {
      words.push({
        id: word.id,
        position: word.position,
        codeV1: word.codeV1,
        textUthmani: word.textUthmani,
        text: word.text,
        pageNumber: word.pageNumber,
        lineNumber: word.lineNumber,
        verseKey: word.verseKey,
        verseNumber: word.verseNumber ?? verse.verseNumber,
        chapterId: word.chapterId,
        charTypeName: word.charTypeName,
      });
    }
  }

  const pageSurahRanges: MushafPageSurahRange[] = Array.from(
    rangeByChapter.entries(),
  )
    .sort(([surahA], [surahB]) => surahA - surahB)
    .map(([surah, range]) => ({surah, ...range}));

  return {pageNumber, words, ayahText, ayahMap, pageSurahRanges};
};
