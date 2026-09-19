'use client';

import React, { useState, useEffect } from 'react';
import { AdminBreadcrumb } from '@/components/admin/AdminBreadcrumb';
import { ConfirmModal } from '@/components/admin/ConfirmModal';
import { useAdminToast } from '@/components/admin/AdminToast';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import {
  Plus,
  Edit3,
  Trash2,
  Workflow,
  Check,
  X,
  Save,
  ArrowUp,
  ArrowDown,
} from 'lucide-react';

interface ProcessStep {
  id: string;
  stepNumber: number;
  title: string;
  phase: string;
  description: string;
  deliverables: string[];
  iconName?: string | null;
}

export default function AdminProcessPage() {
  const { success, error } = useAdminToast();
  const [steps, setSteps] = useState<ProcessStep[]>([]);
  const [loading, setLoading] = useState(true);

  // Editor Modal
  const [editorOpen, setEditorOpen] = useState(false);
  const [editingStep, setEditingStep] = useState<Partial<ProcessStep> | null>(null);
  const [deliverableInput, setDeliverableInput] = useState('');
  const [saving, setSaving] = useState(false);

  // Delete modal
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
      const res = await fetch('/api/v1/content/process');
      const json = await res.json();
      if (json.success && json.data) {
        setSteps(json.data || []);
      }
    } catch {
      error('Failed to load process steps');
    } finally {
      setLoading(false);
    }
  };

  const handleNewStep = () => {
    setEditingStep({
      stepNumber: steps.length + 1,
      phase: `Phase 0${steps.length + 1}`,
      title: '',
      description: '',
      deliverables: ['System Blueprint', 'Technical Spec'],
      iconName: 'Workflow',
    });
    setEditorOpen(true);
  };

  const handleEditStep = (step: ProcessStep) => {
    setEditingStep({ ...step });
    setEditorOpen(true);
  };

  const handleSaveStep = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingStep) return;

    if (!editingStep.title || !editingStep.description || !editingStep.stepNumber) {
      error('Please complete mandatory fields');
      return;
    }

    setSaving(true);
    try {
      const isNew = !editingStep.id;
      const url = isNew
        ? '/api/v1/content/process'
        : `/api/v1/content/process/${editingStep.id}`;
      const method = isNew ? 'POST' : 'PUT';

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(editingStep),
      });

      const json = await res.json();
      if (json.success) {
        success(isNew ? 'Process step created' : 'Process step updated');
        setEditorOpen(false);
        setEditingStep(null);
        await loadData();
      } else {
        error(json.error || 'Failed to save process step');
      }
    } catch {
      error('Network error saving step');
    } finally {
      setSaving(false);
    }
  };

  const handleConfirmDelete = async () => {
    try {
      const res = await fetch(`/api/v1/content/process/${confirmDelete.id}`, { method: 'DELETE' });
      const json = await res.json();
      if (json.success) {
        success('Process step deleted');
        setSteps((prev) => prev.filter((s) => s.id !== confirmDelete.id));
      } else {
        error(json.error || 'Failed to delete process step');
      }
    } catch {
      error('Error deleting step');
    }
  };

  const handleAddDeliverable = () => {
    if (!deliverableInput.trim() || !editingStep) return;
    const current = editingStep.deliverables || [];
    if (!current.includes(deliverableInput.trim())) {
      setEditingStep({ ...editingStep, deliverables: [...current, deliverableInput.trim()] });
    }
    setDeliverableInput('');
  };

  const handleRemoveDeliverable = (item: string) => {
    if (!editingStep) return;
    setEditingStep({
      ...editingStep,
      deliverables: (editingStep.deliverables || []).filter((d) => d !== item),
    });
  };

  return (
    <div className="space-y-6">
      <AdminBreadcrumb items={[{ label: 'Delivery Process' }]} />

      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/5 pb-4">
        <div>
          <h1 className="text-2xl font-bold text-white tracking-tight">
            Delivery Methodology & Engineering Process
          </h1>
          <p className="text-xs text-slate-400">
            Structure the 5-phase engineering lifecycle and key deliverables shown on the public site.
          </p>
        </div>

        <Button size="sm" variant="primary" onClick={handleNewStep} leftIcon={<Plus className="w-4 h-4" />}>
          Add Step
        </Button>
      </div>

      {loading ? (
        <div className="py-20 text-center text-slate-500 font-mono text-xs">
          Loading process steps from database...
        </div>
      ) : steps.length === 0 ? (
        <div className="py-20 text-center border border-dashed border-white/10 rounded-2xl space-y-3 bg-[#0A0E17]/20">
          <Workflow className="w-10 h-10 text-slate-600 mx-auto" />
          <h3 className="text-sm font-bold text-white">No process steps found</h3>
          <Button size="sm" variant="primary" onClick={handleNewStep}>
            Add First Step
          </Button>
        </div>
      ) : (
        <div className="space-y-3">
          {steps.map((step) => (
            <div
              key={step.id}
              className="glass-panel p-5 rounded-xl border border-white/10 hover:border-white/20 transition-all bg-[#0A0E17]/40 flex flex-col md:flex-row md:items-center justify-between gap-4"
            >
              <div className="flex items-start gap-4 min-w-0">
                <div className="w-10 h-10 rounded-xl bg-[#00F2FE]/10 border border-[#00F2FE]/20 flex items-center justify-center font-mono text-sm font-bold text-[#00F2FE] shrink-0">
                  {step.stepNumber}
                </div>

                <div className="space-y-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <Badge variant="cyan" size="sm">{step.phase}</Badge>
                    <h3 className="text-sm font-bold text-white tracking-tight truncate">{step.title}</h3>
                  </div>
                  <p className="text-xs text-slate-400 leading-relaxed max-w-2xl">{step.description}</p>

                  <div className="flex flex-wrap gap-1.5 pt-1">
                    {step.deliverables.map((del, dIdx) => (
                      <span key={dIdx} className="px-2 py-0.5 rounded bg-white/5 border border-white/5 text-[10px] font-mono text-slate-300">
                        {del}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-2 self-end md:self-center shrink-0">
                <Button size="sm" variant="secondary" onClick={() => handleEditStep(step)} leftIcon={<Edit3 className="w-3.5 h-3.5" />}>
                  Edit
                </Button>
                <button
                  type="button"
                  onClick={() => setConfirmDelete({ open: true, id: step.id, title: step.title })}
                  className="p-1.5 text-slate-500 hover:text-[#F43F5E] transition-colors"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Confirm Modal */}
      <ConfirmModal
        isOpen={confirmDelete.open}
        onClose={() => setConfirmDelete((prev) => ({ ...prev, open: false }))}
        onConfirm={handleConfirmDelete}
        title="Delete Process Step"
        message={`Are you sure you want to delete "${confirmDelete.title}"?`}
        confirmLabel="Delete Step"
        variant="danger"
      />

      {/* Editor Modal */}
      {editorOpen && editingStep && (
        <div role="dialog" aria-modal="true" className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-sm animate-in fade-in">
          <div className="relative w-full max-w-xl bg-[#0A0E17] border border-white/10 rounded-2xl shadow-2xl p-6 space-y-4">
            <div className="flex items-center justify-between border-b border-white/5 pb-3">
              <h2 className="text-base font-bold text-white tracking-tight flex items-center gap-2">
                <Workflow className="w-4 h-4 text-[#00F2FE]" />
                <span>{editingStep.id ? 'Edit Process Step' : 'Add Process Step'}</span>
              </h2>
              <button type="button" onClick={() => setEditorOpen(false)} className="text-slate-400 hover:text-white p-1">
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSaveStep} noValidate className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="space-y-1.5">
                  <label className="text-xs font-mono text-slate-300">Step Number *</label>
                  <input
                    type="number"
                    required
                    value={editingStep.stepNumber || 1}
                    onChange={(e) => setEditingStep((prev) => (prev ? { ...prev, stepNumber: parseInt(e.target.value) || 1 } : null))}
                    className="w-full px-3.5 py-2 bg-[#05070B] border border-white/10 rounded-lg text-xs text-white focus:outline-none focus:border-[#00F2FE]"
                  />
                </div>

                <div className="space-y-1.5 sm:col-span-2">
                  <label className="text-xs font-mono text-slate-300">Phase Label *</label>
                  <input
                    type="text"
                    required
                    value={editingStep.phase || ''}
                    onChange={(e) => setEditingStep((prev) => (prev ? { ...prev, phase: e.target.value } : null))}
                    placeholder="e.g. Phase 01: Architecture"
                    className="w-full px-3.5 py-2 bg-[#05070B] border border-white/10 rounded-lg text-xs text-white focus:outline-none focus:border-[#00F2FE]"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-mono text-slate-300">Step Title *</label>
                <input
                  type="text"
                  required
                  value={editingStep.title || ''}
                  onChange={(e) => setEditingStep((prev) => (prev ? { ...prev, title: e.target.value } : null))}
                  placeholder="e.g. Architectural Discovery & Technical Alignment"
                  className="w-full px-3.5 py-2 bg-[#05070B] border border-white/10 rounded-lg text-xs text-white focus:outline-none focus:border-[#00F2FE]"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-mono text-slate-300">Description *</label>
                <textarea
                  rows={3}
                  required
                  value={editingStep.description || ''}
                  onChange={(e) => setEditingStep((prev) => (prev ? { ...prev, description: e.target.value } : null))}
                  placeholder="What actions are executed during this phase..."
                  className="w-full px-3.5 py-2 bg-[#05070B] border border-white/10 rounded-lg text-xs text-white focus:outline-none focus:border-[#00F2FE]"
                />
              </div>

              {/* Deliverables */}
              <div className="space-y-2">
                <label className="text-xs font-mono text-slate-300">Key Deliverables</label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={deliverableInput}
                    onChange={(e) => setDeliverableInput(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault();
                        handleAddDeliverable();
                      }
                    }}
                    placeholder="Type deliverable & hit enter..."
                    className="flex-1 px-3 py-1.5 bg-[#05070B] border border-white/10 rounded-lg text-xs text-white focus:outline-none focus:border-[#00F2FE]"
                  />
                  <Button type="button" size="sm" variant="secondary" onClick={handleAddDeliverable}>
                    Add
                  </Button>
                </div>

                <div className="flex flex-wrap gap-1.5 pt-1">
                  {(editingStep.deliverables || []).map((del, idx) => (
                    <span
                      key={idx}
                      className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-[#00F2FE]/10 border border-[#00F2FE]/20 text-[11px] font-mono text-white"
                    >
                      {del}
                      <button type="button" onClick={() => handleRemoveDeliverable(del)} className="hover:text-[#F43F5E]">
                        <X className="w-3 h-3" />
                      </button>
                    </span>
                  ))}
                </div>
              </div>

              <div className="pt-4 border-t border-white/5 flex items-center justify-between">
                <Button type="button" variant="ghost" size="sm" onClick={() => setEditorOpen(false)}>
                  Cancel
                </Button>
                <Button type="submit" variant="primary" size="sm" isLoading={saving} leftIcon={<Save className="w-3.5 h-3.5" />}>
                  Save Step
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
