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
  Cpu,
  Check,
  X,
  Save,
  Eye,
  EyeOff,
  ExternalLink,
  Search,
} from 'lucide-react';

interface Technology {
  id: string;
  name: string;
  slug: string;
  category: string;
  logoUrl?: string | null;
  description?: string | null;
  url?: string | null;
  isFeatured: boolean;
  isActive: boolean;
  displayOrder: number;
}

const CATEGORIES = ['All', 'Frontend', 'Backend', 'Cloud', 'AI', 'Systems'];

export default function AdminTechnologiesPage() {
  const { success, error } = useAdminToast();
  const [technologies, setTechnologies] = useState<Technology[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [search, setSearch] = useState('');

  // Editor Modal
  const [editorOpen, setEditorOpen] = useState(false);
  const [editingTech, setEditingTech] = useState<Partial<Technology> | null>(null);
  const [saving, setSaving] = useState(false);

  // Delete modal
  const [confirmDelete, setConfirmDelete] = useState<{ open: boolean; id: string; name: string }>({
    open: false,
    id: '',
    name: '',
  });

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/v1/technologies');
      const json = await res.json();
      if (json.success && json.data) {
        setTechnologies(json.data || []);
      }
    } catch {
      error('Failed to load technologies');
    } finally {
      setLoading(false);
    }
  };

  const handleNewTech = () => {
    setEditingTech({
      name: '',
      slug: '',
      category: 'Backend',
      logoUrl: '',
      description: '',
      url: '',
      isFeatured: false,
      isActive: true,
      displayOrder: technologies.length + 1,
    });
    setEditorOpen(true);
  };

  const handleEditTech = (tech: Technology) => {
    setEditingTech({ ...tech });
    setEditorOpen(true);
  };

  const handleSaveTech = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingTech) return;

    if (!editingTech.name || !editingTech.slug || !editingTech.category) {
      error('Please complete mandatory fields: Name, Slug, and Category');
      return;
    }

    setSaving(true);
    try {
      const isNew = !editingTech.id;
      const url = isNew ? '/api/v1/technologies' : `/api/v1/technologies/${editingTech.id}`;
      const method = isNew ? 'POST' : 'PUT';

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(editingTech),
      });

      const json = await res.json();
      if (json.success) {
        success(isNew ? 'Technology cataloged' : 'Technology updated');
        setEditorOpen(false);
        setEditingTech(null);
        await loadData();
      } else {
        error(json.error || 'Failed to save technology');
      }
    } catch {
      error('Network error saving technology');
    } finally {
      setSaving(false);
    }
  };

  const handleToggleActive = async (tech: Technology) => {
    try {
      const res = await fetch(`/api/v1/technologies/${tech.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ isActive: !tech.isActive }),
      });
      const json = await res.json();
      if (json.success) {
        success(tech.isActive ? 'Technology disabled' : 'Technology enabled');
        setTechnologies((prev) =>
          prev.map((t) => (t.id === tech.id ? { ...t, isActive: !tech.isActive } : t))
        );
      }
    } catch {
      error('Failed to toggle active state');
    }
  };

  const handleConfirmDelete = async () => {
    try {
      const res = await fetch(`/api/v1/technologies/${confirmDelete.id}`, { method: 'DELETE' });
      const json = await res.json();
      if (json.success) {
        success('Technology removed from catalog');
        setTechnologies((prev) => prev.filter((t) => t.id !== confirmDelete.id));
      } else {
        error(json.error || 'Failed to remove technology');
      }
    } catch {
      error('Error deleting technology');
    }
  };

  const filteredTech = technologies.filter((t) => {
    const matchesCat = selectedCategory === 'All' || t.category === selectedCategory;
    const matchesSearch =
      t.name.toLowerCase().includes(search.toLowerCase()) ||
      t.slug.toLowerCase().includes(search.toLowerCase()) ||
      (t.description && t.description.toLowerCase().includes(search.toLowerCase()));

    return matchesCat && matchesSearch;
  });

  return (
    <div className="space-y-6">
      <AdminBreadcrumb items={[{ label: 'Technology Stack' }]} />

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/5 pb-4">
        <div>
          <h1 className="text-2xl font-bold text-white tracking-tight">
            Technology Stack & Framework Catalog
          </h1>
          <p className="text-xs text-slate-400">
            Define corporate capability matrices, language proficiencies, and system infrastructure.
          </p>
        </div>

        <Button size="sm" variant="primary" onClick={handleNewTech} leftIcon={<Plus className="w-4 h-4" />}>
          Add Technology
        </Button>
      </div>

      {/* Category Pills & Search */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
        <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar">
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              type="button"
              onClick={() => setSelectedCategory(cat)}
              className={`px-3 py-1.5 rounded-lg text-xs font-mono transition-colors shrink-0 ${
                selectedCategory === cat
                  ? 'bg-[#00F2FE]/15 text-[#00F2FE] border border-[#00F2FE]/30 font-bold'
                  : 'bg-[#0A0E17] text-slate-400 border border-white/5 hover:text-white'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        <div className="relative">
          <Search className="w-3.5 h-3.5 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search technologies..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full sm:w-64 pl-8 pr-3 py-1.5 bg-[#0A0E17] border border-white/10 rounded-lg text-xs text-white focus:outline-none focus:border-[#00F2FE]"
          />
        </div>
      </div>

      {/* Technologies Grid */}
      {loading ? (
        <div className="py-20 text-center text-slate-500 font-mono text-xs">
          Loading technology matrix from database...
        </div>
      ) : filteredTech.length === 0 ? (
        <div className="py-20 text-center border border-dashed border-white/10 rounded-2xl space-y-3 bg-[#0A0E17]/20">
          <Cpu className="w-10 h-10 text-slate-600 mx-auto" />
          <h3 className="text-sm font-bold text-white">No technologies found</h3>
          <Button size="sm" variant="primary" onClick={handleNewTech} leftIcon={<Plus className="w-3.5 h-3.5" />}>
            Add First Technology
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
          {filteredTech.map((tech) => (
            <div
              key={tech.id}
              className={`p-4 rounded-xl border bg-[#0A0E17]/40 flex flex-col justify-between space-y-3 transition-all ${
                tech.isActive ? 'border-white/10 hover:border-white/20' : 'border-white/5 opacity-50'
              }`}
            >
              <div className="space-y-2">
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <h3 className="text-sm font-bold text-white truncate">{tech.name}</h3>
                    <span className="text-[10px] font-mono text-[#00F2FE] uppercase">{tech.category}</span>
                  </div>
                  {tech.isFeatured && <Badge variant="cyan" size="sm">FEATURED</Badge>}
                </div>

                {tech.description && (
                  <p className="text-[11px] text-slate-400 line-clamp-2 leading-relaxed">
                    {tech.description}
                  </p>
                )}
              </div>

              <div className="pt-2 border-t border-white/5 flex items-center justify-between">
                <div className="flex items-center gap-1.5">
                  {tech.url && (
                    <a
                      href={tech.url}
                      target="_blank"
                      rel="noreferrer"
                      className="p-1 text-slate-500 hover:text-white"
                      title="Documentation link"
                    >
                      <ExternalLink className="w-3.5 h-3.5" />
                    </a>
                  )}
                  <button
                    type="button"
                    onClick={() => handleToggleActive(tech)}
                    className="p-1 text-slate-500 hover:text-white"
                    title={tech.isActive ? 'Deactivate' : 'Activate'}
                  >
                    {tech.isActive ? <Eye className="w-3.5 h-3.5 text-[#10B981]" /> : <EyeOff className="w-3.5 h-3.5" />}
                  </button>
                </div>

                <div className="flex items-center gap-1">
                  <Button size="sm" variant="ghost" onClick={() => handleEditTech(tech)}>
                    Edit
                  </Button>
                  <button
                    type="button"
                    onClick={() => setConfirmDelete({ open: true, id: tech.id, name: tech.name })}
                    className="p-1 text-slate-500 hover:text-[#F43F5E]"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Confirmation Modal */}
      <ConfirmModal
        isOpen={confirmDelete.open}
        onClose={() => setConfirmDelete((prev) => ({ ...prev, open: false }))}
        onConfirm={handleConfirmDelete}
        title="Remove Technology"
        message={`Are you sure you want to remove "${confirmDelete.name}" from the capability catalog?`}
        confirmLabel="Remove Technology"
        variant="danger"
      />

      {/* Editor Modal */}
      {editorOpen && editingTech && (
        <div role="dialog" aria-modal="true" className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-sm animate-in fade-in">
          <div className="relative w-full max-w-lg bg-[#0A0E17] border border-white/10 rounded-2xl shadow-2xl p-6 space-y-4">
            <div className="flex items-center justify-between border-b border-white/5 pb-3">
              <h2 className="text-base font-bold text-white tracking-tight flex items-center gap-2">
                <Cpu className="w-4 h-4 text-[#00F2FE]" />
                <span>{editingTech.id ? 'Edit Technology' : 'Add Technology'}</span>
              </h2>
              <button type="button" onClick={() => setEditorOpen(false)} className="text-slate-400 hover:text-white p-1">
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSaveTech} noValidate className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-xs font-mono text-slate-300">Technology Name *</label>
                <input
                  type="text"
                  required
                  value={editingTech.name || ''}
                  onChange={(e) => setEditingTech((prev) => (prev ? { ...prev, name: e.target.value } : null))}
                  placeholder="e.g. Next.js 16"
                  className="w-full px-3.5 py-2 bg-[#05070B] border border-white/10 rounded-lg text-xs text-white focus:outline-none focus:border-[#00F2FE]"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <label className="text-xs font-mono text-slate-300">Slug *</label>
                  <input
                    type="text"
                    required
                    value={editingTech.slug || ''}
                    onChange={(e) => setEditingTech((prev) => (prev ? { ...prev, slug: e.target.value } : null))}
                    placeholder="nextjs"
                    className="w-full px-3.5 py-2 bg-[#05070B] border border-white/10 rounded-lg text-xs font-mono text-white focus:outline-none focus:border-[#00F2FE]"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-mono text-slate-300">Category</label>
                  <select
                    value={editingTech.category || 'Backend'}
                    onChange={(e) => setEditingTech((prev) => (prev ? { ...prev, category: e.target.value } : null))}
                    className="w-full px-3.5 py-2 bg-[#05070B] border border-white/10 rounded-lg text-xs text-slate-300 focus:outline-none focus:border-[#00F2FE]"
                  >
                    <option value="Frontend">Frontend</option>
                    <option value="Backend">Backend</option>
                    <option value="Cloud">Cloud</option>
                    <option value="AI">AI</option>
                    <option value="Systems">Systems</option>
                  </select>
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-mono text-slate-300">Documentation URL</label>
                <input
                  type="url"
                  value={editingTech.url || ''}
                  onChange={(e) => setEditingTech((prev) => (prev ? { ...prev, url: e.target.value } : null))}
                  placeholder="https://..."
                  className="w-full px-3.5 py-2 bg-[#05070B] border border-white/10 rounded-lg text-xs text-white focus:outline-none focus:border-[#00F2FE]"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-mono text-slate-300">Short Technical Description</label>
                <textarea
                  rows={2}
                  value={editingTech.description || ''}
                  onChange={(e) => setEditingTech((prev) => (prev ? { ...prev, description: e.target.value } : null))}
                  placeholder="Architectural purpose and use-cases..."
                  className="w-full px-3.5 py-2 bg-[#05070B] border border-white/10 rounded-lg text-xs text-white focus:outline-none focus:border-[#00F2FE]"
                />
              </div>

              <div className="flex items-center gap-6 pt-2">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={editingTech.isFeatured || false}
                    onChange={(e) => setEditingTech((prev) => (prev ? { ...prev, isFeatured: e.target.checked } : null))}
                    className="w-4 h-4 rounded bg-[#05070B] border-white/10 text-[#00F2FE] focus:ring-0"
                  />
                  <span className="text-xs text-white">Feature in Homepage Tech Matrix</span>
                </label>
              </div>

              <div className="pt-4 border-t border-white/5 flex items-center justify-between">
                <Button type="button" variant="ghost" size="sm" onClick={() => setEditorOpen(false)}>
                  Cancel
                </Button>
                <Button type="submit" variant="primary" size="sm" isLoading={saving} leftIcon={<Save className="w-3.5 h-3.5" />}>
                  Save Technology
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
