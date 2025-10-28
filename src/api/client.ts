/**
 * API Client for Quran.com API
 * Uses axios for HTTP requests
 * Matches quran.com-frontend-next architecture
 */

import axios, {AxiosInstance, AxiosError} from 'axios';
import {API_CONFIG, DEFAULT_VERSES_PARAMS} from './config';

/**
 * Create axios instance with default configuration
 */
const apiClient: AxiosInstance = axios.create({
  baseURL: API_CONFIG.BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

/**
 * Request interceptor for converting camelCase to snake_case
 */
apiClient.interceptors.request.use(config => {
  if (config.params) {
    const snakeCaseParams: Record<string, any> = {};
    Object.entries(config.params).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        // Convert camelCase to snake_case
        const snakeKey = key.replace(
          /[A-Z]/g,
          letter => `_${letter.toLowerCase()}`,
        );
        snakeCaseParams[snakeKey] = value;
      }
    });
    config.params = snakeCaseParams;
  }
  return config;
});

/**
 * Response interceptor for error handling
 */
apiClient.interceptors.response.use(
  response => response,
  (error: AxiosError) => {
    if (error.response) {
      // Server responded with error status
      console.error('API Error:', error.response.status, error.response.data);
    } else if (error.request) {
      // Request made but no response received
      console.error('Network Error:', error.message);
    } else {
      // Error in request configuration
      console.error('Request Error:', error.message);
    }
    return Promise.reject(error);
  },
);

/**
 * Makes a URL for API requests
 */
export const makeUrl = (path: string, params?: Record<string, any>): string => {
  const baseUrl = `${API_CONFIG.BASE_URL}${path}`;

  if (!params) {
    return baseUrl;
  }

  const searchParams = new URLSearchParams();
  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== null) {
      const snakeKey = key.replace(
        /[A-Z]/g,
        letter => `_${letter.toLowerCase()}`,
      );
      searchParams.append(snakeKey, String(value));
    }
  });

  const queryString = searchParams.toString();
  return queryString ? `${baseUrl}?${queryString}` : baseUrl;
};

/**
 * Makes a URL for fetching page verses
 */
export const makePageVersesUrl = (
  pageNumber: number,
  params?: Record<string, any>,
): string => {
  const finalParams = {
    ...DEFAULT_VERSES_PARAMS,
    ...params,
  };

  return makeUrl(`/verses/by_page/${pageNumber}`, finalParams);
};

/**
 * Generic fetcher function using axios
 */
export const fetcher = async <T>(url: string): Promise<T> => {
  try {
    const response = await axios.get<T>(url);
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      throw new Error(
        `API Error: ${error.response?.status || 'Unknown'} ${
          error.response?.statusText || error.message
        }`,
      );
    }
    throw error;
  }
};

/**
 * Fetches verses for a specific page using axios
 */
export const fetchPageVerses = async (pageNumber: number) => {
  const path = `/verses/by_page/${pageNumber}`;
  const params = {
    ...DEFAULT_VERSES_PARAMS,
  };

  const response = await apiClient.get(path, {params});
  return response.data;
};

/**
 * Export the configured axios instance for advanced usage
 */
export {apiClient};
