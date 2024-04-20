import {createAsyncThunk, isRejectedWithValue} from '@reduxjs/toolkit';
import {quranAxios} from '../../utils/axios';
import {Chapter} from '../../types/chapters.types';
import {slicesNames} from '../../store/constants';

export const fetchChapters = createAsyncThunk(
  slicesNames.chapters,
  async (): Promise<Chapter[] | boolean> => {
    try {
      const response = await quranAxios.get<{chapters: Chapter[]}>('/chapters');
      return response.data.chapters;
    } catch (error) {
      return isRejectedWithValue(error);
    }
  },
);
