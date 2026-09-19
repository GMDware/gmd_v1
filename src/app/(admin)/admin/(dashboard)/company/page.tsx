'use client';

import React, { useState, useEffect } from 'react';
import { AdminBreadcrumb } from '@/components/admin/AdminBreadcrumb';
import { ConfirmModal } from '@/components/admin/ConfirmModal';
import { useAdminToast } from '@/components/admin/AdminToast';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import {
  Building2,
  Save,
  Plus,
  Edit3,
  Trash2,
  Check,
  X,
  Target,
  Compass,
  Award,
  Sparkles,
} from 'lucide-react';

interface CompanyValue {
  id: string;
  title: string;
  summary: string;
  displayOrder: number;
}

export default function AdminCompanyPage() {
  const { success, error } = useAdminToast();
  const [loading, setLoading] = useState(true);
  const [savingSettings, setSavingSettings] = useState(false);

  // General Company Identity Settings
  const [companySettings, setCompanySettings] = useState({
    brand_name: '',
    legal_entity_name: '',
    tagline: '',
    company_description: '',
    mission_statement: '',
    vision_statement: '',
    why_gmdware_summary: '',
    contact_email: '',
    headquarters_location: '',
  });

  // Company Values
  const [values, setValues] = useState<CompanyValue[]>([]);
  const [valueModalOpen, setValueModalOpen] = useState(false);
  const [editingValue, setEditingValue] = useState<Partial<CompanyValue> | null>(null);
  const [savingValue, setSavingValue] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState<{ open: boolean; id: string; title: string }>({
    open: false,
    id: '',
    title: '',
  });

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    try {
      const [compRes, valRes] = await Promise.all([
        fetch('/api/v1/content/company'),
        fetch('/api/v1/content/values'),
      ]);

      const compJson = await compRes.json();
      const valJson = await valRes.json();

      if (compJson.success && compJson.data) {
        setCompanySettings((prev) => ({ ...prev, ...compJson.data }));
      }
      if (valJson.success && valJson.data) {
        setValues(valJson.data || []);
      }
    } catch {
      error('Failed to load company content');
    } finally {
      setLoading(false);
    }
  };

  const handleSaveCompanySettings = async (e: React.FormEvent) => {
    e.preventDefault();
    setSavingSettings(true);
    try {
      const res = await fetch('/api/v1/content/company', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(companySettings),
      });
      const json = await res.json();
      if (json.success) {
        success('Company identity declarations updated');
      } else {
        error(json.error || 'Failed to save settings');
      }
    } catch {
      error('Network error saving settings');
    } finally {
      setSavingSettings(false);
    }
  };

  const handleSaveValue = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingValue || !editingValue.title || !editingValue.summary) {
      error('Title and Summary are required');
      return;
    }

    setSavingValue(true);
    try {
      const isNew = !editingValue.id;
      const url = isNew ? '/api/v1/content/values' : `/api/v1/content/values/${editingValue.id}`;
      const method = isNew ? 'POST' : 'PUT';

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(editingValue),
      });

      const json = await res.json();
      if (json.success) {
        success(isNew ? 'Value added' : 'Value updated');
        setValueModalOpen(false);
        setEditingValue(null);
        // Refresh values
        const valRes = await fetch('/api/v1/content/values');
        const valJson = await valRes.json();
        if (valJson.success) setValues(valJson.data || []);
      } else {
        error(json.error || 'Failed to save value');
      }
    } catch {
      error('Network error saving value');
    } finally {
      setSavingValue(false);
    }
  };

  const handleConfirmDeleteValue = async () => {
    try {
      const res = await fetch(`/api/v1/content/values/${confirmDelete.id}`, { method: 'DELETE' });
      const json = await res.json();
      if (json.success) {
        success('Company value removed');
        setValues((prev) => prev.filter((v) => v.id !== confirmDelete.id));
      } else {
        error(json.error || 'Failed to remove value');
      }
    } catch {
      error('Error deleting value');
    }
  };

  return (
    <div className="space-y-8">
      <AdminBreadcrumb items={[{ label: 'Company Identity & Content' }]} />

      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/5 pb-4">
        <div>
          <h1 className="text-2xl font-bold text-white tracking-tight">
            Company Identity, Vision & Values
          </h1>
          <p className="text-xs text-slate-400">
            Database-driven corporate narratives, value propositions, and mission statements.
          </p>
        </div>
      </div>

      {loading ? (
        <div className="py-20 text-center text-slate-500 font-mono text-xs">
          Loading company content from database...
        </div>
      ) : (
        <div className="space-y-8">
          {/* Main Identity Form */}
          <form onSubmit={handleSaveCompanySettings} noValidate className="glass-panel p-6 rounded-2xl border border-white/10 bg-[#0A0E17]/40 space-y-6">
            <div className="flex items-center justify-between border-b border-white/5 pb-4">
              <h2 className="text-sm font-bold text-white uppercase tracking-wider font-mono flex items-center gap-2">
                <Building2 className="w-4 h-4 text-[#00F2FE]" />
                Corporate Declarations & Mission
              </h2>

              <Button type="submit" variant="primary" size="sm" isLoading={savingSettings} leftIcon={<Save className="w-3.5 h-3.5" />}>
                Save Identity
              </Button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-xs font-mono text-slate-300">Brand Name</label>
                <input
                  type="text"
                  value={companySettings.brand_name}
                  onChange={(e) => setCompanySettings({ ...companySettings, brand_name: e.target.value })}
                  placeholder="GMDware"
                  className="w-full px-3.5 py-2 bg-[#05070B] border border-white/10 rounded-lg text-xs text-white focus:outline-none focus:border-[#00F2FE]"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-mono text-slate-300">Corporate Tagline</label>
                <input
                  type="text"
                  value={companySettings.tagline}
                  onChange={(e) => setCompanySettings({ ...companySettings, tagline: e.target.value })}
                  placeholder="Architecting High-Performance Digital Solutions & Enterprise Software"
                  className="w-full px-3.5 py-2 bg-[#05070B] border border-white/10 rounded-lg text-xs text-white focus:outline-none focus:border-[#00F2FE]"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-xs font-mono text-[#00F2FE] uppercase flex items-center gap-1.5">
                  <Compass className="w-3.5 h-3.5" />
                  Mission Statement
                </label>
                <textarea
                  rows={3}
                  value={companySettings.mission_statement}
                  onChange={(e) => setCompanySettings({ ...companySettings, mission_statement: e.target.value })}
                  placeholder="We engineer resilient, scalable, and mathematically sound digital infrastructure..."
                  className="w-full px-3.5 py-2 bg-[#05070B] border border-white/10 rounded-lg text-xs text-white focus:outline-none focus:border-[#00F2FE]"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-mono text-[#7F00FF] uppercase flex items-center gap-1.5">
                  <Target className="w-3.5 h-3.5" />
                  Vision Statement
                </label>
                <textarea
                  rows={3}
                  value={companySettings.vision_statement}
                  onChange={(e) => setCompanySettings({ ...companySettings, vision_statement: e.target.value })}
                  placeholder="To redefine modern software engineering by fusing first-principles architecture with cinematic digital craft."
                  className="w-full px-3.5 py-2 bg-[#05070B] border border-white/10 rounded-lg text-xs text-white focus:outline-none focus:border-[#7F00FF]"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-mono text-slate-300">Why GMDware (Core Value Proposition)</label>
              <textarea
                rows={3}
                value={companySettings.why_gmdware_summary}
                onChange={(e) => setCompanySettings({ ...companySettings, why_gmdware_summary: e.target.value })}
                placeholder="Detailed proposition of architectural superiority and disciplined engineering..."
                className="w-full px-3.5 py-2 bg-[#05070B] border border-white/10 rounded-lg text-xs text-white focus:outline-none focus:border-[#00F2FE]"
              />
            </div>
          </form>

          {/* Company Values Section */}
          <div className="glass-panel p-6 rounded-2xl border border-white/10 bg-[#0A0E17]/40 space-y-4">
            <div className="flex items-center justify-between border-b border-white/5 pb-4">
              <div>
                <h2 className="text-sm font-bold text-white uppercase tracking-wider font-mono flex items-center gap-2">
                  <Award className="w-4 h-4 text-[#10B981]" />
                  Core Engineering Values ({values.length})
                </h2>
                <p className="text-xs text-slate-400 mt-0.5">
                  Displayed on public About page and Homepage Values matrix.
                </p>
              </div>

              <Button
                size="sm"
                variant="primary"
                onClick={() => {
                  setEditingValue({
                    title: '',
                    summary: '',
                    displayOrder: values.length + 1,
                  });
                  setValueModalOpen(true);
                }}
                leftIcon={<Plus className="w-3.5 h-3.5" />}
              >
                Add Value
              </Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
              {values.map((val) => (
                <div key={val.id} className="p-4 rounded-xl border border-white/10 bg-[#06090F] flex flex-col justify-between space-y-3">
                  <div className="space-y-1.5">
                    <div className="flex items-center justify-between">
                      <h3 className="text-sm font-bold text-white">{val.title}</h3>
                      <span className="font-mono text-[10px] text-slate-500">#{val.displayOrder}</span>
                    </div>
                    <p className="text-xs text-slate-400 leading-relaxed">{val.summary}</p>
                  </div>

                  <div className="pt-2 border-t border-white/5 flex items-center justify-end gap-1">
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => {
                        setEditingValue({ ...val });
                        setValueModalOpen(true);
                      }}
                      leftIcon={<Edit3 className="w-3 h-3" />}
                    >
                      Edit
                    </Button>
                    <button
                      type="button"
                      onClick={() => setConfirmDelete({ open: true, id: val.id, title: val.title })}
                      className="p-1 text-slate-500 hover:text-[#F43F5E] transition-colors"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Value Delete Confirm Modal */}
      <ConfirmModal
        isOpen={confirmDelete.open}
        onClose={() => setConfirmDelete((prev) => ({ ...prev, open: false }))}
        onConfirm={handleConfirmDeleteValue}
        title="Delete Company Value"
        message={`Are you sure you want to delete "${confirmDelete.title}"?`}
        confirmLabel="Delete Value"
        variant="danger"
      />

      {/* Value Editor Modal */}
      {valueModalOpen && editingValue && (
        <div role="dialog" aria-modal="true" className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-sm animate-in fade-in">
          <div className="relative w-full max-w-md bg-[#0A0E17] border border-white/10 rounded-2xl shadow-2xl p-6 space-y-4">
            <div className="flex items-center justify-between border-b border-white/5 pb-3">
              <h2 className="text-base font-bold text-white tracking-tight flex items-center gap-2">
                <Award className="w-4 h-4 text-[#10B981]" />
                <span>{editingValue.id ? 'Edit Company Value' : 'Add Company Value'}</span>
              </h2>
              <button type="button" onClick={() => setValueModalOpen(false)} className="text-slate-400 hover:text-white p-1">
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSaveValue} noValidate className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-xs font-mono text-slate-300">Value Title *</label>
                <input
                  type="text"
                  required
                  value={editingValue.title || ''}
                  onChange={(e) => setEditingValue((prev) => (prev ? { ...prev, title: e.target.value } : null))}
                  placeholder="e.g. Architectural Integrity"
                  className="w-full px-3.5 py-2 bg-[#05070B] border border-white/10 rounded-lg text-xs text-white focus:outline-none focus:border-[#00F2FE]"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-mono text-slate-300">Summary Declaration *</label>
                <textarea
                  rows={3}
                  required
                  value={editingValue.summary || ''}
                  onChange={(e) => setEditingValue((prev) => (prev ? { ...prev, summary: e.target.value } : null))}
                  placeholder="We build systems that endure. Every decision is rooted in first principles..."
                  className="w-full px-3.5 py-2 bg-[#05070B] border border-white/10 rounded-lg text-xs text-white focus:outline-none focus:border-[#00F2FE]"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-mono text-slate-300">Display Order</label>
                <input
                  type="number"
                  value={editingValue.displayOrder || 1}
                  onChange={(e) => setEditingValue((prev) => (prev ? { ...prev, displayOrder: parseInt(e.target.value) || 1 } : null))}
                  className="w-full px-3.5 py-2 bg-[#05070B] border border-white/10 rounded-lg text-xs text-white focus:outline-none focus:border-[#00F2FE]"
                />
              </div>

              <div className="pt-4 border-t border-white/5 flex items-center justify-between">
                <Button type="button" variant="ghost" size="sm" onClick={() => setValueModalOpen(false)}>
                  Cancel
                </Button>
                <Button type="submit" variant="primary" size="sm" isLoading={savingValue} leftIcon={<Save className="w-3.5 h-3.5" />}>
                  Save Value
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
