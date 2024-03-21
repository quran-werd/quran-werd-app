import {createSlice} from '@reduxjs/toolkit';
import type {PayloadAction} from '@reduxjs/toolkit';
import type {RootState} from '../../store';

// Define a type for the slice state
interface ChaptersState {
  list: [];
}

// Define the initial state using that type
const initialState: ChaptersState = {
  list: [],
};

export const chaptersSlice = createSlice({
  name: 'chapters',
  // `createSlice` will infer the state type from the `initialState` argument
  initialState,
  reducers: {
    // Use the PayloadAction type to declare the contents of `action.payload`
    fetchChapters: (state, action: PayloadAction<[]>) => {
      state.list = action.payload;
    },
  },
});

export const {fetchChapters} = chaptersSlice.actions;

// Other code such as selectors can use the imported `RootState` type
export const selectCount = (state: RootState) => state.chapters.list;

export default chaptersSlice.reducer;
