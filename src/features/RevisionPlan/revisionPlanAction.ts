import {createAsyncThunk} from '@reduxjs/toolkit';
import axios from 'axios';
import {
  getRevisionPlan,
  generateRevisionPlan,
  updatePlanCapacity,
} from '../../services/revisionPlan.service';
import {ApiError} from '../../types/api.types';

function isNotFound(error: unknown): boolean {
  if (error instanceof ApiError) {
    return error.status === 404;
  }
  return axios.isAxiosError(error) && error.response?.status === 404;
}

export const fetchRevisionPlan = createAsyncThunk(
  'revisionPlan/fetch',
  async (_, {rejectWithValue}) => {
    try {
      return await getRevisionPlan();
    } catch (error) {
      // A 404 here means the user genuinely has no plan yet, not a failed
      // request — resolve to null so the UI shows the real empty state
      // instead of a load-error/retry state.
      if (isNotFound(error)) {
        return null;
      }
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

export type {RevisionPlan, CompletedWerd} from '../../services/revisionPlan.service';
