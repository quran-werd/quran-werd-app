import {Verse} from '../../../types/quran-pager.types';

/**
 * Groups verses into pages to match the Quran Page (Mushaf) layout
 * Adapted from quran.com-frontend-next ReadingView
 *
 * The returning value is an object containing the page number as a key,
 * and array of verses for the value. E.g.
 * {
 *  1: [verses],
 *  2: [verses]
 *  ...
 * }
 *
 * @param verses - Array of verses to group
 * @returns Record of page numbers to verses
 */
export const groupPagesByVerses = (
  verses: Verse[],
): Record<number, Verse[]> => {
  const pages: Record<number, Verse[]> = {};

  verses.forEach(verse => {
    const pageNumber = verse.pageNumber;
    if (!pages[pageNumber]) {
      pages[pageNumber] = [];
    }
    pages[pageNumber].push(verse);
  });

  return pages;
};
