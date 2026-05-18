import { useCallback } from 'react';
import { leadsApi } from '../api/leads';
import { useLeadStore } from '../store/leadStore';
import { LeadFormData } from '../types';
import toast from 'react-hot-toast';

export const useLeads = () => {
  const { filters, setLeads, setLoading } = useLeadStore();

  const fetchLeads = useCallback(async () => {
    setLoading(true);
    try {
      const res = await leadsApi.getAll(filters);
      if (res.data.success && res.data.data && res.data.meta) {
        setLeads(res.data.data, res.data.meta);
      }
    } catch (err){
      toast.error('Failed to fetch leads');
      console.log("Error in fetching leads",err);
    } finally {
      setLoading(false);
    }
  }, [filters, setLeads, setLoading]);

  const createLead = async (data: LeadFormData) => {
    try {
      const res = await leadsApi.create(data);
      if (res.data.success) {
        toast.success('Lead created successfully');
        await fetchLeads();
        return true;
      }
    } catch (err: unknown) {
      const error = err as { response?: { data?: { message?: string } } };
      toast.error(error.response?.data?.message || 'Failed to create lead');
    }
    return false;
  };

  const updateLead = async (id: string, data: Partial<LeadFormData>) => {
    try {
      const res = await leadsApi.update(id, data);
      if (res.data.success) {
        toast.success('Lead updated successfully');
        await fetchLeads();
        return true;
      }
    } catch (err: unknown) {
      const error = err as { response?: { data?: { message?: string } } };
      toast.error(error.response?.data?.message || 'Failed to update lead');
    }
    return false;
  };

  const deleteLead = async (id: string) => {
    try {
      await leadsApi.delete(id);
      toast.success('Lead deleted');
      await fetchLeads();
      return true;
    } catch {
      toast.error('Failed to delete lead');
    }
    return false;
  };

  const exportCSV = async () => {
    try {
      const res = await leadsApi.exportCSV();
      const url = window.URL.createObjectURL(new Blob([res.data as BlobPart]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', 'leads.csv');
      document.body.appendChild(link);
      link.click();
      link.remove();
      toast.success('CSV exported');
    } catch {
      toast.error('Failed to export CSV');
    }
  };

  return { fetchLeads, createLead, updateLead, deleteLead, exportCSV };
};
