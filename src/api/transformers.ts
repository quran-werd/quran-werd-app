/**
 * API Response Transformers
 * Converts API camelCase responses to component-friendly camelCase
 */

import {ApiVerse, ApiWord, ApiVersesResponse} from './types';
import {Verse, Word} from '../types/quran-pager.types';

/**
 * Extract chapter ID from verse_key (e.g., "2:255" -> 2)
 */
const getChapterIdFromVerseKey = (verseKey?: string): number => {
  if (!verseKey) {
    console.warn('verse_key is undefined');
    return 0;
  }
  return parseInt(verseKey.split(':')[0], 10);
};

/**
 * Transforms an API word to component Word
 * Handles case where verse_key might be missing from individual words
 */
export const transformApiWord = (
  apiWord: ApiWord,
  parentVerseKey?: string,
): Word => {
  // Use verse_key from word if available, otherwise use parent verse's key
  const verseKey = apiWord.verse_key || parentVerseKey || '';
  const chapterId = getChapterIdFromVerseKey(verseKey);
  const verseNumber = verseKey ? parseInt(verseKey.split(':')[1], 10) : 0;

  return {
    id: apiWord.id,
    position: apiWord.position,
    text: apiWord.text,
    textUthmani: apiWord.text_uthmani,
    textIndopak: apiWord.text_indopak,
    verseKey,
    pageNumber: apiWord.page_number,
    lineNumber: apiWord.line_number,
    verseNumber,
    chapterId,
    charTypeName: apiWord.char_type_name,
    codeV1: apiWord.code_v1,
    codeV2: apiWord.code_v2,
    audioUrl: apiWord.audio_url,
    translation: apiWord.translation
      ? {
          text: apiWord.translation.text,
          languageName: apiWord.translation.language_name,
        }
      : undefined,
    transliteration: apiWord.transliteration
      ? {
          text: apiWord.transliteration.text,
          languageName: apiWord.transliteration.language_name,
        }
      : undefined,
    verse: {
      verseNumber,
      verseKey,
      chapterId,
    },
  };
};

/**
 * Transforms an API verse to component Verse
 * Passes verse_key to words that might not have it
 */
export const transformApiVerse = (apiVerse: ApiVerse): Verse => {
  const chapterId = getChapterIdFromVerseKey(apiVerse.verse_key);

  return {
    id: apiVerse.id,
    verseNumber: apiVerse.verse_number,
    chapterId,
    pageNumber: apiVerse.page_number,
    juzNumber: apiVerse.juz_number,
    hizbNumber: apiVerse.hizb_number,
    rubElHizbNumber: apiVerse.rub_el_hizb_number,
    verseKey: apiVerse.verse_key,
    // Pass verse_key to each word for cases where word doesn't have it
    words: apiVerse.words.map(word =>
      transformApiWord(word, apiVerse.verse_key),
    ),
    textUthmani: apiVerse.text_uthmani,
    textUthmaniSimple: apiVerse.text_uthmani_simple,
    textIndopak: apiVerse.text_indopak,
    textImlaei: apiVerse.text_imlaei,
    translations: apiVerse.translations,
    audio: apiVerse.audio,
  };
};

/**
 * Transforms API verses response to component verses array
 */
export const transformApiVersesResponse = (
  response: ApiVersesResponse,
): Verse[] => {
  return response.verses.map(transformApiVerse);
};
