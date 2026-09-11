'use client';

import React, { useState, useEffect } from 'react';
import { AdminBreadcrumb } from '@/components/admin/AdminBreadcrumb';
import { useAdminToast } from '@/components/admin/AdminToast';
import { ThemeId, ThemeMetadata } from '@/lib/theme/types';
import { THEME_LIST } from '@/lib/theme/registry';
import {
  Palette,
  CheckCircle2,
  ExternalLink,
  Eye,
  Sparkles,
  Orbit,
  Layout,
  Terminal,
  Layers,
  ArrowRight,
  ShieldCheck,
  Zap,
} from 'lucide-react';

export default function AdminThemePage() {
  const { success, error } = useAdminToast();
  const [activeTheme, setActiveTheme] = useState<ThemeId>('systems');
  const [loading, setLoading] = useState(true);
  const [activatingId, setActivatingId] = useState<ThemeId | null>(null);

  // Confirmation Modal State
  const [confirmModal, setConfirmModal] = useState<{
    open: boolean;
    theme: ThemeMetadata | null;
  }>({
    open: false,
    theme: null,
  });

  useEffect(() => {
    loadThemeState();
  }, []);

  const loadThemeState = async () => {
    try {
      const res = await fetch('/api/v1/theme');
      const json = await res.json();
      if (json.success && json.data) {
        setActiveTheme(json.data.activeTheme);
      }
    } catch {
      error('Failed to load active theme configuration');
    } finally {
      setLoading(false);
    }
  };

  const handlePreviewTheme = async (themeId: ThemeId) => {
    try {
      await fetch('/api/v1/theme/preview', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'set', themeId }),
      });
      // Open preview in new tab or navigate
      window.open(`/?themePreview=${themeId}`, '_blank');
      success(`Opening preview session for ${themeId.toUpperCase()}`);
    } catch {
      error('Failed to initialize preview session');
    }
  };

  const handleOpenActivate = (theme: ThemeMetadata) => {
    setConfirmModal({
      open: true,
      theme,
    });
  };

  const handleConfirmActivate = async () => {
    if (!confirmModal.theme) return;
    const themeId = confirmModal.theme.id;
    setActivatingId(themeId);
    setConfirmModal({ open: false, theme: null });

    try {
      const res = await fetch('/api/v1/theme', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ themeId }),
      });
      const json = await res.json();
      if (json.success) {
        setActiveTheme(themeId);
        success(`Theme successfully activated: ${confirmModal.theme?.name || themeId}`);
      } else {
        error(json.error?.message || 'Failed to activate theme');
      }
    } catch {
      error('Network error while activating theme');
    } finally {
      setActivatingId(null);
    }
  };

  return (
    <div className="space-y-8 max-w-6xl mx-auto">
      <AdminBreadcrumb items={[{ label: 'Theme Engine' }]} />

      {/* Header Banner */}
      <div className="p-8 rounded-3xl bg-gradient-to-r from-[#080D1A] via-[#0D152A] to-[#080D1A] border border-cyan-500/20 shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-cyan-500/5 blur-3xl rounded-full pointer-events-none" />

        <div className="relative z-10 space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-[11px] font-mono text-[#00F2FE]">
            <Palette className="w-3.5 h-3.5" />
            <span>MULTI-IDENTITY THEME ENGINE // THREE RADICAL WEBSITE IDENTITIES</span>
          </div>

          <h1 className="text-3xl sm:text-4xl font-black text-white tracking-tight font-sans">
            THEME ENGINE
          </h1>

          <p className="text-xs sm:text-sm text-slate-400 max-w-2xl leading-relaxed">
            Control the active public identity of GMDware. Switch between three radically distinct architectural design systems without modifying database models, CMS content, or API infrastructure.
          </p>
        </div>
      </div>

      {/* Theme Cards Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {THEME_LIST.map((theme, index) => {
          const isActive = activeTheme === theme.id;
          const isActivating = activatingId === theme.id;

          return (
            <div
              key={theme.id}
              className={`rounded-3xl border transition-all duration-500 flex flex-col justify-between overflow-hidden relative ${
                isActive
                  ? 'bg-[#080E1C] border-[#00F2FE]/50 shadow-[0_0_40px_rgba(0,242,254,0.15)] ring-1 ring-[#00F2FE]/40'
                  : 'bg-[#080D18]/80 border-white/10 hover:border-white/20'
              }`}
            >
              {/* Miniature Interactive Representation */}
              <div className="h-44 w-full p-4 relative overflow-hidden border-b border-white/5 flex flex-col justify-between">
                {theme.id === 'systems' && (
                  <div className="absolute inset-0 bg-[#05080F] flex flex-col justify-between p-4 overflow-hidden">
                    <div className="flex items-center justify-between text-[9px] font-mono text-cyan-400">
                      <span>[GMD // SYSTEMS]</span>
                      <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse" />
                    </div>
                    {/* Wireframe grid preview */}
                    <div className="space-y-1.5 opacity-60">
                      <div className="h-2 w-28 bg-[#0066FF]/60 rounded-sm" />
                      <div className="h-1.5 w-40 bg-white/20 rounded-sm" />
                      <div className="h-1.5 w-20 bg-cyan-400/40 rounded-sm" />
                    </div>
                    <div className="grid grid-cols-3 gap-1 pt-2 border-t border-white/10 text-[8px] font-mono text-slate-500">
                      <div>GRID: ACID</div>
                      <div>CORE: gRPC</div>
                      <div>HUD: ON</div>
                    </div>
                  </div>
                )}

                {theme.id === 'nexus' && (
                  <div className="absolute inset-0 bg-[#030509] flex flex-col justify-between p-4 overflow-hidden">
                    <div className="flex items-center justify-between text-[9px] font-mono text-[#00F2FE]">
                      <span className="flex items-center gap-1">
                        <Orbit className="w-2.5 h-2.5" />
                        <span>NEXUS FABRIC</span>
                      </span>
                      <span className="w-1.5 h-1.5 rounded-full bg-purple-400 animate-pulse" />
                    </div>
                    {/* Orbital nodes preview */}
                    <div className="relative h-16 flex items-center justify-center">
                      <div className="w-16 h-16 rounded-full border border-cyan-500/30 animate-spin" />
                      <div className="w-8 h-8 rounded-full bg-cyan-500/20 absolute flex items-center justify-center">
                        <span className="w-2 h-2 rounded-full bg-[#00F2FE] shadow-[0_0_8px_#00F2FE]" />
                      </div>
                    </div>
                    <div className="text-[8px] font-mono text-purple-300">
                      ORBITAL NODES // LIVING DIGITAL CONTINUUM
                    </div>
                  </div>
                )}

                {theme.id === 'atelier' && (
                  <div className="absolute inset-0 bg-[#0A0A0A] flex flex-col justify-between p-4 overflow-hidden">
                    <div className="flex items-center justify-between text-[9px] font-serif text-stone-300">
                      <span>GMDWARE ATELIER</span>
                      <span className="text-[8px] font-mono text-stone-500">2026</span>
                    </div>
                    {/* Editorial typography preview */}
                    <div className="space-y-1">
                      <div className="text-sm font-serif font-light text-[#F5F2EB] leading-none">
                        Digital Intent.
                      </div>
                      <div className="h-0.5 w-12 bg-stone-500" />
                    </div>
                    <div className="text-[8px] font-mono text-stone-500">
                      QUIET LUXURY // ASYMMETRIC MONOGRAPH
                    </div>
                  </div>
                )}

                {/* Status Badge */}
                <div className="relative z-10 self-end">
                  {isActive ? (
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#00F2FE] text-black font-mono font-bold text-[10px] shadow-lg shadow-[#00F2FE]/30">
                      <CheckCircle2 className="w-3 h-3" />
                      ACTIVE
                    </span>
                  ) : (
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full bg-white/10 text-slate-400 font-mono text-[10px]">
                      READY
                    </span>
                  )}
                </div>
              </div>

              {/* Theme Body Information */}
              <div className="p-6 space-y-6 flex-1 flex flex-col justify-between">
                <div className="space-y-3">
                  <div className="text-[10px] font-mono text-slate-500 uppercase tracking-widest">
                    THEME 0{index + 1}
                  </div>

                  <h3 className="text-xl font-bold text-white tracking-tight">
                    {theme.name}
                  </h3>

                  <p className="text-xs text-[#00F2FE] font-mono">
                    {theme.tagline}
                  </p>

                  <p className="text-xs text-slate-400 leading-relaxed">
                    {theme.concept}
                  </p>

                  <div className="pt-2 flex flex-wrap gap-1.5">
                    {theme.tags.map((tag) => (
                      <span
                        key={tag}
                        className="px-2 py-0.5 rounded bg-white/5 text-[10px] font-mono text-slate-300 border border-white/5"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="pt-6 border-t border-white/5 flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => handlePreviewTheme(theme.id)}
                    className="flex-1 py-2 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-slate-300 hover:text-white text-xs font-mono transition-colors flex items-center justify-center gap-1.5"
                  >
                    <Eye className="w-3.5 h-3.5 text-cyan-400" />
                    <span>Preview</span>
                  </button>

                  {isActive ? (
                    <button
                      type="button"
                      disabled
                      className="flex-1 py-2 rounded-xl bg-[#00F2FE]/20 border border-[#00F2FE]/40 text-[#00F2FE] text-xs font-mono font-bold cursor-default flex items-center justify-center gap-1"
                    >
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      <span>Current</span>
                    </button>
                  ) : (
                    <button
                      type="button"
                      onClick={() => handleOpenActivate(theme)}
                      disabled={isActivating}
                      className="flex-1 py-2 rounded-xl bg-[#00F2FE] hover:bg-cyan-300 text-black text-xs font-mono font-bold shadow-lg shadow-[#00F2FE]/20 transition-colors flex items-center justify-center gap-1"
                    >
                      <span>{isActivating ? 'Activating...' : 'Activate'}</span>
                      <ArrowRight className="w-3 h-3" />
                    </button>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Confirmation Modal */}
      {confirmModal.open && confirmModal.theme && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in"
        >
          <div className="relative w-full max-w-md p-6 rounded-3xl bg-[#0A0E17] border border-cyan-500/30 shadow-2xl space-y-6">
            <div className="space-y-2">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-xs font-mono text-[#00F2FE]">
                <ShieldCheck className="w-3.5 h-3.5" />
                <span>CONFIRM IDENTITY CUTOVER</span>
              </div>
              <h2 className="text-xl font-bold text-white tracking-tight">
                ACTIVATE PUBLIC IDENTITY?
              </h2>
              <p className="text-xs text-slate-300 leading-relaxed font-sans">
                <strong className="text-white">{confirmModal.theme.name}</strong> will immediately become the active public website experience across all desktop and mobile devices.
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-[#05070B] border border-white/5 text-xs font-mono text-slate-400 space-y-1">
              <div>// ZERO APPLICATION REBUILD REQUIRED</div>
              <div>// PERSISTED TO POSTGRESQL AUTHORITATIVELY</div>
              <div>// ALL EXISTING CMS CONTENT PRESERVED</div>
            </div>

            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={() => setConfirmModal({ open: false, theme: null })}
                className="px-4 py-2 rounded-xl bg-white/5 hover:bg-white/10 text-xs font-mono text-slate-400 hover:text-white transition-colors"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleConfirmActivate}
                className="px-5 py-2 rounded-xl bg-[#00F2FE] hover:bg-cyan-300 text-black text-xs font-mono font-bold transition-colors shadow-lg shadow-[#00F2FE]/20"
              >
                Activate Theme Now
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
