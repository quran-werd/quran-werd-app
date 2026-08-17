import {createSlice} from '@reduxjs/toolkit';
import type {RootState} from '../../store';
import type {Werd, CompletedWerd, WerdStatus} from '../../services/revisionPlan.service';
import {fetchTodayWerd, completeWerd} from './revisionSessionAction';

const initialState: {
  werd: Werd | CompletedWerd | null;
  status: WerdStatus;
  isLoading: boolean;
  error: string | null;
} = {
  werd: null,
  status: 'pending',
  isLoading: false,
  error: null,
};

export const revisionSessionSlice = createSlice({
  name: 'revisionSession',
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
        state.werd = action.payload.werd;
        state.status = action.payload.status;
      })
      .addCase(fetchTodayWerd.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      .addCase(completeWerd.pending, state => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(completeWerd.fulfilled, (state, action) => {
        state.isLoading = false;
        state.werd = action.payload.werd;
        state.status = action.payload.status;
      })
      .addCase(completeWerd.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      });
  },
});

export const selectRevisionSessionWerd = (state: RootState) =>
  state.revisionSession.werd;
export const selectRevisionSessionStatus = (state: RootState) =>
  state.revisionSession.status;
export const selectRevisionSessionLoading = (state: RootState) =>
  state.revisionSession.isLoading;
export const selectRevisionSessionError = (state: RootState) =>
  state.revisionSession.error;

export default revisionSessionSlice.reducer;
