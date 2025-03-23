import {createSlice, PayloadAction} from '@reduxjs/toolkit';
import {RootState} from '../../store';

// Track only the current page in the pager
interface PagerState {
  currentPage: number;
}

const initialState: PagerState = {
  currentPage: 1,
};

export const pagerSlice = createSlice({
  name: 'pager',
  initialState,
  reducers: {
    setCurrentPage: (state, action: PayloadAction<number>) => {
      state.currentPage = action.payload;
    },
    nextPage: state => {
      state.currentPage += 1;
    },
    prevPage: state => {
      state.currentPage = Math.max(1, state.currentPage - 1);
    },
  },
});

export const {setCurrentPage, nextPage, prevPage} = pagerSlice.actions;
export const selectCurrentPage = (state: RootState) => state.pager.currentPage;
export default pagerSlice.reducer;
