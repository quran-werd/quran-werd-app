import {createAsyncThunk} from '@reduxjs/toolkit';
import {
  getRevisionPlan,
  generateRevisionPlan,
  updatePlanCapacity,
  RevisionPlan,
} from '../../services/revisionPlan.service';
import {ApiError} from '../../types/api.types';

export const fetchRevisionPlan = createAsyncThunk(
  'revisionPlan/fetch',
  async (_, {rejectWithValue}) => {
    try {
      return await getRevisionPlan();
    } catch (error) {
      const message =
        error instanceof ApiError ? error.message : 'Failed to fetch plan';
      return rejectWithValue(message);
    }
  },
);

export const generatePlan = createAsyncThunk(
  'revisionPlan/generate',
  async (dailyCapacity: number, {rejectWithValue}) => {
    try {
      return await generateRevisionPlan(dailyCapacity);
    } catch (error) {
      const message =
        error instanceof ApiError ? error.message : 'Failed to generate plan';
      return rejectWithValue(message);
    }
  },
);

export const updateCapacity = createAsyncThunk(
  'revisionPlan/updateCapacity',
  async (dailyCapacity: number, {rejectWithValue}) => {
    try {
      return await updatePlanCapacity(dailyCapacity);
    } catch (error) {
      const message =
        error instanceof ApiError ? error.message : 'Failed to update capacity';
      return rejectWithValue(message);
    }
  },
);

export type {RevisionPlan};
