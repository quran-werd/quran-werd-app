import {juz} from './juz_data';
import {pageData, PageDataItem} from './page_data';
import {surah} from './surah_data';
import {sajdahVerses} from './sajdah_verses';
import {QURAN_TEXT} from './quran_text';
import {QURAN_NORMAL_TEXT} from './quran_text_normal';

// Reciters data - placeholder for now
interface Reciter {
  identifier: string;
  language: string;
  name: string;
  englishName: string;
  format: string;
  type: string;
  direction: null | string;
}

declare const reciters: Reciter[];

/**
 * Takes [pageNumber] and returns a list containing Surahs and the starting and ending Verse numbers in that page
 */
export function getPageData(pageNumber: number): PageDataItem[] {
  if (pageNumber < 1 || pageNumber > 604) {
    throw new Error(
      'Invalid page number. Page number must be between 1 and 604',
    );
  }
  return pageData[pageNumber - 1];
}

/**
 * The most standard and common copy of Arabic only Quran total pages count
 */
export const totalPagesCount = 604;

/**
 * The constant total of makki surahs
 */
export const totalMakkiSurahs = 89;

/**
 * The constant total of madani surahs
 */
export const totalMadaniSurahs = 25;

/**
 * The constant total juz count
 */
export const totalJuzCount = 30;

/**
 * The constant total surah count
 */
export const totalSurahCount = 114;

/**
 * The constant total verse count
 */
export const totalVerseCount = 6236;

/**
 * The constant 'بِسْمِ ٱللَّهِ ٱلرَّحْمَٰنِ ٱلرَّحِيمِ'
 */
export const basmala = 'بِسْمِ ٱللَّهِ ٱلرَّحْمَٰنِ ٱلرَّحِيمِ';

/**
 * The constant 'سَجْدَةٌ'
 */
export const sajdah = 'سَجْدَةٌ';

/**
 * Takes [pageNumber] and returns total surahs count in that page
 */
export function getSurahCountByPage(pageNumber: number): number {
  if (pageNumber < 1 || pageNumber > 604) {
    throw new Error(
      'Invalid page number. Page number must be between 1 and 604',
    );
  }
  return pageData[pageNumber - 1].length;
}

/**
 * Takes [pageNumber] and returns total verses count in that page
 */
export function getVerseCountByPage(pageNumber: number): number {
  if (pageNumber < 1 || pageNumber > 604) {
    throw new Error(
      'Invalid page number. Page number must be between 1 and 604',
    );
  }
  let totalVerseCount = 0;
  for (let i = 0; i < pageData[pageNumber - 1].length; i++) {
    totalVerseCount += pageData[pageNumber - 1][i].end;
  }
  return totalVerseCount;
}

/**
 * Takes [surahNumber] & [verseNumber] and returns Juz number
 */
export function getJuzNumber(surahNumber: number, verseNumber: number): number {
  for (const juzItem of juz) {
    if (juzItem.verses[surahNumber]) {
      const [start, end] = juzItem.verses[surahNumber];
      if (verseNumber >= start && verseNumber <= end) {
        return juzItem.id;
      }
    }
  }
  return -1;
}

/**
 * Takes [juzNumber] and returns a map which contains keys as surah number and value as a list containing starting and ending verse numbers.
 */
export function getSurahAndVersesFromJuz(
  juzNumber: number,
): Record<number, [number, number]> {
  return juz[juzNumber - 1].verses;
}

/**
 * Takes [surahNumber] and returns the Surah name
 */
export function getSurahName(surahNumber: number): string {
  if (surahNumber > 114 || surahNumber <= 0) {
    throw new Error('No Surah found with given surahNumber');
  }
  return surah[surahNumber - 1].name;
}

/**
 * Takes [surahNumber] returns the Surah name in English
 */
export function getSurahNameEnglish(surahNumber: number): string {
  if (surahNumber > 114 || surahNumber <= 0) {
    throw new Error('No Surah found with given surahNumber');
  }
  return surah[surahNumber - 1].english;
}

/**
 * Takes [surahNumber] returns the Surah name in Turkish
 */
export function getSurahNameTurkish(surahNumber: number): string {
  if (surahNumber > 114 || surahNumber <= 0) {
    throw new Error('No Surah found with given surahNumber');
  }
  return surah[surahNumber - 1].turkish;
}

/**
 * Takes [surahNumber] returns the Surah name in Arabic
 */
export function getSurahNameArabic(surahNumber: number): string {
  if (surahNumber > 114 || surahNumber <= 0) {
    throw new Error('No Surah found with given surahNumber');
  }
  return surah[surahNumber - 1].arabic;
}

/**
 * Takes [surahNumber], [verseNumber] and returns the page number of the Quran
 */
export function getPageNumber(
  surahNumber: number,
  verseNumber: number,
): number {
  if (surahNumber > 114 || surahNumber <= 0) {
    throw new Error('No Surah found with given surahNumber');
  }

  for (let pageIndex = 0; pageIndex < pageData.length; pageIndex++) {
    for (
      let surahIndexInPage = 0;
      surahIndexInPage < pageData[pageIndex].length;
      surahIndexInPage++
    ) {
      const e = pageData[pageIndex][surahIndexInPage];
      if (
        e.surah === surahNumber &&
        e.start <= verseNumber &&
        e.end >= verseNumber
      ) {
        return pageIndex + 1;
      }
    }
  }

  throw new Error('Invalid verse number.');
}

/**
 * Takes [surahNumber] and returns the place of revelation (Makkah / Madinah) of the surah
 */
export function getPlaceOfRevelation(surahNumber: number): string {
  if (surahNumber > 114 || surahNumber <= 0) {
    throw new Error('No Surah found with given surahNumber');
  }
  return surah[surahNumber - 1].place;
}

/**
 * Takes [surahNumber] and returns the count of total Verses in the Surah
 */
export function getVerseCount(surahNumber: number): number {
  if (surahNumber > 114 || surahNumber <= 0) {
    throw new Error('No verse found with given surahNumber');
  }
  return surah[surahNumber - 1].aya;
}

/**
 * Takes [surahNumber], [verseNumber] & [verseEndSymbol] (optional) and returns the Verse in Arabic
 */
export function getVerse(
  surahNumber: number,
  verseNumber: number,
  verseEndSymbol = false,
): string {
  let verse = '';
  for (const i of QURAN_TEXT) {
    if (i.surah_number === surahNumber && i.verse_number === verseNumber) {
      verse = i.content;
      break;
    }
  }

  if (verse === '') {
    throw new Error(
      'No verse found with given surahNumber and verseNumber.\n\n',
    );
  }

  return verse + (verseEndSymbol ? getVerseEndSymbol(verseNumber) : '');
}

/**
 * Gets verse QCF data
 */
export function getVerseQCF(
  surahNumber: number,
  verseNumber: number,
  verseEndSymbol = false,
): string {
  let verse = '';
  for (const i of QURAN_TEXT) {
    if (i.surah_number === surahNumber && i.verse_number === verseNumber) {
      verse = i.qcfData || '';
      break;
    }
  }

  if (verse === '') {
    throw new Error(
      'No verse found with given surahNumber and verseNumber.\n\n',
    );
  }

  return verse + (verseEndSymbol ? getVerseEndSymbol(verseNumber) : '');
}

export function getPageQCFontName(pageNumber: number): string {
  return `QCF2${pageNumber.toString().padStart(3, '0')}`;
}

/**
 * Takes [verseNumber], [arabicNumeral] (optional) and returns '۝' symbol with verse number
 */
export function getVerseEndSymbol(
  verseNumber: number,
  arabicNumeral = true,
): string {
  if (!arabicNumeral) {
    return '\u06dd' + verseNumber.toString();
  }

  const arabicNumbers: Record<string, string> = {
    '0': '٠',
    '1': '۱',
    '2': '۲',
    '3': '۳',
    '4': '٤',
    '5': '٥',
    '6': '٦',
    '7': '۷',
    '8': '۸',
    '9': '۹',
  };

  const digits = verseNumber.toString().split('');
  let arabicNumeric = '';
  for (const e of digits) {
    arabicNumeric += arabicNumbers[e];
  }

  return '\u06dd' + arabicNumeric;
}

/**
 * Takes [juzNumber] and returns Juz URL (from Quran.com)
 */
export function getJuzURL(juzNumber: number): string {
  return `https://quran.com/juz/${juzNumber}`;
}

/**
 * Takes [surahNumber] and returns Surah URL (from Quran.com)
 */
export function getSurahURL(surahNumber: number): string {
  return `https://quran.com/${surahNumber}`;
}

/**
 * Takes [surahNumber] & [verseNumber] and returns Verse URL (from Quran.com)
 */
export function getVerseURL(surahNumber: number, verseNumber: number): string {
  return `https://quran.com/${surahNumber}/${verseNumber}`;
}

/**
 * Takes [surahNumber] and returns the list of page numbers of the surah
 */
export function getSurahPages(surahNumber: number): number[] {
  if (surahNumber > 114 || surahNumber <= 0) {
    throw new Error('Invalid surahNumber');
  }

  const pagesCount = totalPagesCount;
  const pages: number[] = [];
  for (let currentPage = 1; currentPage <= pagesCount; currentPage++) {
    const currentPageData = getPageData(currentPage);
    for (let j = 0; j < currentPageData.length; j++) {
      const currentSurahNum = currentPageData[j].surah;
      if (currentSurahNum === surahNumber) {
        pages.push(currentPage);
        break;
      }
    }
  }
  return pages;
}

export enum SurahSeperator {
  none,
  surahName,
  surahNameArabic,
  surahNameEnglish,
  surahNameTurkish,
}

/**
 * Takes [surahNumber] and returns audio URL of that surah
 */
export function getAudioURLBySurah(
  surahNumber: number,
  reciterIdentifier: string,
): string {
  return `https://cdn.islamic.network/quran/audio-surah/64/${reciterIdentifier}/${surahNumber}.mp3`;
}

export function getReciters() {
  return reciters;
}

/**
 * Takes [verseNumber] and returns audio URL of that verse
 */
export function getAudioURLByVerseNumber(
  verseNumber: number,
  reciterIdentifier: string,
): string {
  return `https://cdn.islamic.network/quran/audio/64/${reciterIdentifier}/${verseNumber}.mp3`;
}

/**
 * Takes [surahNumber] & [verseNumber] and returns true if verse is sajdah
 */
export function isSajdahVerse(
  surahNumber: number,
  verseNumber: number,
): boolean {
  return sajdahVerses[surahNumber] === verseNumber;
}

/**
 * Normalise Arabic text by removing various diacritics and special characters
 */
export function normalise(input: string): string {
  return input
    .split('\u0610')
    .join('') // ARABIC SIGN SALLALLAHOU ALAYHE WA SALLAM
    .split('\u0611')
    .join('') // ARABIC SIGN ALAYHE ASSALLAM
    .split('\u0612')
    .join('') // ARABIC SIGN RAHMATULLAH ALAYHE
    .split('\u0613')
    .join('') // ARABIC SIGN RADI ALLAHOU ANHU
    .split('\u0614')
    .join('') // ARABIC SIGN TAKHALLUS
    .split('\u0615')
    .join('') // ARABIC SMALL HIGH TAH
    .split('\u0616')
    .join('') // ARABIC SMALL HIGH LIGATURE ALEF WITH LAM WITH YEH
    .split('\u0617')
    .join('') // ARABIC SMALL HIGH ZAIN
    .split('\u0618')
    .join('') // ARABIC SMALL FATHA
    .split('\u0619')
    .join('') // ARABIC SMALL DAMMA
    .split('\u061A')
    .join('') // ARABIC SMALL KASRA
    .split('\u06D6')
    .join('') // ARABIC SMALL HIGH LIGATURE SAD WITH LAM WITH ALEF MAKSURA
    .split('\u06D7')
    .join('') // ARABIC SMALL HIGH LIGATURE QAF WITH LAM WITH ALEF MAKSURA
    .split('\u06D8')
    .join('') // ARABIC SMALL HIGH MEEM INITIAL FORM
    .split('\u06D9')
    .join('') // ARABIC SMALL HIGH LAM ALEF
    .split('\u06DA')
    .join('') // ARABIC SMALL HIGH JEEM
    .split('\u06DB')
    .join('') // ARABIC SMALL HIGH THREE DOTS
    .split('\u06DC')
    .join('') // ARABIC SMALL HIGH SEEN
    .split('\u06DD')
    .join('') // ARABIC END OF AYAH
    .split('\u06DE')
    .join('') // ARABIC START OF RUB EL HIZB
    .split('\u06DF')
    .join('') // ARABIC SMALL HIGH ROUNDED ZERO
    .split('\u06E0')
    .join('') // ARABIC SMALL HIGH UPRIGHT RECTANGULAR ZERO
    .split('\u06E1')
    .join('') // ARABIC SMALL HIGH DOTLESS HEAD OF KHAH
    .split('\u06E2')
    .join('') // ARABIC SMALL HIGH MEEM ISOLATED FORM
    .split('\u06E3')
    .join('') // ARABIC SMALL LOW SEEN
    .split('\u06E4')
    .join('') // ARABIC SMALL HIGH MADDA
    .split('\u06E5')
    .join('') // ARABIC SMALL WAW
    .split('\u06E6')
    .join('') // ARABIC SMALL YEH
    .split('\u06E7')
    .join('') // ARABIC SMALL HIGH YEH
    .split('\u06E8')
    .join('') // ARABIC SMALL HIGH NOON
    .split('\u06E9')
    .join('') // ARABIC PLACE OF SAJDAH
    .split('\u06EA')
    .join('') // ARABIC EMPTY CENTRE LOW STOP
    .split('\u06EB')
    .join('') // ARABIC EMPTY CENTRE HIGH STOP
    .split('\u06EC')
    .join('') // ARABIC ROUNDED HIGH STOP WITH FILLED CENTRE
    .split('\u06ED')
    .join('') // ARABIC SMALL LOW MEEM
    .split('\u0640')
    .join('') // Remove tatweel
    .split('\u064B')
    .join('') // ARABIC FATHATAN
    .split('\u064C')
    .join('') // ARABIC DAMMATAN
    .split('\u064D')
    .join('') // ARABIC KASRATAN
    .split('\u064E')
    .join('') // ARABIC FATHA
    .split('\u064F')
    .join('') // ARABIC DAMMA
    .split('\u0650')
    .join('') // ARABIC KASRA
    .split('\u0651')
    .join('') // ARABIC SHADDA
    .split('\u0652')
    .join('') // ARABIC SUKUN
    .split('\u0653')
    .join('') // ARABIC MADDAH ABOVE
    .split('\u0654')
    .join('') // ARABIC HAMZA ABOVE
    .split('\u0655')
    .join('') // ARABIC HAMZA BELOW
    .split('\u0656')
    .join('') // ARABIC SUBSCRIPT ALEF
    .split('\u0657')
    .join('') // ARABIC INVERTED DAMMA
    .split('\u0658')
    .join('') // ARABIC MARK NOON GHUNNA
    .split('\u0659')
    .join('') // ARABIC ZWARAKAY
    .split('\u065A')
    .join('') // ARABIC VOWEL SIGN SMALL V ABOVE
    .split('\u065B')
    .join('') // ARABIC VOWEL SIGN INVERTED SMALL V ABOVE
    .split('\u065C')
    .join('') // ARABIC VOWEL SIGN DOT BELOW
    .split('\u065D')
    .join('') // ARABIC REVERSED DAMMA
    .split('\u065E')
    .join('') // ARABIC FATHA WITH TWO DOTS
    .split('\u065F')
    .join('') // ARABIC WAVY HAMZA BELOW
    .split('\u0670')
    .join('') // ARABIC LETTER SUPERSCRIPT ALEF
    .split('\u0624')
    .join('\u0648') // Replace Waw Hamza Above by Waw
    .split('\u0629')
    .join('\u0647') // Replace Ta Marbuta by Ha
    .split('\u064A')
    .join('\u0649') // Replace Ya
    .split('\u0626')
    .join('\u0649') // and Ya Hamza Above by Alif Maksura
    .split('\u0622')
    .join('\u0627') // Replace Alifs with Hamza Above/Below
    .split('\u0623')
    .join('\u0627') // and with Madda Above by Alif
    .split('\u0625')
    .join('\u0627');
}

/**
 * Remove Arabic diacritics from text
 */
export function removeDiacritics(input: string): string {
  const diacriticsMap: Record<string, string> = {
    'َ': '', // Fatha
    'ُ': '', // Damma
    'ِ': '', // Kasra
    'ّ': '', // Shadda
    'ً': '', // Tanwin Fatha
    'ٌ': '', // Tanwin Damma
    'ٍ': '', // Tanwin Kasra
  };

  const diacriticsPattern = Object.keys(diacriticsMap)
    .map(e => e.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'))
    .join('|');
  const exp = new RegExp('[' + diacriticsPattern + ']', 'g');

  return input.replace(exp, '');
}

/**
 * Takes a word [words] and returns a map containing no. of occurences and result of the word search in the arabic quran text.
 * You have to include the harakaat (diacritics) in the words
 */
export function searchWords(words: string): {
  occurences: number;
  result: Array<{surah: number; verse: number}>;
} {
  const result: Array<{surah: number; verse: number}> = [];

  for (const i of QURAN_NORMAL_TEXT) {
    if (i.content.toLowerCase().includes(words.toLowerCase())) {
      result.push({surah: i.surah_number, verse: i.verse_number});
    }
  }

  if (result.length === 0) {
    for (const i of QURAN_TEXT) {
      if (i.content.toLowerCase().includes(words.toLowerCase())) {
        result.push({surah: i.surah_number, verse: i.verse_number});
      }
    }
  }

  return {occurences: result.length, result};
}
