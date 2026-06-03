import axios, {AxiosInstance, AxiosError} from 'axios';
import {API_BASE_URL} from './config';
import {ApiError, ApiResponse} from '../types/api.types';

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
