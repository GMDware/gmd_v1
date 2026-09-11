'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Eye, Check, X, ShieldAlert, ArrowRight } from 'lucide-react';
import { ThemeId } from '@/lib/theme/types';
import { THEME_METADATA_REGISTRY } from '@/lib/theme/registry';

interface ThemePreviewBannerProps {
  themeId: ThemeId;
  persistedThemeId: ThemeId;
}

export const ThemePreviewBanner: React.FC<ThemePreviewBannerProps> = ({
  themeId,
  persistedThemeId,
}) => {
  const router = useRouter();
  const [exiting, setExiting] = useState(false);
  const [activating, setActivating] = useState(false);
  const themeMeta = THEME_METADATA_REGISTRY[themeId];

  const handleExitPreview = async () => {
    setExiting(true);
    try {
      await fetch('/api/v1/theme/preview', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'clear' }),
      });
      // Remove query param from current URL if present
      const url = new URL(window.location.href);
      url.searchParams.delete('themePreview');
      url.searchParams.delete('theme');
      window.location.href = url.pathname + (url.search ? url.search : '');
    } catch {
      window.location.href = window.location.pathname;
    }
  };

  const handleActivate = async () => {
    setActivating(true);
    try {
      const res = await fetch('/api/v1/theme', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ themeId }),
      });
      if (res.ok) {
        // Clear preview cookie and reload
        await fetch('/api/v1/theme/preview', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ action: 'clear' }),
        });
        const url = new URL(window.location.href);
        url.searchParams.delete('themePreview');
        url.searchParams.delete('theme');
        window.location.href = url.pathname;
      } else {
        router.push('/admin/theme');
      }
    } catch {
      router.push('/admin/theme');
    } finally {
      setActivating(false);
    }
  };

  return (
    <aside
      aria-label="Theme Preview Control Bar"
      className="fixed top-0 left-0 right-0 z-[9999] bg-[#0A0E17]/95 border-b border-[#00F2FE]/40 backdrop-blur-xl py-2 px-4 shadow-2xl text-xs font-mono text-white flex flex-wrap items-center justify-between gap-3 animate-in slide-in-from-top duration-300"
    >
      <div className="flex items-center gap-2.5">
        <span className="flex h-2 w-2 relative">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#00F2FE] opacity-75" />
          <span className="relative inline-flex rounded-full h-2 w-2 bg-[#00F2FE]" />
        </span>
        <div className="flex items-center gap-2">
          <Eye className="w-3.5 h-3.5 text-[#00F2FE]" />
          <span className="font-bold text-[#00F2FE] tracking-wide uppercase">
            [PREVIEWING IDENTITY: {themeMeta.name}]
          </span>
        </div>
        <span className="text-slate-400 hidden sm:inline">
          • Production active theme remains: <strong className="text-slate-200 uppercase">{persistedThemeId}</strong>
        </span>
      </div>

      <div className="flex items-center gap-2">
        <button
          type="button"
          onClick={handleExitPreview}
          disabled={exiting}
          className="px-2.5 py-1 rounded bg-white/10 hover:bg-white/20 text-slate-300 hover:text-white transition-colors flex items-center gap-1.5"
        >
          <X className="w-3 h-3 text-slate-400" />
          <span>{exiting ? 'Exiting...' : 'Exit Preview'}</span>
        </button>

        <button
          type="button"
          onClick={handleActivate}
          disabled={activating}
          className="px-3 py-1 rounded bg-[#00F2FE] hover:bg-[#00D2FF] text-black font-bold transition-colors flex items-center gap-1.5 shadow-lg shadow-[#00F2FE]/20"
        >
          <Check className="w-3 h-3 text-black" />
          <span>{activating ? 'Activating...' : 'Activate This Theme'}</span>
        </button>
      </div>
    </aside>
  );
};
