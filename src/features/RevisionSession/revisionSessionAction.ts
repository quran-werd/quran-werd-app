import {createAsyncThunk} from '@reduxjs/toolkit';
import {
  getTodayWerd,
  completeWerd as completeWerdRequest,
  TodayWerdResponse,
  CompleteWerdResponse,
} from '../../services/revisionPlan.service';
import {ApiError} from '../../types/api.types';

export const fetchTodayWerd = createAsyncThunk<TodayWerdResponse>(
  'revisionSession/fetchToday',
  async (_, {rejectWithValue}) => {
    try {
      return await getTodayWerd();
    } catch (error) {
      const message =
        error instanceof ApiError ? error.message : 'Failed to fetch today werd';
      return rejectWithValue(message);
    }
  },
);

export const completeWerd = createAsyncThunk<CompleteWerdResponse, string>(
  'revisionSession/complete',
  async (werdId, {rejectWithValue}) => {
    try {
      return await completeWerdRequest(werdId);
    } catch (error) {
      const message =
        error instanceof ApiError ? error.message : 'Failed to complete werd';
      return rejectWithValue(message);
    }
  },
);
