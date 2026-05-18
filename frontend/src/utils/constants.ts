import { LeadStatus, LeadSource } from '../types';

export const LEAD_STATUSES: LeadStatus[] = ['New', 'Contacted', 'Qualified', 'Lost'];
export const LEAD_SOURCES: LeadSource[] = ['Website', 'Instagram', 'Referral'];

export const STATUS_COLORS: Record<LeadStatus, string> = {
  New: 'bg-blue-500/15 text-blue-400 border-blue-500/30',
  Contacted: 'bg-yellow-500/15 text-yellow-400 border-yellow-500/30',
  Qualified: 'bg-green-500/15 text-green-400 border-green-500/30',
  Lost: 'bg-red-500/15 text-red-400 border-red-500/30',
};

export const STATUS_DOT: Record<LeadStatus, string> = {
  New: 'bg-blue-400',
  Contacted: 'bg-yellow-400',
  Qualified: 'bg-green-400',
  Lost: 'bg-red-400',
};

export const SOURCE_COLORS: Record<LeadSource, string> = {
  Website: 'bg-purple-500/15 text-purple-400 border-purple-500/30',
  Instagram: 'bg-pink-500/15 text-pink-400 border-pink-500/30',
  Referral: 'bg-orange-500/15 text-orange-400 border-orange-500/30',
};
