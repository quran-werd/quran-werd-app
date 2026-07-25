import {configureStore} from '@reduxjs/toolkit';
import memorizationSlice from '../features/Memorization/memorizationSlice';
import memorizationSelectionSlice from '../features/Memorization/memorizationSelectionSlice';
import authSlice from '../features/Auth/authSlice';
import revisionPlanSlice from '../features/RevisionPlan/revisionPlanSlice';
import revisionLogSlice from '../features/RevisionLog/revisionLogSlice';

export const store = configureStore({
  reducer: {
    memorization: memorizationSlice,
    memorizationSelection: memorizationSelectionSlice,
    auth: authSlice,
    revisionPlan: revisionPlanSlice,
    revisionLog: revisionLogSlice,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
