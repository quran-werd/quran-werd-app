import {createSlice} from '@reduxjs/toolkit';
import type {RootState} from '../../store';
import {TodayWerd} from '../../services/revisionLog.service';
import {
  fetchTodayWerd,
  completeTodayWerd,
  skipTodayWerd,
} from './revisionLogAction';

const initialState: {
  today: TodayWerd | null;
  isLoading: boolean;
  error: string | null;
} = {
  today: null,
  isLoading: false,
  error: null,
};

export const revisionLogSlice = createSlice({
  name: 'revisionLog',
  initialState,
  reducers: {},
  extraReducers: builder => {
    builder
      .addCase(fetchTodayWerd.pending, state => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchTodayWerd.fulfilled, (state, action) => {
        state.isLoading = false;
        state.today = action.payload;
      })
      .addCase(fetchTodayWerd.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      .addCase(completeTodayWerd.pending, state => {
        state.isLoading = true;
      })
      .addCase(completeTodayWerd.fulfilled, (state, action) => {
        state.isLoading = false;
        state.today = action.payload;
      })
      .addCase(completeTodayWerd.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      .addCase(skipTodayWerd.pending, state => {
        state.isLoading = true;
      })
      .addCase(skipTodayWerd.fulfilled, (state, action) => {
        state.isLoading = false;
        state.today = action.payload;
      })
      .addCase(skipTodayWerd.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      });
  },
});

export const selectTodayWerd = (state: RootState) => state.revisionLog.today;
export const selectRevisionLogLoading = (state: RootState) =>
  state.revisionLog.isLoading;
export const selectRevisionLogError = (state: RootState) =>
  state.revisionLog.error;

export default revisionLogSlice.reducer;
