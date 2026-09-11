'use client';

import React, { useState, useEffect } from 'react';
import { AdminBreadcrumb } from '@/components/admin/AdminBreadcrumb';
import { ConfirmModal } from '@/components/admin/ConfirmModal';
import { MediaPickerModal } from '@/components/admin/MediaPickerModal';
import { useAdminToast } from '@/components/admin/AdminToast';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import {
  Plus,
  Edit3,
  Trash2,
  Layers,
  ArrowUp,
  ArrowDown,
  Eye,
  EyeOff,
  Star,
  Check,
  X,
  Save,
  Cpu,
  ListOrdered,
  Image as ImageIcon,
} from 'lucide-react';

interface ServiceFeature {
  id?: string;
  title: string;
  description: string;
  displayOrder: number;
}

interface Service {
  id: string;
  title: string;
  slug: string;
  summary: string;
  content: string;
  iconName?: string | null;
  heroImageId?: string | null;
  status: 'PUBLISHED' | 'DRAFT' | 'ARCHIVED';
  displayOrder: number;
  isFeatured: boolean;
  isActive: boolean;
  seoTitle?: string | null;
  seoDescription?: string | null;
  features?: ServiceFeature[];
  technologies?: Array<{ technology: { id: string; name: string } }>;
}

interface Technology {
  id: string;
  name: string;
  slug: string;
}

export default function AdminServicesPage() {
  const { success, error } = useAdminToast();
  const [services, setServices] = useState<Service[]>([]);
  const [technologies, setTechnologies] = useState<Technology[]>([]);
  const [loading, setLoading] = useState(true);

  // Editor Modal
  const [editorOpen, setEditorOpen] = useState(false);
  const [editingService, setEditingService] = useState<Partial<Service> | null>(null);
  const [saving, setSaving] = useState(false);

  // Feature item being added
  const [newFeatureTitle, setNewFeatureTitle] = useState('');
  const [newFeatureDesc, setNewFeatureDesc] = useState('');

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
      const [servRes, techRes] = await Promise.all([
        fetch('/api/v1/services'),
        fetch('/api/v1/technologies'),
      ]);

      const servJson = await servRes.json();
      const techJson = await techRes.json();

      if (servJson.success && servJson.data) {
        setServices(servJson.data || []);
      }
      if (techJson.success && techJson.data) {
        setTechnologies(techJson.data || []);
      }
    } catch {
      error('Failed to load services database');
    } finally {
      setLoading(false);
    }
  };

  const handleNewService = () => {
    setEditingService({
      title: '',
      slug: '',
      summary: '',
      content: '',
      iconName: 'Cpu',
      status: 'PUBLISHED',
      displayOrder: services.length + 1,
      isFeatured: true,
      isActive: true,
      features: [
        { title: 'Core Architecture', description: 'Engineered for high-concurrency systems.', displayOrder: 1 },
      ],
      technologies: [],
    });
    setEditorOpen(true);
  };

  const handleEditService = (service: Service) => {
    setEditingService({ ...service });
    setEditorOpen(true);
  };

  const handleSaveService = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingService) return;

    if (!editingService.title || !editingService.slug || !editingService.summary) {
      error('Please complete mandatory fields: Title, Slug, and Summary');
      return;
    }

    setSaving(true);
    try {
      const isNew = !editingService.id;
      const url = isNew ? '/api/v1/services' : `/api/v1/services/${editingService.id}`;
      const method = isNew ? 'POST' : 'PUT';

      const techIds = (editingService.technologies || []).map((t) => t.technology.id);

      const payload = {
        ...editingService,
        technologyIds: techIds,
      };

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const json = await res.json();
      if (json.success) {
        success(isNew ? 'Service created' : 'Service updated');
        setEditorOpen(false);
        setEditingService(null);
        await loadData();
      } else {
        error(json.error || 'Failed to save service');
      }
    } catch {
      error('Network error saving service');
    } finally {
      setSaving(false);
    }
  };

  const handleToggleStatus = async (service: Service) => {
    const nextStatus = service.status === 'PUBLISHED' ? 'DRAFT' : 'PUBLISHED';
    try {
      const res = await fetch(`/api/v1/services/${service.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: nextStatus }),
      });
      const json = await res.json();
      if (json.success) {
        success(`Service set to ${nextStatus}`);
        setServices((prev) =>
          prev.map((s) => (s.id === service.id ? { ...s, status: nextStatus } : s))
        );
      }
    } catch {
      error('Failed to toggle status');
    }
  };

  const handleConfirmDelete = async () => {
    try {
      const res = await fetch(`/api/v1/services/${confirmDelete.id}`, { method: 'DELETE' });
      const json = await res.json();
      if (json.success) {
        success('Service deleted');
        setServices((prev) => prev.filter((s) => s.id !== confirmDelete.id));
      } else {
        error(json.error || 'Failed to delete service');
      }
    } catch {
      error('Error deleting service');
    }
  };

  const handleAddFeature = () => {
    if (!newFeatureTitle.trim() || !editingService) return;
    const current = editingService.features || [];
    setEditingService({
      ...editingService,
      features: [
        ...current,
        {
          title: newFeatureTitle.trim(),
          description: newFeatureDesc.trim() || 'Key technical deliverable.',
          displayOrder: current.length + 1,
        },
      ],
    });
    setNewFeatureTitle('');
    setNewFeatureDesc('');
  };

  const handleRemoveFeature = (index: number) => {
    if (!editingService) return;
    const current = [...(editingService.features || [])];
    current.splice(index, 1);
    setEditingService({ ...editingService, features: current });
  };

  return (
    <div className="space-y-6">
      <AdminBreadcrumb items={[{ label: 'Services & Capabilities' }]} />

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/5 pb-4">
        <div>
          <h1 className="text-2xl font-bold text-white tracking-tight">
            Services & Architectural Offerings
          </h1>
          <p className="text-xs text-slate-400">
            Configure service descriptions, feature checklists, and linked technology frameworks.
          </p>
        </div>

        <Button size="sm" variant="primary" onClick={handleNewService} leftIcon={<Plus className="w-4 h-4" />}>
          New Service
        </Button>
      </div>

      {/* Service List */}
      {loading ? (
        <div className="py-20 text-center text-slate-500 font-mono text-xs">
          Loading services catalog from database...
        </div>
      ) : services.length === 0 ? (
        <div className="py-20 text-center border border-dashed border-white/10 rounded-2xl space-y-3 bg-[#0A0E17]/20">
          <Layers className="w-10 h-10 text-slate-600 mx-auto" />
          <h3 className="text-sm font-bold text-white">No services found</h3>
          <Button size="sm" variant="primary" onClick={handleNewService} leftIcon={<Plus className="w-3.5 h-3.5" />}>
            Create First Service
          </Button>
        </div>
      ) : (
        <div className="space-y-4">
          {services.map((service) => (
            <div
              key={service.id}
              className="glass-panel p-6 rounded-xl border border-white/10 hover:border-white/20 transition-all bg-[#0A0E17]/40 space-y-4"
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-white/5 pb-3">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-lg bg-[#00F2FE]/10 border border-[#00F2FE]/20 flex items-center justify-center text-[#00F2FE]">
                    <Layers className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="text-base font-bold text-white">{service.title}</h3>
                      {service.status === 'PUBLISHED' ? (
                        <Badge variant="emerald" size="sm">PUBLISHED</Badge>
                      ) : (
                        <Badge variant="neutral" size="sm">DRAFT</Badge>
                      )}
                      {service.isFeatured && <Badge variant="cyan" size="sm">FEATURED</Badge>}
                    </div>
                    <span className="font-mono text-xs text-[#00F2FE]">/services#{service.slug}</span>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => handleToggleStatus(service)}
                    className="p-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white transition-colors"
                    title={service.status === 'PUBLISHED' ? 'Unpublish to draft' : 'Publish live'}
                  >
                    {service.status === 'PUBLISHED' ? <Eye className="w-4 h-4 text-[#10B981]" /> : <EyeOff className="w-4 h-4 text-slate-500" />}
                  </button>

                  <Button
                    size="sm"
                    variant="secondary"
                    onClick={() => handleEditService(service)}
                    leftIcon={<Edit3 className="w-3.5 h-3.5" />}
                  >
                    Edit
                  </Button>

                  <button
                    type="button"
                    onClick={() => setConfirmDelete({ open: true, id: service.id, title: service.title })}
                    className="p-1.5 rounded-lg hover:bg-[#F43F5E]/10 text-slate-500 hover:text-[#F43F5E] transition-colors"
                    title="Delete service"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>

              <p className="text-xs text-slate-400 leading-relaxed bg-[#05070B] p-3 rounded-lg border border-white/5">
                {service.summary}
              </p>

              {/* Features preview */}
              {service.features && service.features.length > 0 && (
                <div className="space-y-1.5 pt-1">
                  <span className="font-mono text-[10px] text-slate-500 uppercase tracking-wider block">
                    Core Technical Features ({service.features.length})
                  </span>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                    {service.features.map((feat, fIdx) => (
                      <div key={fIdx} className="p-2.5 rounded-lg bg-white/5 border border-white/5 text-xs">
                        <strong className="text-white block truncate">{feat.title}</strong>
                        <span className="text-[11px] text-slate-400 line-clamp-1">{feat.description}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Confirmation Modal */}
      <ConfirmModal
        isOpen={confirmDelete.open}
        onClose={() => setConfirmDelete((prev) => ({ ...prev, open: false }))}
        onConfirm={handleConfirmDelete}
        title="Delete Service"
        message={`Are you sure you want to permanently delete the service "${confirmDelete.title}"?`}
        confirmLabel="Delete Service"
        variant="danger"
      />

      {/* Service Editor Modal */}
      {editorOpen && editingService && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-sm animate-in fade-in"
        >
          <div className="relative w-full max-w-3xl bg-[#0A0E17] border border-white/10 rounded-2xl shadow-2xl flex flex-col max-h-[90vh] overflow-hidden">
            <div className="p-6 border-b border-white/5 flex items-center justify-between shrink-0 bg-[#06090F]">
              <h2 className="text-lg font-bold text-white tracking-tight flex items-center gap-2">
                <Layers className="w-5 h-5 text-[#00F2FE]" />
                <span>{editingService.id ? 'Edit Service' : 'Create New Service'}</span>
              </h2>
              <button type="button" onClick={() => setEditorOpen(false)} className="text-slate-400 hover:text-white p-1">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveService} className="flex-1 overflow-y-auto p-6 space-y-5">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-mono text-slate-300">
                    Service Title <span className="text-[#F43F5E]">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={editingService.title || ''}
                    onChange={(e) =>
                      setEditingService((prev) => (prev ? { ...prev, title: e.target.value } : null))
                    }
                    placeholder="e.g. Distributed Cloud & Systems Architecture"
                    className="w-full px-3.5 py-2 bg-[#05070B] border border-white/10 rounded-lg text-xs text-white focus:outline-none focus:border-[#00F2FE]"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-mono text-slate-300">
                    Slug <span className="text-[#F43F5E]">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={editingService.slug || ''}
                    onChange={(e) =>
                      setEditingService((prev) => (prev ? { ...prev, slug: e.target.value } : null))
                    }
                    placeholder="cloud-systems-architecture"
                    className="w-full px-3.5 py-2 bg-[#05070B] border border-white/10 rounded-lg text-xs font-mono text-white focus:outline-none focus:border-[#00F2FE]"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-mono text-slate-300">Summary</label>
                <textarea
                  rows={2}
                  value={editingService.summary || ''}
                  onChange={(e) =>
                    setEditingService((prev) => (prev ? { ...prev, summary: e.target.value } : null))
                  }
                  placeholder="Primary executive summary..."
                  className="w-full px-3.5 py-2 bg-[#05070B] border border-white/10 rounded-lg text-xs text-white focus:outline-none focus:border-[#00F2FE]"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-mono text-slate-300">Full Content / Proposition</label>
                <textarea
                  rows={4}
                  value={editingService.content || ''}
                  onChange={(e) =>
                    setEditingService((prev) => (prev ? { ...prev, content: e.target.value } : null))
                  }
                  placeholder="Comprehensive service narrative..."
                  className="w-full px-3.5 py-2 bg-[#05070B] border border-white/10 rounded-lg text-xs text-white focus:outline-none focus:border-[#00F2FE]"
                />
              </div>

              {/* Feature Checklist Builder */}
              <div className="space-y-3 p-4 rounded-xl bg-[#05070B] border border-white/5">
                <h4 className="text-xs font-mono text-[#00F2FE] uppercase tracking-wider">
                  Service Feature Matrix
                </h4>

                <div className="space-y-2">
                  {(editingService.features || []).map((feat, fIdx) => (
                    <div
                      key={fIdx}
                      className="p-3 rounded-lg bg-[#0A0E17] border border-white/5 flex items-start justify-between gap-3 text-xs"
                    >
                      <div className="space-y-0.5">
                        <strong className="text-white block">{feat.title}</strong>
                        <p className="text-[11px] text-slate-400">{feat.description}</p>
                      </div>
                      <button
                        type="button"
                        onClick={() => handleRemoveFeature(fIdx)}
                        className="text-slate-500 hover:text-[#F43F5E] p-1"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </div>

                {/* Add feature row */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-2">
                  <input
                    type="text"
                    placeholder="Feature Title (e.g. Multi-Region Failover)"
                    value={newFeatureTitle}
                    onChange={(e) => setNewFeatureTitle(e.target.value)}
                    className="px-3 py-1.5 bg-[#0A0E17] border border-white/10 rounded-lg text-xs text-white focus:outline-none focus:border-[#00F2FE]"
                  />
                  <div className="flex gap-2">
                    <input
                      type="text"
                      placeholder="Feature Description"
                      value={newFeatureDesc}
                      onChange={(e) => setNewFeatureDesc(e.target.value)}
                      className="flex-1 px-3 py-1.5 bg-[#0A0E17] border border-white/10 rounded-lg text-xs text-white focus:outline-none focus:border-[#00F2FE]"
                    />
                    <Button type="button" size="sm" variant="secondary" onClick={handleAddFeature}>
                      Add
                    </Button>
                  </div>
                </div>
              </div>

              {/* Technologies association */}
              <div className="space-y-2">
                <label className="text-xs font-mono text-slate-300">Associated Technologies</label>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  {technologies.map((tech) => {
                    const isSelected = (editingService.technologies || []).some(
                      (t) => t.technology.id === tech.id
                    );

                    return (
                      <button
                        key={tech.id}
                        type="button"
                        onClick={() => {
                          setEditingService((prev) => {
                            if (!prev) return null;
                            const current = prev.technologies || [];
                            const exists = current.some((t) => t.technology.id === tech.id);
                            const updated = exists
                              ? current.filter((t) => t.technology.id !== tech.id)
                              : [...current, { technology: tech }];
                            return { ...prev, technologies: updated };
                          });
                        }}
                        className={`p-2 rounded-lg border text-xs font-mono text-left flex items-center justify-between ${
                          isSelected
                            ? 'bg-[#00F2FE]/10 border-[#00F2FE] text-white'
                            : 'bg-[#05070B] border-white/10 text-slate-400'
                        }`}
                      >
                        <span className="truncate">{tech.name}</span>
                        {isSelected && <Check className="w-3 h-3 text-[#00F2FE]" />}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Status and featured */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                <div className="space-y-1.5">
                  <label className="text-xs font-mono text-slate-300">Status</label>
                  <select
                    value={editingService.status || 'PUBLISHED'}
                    onChange={(e) =>
                      setEditingService((prev) => (prev ? { ...prev, status: e.target.value as any } : null))
                    }
                    className="w-full px-3.5 py-2 bg-[#05070B] border border-white/10 rounded-lg text-xs text-slate-300 focus:outline-none focus:border-[#00F2FE]"
                  >
                    <option value="PUBLISHED">PUBLISHED (Live)</option>
                    <option value="DRAFT">DRAFT</option>
                  </select>
                </div>

                <div className="flex items-center gap-4 pt-6">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={editingService.isFeatured || false}
                      onChange={(e) =>
                        setEditingService((prev) => (prev ? { ...prev, isFeatured: e.target.checked } : null))
                      }
                      className="w-4 h-4 rounded bg-[#05070B] border-white/10 text-[#00F2FE] focus:ring-0"
                    />
                    <span className="text-xs text-white">Feature on Homepage</span>
                  </label>
                </div>
              </div>

              {/* Footer */}
              <div className="p-6 border-t border-white/5 flex items-center justify-between bg-[#06090F] shrink-0 -mx-6 -mb-6 mt-6">
                <Button type="button" variant="ghost" size="sm" onClick={() => setEditorOpen(false)}>
                  Cancel
                </Button>
                <Button type="submit" variant="primary" size="sm" isLoading={saving} leftIcon={<Save className="w-3.5 h-3.5" />}>
                  Save Service
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
