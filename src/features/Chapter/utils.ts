import {Verse, VerseAPI, VerseInfoAPI} from '../../types/verses.types';

export function addOthmaniTextToVersesInfo(
  verses: VerseAPI[],
  versesInfo: VerseInfoAPI[],
): Verse[] {
  return versesInfo.map((verse, idx) => {
    const splittedUthmani = verses[idx].text_uthmani.split(' ');
    console.log(1111, {splittedUthmani, original: verses[idx].text_uthmani});

    const words = verse.words.map((word, idx) => ({
      ...word,
      text: splittedUthmani[idx],
    }));

    return {
      ...verse,
      words,
    };
  });
}

/**
 * split text_uthmani
 * loop words
 * replace text property value with splitted uthmani text
 */
