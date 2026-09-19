'use client';

import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { Upload, Image as ImageIcon, Check, X, Search, Loader2, Link as LinkIcon, Trash2 } from 'lucide-react';
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

/**
 * Client-side optimization: downscale high-resolution photos (e.g. phone uploads > 1.5MB)
 * to max 2048px and convert to WebP to keep payload well within Vercel's 4.5MB limit.
 */
async function optimizeImageForUpload(file: File): Promise<File> {
  if (!file.type.startsWith('image/') || file.type.includes('svg')) {
    return file;
  }
  if (file.size <= 1.5 * 1024 * 1024) {
    return file;
  }

  return new Promise((resolve) => {
    const img = new Image();
    const url = URL.createObjectURL(file);
    img.onload = () => {
      URL.revokeObjectURL(url);
      const maxWidth = 2048;
      const maxHeight = 2048;
      let { width, height } = img;

      if (width > maxWidth || height > maxHeight) {
        if (width > height) {
          height = Math.round((height * maxWidth) / width);
          width = maxWidth;
        } else {
          width = Math.round((width * maxHeight) / height);
          height = maxHeight;
        }
      }

      const canvas = document.createElement('canvas');
      canvas.width = width;
      canvas.height = height;
      const ctx = canvas.getContext('2d');
      if (!ctx) {
        resolve(file);
        return;
      }
      ctx.drawImage(img, 0, 0, width, height);
      canvas.toBlob(
        (blob) => {
          if (!blob) {
            resolve(file);
            return;
          }
          const baseName = file.name.replace(/\.[^/.]+$/, '');
          const optimizedFile = new File([blob], `${baseName}.webp`, {
            type: 'image/webp',
          });
          resolve(optimizedFile);
        },
        'image/webp',
        0.85
      );
    };
    img.onerror = () => {
      URL.revokeObjectURL(url);
      resolve(file);
    };
    img.src = url;
  });
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
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [search, setSearch] = useState('');
  const [selectedAsset, setSelectedAsset] = useState<MediaAsset | null>(null);
  const [errorMessage, setErrorMessage] = useState('');
  const [urlInput, setUrlInput] = useState('');
  const [showUrlInput, setShowUrlInput] = useState(false);
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

  const handleDeleteAsset = async (assetId: string) => {
    setDeletingId(assetId);
    setErrorMessage('');
    try {
      const res = await fetch(`/api/v1/media/${assetId}`, { method: 'DELETE' });
      const json = await res.json().catch(() => null);
      if (res.ok && json?.success) {
        setAssets((prev) => prev.filter((a) => a.id !== assetId));
        if (selectedAsset?.id === assetId) {
          setSelectedAsset(null);
        }
      } else {
        setErrorMessage(json?.error?.message || json?.error || 'Failed to delete media asset');
      }
    } catch {
      setErrorMessage('Network connection error while deleting asset');
    } finally {
      setDeletingId(null);
    }
  };

  const handleUrlAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!urlInput.trim()) {
      setErrorMessage('Please enter an image URL');
      return;
    }

    setUploading(true);
    setErrorMessage('');

    try {
      const res = await fetch('/api/v1/media/upload', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url: urlInput.trim() }),
      });

      const json = await res.json().catch(() => null);
      if (res.ok && json?.success && json.data) {
        const added = normalizeAsset(json.data);
        setAssets((prev) => [added, ...prev]);
        setSelectedAsset(added);
        setUrlInput('');
        setShowUrlInput(false);
      } else {
        const errorMsg =
          json?.error?.message || (typeof json?.error === 'string' ? json.error : 'Failed to import image from URL');
        setErrorMessage(errorMsg);
      }
    } catch {
      setErrorMessage('Connection error while importing image');
    } finally {
      setUploading(false);
    }
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    let file = e.target.files?.[0];
    if (!file) return;

    if (!storageStatus.uploadsEnabled) {
      setErrorMessage(
        storageStatus.message || 'Media uploads are temporarily paused.'
      );
      if (e.target) e.target.value = '';
      return;
    }

    setUploading(true);
    setErrorMessage('');

    try {
      // Optimize image if needed (e.g. camera photo > 1.5MB) to prevent 413 Vercel payload limit
      file = await optimizeImageForUpload(file);

      if (file.size > 10 * 1024 * 1024) {
        setErrorMessage('File exceeds maximum allowable size of 10MB');
        setUploading(false);
        return;
      }

      const formData = new FormData();
      formData.append('file', file);

      let res: Response;
      try {
        res = await fetch('/api/v1/media/upload', {
          method: 'POST',
          body: formData,
        });
      } catch {
        setErrorMessage('Connection failed. Please check your internet connection.');
        return;
      }

      if (!res.ok) {
        if (res.status === 413) {
          setErrorMessage('File exceeds server payload limit. Please choose an image under 4.5MB.');
          return;
        }
        let serverError = '';
        try {
          const errJson = await res.json();
          serverError = errJson?.error?.message || errJson?.error || '';
        } catch {
          serverError = await res.text().catch(() => '');
        }
        setErrorMessage(serverError || `Upload failed (Status ${res.status})`);
        return;
      }

      const json = await res.json().catch(() => null);
      if (json?.success && json.data) {
        const uploaded = normalizeAsset(json.data);
        setAssets((prev) => [uploaded, ...prev]);
        setSelectedAsset(uploaded);
      } else {
        const errorMsg =
          json?.error?.message || (typeof json?.error === 'string' ? json.error : 'Upload failed');
        setErrorMessage(errorMsg);
      }
    } catch (err: any) {
      setErrorMessage(err?.message || 'Error during file upload');
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
            <p className="text-xs text-slate-400">Choose from media catalog, upload a file, or import from URL (max 10MB).</p>
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

          <div className="flex items-center gap-2">
            <label className="cursor-pointer">
              <input
                type="file"
                accept="image/jpeg,image/png,image/webp,image/svg+xml,image/avif"
                onChange={handleFileUpload}
                disabled={uploading}
                className="hidden"
              />
              <Button
                type="button"
                variant="secondary"
                size="sm"
                isLoading={uploading}
                leftIcon={<Upload className="w-3.5 h-3.5" />}
                className="pointer-events-none"
              >
                Upload File
              </Button>
            </label>

            <Button
              type="button"
              variant={showUrlInput ? 'secondary' : 'ghost'}
              size="sm"
              onClick={() => setShowUrlInput(!showUrlInput)}
              leftIcon={<LinkIcon className="w-3.5 h-3.5" />}
              className="text-slate-300 hover:text-white"
            >
              Paste URL
            </Button>
          </div>
        </div>

        {/* URL Input Bar */}
        {showUrlInput && (
          <form onSubmit={handleUrlAdd} noValidate className="flex items-center gap-2 p-3 bg-[#05070B] border border-white/10 rounded-xl animate-in fade-in">
            <input
              type="url"
              placeholder="Paste public image URL (https://... or data:...)"
              value={urlInput}
              onChange={(e) => setUrlInput(e.target.value)}
              className="flex-1 px-3 py-1.5 bg-[#0A0E17] border border-white/10 rounded-lg text-xs text-white placeholder-slate-500 focus:outline-none focus:border-[#00F2FE]"
              autoFocus
            />
            <Button type="submit" size="sm" variant="primary" isLoading={uploading}>
              Import Image
            </Button>
            <Button type="button" size="sm" variant="ghost" onClick={() => setShowUrlInput(false)}>
              Cancel
            </Button>
          </form>
        )}

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
                const isDeleting = deletingId === asset.id;
                const displayUrl = asset.url || asset.storageUrl;

                return (
                  <div
                    key={asset.id}
                    role="button"
                    tabIndex={0}
                    onClick={() => setSelectedAsset(asset)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' || e.key === ' ') {
                        setSelectedAsset(asset);
                      }
                    }}
                    className={`relative group rounded-xl overflow-hidden border text-left transition-all aspect-video bg-[#05070B] flex flex-col justify-end p-2 cursor-pointer select-none ${
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

                    {/* Top action row: Delete button & Selected badge */}
                    <div className="absolute top-2 left-2 right-2 flex items-center justify-between z-20 pointer-events-auto">
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          if (confirm(`Are you sure you want to delete "${asset.originalName}" from the media library?`)) {
                            handleDeleteAsset(asset.id);
                          }
                        }}
                        disabled={isDeleting}
                        className="p-1.5 rounded-lg bg-black/80 hover:bg-[#F43F5E] text-slate-300 hover:text-white transition-all shadow-md opacity-80 group-hover:opacity-100"
                        title="Delete asset from library"
                        aria-label={`Delete ${asset.originalName}`}
                      >
                        {isDeleting ? (
                          <Loader2 className="w-3.5 h-3.5 animate-spin text-white" />
                        ) : (
                          <Trash2 className="w-3.5 h-3.5" />
                        )}
                      </button>

                      {isSelected && (
                        <div className="w-5 h-5 rounded-full bg-[#00F2FE] text-[#05070B] flex items-center justify-center shadow-lg">
                          <Check className="w-3.5 h-3.5 stroke-[3]" />
                        </div>
                      )}
                    </div>

                    {/* Meta label */}
                    <div className="relative z-10">
                      <span className="text-[10px] font-mono text-white truncate block">
                        {asset.originalName}
                      </span>
                      <span className="text-[9px] text-slate-400 font-mono">
                        {asset.size ? (asset.size / 1024).toFixed(0) : '0'} KB
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between border-t border-white/5 pt-4">
          <div className="text-xs text-slate-400 truncate max-w-sm flex items-center gap-3">
            {selectedAsset ? (
              <>
                <span className="truncate">
                  Selected: <strong className="text-white">{selectedAsset.originalName}</strong>
                </span>
                <button
                  type="button"
                  onClick={() => {
                    if (confirm(`Delete "${selectedAsset.originalName}" from media library?`)) {
                      handleDeleteAsset(selectedAsset.id);
                    }
                  }}
                  disabled={deletingId === selectedAsset.id}
                  className="text-[11px] text-[#F43F5E] hover:underline flex items-center gap-1 shrink-0 font-mono"
                >
                  <Trash2 className="w-3 h-3" />
                  Delete
                </button>
              </>
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
