import {PageTypes} from '../../types/page.types';
import {APITypes, Verse} from '../../types/api.types';

export function addUthmaniTextToVersesInfo(
  verses: APITypes.Verse[],
  versesInfo: APITypes.VerseInfo[],
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

type ChaptersObjMap = {[key: number]: PageTypes.Chapter};
type LinesObjMap = {[key: number]: PageTypes.Line};

export function getPageContent(verses: Verse[]): PageTypes.Page {
  let chaptersObj: ChaptersObjMap = {};
  let linesObjets: LinesObjMap = {};

  for (let i = 0; i < verses.length; i++) {
    const verse = verses[i];
    const chapterNumber = _getChapterNumberByVerseKey(verse.verse_key);

    // Add chapter lines
    verse.words.map(word => {
      if (!linesObjets[word.line_number]) {
        linesObjets[word.line_number] = {
          lineNumber: word.line_number,
          words: [],
        };
      }

      const _word: PageTypes.Word = {
        id: word.id,
        text: word.text,
        isVerseEnd: word.char_type_name === 'end',
        verseNumber: verse.verse_number,
      };

      linesObjets[word.line_number]?.words.push(_word);
    });

    chaptersObj[chapterNumber] = {
      chapterNumber,
      lines: _sortLinesByNumber(linesObjets),
    };

    // Last step
    const nextVerse = verses[i + 1];

    // No more verses
    if (!nextVerse) {
      continue;
    }

    const isNewChapter = _checkIsNextVerseInNewChapter(
      nextVerse,
      chapterNumber,
    );

    if (isNewChapter) {
      linesObjets = {};
    }
  }

  return _sortChaptersByNumber(chaptersObj);
}

function _sortLinesByNumber(lines: LinesObjMap): PageTypes.Line[] {
  return Object.values(lines).sort((a, b) => a.lineNumber - b.lineNumber);
}

function _sortChaptersByNumber(chapters: ChaptersObjMap): PageTypes.Chapter[] {
  return Object.values(chapters).sort(
    (a, b) => a.chapterNumber - b.chapterNumber,
  );
}

function _checkIsNextVerseInNewChapter(
  verse: Verse,
  currentChapterNumber: number,
): boolean {
  const chapterNumber = _getChapterNumberByVerseKey(verse.verse_key);
  return chapterNumber !== currentChapterNumber;
}

function _getChapterNumberByVerseKey(verseKey: string): number {
  return +verseKey.split(':')[0];
}
