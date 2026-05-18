import React, { useEffect, useState } from 'react';
import { Plus, Download, RefreshCw, Inbox } from 'lucide-react';
import { useLeadStore } from '../store/leadStore';
import { useLeads } from '../hooks/useLeads';
import { LeadFilters } from '../components/leads/LeadFilters';
import { LeadTable } from '../components/leads/LeadTable';
import { LeadForm } from '../components/leads/LeadForm';
import { LeadDetailModal } from '../components/leads/LeadDetailModal';
import { ConfirmDialog } from '../components/ui/ConfirmDialog';
import { Pagination } from '../components/ui/Pagination';
import { Modal } from '../components/ui/Modal';
import { Button } from '../components/ui/Button';
import { Lead } from '../types';

export const LeadsPage: React.FC = () => {
  const { leads, meta, isLoading, setFilters } = useLeadStore();
  const { fetchLeads, createLead, updateLead, deleteLead, exportCSV } = useLeads();

  const [showCreate, setShowCreate] = useState(false);
  const [editLead, setEditLead] = useState<Lead | null>(null);
  const [viewLead, setViewLead] = useState<Lead | null>(null);
  const [deletingLead, setDeletingLead] = useState<Lead | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isExporting, setIsExporting] = useState(false);

  useEffect(() => { fetchLeads(); }, [fetchLeads]);

  const handleDelete = async () => {
    if (!deletingLead) return;
    setIsDeleting(true);
    await deleteLead(deletingLead._id);
    setIsDeleting(false);
    setDeletingLead(null);
  };

  const handleExport = async () => {
    setIsExporting(true);
    await exportCSV();
    setIsExporting(false);
  };

  return (
    <div className="flex flex-col gap-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">Leads</h1>
          <p className="text-gray-500 text-sm mt-0.5">
            {meta ? `${meta.total} total leads` : 'Manage your sales pipeline'}
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="secondary" size="sm" onClick={handleExport} isLoading={isExporting}>
            <Download size={15} /> Export CSV
          </Button>
          <Button size="sm" onClick={() => setShowCreate(true)}>
            <Plus size={15} /> New Lead
          </Button>
        </div>
      </div>

      {/* Main card */}
      <div className="bg-surface-card border border-surface-border rounded-xl">
        {/* Filters */}
        <div className="p-4 border-b border-surface-border">
          <LeadFilters />
        </div>

        {/* Table */}
        {isLoading ? (
          <div className="flex items-center justify-center py-20">
            <RefreshCw size={24} className="text-brand-400 animate-spin" />
          </div>
        ) : leads.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <div className="w-14 h-14 rounded-full bg-surface-muted flex items-center justify-center mb-4">
              <Inbox size={24} className="text-gray-500" />
            </div>
            <p className="text-gray-400 font-medium">No leads found</p>
            <p className="text-gray-600 text-sm mt-1">Try adjusting your filters or create a new lead</p>
          </div>
        ) : (
          <LeadTable
            leads={leads}
            onEdit={setEditLead}
            onDelete={setDeletingLead}
            onView={setViewLead}
          />
        )}

        {/* Pagination */}
        {meta && meta.total > 0 && (
          <div className="px-4 pb-3 pt-2 border-t border-surface-border/50">
            <Pagination meta={meta} onPageChange={(page) => setFilters({ page })} />
          </div>
        )}
      </div>

      {/* Create Modal */}
      <Modal isOpen={showCreate} onClose={() => setShowCreate(false)} title="New Lead">
        <LeadForm onSubmit={createLead} onCancel={() => setShowCreate(false)} />
      </Modal>

      {/* Edit Modal */}
      <Modal isOpen={!!editLead} onClose={() => setEditLead(null)} title="Edit Lead">
        {editLead && (
          <LeadForm
            isEdit
            initialData={editLead}
            onSubmit={(data) => updateLead(editLead._id, data)}
            onCancel={() => setEditLead(null)}
          />
        )}
      </Modal>

      {/* View Modal */}
      <LeadDetailModal
        lead={viewLead}
        isOpen={!!viewLead}
        onClose={() => setViewLead(null)}
        onEdit={() => { setEditLead(viewLead); setViewLead(null); }}
      />

      {/* Delete confirm */}
      <ConfirmDialog
        isOpen={!!deletingLead}
        onClose={() => setDeletingLead(null)}
        onConfirm={handleDelete}
        title="Delete Lead"
        message={`Are you sure you want to delete "${deletingLead?.name}"? This action cannot be undone.`}
        isLoading={isDeleting}
      />
    </div>
  );
};
