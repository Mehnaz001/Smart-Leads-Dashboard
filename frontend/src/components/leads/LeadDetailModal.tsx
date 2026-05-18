import React from 'react';
import { Mail, Calendar, User, FileText } from 'lucide-react';
import { Lead } from '../../types';
import { Modal } from '../ui/Modal';
import { StatusBadge, SourceBadge } from '../ui/Badge';

interface LeadDetailModalProps {
  lead: Lead | null;
  isOpen: boolean;
  onClose: () => void;
  onEdit: () => void;
}

export const LeadDetailModal: React.FC<LeadDetailModalProps> = ({ lead, isOpen, onClose, onEdit }) => {
  if (!lead) return null;
  const formatDate = (d: string) =>
    new Date(d).toLocaleDateString('en-IN', { weekday: 'short', day: 'numeric', month: 'long', year: 'numeric' });

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Lead Details" size="md">
      <div className="flex flex-col gap-5">
        {/* Header */}
        <div className="flex items-start gap-4 pb-4 border-b border-surface-border">
          <div className="w-14 h-14 rounded-full bg-brand-500/20 flex items-center justify-center text-brand-400 text-xl font-bold flex-shrink-0">
            {lead.name.charAt(0).toUpperCase()}
          </div>
          <div className="flex-1">
            <h3 className="text-lg font-semibold text-white">{lead.name}</h3>
            <p className="text-sm text-gray-500">{lead.email}</p>
            <div className="flex items-center gap-2 mt-2">
              <StatusBadge status={lead.status} />
              <SourceBadge source={lead.source} />
            </div>
          </div>
        </div>

        {/* Details */}
        <div className="grid grid-cols-2 gap-4">
          <div className="flex items-center gap-2 text-sm">
            <Mail size={14} className="text-gray-500" />
            <div>
              <p className="text-xs text-gray-500 mb-0.5">Email</p>
              <p className="text-white">{lead.email}</p>
            </div>
          </div>
          <div className="flex items-center gap-2 text-sm">
            <User size={14} className="text-gray-500" />
            <div>
              <p className="text-xs text-gray-500 mb-0.5">Created by</p>
              <p className="text-white">{typeof lead.createdBy === 'object' ? lead.createdBy.name : 'N/A'}</p>
            </div>
          </div>
          <div className="flex items-center gap-2 text-sm">
            <Calendar size={14} className="text-gray-500" />
            <div>
              <p className="text-xs text-gray-500 mb-0.5">Created</p>
              <p className="text-white">{formatDate(lead.createdAt)}</p>
            </div>
          </div>
          <div className="flex items-center gap-2 text-sm">
            <Calendar size={14} className="text-gray-500" />
            <div>
              <p className="text-xs text-gray-500 mb-0.5">Updated</p>
              <p className="text-white">{formatDate(lead.updatedAt)}</p>
            </div>
          </div>
        </div>

        {lead.notes && (
          <div className="flex gap-2 p-3 bg-surface-DEFAULT rounded-lg">
            <FileText size={14} className="text-gray-500 mt-0.5 flex-shrink-0" />
            <div>
              <p className="text-xs text-gray-500 mb-1">Notes</p>
              <p className="text-sm text-gray-300">{lead.notes}</p>
            </div>
          </div>
        )}

        <div className="flex justify-end gap-3">
          <button onClick={onClose} className="px-4 py-2 text-sm text-gray-400 hover:text-white transition-colors">Close</button>
          <button onClick={onEdit} className="px-4 py-2 text-sm bg-brand-500 hover:bg-brand-600 text-white rounded-lg transition-colors">Edit Lead</button>
        </div>
      </div>
    </Modal>
  );
};
