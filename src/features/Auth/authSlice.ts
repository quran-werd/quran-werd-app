import {createSlice, PayloadAction} from '@reduxjs/toolkit';
import type {RootState} from '../../store';
import {slicesNames} from '../../store/constants';
import {sendOTP, verifyOTP} from './authAction';

// Define a type for the slice state
interface AuthState {
  phoneNumber: string;
  isAuthenticated: boolean;
  loading: boolean;
  error: string | null;
  otpSent: boolean;
  otpVerified: boolean;
  resendCooldown: number; // seconds remaining
  token: string | null;
}

// Define the initial state using that type
const initialState: AuthState = {
  phoneNumber: '',
  isAuthenticated: false,
  loading: false,
  error: null,
  otpSent: false,
  otpVerified: false,
  resendCooldown: 0,
  token: null,
};

export const authSlice = createSlice({
  name: slicesNames.auth,
  initialState,
  reducers: {
    setPhoneNumber: (state, action: PayloadAction<string>) => {
      state.phoneNumber = action.payload;
    },
    setResendCooldown: (state, action: PayloadAction<number>) => {
      state.resendCooldown = action.payload;
    },
    clearError: state => {
      state.error = null;
    },
    resetAuth: state => {
      state.phoneNumber = '';
      state.isAuthenticated = false;
      state.otpSent = false;
      state.otpVerified = false;
      state.error = null;
      state.token = null;
    },
    logout: state => {
      state.isAuthenticated = false;
      state.token = null;
      state.otpSent = false;
      state.otpVerified = false;
      state.phoneNumber = '';
      state.error = null;
      // Clear token from API client
      const {clearAuthToken} = require('../../api/clients/werdApiClient');
      clearAuthToken();
    },
  },
  extraReducers: builder => {
    // Send OTP
    builder.addCase(sendOTP.pending, state => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(sendOTP.fulfilled, state => {
      state.loading = false;
      state.otpSent = true;
      state.resendCooldown = 60; // 1 minute cooldown
      state.error = null;
    });
    builder.addCase(sendOTP.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload as string;
      state.otpSent = false;
    });

    // Verify OTP
    builder.addCase(verifyOTP.pending, state => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(verifyOTP.fulfilled, (state, action) => {
      state.loading = false;
      state.otpVerified = true;
      state.isAuthenticated = true;
      state.token = action.payload.token;
      state.error = null;
    });
    builder.addCase(verifyOTP.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload as string;
      state.otpVerified = false;
    });
  },
});

export const {
  setPhoneNumber,
  setResendCooldown,
  clearError,
  resetAuth,
  logout,
} = authSlice.actions;

// Selectors
export const selectAuth = (state: RootState) => state.auth;
export const selectIsAuthenticated = (state: RootState) =>
  state.auth.isAuthenticated;
export const selectPhoneNumber = (state: RootState) => state.auth.phoneNumber;
export const selectAuthLoading = (state: RootState) => state.auth.loading;
export const selectAuthError = (state: RootState) => state.auth.error;
export const selectOtpSent = (state: RootState) => state.auth.otpSent;
export const selectResendCooldown = (state: RootState) =>
  state.auth.resendCooldown;

export default authSlice.reducer;

