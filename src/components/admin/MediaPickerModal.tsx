'use client';

import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { Upload, Image as ImageIcon, Check, X, Search, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/Button';

export interface MediaAsset {
  id: string;
  filename: string;
  originalName: string;
  mimeType: string;
  size: number;
  url: string;
  storageUrl?: string;
  blurDataUrl?: string | null;
  altText?: string | null;
}

interface MediaPickerModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelect: (asset: MediaAsset) => void;
  selectedId?: string;
}

export const MediaPickerModal: React.FC<MediaPickerModalProps> = ({
  isOpen,
  onClose,
  onSelect,
  selectedId,
}) => {
  const [mounted, setMounted] = useState(false);
  const [assets, setAssets] = useState<MediaAsset[]>([]);
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [search, setSearch] = useState('');
  const [selectedAsset, setSelectedAsset] = useState<MediaAsset | null>(null);
  const [errorMessage, setErrorMessage] = useState('');
  const [storageStatus, setStorageStatus] = useState<{
    uploadsEnabled: boolean;
    provider?: string;
    message?: string;
  }>({ uploadsEnabled: true });

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (isOpen) {
      fetchMedia();
    }
  }, [isOpen]);

  // Accessibility: close on Escape key press
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen && !uploading) {
        onClose();
      }
    };
    if (isOpen) {
      window.addEventListener('keydown', handleKeyDown);
    }
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, uploading, onClose]);

  const normalizeAsset = (a: any): MediaAsset => {
    const resolvedUrl = a.url || a.storageUrl || '';
    return {
      id: a.id,
      filename: a.filename || a.fileName || a.originalName || 'media_asset',
      originalName: a.originalName || a.fileName || a.filename || 'media_asset',
      mimeType: a.mimeType || 'image/jpeg',
      size: a.size ?? a.sizeBytes ?? 0,
      url: resolvedUrl,
      storageUrl: a.storageUrl || a.url || '',
      blurDataUrl: a.blurDataUrl || null,
      altText: a.altText || null,
    };
  };

  const fetchMedia = async () => {
    setLoading(true);
    setErrorMessage('');
    try {
      const res = await fetch('/api/v1/media');
      const json = await res.json();
      if (json.meta?.storage) {
        setStorageStatus(json.meta.storage);
      }
      if (json.success && json.data) {
        const rawList = Array.isArray(json.data)
          ? json.data
          : json.data.assets || json.data.items || [];
        const normalized = rawList.map(normalizeAsset);
        setAssets(normalized);
        if (selectedId) {
          const match = normalized.find((a: MediaAsset) => a.id === selectedId);
          if (match) setSelectedAsset(match);
        }
      }
    } catch {
      setErrorMessage('Failed to load media assets');
    } finally {
      setLoading(false);
    }
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!storageStatus.uploadsEnabled) {
      setErrorMessage(
        storageStatus.message ||
          'Media uploads are temporarily disabled because persistent Cloudflare R2 storage is not yet configured for this deployment.'
      );
      if (e.target) e.target.value = '';
      return;
    }

    if (file.size > 10 * 1024 * 1024) {
      setErrorMessage('File exceeds maximum allowable size of 10MB');
      return;
    }

    setUploading(true);
    setErrorMessage('');

    try {
      const formData = new FormData();
      formData.append('file', file);

      const res = await fetch('/api/v1/media/upload', {
        method: 'POST',
        body: formData,
      });

      const json = await res.json();
      if (json.success && json.data) {
        const uploaded = normalizeAsset(json.data);
        setAssets((prev) => [uploaded, ...prev]);
        setSelectedAsset(uploaded);
      } else {
        const errorMsg =
          json.error?.message || (typeof json.error === 'string' ? json.error : 'Upload failed');
        setErrorMessage(errorMsg);
      }
    } catch {
      setErrorMessage('Network error during file upload');
    } finally {
      setUploading(false);
      if (e.target) e.target.value = '';
    }
  };

  if (!isOpen || !mounted) return null;

  const filteredAssets = assets.filter(
    (a) =>
      a.originalName.toLowerCase().includes(search.toLowerCase()) ||
      (a.altText && a.altText.toLowerCase().includes(search.toLowerCase()))
  );

  const modalContent = (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="media-picker-title"
      className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-in fade-in"
      onClick={(e) => {
        // Backdrop click to close
        if (e.target === e.currentTarget && !uploading) {
          onClose();
        }
      }}
    >
      <div
        className="relative w-full max-w-4xl bg-[#0A0E17] border border-white/10 rounded-2xl p-6 shadow-2xl flex flex-col max-h-[85vh] space-y-6"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between border-b border-white/5 pb-4">
          <div>
            <h3 id="media-picker-title" className="text-lg font-bold text-white tracking-tight flex items-center gap-2">
              <ImageIcon className="w-5 h-5 text-[#00F2FE]" />
              <span>Select Media Asset</span>
            </h3>
            <p className="text-xs text-slate-400">Choose from media catalog or upload an image (max 10MB).</p>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-white/5 transition-colors"
            aria-label="Close media selector"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Toolbar: Search and Upload */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search assets by name..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-9 pr-4 py-2 bg-[#05070B] border border-white/10 rounded-lg text-xs text-white placeholder-slate-500 focus:outline-none focus:border-[#00F2FE]"
            />
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
              accept="image/jpeg,image/png,image/webp,image/svg+xml,image/avif"
              onChange={handleFileUpload}
              disabled={uploading || !storageStatus.uploadsEnabled}
              className="hidden"
            />
            <Button
              type="button"
              variant="secondary"
              size="sm"
              isLoading={uploading}
              disabled={!storageStatus.uploadsEnabled}
              leftIcon={<Upload className="w-3.5 h-3.5" />}
              className="w-full sm:w-auto pointer-events-none"
            >
              {storageStatus.uploadsEnabled ? 'Upload Asset' : 'Uploads Paused'}
            </Button>
          </label>
        </div>

        {errorMessage && (
          <div className="p-3 bg-[#1C0A0E] border border-[#F43F5E]/30 rounded-lg text-xs text-[#F43F5E]">
            {errorMessage}
          </div>
        )}

        {/* Asset Grid */}
        <div className="flex-1 overflow-y-auto pr-1">
          {loading ? (
            <div className="py-16 flex flex-col items-center justify-center text-slate-500 space-y-2">
              <Loader2 className="w-6 h-6 animate-spin text-[#00F2FE]" />
              <span className="text-xs font-mono">Loading media catalog...</span>
            </div>
          ) : filteredAssets.length === 0 ? (
            <div className="py-16 text-center text-slate-500 space-y-2 border border-dashed border-white/10 rounded-xl">
              <ImageIcon className="w-8 h-8 mx-auto text-slate-600" />
              <p className="text-xs">No media assets found.</p>
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
              {filteredAssets.map((asset) => {
                const isSelected = selectedAsset?.id === asset.id;
                const displayUrl = asset.url || asset.storageUrl;

                return (
                  <button
                    key={asset.id}
                    type="button"
                    onClick={() => setSelectedAsset(asset)}
                    className={`relative group rounded-xl overflow-hidden border text-left transition-all aspect-video bg-[#05070B] flex flex-col justify-end p-2 cursor-pointer ${
                      isSelected
                        ? 'border-[#00F2FE] ring-2 ring-[#00F2FE]/30'
                        : 'border-white/10 hover:border-white/30'
                    }`}
                  >
                    {/* Background image preview */}
                    {displayUrl && (
                      <img
                        src={displayUrl}
                        alt={asset.altText || asset.originalName}
                        className="absolute inset-0 w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-opacity"
                      />
                    )}

                    {/* Gradient overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent pointer-events-none" />

                    {/* Selected badge */}
                    {isSelected && (
                      <div className="absolute top-2 right-2 w-5 h-5 rounded-full bg-[#00F2FE] text-[#05070B] flex items-center justify-center shadow-lg">
                        <Check className="w-3.5 h-3.5 stroke-[3]" />
                      </div>
                    )}

                    {/* Meta label */}
                    <div className="relative z-10">
                      <span className="text-[10px] font-mono text-white truncate block">
                        {asset.originalName}
                      </span>
                      <span className="text-[9px] text-slate-400 font-mono">
                        {asset.size ? (asset.size / 1024).toFixed(0) : '0'} KB
                      </span>
                    </div>
                  </button>
                );
              })}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between border-t border-white/5 pt-4">
          <div className="text-xs text-slate-400 truncate max-w-sm">
            {selectedAsset ? (
              <span>
                Selected: <strong className="text-white">{selectedAsset.originalName}</strong>
              </span>
            ) : (
              <span>Select an asset to continue</span>
            )}
          </div>

          <div className="flex items-center gap-3">
            <Button type="button" variant="ghost" size="sm" onClick={onClose}>
              Cancel
            </Button>
            <Button
              type="button"
              variant="primary"
              size="sm"
              disabled={!selectedAsset}
              onClick={() => {
                if (selectedAsset) {
                  onSelect(selectedAsset);
                  onClose();
                }
              }}
            >
              Confirm Selection
            </Button>
          </div>
        </div>
      </div>
    </div>
  );

  return createPortal(modalContent, document.body);
};
