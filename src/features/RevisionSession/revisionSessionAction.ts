import {createAsyncThunk} from '@reduxjs/toolkit';
import {
  getCurrentWerd,
  completeWerd as completeWerdRequest,
  CurrentWerdResponse,
  CompleteWerdResponse,
} from '../../services/revisionPlan.service';
import {ApiError} from '../../types/api.types';

export const fetchCurrentWerd = createAsyncThunk<CurrentWerdResponse>(
  'revisionSession/fetchCurrent',
  async (_, {rejectWithValue}) => {
    try {
      return await getCurrentWerd();
    } catch (error) {
      const message =
        error instanceof ApiError
          ? error.message
          : 'Failed to fetch current werd';
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
