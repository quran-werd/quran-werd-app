import {werdApiRequest, setAuthToken, clearAuthToken} from './werdApi';

export type User = {
  _id: string;
  name: string;
  email: string;
  createdAt: string;
};

export type GoogleAuthResponse = {
  token: string;
  user: User;
};

export const googleLogin = async (idToken: string): Promise<GoogleAuthResponse> => {
  const data = await werdApiRequest<GoogleAuthResponse>('/auth/google', {
    method: 'POST',
    data: {idToken},
  });
  setAuthToken(data.token);
  return data;
};

export const logout = async (): Promise<void> => {
  try {
    await werdApiRequest<null>('/auth/logout', {method: 'POST'});
  } finally {
    clearAuthToken();
  }
};

export const getMe = async (): Promise<User> => {
  return werdApiRequest<User>('/auth/me');
};
