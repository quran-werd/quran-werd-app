import {createSlice} from '@reduxjs/toolkit';
import type {RootState} from '../../store';
import {RevisionPlan} from '../../services/revisionPlan.service';
import {
  fetchRevisionPlan,
  generatePlan,
  updateCapacity,
} from './revisionPlanAction';

const initialState: {
  plan: RevisionPlan | null;
  isLoading: boolean;
  error: string | null;
} = {
  plan: null,
  isLoading: false,
  error: null,
};

export const revisionPlanSlice = createSlice({
  name: 'revisionPlan',
  initialState,
  reducers: {},
  extraReducers: builder => {
    const setPlan = (state: typeof initialState, plan: RevisionPlan) => {
      state.isLoading = false;
      state.plan = plan;
      state.error = null;
    };

    builder
      .addCase(fetchRevisionPlan.pending, state => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchRevisionPlan.fulfilled, (state, action) => {
        setPlan(state, action.payload);
      })
      .addCase(fetchRevisionPlan.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      .addCase(generatePlan.pending, state => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(generatePlan.fulfilled, (state, action) => {
        setPlan(state, action.payload);
      })
      .addCase(generatePlan.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      .addCase(updateCapacity.pending, state => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(updateCapacity.fulfilled, (state, action) => {
        setPlan(state, action.payload);
      })
      .addCase(updateCapacity.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      });
  },
});

export const selectRevisionPlan = (state: RootState) => state.revisionPlan.plan;
export const selectRevisionPlanLoading = (state: RootState) =>
  state.revisionPlan.isLoading;
export const selectRevisionPlanError = (state: RootState) =>
  state.revisionPlan.error;

export default revisionPlanSlice.reducer;
