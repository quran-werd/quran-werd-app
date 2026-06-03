import {createAsyncThunk} from '@reduxjs/toolkit';
import {
  getTodayWerd,
  completeWerd,
  skipWerd,
  TodayWerd,
} from '../../services/revisionLog.service';
import {ApiError} from '../../types/api.types';

export const fetchTodayWerd = createAsyncThunk(
  'revisionLog/fetchToday',
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

export const completeTodayWerd = createAsyncThunk(
  'revisionLog/complete',
  async (werdId: string, {rejectWithValue, dispatch}) => {
    try {
      await completeWerd(werdId);
      return await dispatch(fetchTodayWerd()).unwrap();
    } catch (error) {
      const message =
        error instanceof ApiError ? error.message : 'Failed to complete werd';
      return rejectWithValue(message);
    }
  },
);

export const skipTodayWerd = createAsyncThunk(
  'revisionLog/skip',
  async (werdId: string, {rejectWithValue, dispatch}) => {
    try {
      await skipWerd(werdId);
      return await dispatch(fetchTodayWerd()).unwrap();
    } catch (error) {
      const message =
        error instanceof ApiError ? error.message : 'Failed to skip werd';
      return rejectWithValue(message);
    }
  },
);

export type {TodayWerd};
