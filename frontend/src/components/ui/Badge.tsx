import React from 'react';
import { LeadStatus, LeadSource } from '../../types';
import { STATUS_COLORS, SOURCE_COLORS, STATUS_DOT } from '../../utils/constants';

interface StatusBadgeProps { status: LeadStatus; }
interface SourceBadgeProps { source: LeadSource; }

export const StatusBadge: React.FC<StatusBadgeProps> = ({ status }) => (
  <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-medium border ${STATUS_COLORS[status]}`}>
    <span className={`w-1.5 h-1.5 rounded-full ${STATUS_DOT[status]}`} />
    {status}
  </span>
);

export const SourceBadge: React.FC<SourceBadgeProps> = ({ source }) => (
  <span className={`inline-flex items-center px-2.5 py-1 rounded-md text-xs font-medium border ${SOURCE_COLORS[source]}`}>
    {source}
  </span>
);
