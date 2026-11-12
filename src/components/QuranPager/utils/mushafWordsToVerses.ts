import {Verse, Word} from '../../../types/quran-pager.types';
import {MushafWord} from '../../../types/mushaf-local-store.types';

/**
 * Regroups a page's flat Mushaf Local Store words back into the Verse[]
 * shape the Page/Line/Word render pipeline already understands, preserving
 * mushaf reading order.
 */
export const groupMushafWordsIntoVerses = (words: MushafWord[]): Verse[] => {
  const versesByKey = new Map<string, Verse>();
  const order: string[] = [];

  for (const mushafWord of words) {
    let verse = versesByKey.get(mushafWord.verseKey);
    if (!verse) {
      verse = {
        id: mushafWord.id,
        verseNumber: mushafWord.verseNumber,
        chapterId: mushafWord.chapterId,
        pageNumber: mushafWord.pageNumber,
        verseKey: mushafWord.verseKey,
        words: [],
      };
      versesByKey.set(mushafWord.verseKey, verse);
      order.push(mushafWord.verseKey);
    }

    const word: Word = {
      id: mushafWord.id,
      position: mushafWord.position,
      text: mushafWord.text,
      textUthmani: mushafWord.textUthmani,
      verseKey: mushafWord.verseKey,
      pageNumber: mushafWord.pageNumber,
      lineNumber: mushafWord.lineNumber,
      verseNumber: mushafWord.verseNumber,
      chapterId: mushafWord.chapterId,
      charTypeName: mushafWord.charTypeName,
      codeV1: mushafWord.codeV1,
    };
    verse.words.push(word);
  }

  return order.map(key => versesByKey.get(key) as Verse);
};
