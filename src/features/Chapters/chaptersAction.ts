import {createAsyncThunk, isRejectedWithValue} from '@reduxjs/toolkit';
import {quranAxios} from '../../utils/axios';
import {Chapter} from '../../types/chapters.types';

export const fetchChapters = createAsyncThunk(
  'fetchChapters',
  async (): Promise<Chapter[] | boolean> => {
    try {
      const response = await quranAxios.get<{chapters: Chapter[]}>('/chapters');
      return response.data.chapters;
    } catch (error) {
      return isRejectedWithValue(error);
    }
  },
);
