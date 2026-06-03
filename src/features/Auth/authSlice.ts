import {createSlice, PayloadAction} from '@reduxjs/toolkit';
import type {RootState} from '../../store';
import {slicesNames} from '../../store/constants';
import {
  signInWithGoogle,
  signOut,
  restoreSession,
  fetchCurrentUser,
} from './authAction';
import {User} from '../../services/auth.service';
import {setAuthToken, clearAuthToken} from '../../services/werdApi';

interface AuthState {
  isAuthenticated: boolean;
  loading: boolean;
  error: string | null;
  token: string | null;
  user: User | null;
}

const initialState: AuthState = {
  isAuthenticated: false,
  loading: false,
  error: null,
  token: null,
  user: null,
};

export const authSlice = createSlice({
  name: slicesNames.auth,
  initialState,
  reducers: {
    clearError: state => {
      state.error = null;
    },
    setAuthData: (
      state,
      action: PayloadAction<{token: string; user: User}>,
    ) => {
      state.token = action.payload.token;
      state.user = action.payload.user;
      state.isAuthenticated = true;
      setAuthToken(action.payload.token);
    },
  },
  extraReducers: builder => {
    builder
      .addCase(signInWithGoogle.pending, state => {
        state.loading = true;
        state.error = null;
      })
      .addCase(signInWithGoogle.fulfilled, (state, action) => {
        state.loading = false;
        state.isAuthenticated = true;
        state.token = action.payload.token;
        state.user = action.payload.user;
        state.error = null;
      })
      .addCase(signInWithGoogle.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(restoreSession.pending, state => {
        state.loading = true;
      })
      .addCase(restoreSession.fulfilled, (state, action) => {
        state.loading = false;
        state.isAuthenticated = true;
        state.token = action.payload.token;
        state.user = action.payload.user;
      })
      .addCase(restoreSession.rejected, state => {
        state.loading = false;
        state.isAuthenticated = false;
        state.token = null;
        state.user = null;
      })
      .addCase(fetchCurrentUser.fulfilled, (state, action) => {
        state.user = action.payload;
      })
      .addCase(signOut.fulfilled, state => {
        state.isAuthenticated = false;
        state.token = null;
        state.user = null;
        state.error = null;
        clearAuthToken();
      })
      .addCase(signOut.rejected, state => {
        state.isAuthenticated = false;
        state.token = null;
        state.user = null;
        clearAuthToken();
      });
  },
});

export const {clearError, setAuthData} = authSlice.actions;

export const selectAuth = (state: RootState) => state.auth;
export const selectIsAuthenticated = (state: RootState) =>
  state.auth.isAuthenticated;
export const selectAuthLoading = (state: RootState) => state.auth.loading;
export const selectAuthError = (state: RootState) => state.auth.error;
export const selectUser = (state: RootState) => state.auth.user;
export const selectToken = (state: RootState) => state.auth.token;

export default authSlice.reducer;
