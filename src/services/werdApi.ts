import axios, {AxiosInstance, AxiosError} from 'axios';
import {API_BASE_URL} from './config';
import {ApiError, ApiResponse} from '../types/api.types';
import i18n from '../i18n';

const werdApiClient: AxiosInstance = axios.create({
  baseURL: API_BASE_URL,
  timeout: 15000,
  headers: {'Content-Type': 'application/json'},
});

let authToken: string | null = null;

export const setAuthToken = (token: string | null) => {
  authToken = token;
};

export const getAuthToken = (): string | null => authToken;

export const clearAuthToken = () => {
  authToken = null;
};

werdApiClient.interceptors.request.use(config => {
  if (authToken) {
    config.headers.Authorization = `Bearer ${authToken}`;
  }
  return config;
});

werdApiClient.interceptors.response.use(
  response => response,
  (error: AxiosError<ApiResponse<unknown>>) => {
    if (error.response?.status === 401) {
      clearAuthToken();
    }
    return Promise.reject(error);
  },
);

export function getApiErrorMessage(error: unknown): string {
  if (axios.isAxiosError(error)) {
    const isTimeout =
      error.code === 'ECONNABORTED' ||
      error.message?.toLowerCase().includes('timeout');
    const isNetworkError = error.message === 'Network Error';

    if (isTimeout || isNetworkError) {
      if (__DEV__) {
        // eslint-disable-next-line no-console
        console.warn(
          `[werdApi] ${isTimeout ? 'Timeout' : 'Network error'} connecting to ${API_BASE_URL}`,
        );
      }
      return i18n.t('auth.networkError');
    }
  }

  if (error instanceof ApiError) {
    return error.message;
  }

  return error instanceof Error ? error.message : 'Request failed';
}

export async function werdApiRequest<T>(
  url: string,
  options?: {
    method?: 'GET' | 'POST' | 'PUT' | 'DELETE';
    data?: unknown;
  },
): Promise<T> {
  const {method = 'GET', data} = options || {};
  const response = await werdApiClient.request<ApiResponse<T>>({
    url,
    method,
    data,
  });

  const body = response.data;
  if (!body.success) {
    throw new ApiError(body.error, response.status);
  }

  return body.data;
}

export {werdApiClient};
