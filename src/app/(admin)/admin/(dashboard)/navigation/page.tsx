'use client';

import React, { useState, useEffect } from 'react';
import { AdminBreadcrumb } from '@/components/admin/AdminBreadcrumb';
import { ConfirmModal } from '@/components/admin/ConfirmModal';
import { useAdminToast } from '@/components/admin/AdminToast';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import {
  Navigation,
  Plus,
  Edit3,
  Trash2,
  Check,
  X,
  Save,
  ArrowUp,
  ArrowDown,
  Eye,
  EyeOff,
  ExternalLink,
} from 'lucide-react';

interface NavigationItem {
  id: string;
  label: string;
  path: string;
  location: string;
  displayOrder: number;
  isExternal: boolean;
  isEnabled: boolean;
}

export default function AdminNavigationPage() {
  const { success, error } = useAdminToast();
  const [navItems, setNavItems] = useState<NavigationItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [locationTab, setLocationTab] = useState<'header' | 'footer'>('header');

  // Editor modal
  const [editorOpen, setEditorOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<Partial<NavigationItem> | null>(null);
  const [saving, setSaving] = useState(false);

  // Delete modal
  const [confirmDelete, setConfirmDelete] = useState<{ open: boolean; id: string; label: string }>({
    open: false,
    id: '',
    label: '',
  });

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/v1/content/navigation');
      const json = await res.json();
      if (json.success && json.data) {
        setNavItems(json.data || []);
      }
    } catch {
      error('Failed to load navigation items');
    } finally {
      setLoading(false);
    }
  };

  const handleNewItem = () => {
    setEditingItem({
      label: '',
      path: '/',
      location: locationTab,
      displayOrder: navItems.filter((i) => i.location === locationTab).length + 1,
      isExternal: false,
      isEnabled: true,
    });
    setEditorOpen(true);
  };

  const handleEditItem = (item: NavigationItem) => {
    setEditingItem({ ...item });
    setEditorOpen(true);
  };

  const handleSaveItem = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingItem) return;

    if (!editingItem.label || !editingItem.path) {
      error('Label and Path are mandatory');
      return;
    }

    if (/^(javascript|data|vbscript):/i.test(editingItem.path)) {
      error('Unsafe URL protocol rejected');
      return;
    }

    setSaving(true);
    try {
      const isNew = !editingItem.id;
      const url = isNew
        ? '/api/v1/content/navigation'
        : `/api/v1/content/navigation/${editingItem.id}`;
      const method = isNew ? 'POST' : 'PUT';

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(editingItem),
      });

      const json = await res.json();
      if (json.success) {
        success(isNew ? 'Link added' : 'Link updated');
        setEditorOpen(false);
        setEditingItem(null);
        await loadData();
      } else {
        error(json.error || 'Failed to save navigation item');
      }
    } catch {
      error('Network error saving navigation item');
    } finally {
      setSaving(false);
    }
  };

  const handleToggleEnable = async (item: NavigationItem) => {
    try {
      const res = await fetch(`/api/v1/content/navigation/${item.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ isEnabled: !item.isEnabled }),
      });
      const json = await res.json();
      if (json.success) {
        success(item.isEnabled ? 'Link hidden' : 'Link shown');
        setNavItems((prev) =>
          prev.map((i) => (i.id === item.id ? { ...i, isEnabled: !item.isEnabled } : i))
        );
      }
    } catch {
      error('Failed to toggle visibility');
    }
  };

  const handleConfirmDelete = async () => {
    try {
      const res = await fetch(`/api/v1/content/navigation/${confirmDelete.id}`, { method: 'DELETE' });
      const json = await res.json();
      if (json.success) {
        success('Navigation item deleted');
        setNavItems((prev) => prev.filter((i) => i.id !== confirmDelete.id));
      } else {
        error(json.error || 'Failed to delete navigation item');
      }
    } catch {
      error('Error deleting navigation item');
    }
  };

  const currentItems = navItems
    .filter((i) => i.location === locationTab)
    .sort((a, b) => a.displayOrder - b.displayOrder);

  return (
    <div className="space-y-6">
      <AdminBreadcrumb items={[{ label: 'Navigation Menus' }]} />

      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/5 pb-4">
        <div>
          <h1 className="text-2xl font-bold text-white tracking-tight">
            Navigation Hierarchy & Menu Manager
          </h1>
          <p className="text-xs text-slate-400">
            Control links in public website header and footer menus.
          </p>
        </div>

        <Button size="sm" variant="primary" onClick={handleNewItem} leftIcon={<Plus className="w-4 h-4" />}>
          Add Menu Item
        </Button>
      </div>

      {/* Tabs: Header vs Footer */}
      <div className="flex border-b border-white/10 gap-2">
        <button
          type="button"
          onClick={() => setLocationTab('header')}
          className={`px-4 py-2 text-xs font-mono font-medium border-b-2 transition-all ${
            locationTab === 'header'
              ? 'border-[#00F2FE] text-[#00F2FE]'
              : 'border-transparent text-slate-400 hover:text-white'
          }`}
        >
          Header Menu ({navItems.filter((i) => i.location === 'header').length})
        </button>
        <button
          type="button"
          onClick={() => setLocationTab('footer')}
          className={`px-4 py-2 text-xs font-mono font-medium border-b-2 transition-all ${
            locationTab === 'footer'
              ? 'border-[#00F2FE] text-[#00F2FE]'
              : 'border-transparent text-slate-400 hover:text-white'
          }`}
        >
          Footer Menu ({navItems.filter((i) => i.location === 'footer').length})
        </button>
      </div>

      {/* List */}
      {loading ? (
        <div className="py-20 text-center text-slate-500 font-mono text-xs">
          Loading navigation items from database...
        </div>
      ) : currentItems.length === 0 ? (
        <div className="py-20 text-center border border-dashed border-white/10 rounded-2xl space-y-3 bg-[#0A0E17]/20">
          <Navigation className="w-10 h-10 text-slate-600 mx-auto" />
          <h3 className="text-sm font-bold text-white">No items in this menu</h3>
          <Button size="sm" variant="primary" onClick={handleNewItem}>
            Add First Link
          </Button>
        </div>
      ) : (
        <div className="space-y-2.5">
          {currentItems.map((item) => (
            <div
              key={item.id}
              className={`p-4 rounded-xl border flex items-center justify-between gap-4 transition-all bg-[#0A0E17]/40 ${
                item.isEnabled ? 'border-white/10 hover:border-white/20' : 'border-white/5 opacity-50'
              }`}
            >
              <div className="flex items-center gap-3 min-w-0">
                <span className="font-mono text-xs text-slate-500 w-6">#{item.displayOrder}</span>
                <div className="min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-bold text-white truncate">{item.label}</span>
                    {item.isExternal && <Badge variant="neutral" size="sm">EXTERNAL</Badge>}
                    {!item.isEnabled && <Badge variant="rose" size="sm">HIDDEN</Badge>}
                  </div>
                  <span className="font-mono text-xs text-[#00F2FE] block truncate">{item.path}</span>
                </div>
              </div>

              <div className="flex items-center gap-2 shrink-0">
                <button
                  type="button"
                  onClick={() => handleToggleEnable(item)}
                  className="p-1.5 text-slate-400 hover:text-white"
                  title={item.isEnabled ? 'Hide from menu' : 'Show in menu'}
                >
                  {item.isEnabled ? <Eye className="w-4 h-4 text-[#10B981]" /> : <EyeOff className="w-4 h-4" />}
                </button>

                <Button size="sm" variant="ghost" onClick={() => handleEditItem(item)} leftIcon={<Edit3 className="w-3.5 h-3.5" />}>
                  Edit
                </Button>

                <button
                  type="button"
                  onClick={() => setConfirmDelete({ open: true, id: item.id, label: item.label })}
                  className="p-1.5 text-slate-500 hover:text-[#F43F5E]"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Confirm Delete */}
      <ConfirmModal
        isOpen={confirmDelete.open}
        onClose={() => setConfirmDelete((prev) => ({ ...prev, open: false }))}
        onConfirm={handleConfirmDelete}
        title="Delete Navigation Item"
        message={`Are you sure you want to delete "${confirmDelete.label}" from the navigation menu?`}
        confirmLabel="Delete Item"
        variant="danger"
      />

      {/* Editor Modal */}
      {editorOpen && editingItem && (
        <div role="dialog" aria-modal="true" className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-sm animate-in fade-in">
          <div className="relative w-full max-w-md bg-[#0A0E17] border border-white/10 rounded-2xl shadow-2xl p-6 space-y-4">
            <div className="flex items-center justify-between border-b border-white/5 pb-3">
              <h2 className="text-base font-bold text-white tracking-tight flex items-center gap-2">
                <Navigation className="w-4 h-4 text-[#00F2FE]" />
                <span>{editingItem.id ? 'Edit Menu Item' : 'Add Menu Item'}</span>
              </h2>
              <button type="button" onClick={() => setEditorOpen(false)} className="text-slate-400 hover:text-white p-1">
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSaveItem} noValidate className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-xs font-mono text-slate-300">Navigation Label *</label>
                <input
                  type="text"
                  required
                  value={editingItem.label || ''}
                  onChange={(e) => setEditingItem((prev) => (prev ? { ...prev, label: e.target.value } : null))}
                  placeholder="e.g. Case Studies"
                  className="w-full px-3.5 py-2 bg-[#05070B] border border-white/10 rounded-lg text-xs text-white focus:outline-none focus:border-[#00F2FE]"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-mono text-slate-300">Destination Path / URL *</label>
                <input
                  type="text"
                  required
                  value={editingItem.path || ''}
                  onChange={(e) => setEditingItem((prev) => (prev ? { ...prev, path: e.target.value } : null))}
                  placeholder="/projects"
                  className="w-full px-3.5 py-2 bg-[#05070B] border border-white/10 rounded-lg text-xs font-mono text-white focus:outline-none focus:border-[#00F2FE]"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <label className="text-xs font-mono text-slate-300">Menu Location</label>
                  <select
                    value={editingItem.location || 'header'}
                    onChange={(e) => setEditingItem((prev) => (prev ? { ...prev, location: e.target.value } : null))}
                    className="w-full px-3 py-1.5 bg-[#05070B] border border-white/10 rounded-lg text-xs text-slate-300 focus:outline-none focus:border-[#00F2FE]"
                  >
                    <option value="header">Header Menu</option>
                    <option value="footer">Footer Menu</option>
                  </select>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-mono text-slate-300">Display Order</label>
                  <input
                    type="number"
                    value={editingItem.displayOrder || 1}
                    onChange={(e) => setEditingItem((prev) => (prev ? { ...prev, displayOrder: parseInt(e.target.value) || 1 } : null))}
                    className="w-full px-3 py-1.5 bg-[#05070B] border border-white/10 rounded-lg text-xs text-white focus:outline-none focus:border-[#00F2FE]"
                  />
                </div>
              </div>

              <div className="flex items-center gap-6 pt-2">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={editingItem.isExternal || false}
                    onChange={(e) => setEditingItem((prev) => (prev ? { ...prev, isExternal: e.target.checked } : null))}
                    className="w-4 h-4 rounded bg-[#05070B] border-white/10 text-[#00F2FE] focus:ring-0"
                  />
                  <span className="text-xs text-white">Opens in New Tab</span>
                </label>

                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={editingItem.isEnabled !== false}
                    onChange={(e) => setEditingItem((prev) => (prev ? { ...prev, isEnabled: e.target.checked } : null))}
                    className="w-4 h-4 rounded bg-[#05070B] border-white/10 text-[#00F2FE] focus:ring-0"
                  />
                  <span className="text-xs text-white">Active</span>
                </label>
              </div>

              <div className="pt-4 border-t border-white/5 flex items-center justify-between">
                <Button type="button" variant="ghost" size="sm" onClick={() => setEditorOpen(false)}>
                  Cancel
                </Button>
                <Button type="submit" variant="primary" size="sm" isLoading={saving} leftIcon={<Save className="w-3.5 h-3.5" />}>
                  Save Link
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
