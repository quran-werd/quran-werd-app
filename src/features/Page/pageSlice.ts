import {createSlice} from '@reduxjs/toolkit';
import {RootState} from '../../store';
import {PageTypes} from '../../types/page.types';
import {addUthmaniTextToVersesInfo, getPageContent} from '../Chapter/utils';
import {FetchVersesFullInfoPayloadAction} from '../Chapter/chapterAction';

interface PagesState {
  pages: Record<number, PageTypes.Page>; // { [pageNumber]: PageState }
}

const initialState: PagesState = {
  pages: {},
};

export const pageSlice = createSlice({
  name: 'page',
  initialState,
  reducers: {
    setPageVerses: (state, action: FetchVersesFullInfoPayloadAction) => {
      const {verses, versesInfo, pageNumber} = action.payload;

      const uthmaniVerses = addUthmaniTextToVersesInfo(verses, versesInfo);

      state.pages[pageNumber] = getPageContent(uthmaniVerses);
    },
  },
});

export const {setPageVerses} = pageSlice.actions;
export const selectPageVerses = (state: RootState, pageNumber: number) =>
  state.page.pages[pageNumber] || null;
export default pageSlice.reducer;
