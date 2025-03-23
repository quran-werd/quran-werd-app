import {configureStore} from '@reduxjs/toolkit';
import pageSlice from '../features/Page/pageSlice';
import pagerSlice from '../features/Pager/pagerSlice';
import chapterSlice from '../features/Chapter/chapterSlice';
import chaptersSlice from '../features/Chapters/chaptersSlice';

export const store = configureStore({
  reducer: {
    page: pageSlice,
    pager: pagerSlice,
    chapter: chapterSlice,
    chapters: chaptersSlice,
  },
});

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>;
// Inferred type: {posts: PostsState, comments: CommentsState, users: UsersState}
export type AppDispatch = typeof store.dispatch;
