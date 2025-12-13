import {createAsyncThunk} from '@reduxjs/toolkit';
import {werdApiFetcher} from '../../api/clients/werdApiClient';

// Server response type: { [chapterNumber: number]: MemorizedRange[] }
export type ServerMemorizationResponse = {
  [chapterNumber: number]: Array<{
    startVerse: number;
    endVerse: number;
    wordsCount: number;
  }>;
};

/**
 * Fetch all memorized ranges from the server
 */
export const fetchMemorizations = createAsyncThunk(
  'memorization/fetchMemorizations',
  async (_, {rejectWithValue}) => {
    try {
      const response = await werdApiFetcher<ServerMemorizationResponse>(
        '/memorizations',
        {
          method: 'GET',
        },
      );
      return response;
    } catch (error: any) {
      console.error('fetchMemorizations error:', {
        message: error?.message,
        response: error?.response,
        request: error?.request,
        code: error?.code,
      });

      return rejectWithValue(
        error?.response?.data?.message ||
          error?.response?.data?.error ||
          error?.message ||
          'Failed to fetch memorizations. Please try again.',
      );
    }
  },
);

/**
 * Fetch memorized ranges for a specific chapter
 */
export const fetchMemorizationByChapter = createAsyncThunk(
  'memorization/fetchMemorizationByChapter',
  async (chapterNumber: number, {rejectWithValue}) => {
    try {
      const response = await werdApiFetcher<{
        [chapterNumber: number]: Array<{
          startVerse: number;
          endVerse: number;
          wordsCount: number;
        }>;
      }>(`/memorizations/${chapterNumber}`, {
        method: 'GET',
      });
      return {chapterNumber, ranges: response[chapterNumber] || []};
    } catch (error: any) {
      console.error('fetchMemorizationByChapter error:', {
        message: error?.message,
        response: error?.response,
        request: error?.request,
        code: error?.code,
      });

      return rejectWithValue(
        error?.response?.data?.message ||
          error?.response?.data?.error ||
          error?.message ||
          'Failed to fetch chapter memorizations. Please try again.',
      );
    }
  },
);

