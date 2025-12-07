import {Verse} from '../types';
import {fetchPageVerses} from '../../../api/clients/quranCdnClient';
import {transformApiVersesResponse} from '../../../api/transformers';
import {ApiVersesResponse} from '../../../api/types';

/**
 * Fetches and transforms page data from Quran.com API
 * Matches the web version's approach exactly
 *
 * @param pageNumber - The Quran page number (1-604)
 * @returns Promise<Array of verses with real API data including line numbers>
 */
export const getPageVerses = async (pageNumber: number): Promise<Verse[]> => {
  try {
    // Fetch from Quran.com API using axios
    const response: ApiVersesResponse = await fetchPageVerses(pageNumber);

    // Transform API response to component format
    const verses = transformApiVersesResponse(response);

    return verses;
  } catch (error) {
    console.error(`Failed to fetch verses for page ${pageNumber}:`, error);
    throw error;
  }
};
