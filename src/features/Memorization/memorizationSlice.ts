import {createSlice} from '@reduxjs/toolkit';
import type {RootState} from '../../store';
import {
  fetchMemorizations,
  addMemorizationRange,
  removeMemorizationRange,
  MemorizationRanges,
} from './memorizationAction';

const initialState: {
  ranges: MemorizationRanges;
  isLoading: boolean;
  error: string | null;
} = {
  ranges: {},
  isLoading: false,
  error: null,
};

export const memorizationSlice = createSlice({
  name: 'memorization',
  initialState,
  reducers: {},
  extraReducers: builder => {
    const handleRangesFulfilled = (
      state: typeof initialState,
      ranges: MemorizationRanges,
    ) => {
      state.isLoading = false;
      state.ranges = ranges;
      state.error = null;
    };

    builder
      .addCase(fetchMemorizations.pending, state => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchMemorizations.fulfilled, (state, action) => {
        handleRangesFulfilled(state, action.payload);
      })
      .addCase(fetchMemorizations.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      .addCase(addMemorizationRange.pending, state => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(addMemorizationRange.fulfilled, (state, action) => {
        handleRangesFulfilled(state, action.payload);
      })
      .addCase(addMemorizationRange.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      .addCase(removeMemorizationRange.pending, state => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(removeMemorizationRange.fulfilled, (state, action) => {
        handleRangesFulfilled(state, action.payload);
      })
      .addCase(removeMemorizationRange.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      });
  },
});

export const selectMemorizationRanges = (state: RootState) =>
  state.memorization.ranges;

export default memorizationSlice.reducer;
