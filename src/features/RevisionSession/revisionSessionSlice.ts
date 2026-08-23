import {createSlice} from '@reduxjs/toolkit';
import type {RootState} from '../../store';
import type {
  Werd,
  CompletedWerd,
  PlanStatus,
} from '../../services/revisionPlan.service';
import {fetchCurrentWerd, completeWerd} from './revisionSessionAction';

const initialState: {
  current: {werd: Werd | CompletedWerd; isCompleted: boolean} | null;
  next: Werd | null;
  planStatus: PlanStatus;
  isLoading: boolean;
  error: string | null;
} = {
  current: null,
  next: null,
  planStatus: 'no-plan',
  isLoading: false,
  error: null,
};

export const revisionSessionSlice = createSlice({
  name: 'revisionSession',
  initialState,
  reducers: {},
  extraReducers: builder => {
    builder
      .addCase(fetchCurrentWerd.pending, state => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchCurrentWerd.fulfilled, (state, action) => {
        state.isLoading = false;
        state.current = action.payload.current;
        state.next = action.payload.next;
        state.planStatus = action.payload.planStatus;
      })
      .addCase(fetchCurrentWerd.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      .addCase(completeWerd.pending, state => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(completeWerd.fulfilled, (state, action) => {
        state.isLoading = false;
        state.current = {werd: action.payload.werd, isCompleted: true};
      })
      .addCase(completeWerd.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      });
  },
});

export const selectRevisionSessionCurrent = (state: RootState) =>
  state.revisionSession.current;
export const selectRevisionSessionNext = (state: RootState) =>
  state.revisionSession.next;
export const selectRevisionSessionPlanStatus = (state: RootState) =>
  state.revisionSession.planStatus;
export const selectRevisionSessionLoading = (state: RootState) =>
  state.revisionSession.isLoading;
export const selectRevisionSessionError = (state: RootState) =>
  state.revisionSession.error;

export default revisionSessionSlice.reducer;
