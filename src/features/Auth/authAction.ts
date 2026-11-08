import {createAsyncThunk} from '@reduxjs/toolkit';
import {Buffer} from 'buffer';
import {
  GoogleSignin,
  statusCodes,
  isErrorWithCode,
  isCancelledResponse,
} from '@react-native-google-signin/google-signin';
import {slicesNames} from '../../store/constants';
import {
  googleLogin,
  logout as logoutApi,
  getMe,
} from '../../services/auth.service';
import {
  GOOGLE_IOS_CLIENT_ID,
  GOOGLE_WEB_CLIENT_ID,
  MOCK_LOGIN_EMAIL,
  MOCK_LOGIN_NAME,
  MOCK_LOGIN_GOOGLE_ID,
} from '../../services/config';
import {
  setAuthToken,
  clearAuthToken,
  getApiErrorMessage,
} from '../../services/werdApi';
import axios from 'axios';
import {saveAuthData, clearAuthData} from '../../utils/storage/auth.storage';

GoogleSignin.configure({
  iosClientId: GOOGLE_IOS_CLIENT_ID,
  webClientId: GOOGLE_WEB_CLIENT_ID,
  offlineAccess: false,
});

const getGoogleSignInErrorMessage = (error: unknown): string | null => {
  if (isErrorWithCode(error)) {
    switch (error.code) {
      case statusCodes.SIGN_IN_CANCELLED:
        return null;
      case statusCodes.IN_PROGRESS:
        return 'Sign-in is already in progress';
      case statusCodes.PLAY_SERVICES_NOT_AVAILABLE:
        return 'Google Play Services is not available';
      default:
        return error.message || 'Google sign-in failed';
    }
  }

  return error instanceof Error ? error.message : 'Google sign-in failed';
};

export const signInWithGoogle = createAsyncThunk(
  `${slicesNames.auth}/signInWithGoogle`,
  async (_, {rejectWithValue}) => {
    try {
      await GoogleSignin.hasPlayServices({showPlayServicesUpdateDialog: true});

      const signInResult = await GoogleSignin.signIn();

      if (isCancelledResponse(signInResult)) {
        return rejectWithValue(null);
      }

      const idToken = signInResult.data.idToken;

      if (!idToken) {
        return rejectWithValue('Failed to get Google ID token');
      }

      const response = await googleLogin(idToken);

      await saveAuthData({
        token: response.token,
        user: response.user,
        isAuthenticated: true,
      });

      return response;
    } catch (error: unknown) {
      const googleMessage = getGoogleSignInErrorMessage(error);
      if (googleMessage === null) {
        return rejectWithValue(null);
      }
      if (isErrorWithCode(error)) {
        return rejectWithValue(googleMessage);
      }
      if (axios.isAxiosError(error)) {
        return rejectWithValue(getApiErrorMessage(error));
      }
      return rejectWithValue(googleMessage);
    }
  },
);

// Dev-only sign-in that bypasses the Google SDK entirely, matching the
// server's `mock:<base64 json>` idToken bypass (requires AUTH_MOCK_GOOGLE=true
// on the server). Only wired up behind __DEV__ in the UI.
export const signInWithMock = createAsyncThunk(
  `${slicesNames.auth}/signInWithMock`,
  async (_, {rejectWithValue}) => {
    try {
      const payload = {
        googleId: MOCK_LOGIN_GOOGLE_ID,
        email: MOCK_LOGIN_EMAIL,
        name: MOCK_LOGIN_NAME,
      };
      const idToken = `mock:${Buffer.from(JSON.stringify(payload)).toString('base64')}`;

      const response = await googleLogin(idToken);

      await saveAuthData({
        token: response.token,
        user: response.user,
        isAuthenticated: true,
      });

      return response;
    } catch (error: unknown) {
      if (axios.isAxiosError(error)) {
        return rejectWithValue(getApiErrorMessage(error));
      }
      return rejectWithValue(
        error instanceof Error ? error.message : 'Mock sign-in failed',
      );
    }
  },
);

export const fetchCurrentUser = createAsyncThunk(
  `${slicesNames.auth}/fetchCurrentUser`,
  async (_, {rejectWithValue}) => {
    try {
      return await getMe();
    } catch (error: unknown) {
      return rejectWithValue(getApiErrorMessage(error));
    }
  },
);

export const signOut = createAsyncThunk(
  `${slicesNames.auth}/signOut`,
  async (_, {rejectWithValue}) => {
    try {
      await logoutApi();
    } catch {
      // Continue local sign-out even if the server session is already gone.
    }

    try {
      await GoogleSignin.signOut();
      await clearAuthData();
      clearAuthToken();
    } catch (error: unknown) {
      await clearAuthData();
      clearAuthToken();
      const message = error instanceof Error ? error.message : 'Logout failed';
      return rejectWithValue(message);
    }
  },
);

export const restoreSession = createAsyncThunk(
  `${slicesNames.auth}/restoreSession`,
  async (token: string, {rejectWithValue}) => {
    try {
      setAuthToken(token);
      const user = await getMe();
      return {token, user};
    } catch (error: unknown) {
      clearAuthToken();
      await clearAuthData();
      return rejectWithValue(getApiErrorMessage(error));
    }
  },
);
