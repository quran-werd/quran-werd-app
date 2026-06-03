import {createAsyncThunk} from '@reduxjs/toolkit';
import {GoogleSignin} from '@react-native-google-signin/google-signin';
import {slicesNames} from '../../store/constants';
import {
  googleLogin,
  logout as logoutApi,
  getMe,
} from '../../services/auth.service';
import {setAuthToken, clearAuthToken} from '../../services/werdApi';
import {saveAuthData, clearAuthData} from '../../utils/storage/auth.storage';

let Config: {GOOGLE_WEB_CLIENT_ID?: string} = {};
try {
  Config = require('react-native-config').default;
} catch {
  Config = {};
}

// GoogleSignin.configure({
//   webClientId: Config.GOOGLE_WEB_CLIENT_ID,
//   offlineAccess: false,
// });
GoogleSignin.configure({
  webClientId:
    '154027524372-64gh40fobnhtl65clllcn7mm7t7vnstd.apps.googleusercontent.com',
  offlineAccess: false,
});

export const signInWithGoogle = createAsyncThunk(
  `${slicesNames.auth}/signInWithGoogle`,
  async (_, {rejectWithValue}) => {
    try {
      await GoogleSignin.hasPlayServices();
      const signInResult = await GoogleSignin.signIn();
      const idToken = signInResult.data?.idToken;
      console.log('SUCCESS -> ID_TOKEN', {idToken, signInResult});

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
      const message =
        error instanceof Error ? error.message : 'Google sign-in failed';
      return rejectWithValue(message);
    }
  },
);

export const fetchCurrentUser = createAsyncThunk(
  `${slicesNames.auth}/fetchCurrentUser`,
  async (_, {rejectWithValue}) => {
    try {
      return await getMe();
    } catch (error: unknown) {
      const message =
        error instanceof Error ? error.message : 'Failed to fetch user';
      return rejectWithValue(message);
    }
  },
);

export const signOut = createAsyncThunk(
  `${slicesNames.auth}/signOut`,
  async (_, {rejectWithValue}) => {
    try {
      await logoutApi();
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
      const message =
        error instanceof Error ? error.message : 'Session expired';
      return rejectWithValue(message);
    }
  },
);
