import { apiClient } from './api.js';
import { AuthResponse, User } from '../types/index.js';

export const authApi = {
  login: async (credential: string, password: string): Promise<AuthResponse> => {
    const res: any = await apiClient.post('/auth/login', { credential, password });
    return res.data;
  },

  getMe: async (): Promise<User> => {
    const res: any = await apiClient.get('/auth/me');
    return res.data;
  },

  logout: async (): Promise<void> => {
    await apiClient.post('/auth/logout');
  },
};
