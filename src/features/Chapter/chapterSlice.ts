import {createSlice} from '@reduxjs/toolkit';
import type {RootState} from '../../store';
import {slicesNames} from '../../store/constants';
import {
  FetchVersesFullInfoPayloadAction,
  fetchChapterInfo,
  fetchVersesFullInfo,
} from './chapterAction';
import {APITypes} from '../../types/api.types';
import {addUthmaniTextToVersesInfo, getPageContent} from './utils';
import {PageTypes} from '../../types/page.types';

// Define a type for the slice state
interface ChapterState {
  loading: boolean;
  verses: APITypes.VerseInfo[];
  content: PageTypes.Page;
}

// Define the initial state using that type
const initialState: ChapterState = {
  loading: false,
  verses: [],
  content: [],
};

export const chapterSlice = createSlice({
  name: slicesNames.chapter,
  initialState,
  reducers: {},
  extraReducers: builder => {
    builder.addCase(fetchVersesFullInfo.pending, state => {
      state.loading = true;
    });
    builder.addCase(fetchVersesFullInfo.fulfilled, (state, action) => {
      const action2 = action as FetchVersesFullInfoPayloadAction;
      state.verses = addUthmaniTextToVersesInfo(
        action2.payload.verses,
        action2.payload.versesInfo,
      );
      state.content = getPageContent(state.verses);
      state.loading = false;
    });
    builder.addCase(fetchVersesFullInfo.rejected, state => {
      state.loading = false;
    });
  },
});

// Other code such as selectors can use the imported `RootState` type
export const selectChapter = (state: RootState) => state.chapter.verses;

export default chapterSlice.reducer;
