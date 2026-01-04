/**
 * API Client for Werd Server API
 * Uses axios for HTTP requests with bearer token authentication
 */

import axios, {
  AxiosInstance,
  AxiosError,
  InternalAxiosRequestConfig,
} from 'axios';
import {WERD_API_CONFIG} from '../config';
import {store} from '../../store';
import {selectRefreshToken} from '../../features/Auth/authSlice';
import {updateAccessToken, logout} from '../../features/Auth/authSlice';

/**
 * Refresh access token using refresh token
 * This is used internally by the API client interceptor
 * Uses direct axios call to avoid interceptor loops
 */
const refreshAccessToken = async (
  refreshToken: string,
): Promise<{accessToken: string}> => {
  const response = await axios.post(
    `${WERD_API_CONFIG.BASE_URL}/users/refresh`,
    {refreshToken},
    {
      headers: {
        'Content-Type': 'application/json',
      },
      timeout: 2500,
    },
  );

  return response.data;
};

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
 * Flag to prevent infinite refresh loops
 */
let isRefreshing = false;
let failedQueue: Array<{
  resolve: (value?: any) => void;
  reject: (error?: any) => void;
}> = [];

/**
 * Process queued requests after token refresh
 */
const processQueue = (error: any, token: string | null = null) => {
  failedQueue.forEach(promise => {
    if (error) {
      promise.reject(error);
    } else {
      promise.resolve(token);
    }
  });
  failedQueue = [];
};

/**
 * Response interceptor for error handling and automatic token refresh
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
  async (error: AxiosError) => {
    const originalRequest = error.config as InternalAxiosRequestConfig & {
      _retry?: boolean;
    };

    if (error.response) {
      // Server responded with error status
      const status = error.response.status;

      // Handle 403 Forbidden - access token expired or invalid
      if (status === 403 && originalRequest && !originalRequest._retry) {
        // Skip refresh if this is already a refresh request to avoid infinite loop
        if (originalRequest.url?.includes('/users/refresh')) {
          // Refresh token is also invalid, logout user
          console.warn('🔒 Refresh token invalid. Logging out...');
          store.dispatch(logout());
          clearAuthToken();
          return Promise.reject(error);
        }

        // If already refreshing, queue this request
        if (isRefreshing) {
          return new Promise((resolve, reject) => {
            failedQueue.push({resolve, reject});
          })
            .then((token: unknown) => {
              if (!token || typeof token !== 'string') {
                return Promise.reject(
                  new Error('Token refresh failed - no token received'),
                );
              }
              if (originalRequest.headers) {
                originalRequest.headers.Authorization = `Bearer ${token}`;
              }
              return werdApiClient(originalRequest);
            })
            .catch(err => {
              return Promise.reject(err);
            });
        }

        originalRequest._retry = true;
        isRefreshing = true;

        try {
          // Get refresh token from Redux store
          const state = store.getState();
          const refreshToken = selectRefreshToken(state);

          if (!refreshToken) {
            console.warn('🔒 No refresh token available. Logging out...');
            store.dispatch(logout());
            clearAuthToken();
            processQueue(error, null);
            isRefreshing = false;
            return Promise.reject(error);
          }

          console.log('🔄 Refreshing access token...');
          // Call refresh endpoint
          const response = await refreshAccessToken(refreshToken);
          console.log('🔄 Refresh token response:', response);

          // Validate response
          if (!response || !response.accessToken) {
            throw new Error(
              'Invalid refresh token response: missing accessToken',
            );
          }

          const newAccessToken = response.accessToken;

          // Update token in store and API client
          setAuthToken(newAccessToken);
          store.dispatch(updateAccessToken(newAccessToken));

          // Update the original request with new token
          if (originalRequest.headers) {
            originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
          }

          console.log('✅ Access token refreshed successfully');
          processQueue(null, newAccessToken);
          isRefreshing = false;

          // Retry the original request
          return werdApiClient(originalRequest);
        } catch (refreshError: any) {
          console.error('❌ Failed to refresh token:', {
            message: refreshError?.message,
            code: refreshError?.code,
            response: refreshError?.response?.data,
            isTimeout:
              refreshError?.code === 'ECONNABORTED' ||
              refreshError?.message?.includes('timeout'),
          });

          // Refresh failed, logout user
          store.dispatch(logout());
          clearAuthToken();
          processQueue(refreshError, null);
          isRefreshing = false;
          return Promise.reject(refreshError);
        }
      }

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
