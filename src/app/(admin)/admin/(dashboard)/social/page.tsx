'use client';

import React, { useState, useEffect } from 'react';
import { AdminBreadcrumb } from '@/components/admin/AdminBreadcrumb';
import { ConfirmModal } from '@/components/admin/ConfirmModal';
import { useAdminToast } from '@/components/admin/AdminToast';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import {
  Share2,
  Plus,
  Edit3,
  Trash2,
  Check,
  X,
  Save,
  ExternalLink,
  Eye,
  EyeOff,
} from 'lucide-react';

interface SocialLinkItem {
  id: string;
  platform: string;
  url: string;
  displayOrder: number;
  isEnabled: boolean;
}

export default function AdminSocialPage() {
  const { success, error } = useAdminToast();
  const [links, setLinks] = useState<SocialLinkItem[]>([]);
  const [loading, setLoading] = useState(true);

  // Editor modal
  const [editorOpen, setEditorOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<Partial<SocialLinkItem> | null>(null);
  const [saving, setSaving] = useState(false);

  // Delete modal
  const [confirmDelete, setConfirmDelete] = useState<{ open: boolean; id: string; platform: string }>({
    open: false,
    id: '',
    platform: '',
  });

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/v1/content/social-links?all=true');
      const json = await res.json();
      if (json.success && json.data) {
        setLinks(json.data || []);
      }
    } catch {
      error('Failed to load social links');
    } finally {
      setLoading(false);
    }
  };

  const handleNewItem = () => {
    setEditingItem({
      platform: '',
      url: 'https://',
      displayOrder: links.length + 1,
      isEnabled: true,
    });
    setEditorOpen(true);
  };

  const handleEditItem = (item: SocialLinkItem) => {
    setEditingItem({ ...item });
    setEditorOpen(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingItem?.platform || !editingItem?.url) {
      error('Platform name and destination URL are required.');
      return;
    }

    setSaving(true);
    try {
      const isUpdating = Boolean(editingItem.id);
      const url = '/api/v1/content/social-links';
      const method = isUpdating ? 'PUT' : 'POST';

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(editingItem),
      });

      const json = await res.json();
      if (json.success) {
        success(isUpdating ? 'Social link updated' : 'Social link created');
        setEditorOpen(false);
        setEditingItem(null);
        loadData();
      } else {
        error(json.error?.message || json.error || 'Failed to save social link');
      }
    } catch {
      error('An error occurred while saving.');
    } finally {
      setSaving(false);
    }
  };

  const handleToggleActive = async (item: SocialLinkItem) => {
    try {
      const res = await fetch('/api/v1/content/social-links', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: item.id, isEnabled: !item.isEnabled }),
      });
      const json = await res.json();
      if (json.success) {
        success(`${item.platform} link ${!item.isEnabled ? 'enabled' : 'disabled'}`);
        loadData();
      }
    } catch {
      error('Failed to toggle status');
    }
  };

  const handleDelete = async () => {
    try {
      const res = await fetch(`/api/v1/content/social-links?id=${confirmDelete.id}`, {
        method: 'DELETE',
      });
      const json = await res.json();
      if (json.success) {
        success('Social link deleted');
        setConfirmDelete({ open: false, id: '', platform: '' });
        loadData();
      }
    } catch {
      error('Failed to delete social link');
    }
  };

  return (
    <div className="space-y-6">
      <AdminBreadcrumb items={[{ label: 'Social Links' }]} />

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/5 pb-4">
        <div>
          <h1 className="text-2xl font-bold text-white tracking-tight flex items-center gap-2.5">
            <Share2 className="w-6 h-6 text-[#00F2FE]" />
            <span>Official Social Links & Channels</span>
          </h1>
          <p className="text-xs text-slate-400">
            Authoritative company social presence. Changes update the Header, Footer, Contact page, and Guides.
          </p>
        </div>
        <Button onClick={handleNewItem} variant="primary" size="sm" className="gap-2 shrink-0">
          <Plus className="w-4 h-4" />
          <span>Add Channel</span>
        </Button>
      </div>

      {/* Content Table */}
      {loading ? (
        <div className="py-20 text-center text-slate-500 font-mono text-xs">
          Querying social links from database...
        </div>
      ) : links.length === 0 ? (
        <div className="glass-panel p-12 text-center rounded-2xl border border-white/10 bg-[#0A0E17]/40 space-y-3">
          <Share2 className="w-8 h-8 text-slate-600 mx-auto" />
          <p className="text-slate-400 text-sm">No social links configured.</p>
          <Button onClick={handleNewItem} variant="outline" size="sm" className="gap-2">
            <Plus className="w-4 h-4" />
            <span>Add First Social Link</span>
          </Button>
        </div>
      ) : (
        <div className="glass-panel rounded-2xl border border-white/10 bg-[#0A0E17]/40 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-300">
              <thead className="bg-white/5 text-slate-400 font-mono uppercase text-[10px] tracking-wider border-b border-white/10">
                <tr>
                  <th className="py-3 px-4 w-16 text-center">Order</th>
                  <th className="py-3 px-4">Platform</th>
                  <th className="py-3 px-4">Destination URL</th>
                  <th className="py-3 px-4 text-center">Status</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5 font-sans">
                {links.map((link) => (
                  <tr key={link.id} className="hover:bg-white/[0.02] transition-colors">
                    <td className="py-3 px-4 text-center font-mono text-slate-500">
                      {link.displayOrder}
                    </td>
                    <td className="py-3 px-4 font-semibold text-white">
                      {link.platform}
                    </td>
                    <td className="py-3 px-4 max-w-md truncate font-mono text-[11px] text-slate-400">
                      <a
                        href={link.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-[#00F2FE] hover:underline flex items-center gap-1.5"
                      >
                        <span className="truncate">{link.url}</span>
                        <ExternalLink className="w-3 h-3 shrink-0 opacity-60" />
                      </a>
                    </td>
                    <td className="py-3 px-4 text-center">
                      <Badge variant={link.isEnabled ? 'emerald' : 'neutral'}>
                        {link.isEnabled ? 'Active' : 'Disabled'}
                      </Badge>
                    </td>
                    <td className="py-3 px-4 text-right space-x-1 whitespace-nowrap">
                      <button
                        onClick={() => handleToggleActive(link)}
                        title={link.isEnabled ? 'Disable' : 'Enable'}
                        className="p-1.5 rounded-lg hover:bg-white/10 text-slate-400 hover:text-white transition-colors"
                      >
                        {link.isEnabled ? <Eye className="w-3.5 h-3.5" /> : <EyeOff className="w-3.5 h-3.5" />}
                      </button>
                      <button
                        onClick={() => handleEditItem(link)}
                        title="Edit"
                        className="p-1.5 rounded-lg hover:bg-white/10 text-slate-400 hover:text-[#00F2FE] transition-colors"
                      >
                        <Edit3 className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => setConfirmDelete({ open: true, id: link.id, platform: link.platform })}
                        title="Delete"
                        className="p-1.5 rounded-lg hover:bg-white/10 text-slate-400 hover:text-rose-400 transition-colors"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Edit/Create Modal */}
      {editorOpen && editingItem && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#0D121F] border border-white/10 rounded-2xl w-full max-w-lg p-6 space-y-6 shadow-2xl">
            <div className="flex items-center justify-between border-b border-white/10 pb-4">
              <h2 className="text-lg font-bold text-white flex items-center gap-2">
                <Share2 className="w-5 h-5 text-[#00F2FE]" />
                <span>{editingItem.id ? 'Edit Social Channel' : 'Add Official Social Channel'}</span>
              </h2>
              <button
                onClick={() => setEditorOpen(false)}
                className="text-slate-400 hover:text-white transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSave} noValidate className="space-y-4">
              <div>
                <label className="block text-xs font-mono text-slate-400 uppercase tracking-wider mb-1">
                  Platform Name
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g., Instagram, GitHub, LinkedIn"
                  value={editingItem.platform || ''}
                  onChange={(e) => setEditingItem({ ...editingItem, platform: e.target.value })}
                  className="w-full px-3 py-2 rounded-lg bg-black/40 border border-white/10 text-white font-sans text-xs focus:outline-none focus:border-[#00F2FE]"
                />
              </div>

              <div>
                <label className="block text-xs font-mono text-slate-400 uppercase tracking-wider mb-1">
                  Destination URL
                </label>
                <input
                  type="url"
                  required
                  placeholder="https://..."
                  value={editingItem.url || ''}
                  onChange={(e) => setEditingItem({ ...editingItem, url: e.target.value })}
                  className="w-full px-3 py-2 rounded-lg bg-black/40 border border-white/10 text-white font-mono text-xs focus:outline-none focus:border-[#00F2FE]"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-mono text-slate-400 uppercase tracking-wider mb-1">
                    Display Order
                  </label>
                  <input
                    type="number"
                    min="1"
                    value={editingItem.displayOrder ?? 1}
                    onChange={(e) =>
                      setEditingItem({ ...editingItem, displayOrder: parseInt(e.target.value, 10) || 1 })
                    }
                    className="w-full px-3 py-2 rounded-lg bg-black/40 border border-white/10 text-white font-mono text-xs focus:outline-none focus:border-[#00F2FE]"
                  />
                </div>
                <div>
                  <label className="block text-xs font-mono text-slate-400 uppercase tracking-wider mb-1">
                    Active Status
                  </label>
                  <div className="pt-1.5">
                    <label className="inline-flex items-center gap-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={editingItem.isEnabled ?? true}
                        onChange={(e) => setEditingItem({ ...editingItem, isEnabled: e.target.checked })}
                        className="rounded border-white/20 text-[#00F2FE] focus:ring-[#00F2FE] bg-black/40"
                      />
                      <span className="text-xs text-slate-300 font-medium">Visible on Public Site</span>
                    </label>
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-end gap-3 pt-4 border-t border-white/10">
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => setEditorOpen(false)}
                  disabled={saving}
                >
                  Cancel
                </Button>
                <Button type="submit" variant="primary" size="sm" disabled={saving} className="gap-1.5">
                  <Save className="w-4 h-4" />
                  <span>{saving ? 'Saving...' : 'Save Channel'}</span>
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation */}
      <ConfirmModal
        isOpen={confirmDelete.open}
        title="Delete Social Channel"
        message={`Are you sure you want to remove ${confirmDelete.platform}? This will remove it from the public header, footer, and contact sections.`}
        confirmLabel="Delete Channel"
        variant="danger"
        onConfirm={handleDelete}
        onClose={() => setConfirmDelete({ open: false, id: '', platform: '' })}
      />
    </div>
  );
}
