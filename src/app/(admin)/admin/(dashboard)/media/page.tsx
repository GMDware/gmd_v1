'use client';

import React, { useState, useEffect } from 'react';
import { AdminBreadcrumb } from '@/components/admin/AdminBreadcrumb';
import { ConfirmModal } from '@/components/admin/ConfirmModal';
import { useAdminToast } from '@/components/admin/AdminToast';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import {
  ImageIcon,
  Upload,
  Search,
  Trash2,
  Copy,
  Check,
  X,
  ExternalLink,
  Calendar,
  HardDrive,
  FileCode,
} from 'lucide-react';

interface MediaAsset {
  id: string;
  filename: string;
  originalName: string;
  mimeType: string;
  size: number;
  width?: number | null;
  height?: number | null;
  url: string;
  blurDataUrl?: string | null;
  altText?: string | null;
  createdAt: string;
}

export default function AdminMediaPage() {
  const { success, error } = useAdminToast();
  const [assets, setAssets] = useState<MediaAsset[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [search, setSearch] = useState('');

  // Asset detail modal
  const [selectedAsset, setSelectedAsset] = useState<MediaAsset | null>(null);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [storageStatus, setStorageStatus] = useState<{
    uploadsEnabled: boolean;
    provider?: string;
    message?: string;
  }>({ uploadsEnabled: true });

  // Confirm delete modal
  const [confirmDelete, setConfirmDelete] = useState<{ open: boolean; id: string; name: string }>({
    open: false,
    id: '',
    name: '',
  });

  useEffect(() => {
    loadMedia();
  }, []);

  const loadMedia = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/v1/media');
      const json = await res.json();
      if (json.meta?.storage) {
        setStorageStatus(json.meta.storage);
      }
      if (json.success && json.data) {
        const raw = Array.isArray(json.data)
          ? json.data
          : (json.data.assets || json.data.items || []);
        const mapped = raw.map((a: any) => ({
          ...a,
          url: a.url || a.storageUrl,
          size: a.size ?? a.sizeBytes ?? 0,
          filename: a.filename || a.fileName || a.originalName,
        }));
        setAssets(mapped);
      }
    } catch {
      error('Failed to load media catalog');
    } finally {
      setLoading(false);
    }
  };

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!storageStatus.uploadsEnabled) {
      error(
        storageStatus.message ||
          'Media uploads are temporarily disabled because persistent Cloudflare R2 storage is not yet configured for this deployment.'
      );
      if (e.target) e.target.value = '';
      return;
    }

    if (file.size > 10 * 1024 * 1024) {
      error('File exceeds maximum allowable size of 10MB');
      return;
    }

    setUploading(true);
    try {
      const formData = new FormData();
      formData.append('file', file);

      const res = await fetch('/api/v1/media/upload', {
        method: 'POST',
        body: formData,
      });

      const json = await res.json();
      if (json.success && json.data) {
        success('Asset uploaded successfully');
        setAssets((prev) => [json.data, ...prev]);
        setSelectedAsset(json.data);
      } else {
        const errorMsg =
          json.error?.message || (typeof json.error === 'string' ? json.error : 'Upload failed');
        error(errorMsg);
      }
    } catch {
      error('Network error during upload');
    } finally {
      setUploading(false);
      if (e.target) e.target.value = '';
    }
  };

  const handleCopyUrl = (url: string, id: string) => {
    navigator.clipboard.writeText(url);
    setCopiedId(id);
    success('Storage URL copied to clipboard');
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleConfirmDelete = async () => {
    try {
      const res = await fetch(`/api/v1/media/${confirmDelete.id}`, { method: 'DELETE' });
      const json = await res.json();
      if (json.success) {
        success('Asset soft-deleted from storage');
        setAssets((prev) => prev.filter((a) => a.id !== confirmDelete.id));
        if (selectedAsset?.id === confirmDelete.id) {
          setSelectedAsset(null);
        }
      } else {
        error(json.error || 'Failed to delete asset');
      }
    } catch {
      error('Error deleting asset');
    }
  };

  const filteredAssets = assets.filter(
    (a) =>
      a.originalName.toLowerCase().includes(search.toLowerCase()) ||
      a.filename.toLowerCase().includes(search.toLowerCase()) ||
      (a.altText && a.altText.toLowerCase().includes(search.toLowerCase()))
  );

  return (
    <div className="space-y-6">
      <AdminBreadcrumb items={[{ label: 'Media Library' }]} />

      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/5 pb-4">
        <div>
          <h1 className="text-2xl font-bold text-white tracking-tight">
            Media Storage & Asset Catalog
          </h1>
          <p className="text-xs text-slate-400">
            Secure asset repository with magic-byte binary validation, WebP compression, and metadata extraction.
          </p>
        </div>

        <label
          className={
            storageStatus.uploadsEnabled
              ? 'cursor-pointer'
              : 'cursor-not-allowed opacity-60'
          }
          title={
            !storageStatus.uploadsEnabled
              ? storageStatus.message || 'Media uploads are disabled until Cloudflare R2 is configured.'
              : undefined
          }
        >
          <input
            type="file"
            accept="image/jpeg,image/png,image/webp,image/svg+xml,image/avif,application/pdf"
            onChange={handleUpload}
            disabled={uploading || !storageStatus.uploadsEnabled}
            className="hidden"
          />
          <Button
            type="button"
            variant="primary"
            size="sm"
            isLoading={uploading}
            disabled={!storageStatus.uploadsEnabled}
            leftIcon={<Upload className="w-4 h-4" />}
            className="pointer-events-none"
          >
            {storageStatus.uploadsEnabled ? 'Upload Media' : 'Uploads Paused'}
          </Button>
        </label>
      </div>

      {!storageStatus.uploadsEnabled && (
        <div className="flex items-center gap-3 p-3 bg-amber-500/10 border border-amber-500/20 rounded-xl text-xs text-amber-300">
          <HardDrive className="w-4 h-4 flex-shrink-0 text-amber-400" />
          <span>
            {storageStatus.message ||
              'Persistent cloud storage (Cloudflare R2) is not yet configured for this deployment. Uploads are paused to prevent ephemeral data loss. Existing media assets remain fully accessible.'}
          </span>
        </div>
      )}

      {/* Search Toolbar */}
      <div className="flex items-center justify-between gap-3 bg-[#0A0E17]/60 p-3 rounded-xl border border-white/5">
        <div className="relative flex-1 max-w-md">
          <Search className="w-3.5 h-3.5 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search assets by filename or alt text..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-8 pr-3 py-1.5 bg-[#05070B] border border-white/10 rounded-lg text-xs text-white focus:outline-none focus:border-[#00F2FE]"
          />
        </div>

        <span className="font-mono text-xs text-slate-400">
          {assets.length} Assets Registered
        </span>
      </div>

      {/* Media Grid */}
      {loading ? (
        <div className="py-20 text-center text-slate-500 font-mono text-xs">
          Loading asset repository...
        </div>
      ) : filteredAssets.length === 0 ? (
        <div className="py-20 text-center border border-dashed border-white/10 rounded-2xl space-y-3 bg-[#0A0E17]/20">
          <ImageIcon className="w-10 h-10 text-slate-600 mx-auto" />
          <h3 className="text-sm font-bold text-white">No media assets found</h3>
          <p className="text-xs text-slate-400">
            Upload images or diagrams to attach them to case studies, services, and team profiles.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
          {filteredAssets.map((asset) => (
            <div
              key={asset.id}
              onClick={() => setSelectedAsset(asset)}
              className="glass-panel group rounded-xl border border-white/10 hover:border-[#00F2FE]/50 overflow-hidden cursor-pointer transition-all bg-[#0A0E17]/50 flex flex-col justify-between"
            >
              {/* Image Preview Container */}
              <div className="aspect-video bg-[#05070B] relative flex items-center justify-center overflow-hidden">
                {asset.url ? (
                  <img
                    src={asset.url}
                    alt={asset.altText || asset.originalName}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                ) : (
                  <FileCode className="w-8 h-8 text-slate-600" />
                )}
              </div>

              {/* Asset Meta Strip */}
              <div className="p-2.5 space-y-1">
                <span className="text-xs font-bold text-white truncate block">
                  {asset.originalName}
                </span>
                <div className="flex items-center justify-between text-[10px] font-mono text-slate-400">
                  <span>{(asset.size / 1024).toFixed(0)} KB</span>
                  <span className="text-[#00F2FE] uppercase">{asset.mimeType.split('/')[1]}</span>
                </div>
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
        title="Delete Media Asset"
        message={`Are you sure you want to soft-delete "${confirmDelete.name}"?`}
        confirmLabel="Delete Asset"
        variant="danger"
      />

      {/* Asset Detail Drawer / Modal */}
      {selectedAsset && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-sm animate-in fade-in"
        >
          <div className="relative w-full max-w-lg bg-[#0A0E17] border border-white/10 rounded-2xl shadow-2xl p-6 space-y-5">
            <div className="flex items-center justify-between border-b border-white/5 pb-3">
              <h2 className="text-sm font-bold text-white tracking-tight flex items-center gap-2 truncate">
                <ImageIcon className="w-4 h-4 text-[#00F2FE]" />
                <span className="truncate">{selectedAsset.originalName}</span>
              </h2>
              <button
                type="button"
                onClick={() => setSelectedAsset(null)}
                className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-white/5"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Large Preview */}
            <div className="aspect-video w-full rounded-xl bg-[#05070B] border border-white/10 overflow-hidden flex items-center justify-center">
              {selectedAsset.url && (
                <img
                  src={selectedAsset.url}
                  alt={selectedAsset.altText || selectedAsset.originalName}
                  className="w-full h-full object-contain"
                />
              )}
            </div>

            {/* Metadata Grid */}
            <div className="grid grid-cols-2 gap-3 p-3.5 rounded-xl bg-[#05070B] border border-white/5 text-xs font-mono">
              <div>
                <span className="text-slate-500 text-[10px] block">MIME TYPE</span>
                <span className="text-white">{selectedAsset.mimeType}</span>
              </div>
              <div>
                <span className="text-slate-500 text-[10px] block">FILE SIZE</span>
                <span className="text-white">{(selectedAsset.size / 1024).toFixed(1)} KB</span>
              </div>
              <div>
                <span className="text-slate-500 text-[10px] block">DIMENSIONS</span>
                <span className="text-white">
                  {selectedAsset.width && selectedAsset.height
                    ? `${selectedAsset.width} × ${selectedAsset.height} px`
                    : 'Scalable Vector'}
                </span>
              </div>
              <div>
                <span className="text-slate-500 text-[10px] block">UPLOADED</span>
                <span className="text-white">{new Date(selectedAsset.createdAt).toLocaleDateString()}</span>
              </div>
            </div>

            {/* Storage URL Copy */}
            <div className="space-y-1.5">
              <span className="text-xs font-mono text-slate-300 block">CDN Storage URL</span>
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  readOnly
                  value={selectedAsset.url}
                  className="w-full px-3 py-1.5 bg-[#05070B] border border-white/10 rounded-lg text-xs font-mono text-slate-300 focus:outline-none"
                />
                <Button
                  type="button"
                  size="sm"
                  variant="secondary"
                  onClick={() => handleCopyUrl(selectedAsset.url, selectedAsset.id)}
                  leftIcon={
                    copiedId === selectedAsset.id ? (
                      <Check className="w-3.5 h-3.5 text-[#10B981]" />
                    ) : (
                      <Copy className="w-3.5 h-3.5" />
                    )
                  }
                >
                  {copiedId === selectedAsset.id ? 'Copied' : 'Copy'}
                </Button>
              </div>
            </div>

            {/* Action buttons */}
            <div className="pt-3 border-t border-white/5 flex items-center justify-between">
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={() =>
                  setConfirmDelete({
                    open: true,
                    id: selectedAsset.id,
                    name: selectedAsset.originalName,
                  })
                }
                className="text-[#F43F5E] hover:text-[#F43F5E]"
                leftIcon={<Trash2 className="w-3.5 h-3.5" />}
              >
                Delete Asset
              </Button>

              <Button type="button" variant="primary" size="sm" onClick={() => setSelectedAsset(null)}>
                Done
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
