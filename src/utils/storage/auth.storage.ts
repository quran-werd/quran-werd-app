/**
 * Authentication storage — JWT in Keychain, user prefs in AsyncStorage
 */

import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Keychain from 'react-native-keychain';
import {User} from '../../services/auth.service';

const AUTH_USER_KEY = '@quran_werd_user';
const KEYCHAIN_SERVICE = 'quran_werd_jwt';

export interface StoredAuthData {
  token: string;
  user: User;
  isAuthenticated: boolean;
}

export const saveAuthData = async (authData: StoredAuthData): Promise<void> => {
  await Keychain.setGenericPassword('token', authData.token, {
    service: KEYCHAIN_SERVICE,
  });
  await AsyncStorage.setItem(
    AUTH_USER_KEY,
    JSON.stringify({user: authData.user, isAuthenticated: true}),
  );
};

export const loadAuthData = async (): Promise<StoredAuthData | null> => {
  try {
    const credentials = await Keychain.getGenericPassword({
      service: KEYCHAIN_SERVICE,
    });
    const userData = await AsyncStorage.getItem(AUTH_USER_KEY);

    if (!credentials || !userData) {
      return null;
    }

    const {user, isAuthenticated} = JSON.parse(userData);
    return {
      token: credentials.password,
      user,
      isAuthenticated,
    };
  } catch {
    return null;
  }
};

export const clearAuthData = async (): Promise<void> => {
  await Keychain.resetGenericPassword({service: KEYCHAIN_SERVICE});
  await AsyncStorage.removeItem(AUTH_USER_KEY);
};
