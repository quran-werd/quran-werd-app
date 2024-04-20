import {createSlice} from '@reduxjs/toolkit';
import type {RootState} from '../../store';
import {slicesNames} from '../../store/constants';
import {fetchChapters} from './chaptersAction';
import {Chapter} from '../../types/chapters.types';

// Define a type for the slice state
interface ChaptersState {
  loading: boolean;
  list: Chapter[];
}

// Define the initial state using that type
const initialState: ChaptersState = {
  loading: false,
  list: [],
};

export const chaptersSlice = createSlice({
  name: slicesNames.chapters,
  // `createSlice` will infer the state type from the `initialState` argument
  initialState,
  reducers: {},
  extraReducers: builder => {
    builder.addCase(fetchChapters.pending, (state, action) => {
      state.loading = true;
    });

    builder.addCase(fetchChapters.fulfilled, (state, action) => {
      state.list = action.payload as Chapter[];
      state.loading = false;
    });

    builder.addCase(fetchChapters.rejected, (state, action) => {
      state.loading = false;
    });
  },
});

// Other code such as selectors can use the imported `RootState` type
export const selectChapters = (state: RootState) => state.chapters.list;

export default chaptersSlice.reducer;
