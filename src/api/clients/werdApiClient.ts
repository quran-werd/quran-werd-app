/**
 * API Client for Werd Server API
 * Uses axios for HTTP requests with bearer token authentication
 */

import axios, {AxiosInstance, AxiosError} from 'axios';
import {WERD_API_CONFIG} from '../config';

/**
 * Create axios instance with default configuration for Werd API
 */
const werdApiClient: AxiosInstance = axios.create({
  baseURL: WERD_API_CONFIG.BASE_URL,
  timeout: 15000,
  headers: {
    'Content-Type': 'application/json',
  },
});

/**
 * Request interceptor for adding bearer token
 */
werdApiClient.interceptors.request.use(
  config => {
    // Get token from token storage
    const token = getAuthToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    const fullUrl = `${config.baseURL || ''}${config.url || ''}`;
    console.log('📤 Request Interceptor:', {
      method: config.method?.toUpperCase(),
      url: fullUrl,
      baseURL: config.baseURL,
      headers: config.headers,
      data: config.data,
    });

    return config;
  },
  error => {
    console.error('📤 Request Interceptor Error:', error);
    return Promise.reject(error);
  },
);

/**
 * Response interceptor for error handling
 */
werdApiClient.interceptors.response.use(
  response => {
    console.log('📥 Response Interceptor Success:', {
      status: response.status,
      url: response.config.url,
      data: response.data,
    });
    return response;
  },
  (error: AxiosError) => {
    if (error.response) {
      // Server responded with error status
      const status = error.response.status;

      // Handle 401 Unauthorized - token expired or invalid
      if (status === 401) {
        // Clear token
        clearAuthToken();
        console.warn('🔒 Authentication failed. Please login again.');
      }

      console.error('📥 Response Interceptor Error (Server Response):', {
        status,
        statusText: error.response.statusText,
        data: error.response.data,
        headers: error.response.headers,
        request: {
          url: error.config?.url,
          method: error.config?.method,
          baseURL: error.config?.baseURL,
          data: error.config?.data,
        },
      });
    } else if (error.request) {
      // Request made but no response received
      console.error('📥 Response Interceptor Error (No Response):', {
        message: error.message,
        code: error.code,
        request: {
          url: error.config?.url,
          method: error.config?.method,
          baseURL: error.config?.baseURL,
          data: error.config?.data,
        },
        // This means the request was made but no response was received
        // Could be network issue, CORS, or server not reachable
      });
    } else {
      // Error in request configuration
      console.error('📥 Response Interceptor Error (Request Config):', {
        message: error.message,
        code: error.code,
      });
    }
    return Promise.reject(error);
  },
);

/**
 * Token management
 * In a real app, you might want to use AsyncStorage or a secure storage solution
 */
let authToken: string | null = null;

export const setAuthToken = (token: string | null) => {
  authToken = token;
};

export const getAuthToken = (): string | null => {
  return authToken;
};

export const clearAuthToken = () => {
  authToken = null;
};

/**
 * Generic fetcher function using axios for Werd API
 */
export const werdApiFetcher = async <T>(
  url: string,
  options?: {
    method?: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';
    data?: any;
    params?: Record<string, any>;
  },
): Promise<T> => {
  try {
    const {method = 'GET', data, params} = options || {};
    const fullUrl = `${werdApiClient.defaults.baseURL}${url}`;

    console.log('🚀 Werd API Request:', {
      method,
      url: fullUrl,
      baseURL: werdApiClient.defaults.baseURL,
      data,
      params,
    });

    const response = await werdApiClient.request<T>({
      url,
      method,
      data,
      params,
    });

    console.log('✅ Werd API Response:', {
      status: response.status,
      data: response.data,
    });

    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      const errorDetails = {
        message: error.message,
        code: error.code,
        status: error.response?.status,
        statusText: error.response?.statusText,
        data: error.response?.data,
        request: {
          url: error.config?.url,
          method: error.config?.method,
          baseURL: error.config?.baseURL,
          data: error.config?.data,
        },
      };

      console.error('❌ Werd API Error:', errorDetails);

      // Re-throw the original error to preserve all details
      throw error;
    }
    console.error('❌ Unknown Error:', error);
    throw error;
  }
};

export {werdApiClient};
