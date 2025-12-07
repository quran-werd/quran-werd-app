import {createAsyncThunk} from '@reduxjs/toolkit';
import {slicesNames} from '../../store/constants';

// Mock API calls - replace with actual API endpoints
const sendOTPAPI = async (phoneNumber: string): Promise<{success: boolean}> => {
  // TODO: Replace with actual API call
  // Example: return await api.post('/auth/send-otp', { phoneNumber });
  return new Promise(resolve => {
    setTimeout(() => {
      resolve({success: true});
    }, 1000);
  });
};

const verifyOTPAPI = async (
  phoneNumber: string,
  otp: string,
): Promise<{token: string}> => {
  // TODO: Replace with actual API call
  // Example: return await api.post('/auth/verify-otp', { phoneNumber, otp });
  return new Promise(resolve => {
    setTimeout(() => {
      resolve({token: 'mock-jwt-token-' + Date.now()});
    }, 1000);
  });
};

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
      if (response.success) {
        return {success: true};
      } else {
        return rejectWithValue('Failed to send OTP');
      }
    } catch (error: any) {
      return rejectWithValue(
        error?.message || 'Failed to send OTP. Please try again.',
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
      return response;
    } catch (error: any) {
      return rejectWithValue(
        error?.message || 'Invalid OTP. Please try again.',
      );
    }
  },
);

