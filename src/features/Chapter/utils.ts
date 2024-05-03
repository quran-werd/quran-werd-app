import {Verse, VerseAPI, VerseInfoAPI} from '../../types/verses.types';

export function addUthmaniTextToVersesInfo(
  verses: VerseAPI[],
  versesInfo: VerseInfoAPI[],
): Verse[] {
  return versesInfo.map((verse, idx) => {
    const splittedUthmani = verses[idx].text_uthmani.split(' ');

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
type LineWord = {
  text: string;
  verseNumber: number;
  chapterNumber: number;
  isVerseEnd: boolean;
  isNewChapter: boolean;
};

export type PageLines = {[lineNumber: number]: LineWord[]};

export function preparePageLines(verses: Verse[]): PageLines {
  console.log(1111, {verses});
  const lines: PageLines = {};

  let currentChapterNumber: unknown = null;
  let isNewChapter = false;

  for (let i = 0; i < verses.length; i++) {
    const verse = verses[i];

    const chapterNumber = getChapterNumberByVerseKey(verse.verse_key);

    if (chapterNumber !== currentChapterNumber) {
      isNewChapter = true;
      currentChapterNumber = chapterNumber;
    }

    verse.words.map(word => {
      const wordsOfLine = lines[word.line_number] || [];

      const isVerseEnd = word.char_type_name === 'end';

      wordsOfLine.push({
        text: word.text,
        verseNumber: verse.verse_number,
        chapterNumber,
        isVerseEnd,
        isNewChapter,
      });

      if (isNewChapter) {
        isNewChapter = false;
      }

      lines[word.line_number] = wordsOfLine;
    });
  }

  console.log(1111, 3, {lines});
  return lines;
}

function getChapterNumberByVerseKey(verseKey: string): number {
  return +verseKey.split(':')[0];
}
