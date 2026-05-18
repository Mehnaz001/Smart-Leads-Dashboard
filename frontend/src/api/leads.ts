import api from './axios';
import { ApiResponse, Lead, LeadFilters, LeadFormData, LeadStats } from '../types';

export const leadsApi = {
  getAll: (filters: LeadFilters) => {
    const params = Object.entries(filters).reduce((acc, [key, value]) => {
      if (value !== '' && value !== undefined && value !== null) {
        acc[key] = value;
      }
      return acc;
    }, {} as Record<string, string | number>);

    return api.get<ApiResponse<Lead[]>>('/leads', { params });
  },
  getById: (id: string) => api.get<ApiResponse<Lead>>(`/leads/${id}`),
  create: (data: LeadFormData) => api.post<ApiResponse<Lead>>('/leads', data),
  update: (id: string, data: Partial<LeadFormData>) => api.put<ApiResponse<Lead>>(`/leads/${id}`, data),
  delete: (id: string) => api.delete<ApiResponse>(`/leads/${id}`),
  exportCSV: () => api.get('/leads/export', { responseType: 'blob' }),
  getStats: () => api.get<ApiResponse<LeadStats>>('/leads/stats'),
};
