import {Platform} from 'react-native';
import {juz} from './juz_data';
import {pageData, PageDataItem} from './page_data';
import {SURAHS_INFO} from './surah_data';

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
 * Takes [num] and returns the Arabic numerals
 */
export const toArabicNumerals = (num: number): string => {
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
  return num
    .toString()
    .split('')
    .map(digit => arabicNumbers[digit])
    .join('');
};

/**
 * The most standard and common copy of Arabic only Quran total pages count
 */
export const totalPagesCount = 604;

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
 * Takes [surahNumber] returns the Surah name in Arabic
 */
export function getSurahNameArabic(surahNumber: number): string {
  if (surahNumber > 114 || surahNumber <= 0) {
    throw new Error('No Surah found with given surahNumber');
  }
  return SURAHS_INFO[surahNumber - 1].arabic;
}

/**
 * Takes [surahNumber] and returns the count of total Verses in the Surah
 */
export function getVerseCount(surahNumber: number): number {
  if (!surahNumber || surahNumber > 114 || surahNumber <= 0) {
    throw new Error('No verse found with given surahNumber');
  }
  return SURAHS_INFO[surahNumber - 1].aya;
}

export function getPageQCFontName(pageNumber: number): string {
  // iOS uses QCF_P001, QCF_P002 format
  // Android uses p1, p2, p10, p100 format (matches filename)
  if (Platform.OS === 'android') {
    return `p${pageNumber}`;
  }
  const fontName = `QCF_P${pageNumber.toString().padStart(3, '0')}`;
  console.log('fontName', fontName);
  return fontName;
}

/**
 * Takes [surahNumber] & [verseNumber] and returns the Mushaf page number containing that verse
 */
export function getPageForVerse(surahNumber: number, verseNumber: number): number {
  for (let page = 1; page <= totalPagesCount; page++) {
    const items = getPageData(page);
    const match = items.find(
      item =>
        item.surah === surahNumber &&
        verseNumber >= item.start &&
        verseNumber <= item.end,
    );
    if (match) {
      return page;
    }
  }
  return 1;
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
