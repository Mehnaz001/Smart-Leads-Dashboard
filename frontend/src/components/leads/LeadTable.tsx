import React from 'react';
import { Pencil, Trash2, Eye } from 'lucide-react';
import { Lead } from '../../types';
import { StatusBadge, SourceBadge } from '../ui/Badge';
import { useAuthStore } from '../../store/authStore';

interface LeadTableProps {
  leads: Lead[];
  onEdit: (lead: Lead) => void;
  onDelete: (lead: Lead) => void;
  onView: (lead: Lead) => void;
}

export const LeadTable: React.FC<LeadTableProps> = ({ leads, onEdit, onDelete, onView }) => {
  const { user } = useAuthStore();
  const formatDate = (date: string) =>
    new Date(date).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' });

  return (
    <div className="overflow-x-auto">
      <table className="w-full">
        <thead>
          <tr className="border-b border-surface-border">
            {['Name', 'Email', 'Status', 'Source', 'Created', 'Actions'].map((h) => (
              <th key={h} className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                {h}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-surface-border/50">
          {leads.map((lead) => (
            <tr key={lead._id} className="group hover:bg-surface-muted/40 transition-colors">
              <td className="px-4 py-3">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-brand-500/20 flex items-center justify-center text-brand-400 text-xs font-bold flex-shrink-0">
                    {lead.name.charAt(0).toUpperCase()}
                  </div>
                  <span className="text-sm font-medium text-white truncate max-w-[140px]">{lead.name}</span>
                </div>
              </td>
              <td className="px-4 py-3 text-sm text-gray-400">{lead.email}</td>
              <td className="px-4 py-3"><StatusBadge status={lead.status} /></td>
              <td className="px-4 py-3"><SourceBadge source={lead.source} /></td>
              <td className="px-4 py-3 text-xs text-gray-500">{formatDate(lead.createdAt)}</td>
              <td className="px-4 py-3">
                <div className="relative flex items-center gap-1">
                  <button
                    onClick={() => onView(lead)}
                    className="p-1.5 rounded-lg text-gray-500 hover:text-white hover:bg-surface-muted transition-colors"
                    title="View"
                  >
                    <Eye size={15} />
                  </button>
                  <button
                    onClick={() => onEdit(lead)}
                    className="p-1.5 rounded-lg text-gray-500 hover:text-brand-400 hover:bg-surface-muted transition-colors"
                    title="Edit"
                  >
                    <Pencil size={15} />
                  </button>
                  {user?.role === 'admin' && (
                    <button
                      onClick={() => onDelete(lead)}
                      className="p-1.5 rounded-lg text-gray-500 hover:text-red-400 hover:bg-surface-muted transition-colors"
                      title="Delete"
                    >
                      <Trash2 size={15} />
                    </button>
                  )}
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};
