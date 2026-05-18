import React, { useState } from 'react';
import { LeadFormData } from '../../types';
import { LEAD_STATUSES, LEAD_SOURCES } from '../../utils/constants';
import { Input } from '../ui/Input';
import { Select } from '../ui/Select';
import { Button } from '../ui/Button';

interface LeadFormProps {
  initialData?: Partial<LeadFormData>;
  onSubmit: (data: LeadFormData) => Promise<boolean>;
  onCancel: () => void;
  isEdit?: boolean;
}

export const LeadForm: React.FC<LeadFormProps> = ({ initialData, onSubmit, onCancel, isEdit }) => {
  const [form, setForm] = useState<LeadFormData>({
    name: initialData?.name || '',
    email: initialData?.email || '',
    status: initialData?.status || 'New',
    source: initialData?.source || 'Website',
    notes: initialData?.notes || '',
  });
  const [errors, setErrors] = useState<Partial<Record<keyof LeadFormData, string>>>({});
  const [isLoading, setIsLoading] = useState(false);

  const validate = (): boolean => {
    const newErrors: Partial<Record<keyof LeadFormData, string>> = {};
    if (!form.name.trim() || form.name.length < 2) newErrors.name = 'Name must be at least 2 characters';
    if (!form.email.trim() || !/^\S+@\S+\.\S+$/.test(form.email)) newErrors.email = 'Valid email required';
    if (!form.source) newErrors.source = 'Source is required';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    setIsLoading(true);
    const success = await onSubmit(form);
    setIsLoading(false);
    if (success) onCancel();
  };

  const handleChange = (field: keyof LeadFormData) => (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    setForm((prev) => ({ ...prev, [field]: e.target.value }));
    if (errors[field]) setErrors((prev) => ({ ...prev, [field]: undefined }));
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
      <Input
        label="Full Name"
        placeholder="e.g. Rahul Sharma"
        value={form.name}
        onChange={handleChange('name')}
        error={errors.name}
      />
      <Input
        label="Email Address"
        type="email"
        placeholder="rahul@example.com"
        value={form.email}
        onChange={handleChange('email')}
        error={errors.email}
      />
      <div className="grid grid-cols-2 gap-4">
        <Select
          label="Status"
          value={form.status}
          onChange={handleChange('status')}
          options={LEAD_STATUSES.map((s) => ({ value: s, label: s }))}
          error={errors.status}
        />
        <Select
          label="Source"
          value={form.source}
          onChange={handleChange('source')}
          options={LEAD_SOURCES.map((s) => ({ value: s, label: s }))}
          error={errors.source}
        />
      </div>
      <div className="flex flex-col gap-1.5">
        <label className="text-xs font-medium text-gray-400 uppercase tracking-wider">Notes (optional)</label>
        <textarea
          placeholder="Any additional notes..."
          value={form.notes}
          onChange={handleChange('notes')}
          rows={3}
          className="w-full bg-surface-card border border-surface-border rounded-lg text-white placeholder-gray-600 text-sm px-4 py-2.5 focus:outline-none focus:ring-1 focus:ring-brand-500 focus:border-brand-500 resize-none"
        />
      </div>
      <div className="flex justify-end gap-3 pt-2">
        <Button type="button" variant="ghost" onClick={onCancel}>Cancel</Button>
        <Button type="submit" isLoading={isLoading}>
          {isEdit ? 'Update Lead' : 'Create Lead'}
        </Button>
      </div>
    </form>
  );
};
