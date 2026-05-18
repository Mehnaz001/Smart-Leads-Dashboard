import { create } from 'zustand';
import { Lead, LeadFilters, PaginationMeta } from '../types';

interface LeadStore {
  leads: Lead[];
  selectedLead: Lead | null;
  filters: LeadFilters;
  meta: PaginationMeta | null;
  isLoading: boolean;
  setLeads: (leads: Lead[], meta: PaginationMeta) => void;
  setSelectedLead: (lead: Lead | null) => void;
  setFilters: (filters: Partial<LeadFilters>) => void;
  setLoading: (loading: boolean) => void;
  resetFilters: () => void;
}

const defaultFilters: LeadFilters = {
  status: '',
  source: '',
  search: '',
  sort: 'latest',
  page: 1,
  limit: 10,
};

export const useLeadStore = create<LeadStore>((set) => ({
  leads: [],
  selectedLead: null,
  filters: defaultFilters,
  meta: null,
  isLoading: false,

  setLeads: (leads, meta) => set({ leads, meta }),
  setSelectedLead: (lead) => set({ selectedLead: lead }),
  setFilters: (newFilters) =>
    set((state) => ({
      filters: { ...state.filters, ...newFilters, page: newFilters.page ?? 1 },
    })),
  setLoading: (loading) => set({ isLoading: loading }),
  resetFilters: () => set({ filters: defaultFilters }),
}));
