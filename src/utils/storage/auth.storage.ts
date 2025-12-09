/**
 * Authentication storage utilities
 * Handles persisting and retrieving auth state from AsyncStorage
 */

import AsyncStorage from '@react-native-async-storage/async-storage';

const AUTH_STORAGE_KEY = '@quran_werd_auth';

export interface StoredAuthData {
  accessToken: string;
  refreshToken: string;
  user: {
    id: string;
    phone: string;
  };
  phoneNumber: string;
  isAuthenticated: boolean;
}

/**
 * Save authentication data to AsyncStorage
 */
export const saveAuthData = async (authData: StoredAuthData): Promise<void> => {
  try {
    await AsyncStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(authData));
  } catch (error) {
    console.error('Failed to save auth data:', error);
    throw error;
  }
};

/**
 * Load authentication data from AsyncStorage
 */
export const loadAuthData = async (): Promise<StoredAuthData | null> => {
  try {
    const data = await AsyncStorage.getItem(AUTH_STORAGE_KEY);
    if (data) {
      return JSON.parse(data) as StoredAuthData;
    }
    return null;
  } catch (error) {
    console.error('Failed to load auth data:', error);
    return null;
  }
};

/**
 * Clear authentication data from AsyncStorage
 */
export const clearAuthData = async (): Promise<void> => {
  try {
    await AsyncStorage.removeItem(AUTH_STORAGE_KEY);
  } catch (error) {
    console.error('Failed to clear auth data:', error);
    throw error;
  }
};

