import api from './axios';
import type { ApiResponse, User } from '../types';

interface LoginData { email: string; password: string; }
interface RegisterData { name: string; email: string; password: string; role?: string; }
interface AuthResponseData { token: string; user: User; }

export const authApi = {
  login: (data: LoginData) => api.post<ApiResponse<AuthResponseData>>('/auth/login', data),
  register: (data: RegisterData) => api.post<ApiResponse<AuthResponseData>>('/auth/register', data),
  getMe: () => api.get<ApiResponse<User>>('/auth/me'),
};
