import React, { useEffect, useState } from 'react';
import { Users, TrendingUp, CheckCircle, XCircle, RefreshCw } from 'lucide-react';
import { leadsApi } from '../api/leads';
import { useAuthStore } from '../store/authStore';
import { LeadStats } from '../types';
import { LEAD_STATUSES, LEAD_SOURCES } from '../utils/constants';

const StatCard: React.FC<{ label: string; value: number; icon: React.ReactNode; color: string }> = ({
  label, value, icon, color,
}) => (
  <div className="bg-surface-card border border-surface-border rounded-xl p-5">
    <div className="flex items-center justify-between mb-3">
      <span className="text-xs font-medium text-gray-500 uppercase tracking-wider">{label}</span>
      <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${color}`}>{icon}</div>
    </div>
    <p className="text-3xl font-bold text-white">{value}</p>
  </div>
);

export const DashboardPage: React.FC = () => {
  const { user } = useAuthStore();
  const [stats, setStats] = useState<LeadStats | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    leadsApi.getStats().then((res) => {
      if (res.data.success && res.data.data) setStats(res.data.data);
    }).finally(() => setIsLoading(false));
  }, []);

  const getStatusCount = (s: string) => stats?.statusStats.find((x) => x._id === s)?.count ?? 0;
  const getSourceCount = (s: string) => stats?.sourceStats.find((x) => x._id === s)?.count ?? 0;

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <RefreshCw size={24} className="text-brand-400 animate-spin" />
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-8">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-white">
          Good {new Date().getHours() < 12 ? 'morning' : new Date().getHours() < 18 ? 'afternoon' : 'evening'},{' '}
          <span className="text-brand-400">{user?.name?.split(' ')[0]}</span> 👋
        </h1>
        <p className="text-gray-500 mt-1">Here's an overview of your leads pipeline.</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard label="Total Leads" value={stats?.total ?? 0} icon={<Users size={16} className="text-brand-400" />} color="bg-brand-500/15" />
        <StatCard label="Qualified" value={getStatusCount('Qualified')} icon={<CheckCircle size={16} className="text-green-400" />} color="bg-green-500/15" />
        <StatCard label="Contacted" value={getStatusCount('Contacted')} icon={<TrendingUp size={16} className="text-yellow-400" />} color="bg-yellow-500/15" />
        <StatCard label="Lost" value={getStatusCount('Lost')} icon={<XCircle size={16} className="text-red-400" />} color="bg-red-500/15" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Status breakdown */}
        <div className="bg-surface-card border border-surface-border rounded-xl p-6">
          <h2 className="text-sm font-semibold text-white mb-5">Leads by Status</h2>
          <div className="flex flex-col gap-3">
            {LEAD_STATUSES.map((status) => {
              const count = getStatusCount(status);
              const pct = stats?.total ? Math.round((count / stats.total) * 100) : 0;
              return (
                <div key={status}>
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="text-sm text-gray-400">{status}</span>
                    <span className="text-xs text-gray-500">{count} ({pct}%)</span>
                  </div>
                  <div className="h-2 bg-surface-DEFAULT rounded-full overflow-hidden">
                    <div
                      className="h-full rounded-full transition-all duration-700"
                      style={{ width: `${pct}%`, background: status === 'New' ? '#60a5fa' : status === 'Contacted' ? '#facc15' : status === 'Qualified' ? '#4ade80' : '#f87171' }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Source breakdown */}
        <div className="bg-surface-card border border-surface-border rounded-xl p-6">
          <h2 className="text-sm font-semibold text-white mb-5">Leads by Source</h2>
          <div className="flex flex-col gap-3">
            {LEAD_SOURCES.map((source) => {
              const count = getSourceCount(source);
              const pct = stats?.total ? Math.round((count / stats.total) * 100) : 0;
              return (
                <div key={source}>
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="text-sm text-gray-400">{source}</span>
                    <span className="text-xs text-gray-500">{count} ({pct}%)</span>
                  </div>
                  <div className="h-2 bg-surface-DEFAULT rounded-full overflow-hidden">
                    <div
                      className="h-full rounded-full transition-all duration-700"
                      style={{ width: `${pct}%`, background: source === 'Website' ? '#a78bfa' : source === 'Instagram' ? '#f472b6' : '#fb923c' }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};
