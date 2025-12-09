import {createAsyncThunk} from '@reduxjs/toolkit';
import {slicesNames} from '../../store/constants';
import {werdApiFetcher, setAuthToken} from '../../api/clients/werdApiClient';

export const sendOTP = createAsyncThunk(
  `${slicesNames.auth}/sendOTP`,
  async (phoneNumber: string, {rejectWithValue}) => {
    try {
      // Validate phone number format
      const cleanedPhone = phoneNumber.replace(/\D/g, '');
      if (cleanedPhone.length < 10) {
        return rejectWithValue('Invalid phone number');
      }

      const response = await sendOTPAPI(cleanedPhone);
      if (response.verification) {
        return {success: true};
      } else {
        return rejectWithValue('Failed to send OTP');
      }
    } catch (error: any) {
      // Log full error details for debugging
      console.error('sendOTP error:', {
        message: error?.message,
        response: error?.response,
        request: error?.request,
        code: error?.code,
      });

      return rejectWithValue(
        error?.response?.data?.message ||
          error?.response?.data?.error ||
          error?.message ||
          'Failed to send OTP. Please try again.',
      );
    }
  },
);

export const verifyOTP = createAsyncThunk(
  `${slicesNames.auth}/verifyOTP`,
  async (
    {phoneNumber, otp}: {phoneNumber: string; otp: string},
    {rejectWithValue},
  ) => {
    try {
      // Validate OTP format
      if (otp.length !== 6 || !/^\d+$/.test(otp)) {
        return rejectWithValue('Invalid OTP format');
      }

      const cleanedPhone = phoneNumber.replace(/\D/g, '');
      const response = await verifyOTPAPI(cleanedPhone, otp);

      // Store token for future API requests
      if (response.token) {
        setAuthToken(response.token);
      }

      return response;
    } catch (error: any) {
      // Log full error details for debugging
      console.error('verifyOTP error:', {
        message: error?.message,
        response: error?.response,
        request: error?.request,
        code: error?.code,
      });

      return rejectWithValue(
        error?.response?.data?.message ||
          error?.response?.data?.error ||
          error?.message ||
          'Invalid OTP. Please try again.',
      );
    }
  },
);

// API calls using Werd API fetcher
const sendOTPAPI = async (phone: string): Promise<{verification: any}> => {
  return await werdApiFetcher<{verification: any}>('/users/login', {
    method: 'POST',
    data: {
      phone: `+${phone}`,
    },
  });
};

const verifyOTPAPI = async (
  phone: string,
  otp: string,
): Promise<{token: string}> => {
  return await werdApiFetcher<{token: string}>('/users/login/verify', {
    method: 'POST',
    data: {
      phone: `+${phone}`,
      otp,
    },
  });
};
