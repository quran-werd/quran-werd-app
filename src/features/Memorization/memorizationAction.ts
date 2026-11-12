import {createAsyncThunk} from '@reduxjs/toolkit';
import {
  getMemorizations,
  addRanges,
  deleteRange,
  MemorizationData,
} from '../../services/memorizations.service';
import {ApiError} from '../../types/api.types';

export const fetchMemorizations = createAsyncThunk(
  'memorization/fetchMemorizations',
  async (_, {rejectWithValue}) => {
    try {
      const data = await getMemorizations();
      return data.ranges;
    } catch (error) {
      const message =
        error instanceof ApiError ? error.message : 'Failed to fetch memorizations';
      return rejectWithValue(message);
    }
  },
);

export const addMemorizationRanges = createAsyncThunk(
  'memorization/addRanges',
  async (
    ranges: {surah: number; from: number; to: number}[],
    {rejectWithValue},
  ) => {
    try {
      const data = await addRanges(ranges);
      return data.ranges;
    } catch (error) {
      const message =
        error instanceof ApiError ? error.message : 'Failed to add ranges';
      return rejectWithValue(message);
    }
  },
);

export const removeMemorizationRange = createAsyncThunk(
  'memorization/deleteRange',
  async (
    {surah, from, to}: {surah: number; from: number; to: number},
    {rejectWithValue},
  ) => {
    try {
      const data = await deleteRange(surah, from, to);
      return data.ranges;
    } catch (error) {
      const message =
        error instanceof ApiError ? error.message : 'Failed to delete range';
      return rejectWithValue(message);
    }
  },
);

export type MemorizationRanges = MemorizationData['ranges'];
