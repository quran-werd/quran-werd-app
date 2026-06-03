import {Verse} from '../../../types/quran-pager.types';
import {fetchPageWithCache} from '../../../services/quranCache.service';
import {transformApiVersesResponse} from '../../../services/transformers';
import {ApiVersesResponse} from '../../../types/api-response.types';

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
    const response: ApiVersesResponse = await fetchPageWithCache(pageNumber);

    // Transform API response to component format
    const verses = transformApiVersesResponse(response);

    return verses;
  } catch (error) {
    console.error(`Failed to fetch verses for page ${pageNumber}:`, error);
    throw error;
  }
};
