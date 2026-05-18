import React, { useState, useEffect } from 'react';
import { Search, X, SlidersHorizontal } from 'lucide-react';
import { useLeadStore } from '../../store/leadStore';
import { useDebounce } from '../../hooks/useDebounce';
import { LEAD_STATUSES, LEAD_SOURCES } from '../../utils/constants';
import { Select } from '../ui/Select';

export const LeadFilters: React.FC = () => {
  const { filters, setFilters, resetFilters } = useLeadStore();
  const [searchInput, setSearchInput] = useState(filters.search || '');
  const debouncedSearch = useDebounce(searchInput, 400);

  useEffect(() => {
    setFilters({ search: debouncedSearch, page: 1 });
  }, [debouncedSearch]); // eslint-disable-line react-hooks/exhaustive-deps

  const hasActiveFilters =
    filters.status || filters.source || filters.search || filters.sort !== 'latest';

  return (
    <div className="flex flex-wrap items-center gap-3">
      {/* Search */}
      <div className="relative flex-1 min-w-[200px]">
        <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
        <input
          type="text"
          placeholder="Search by name or email..."
          value={searchInput}
          onChange={(e) => setSearchInput(e.target.value)}
          className="w-full bg-surface-card border border-surface-border rounded-lg text-white placeholder-gray-600 text-sm pl-9 pr-4 py-2.5 focus:outline-none focus:ring-1 focus:ring-brand-500 focus:border-brand-500"
        />
        {searchInput && (
          <button
            onClick={() => setSearchInput('')}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-white"
          >
            <X size={14} />
          </button>
        )}
      </div>

      {/* Status filter */}
      <div className="w-40">
        <Select
          value={filters.status || ''}
          onChange={(e) => setFilters({ status: e.target.value as typeof filters.status, page: 1 })}
          options={LEAD_STATUSES.map((s) => ({ value: s, label: s }))}
          placeholder="All Statuses"
        />
      </div>

      {/* Source filter */}
      <div className="w-40">
        <Select
          value={filters.source || ''}
          onChange={(e) => setFilters({ source: e.target.value as typeof filters.source, page: 1 })}
          options={LEAD_SOURCES.map((s) => ({ value: s, label: s }))}
          placeholder="All Sources"
        />
      </div>

      {/* Sort */}
      <div className="w-36">
        <Select
          value={filters.sort || 'latest'}
          onChange={(e) => setFilters({ sort: e.target.value as 'latest' | 'oldest', page: 1 })}
          options={[
            { value: 'latest', label: 'Latest First' },
            { value: 'oldest', label: 'Oldest First' },
          ]}
        />
      </div>

      {/* Reset */}
      {hasActiveFilters && (
        <button
          onClick={() => { resetFilters(); setSearchInput(''); }}
          className="flex items-center gap-1.5 px-3 py-2.5 text-xs text-gray-400 hover:text-white border border-surface-border rounded-lg hover:bg-surface-muted transition-colors"
        >
          <SlidersHorizontal size={13} />
          Reset
        </button>
      )}
    </div>
  );
};
