'use client';

import React, { useState, useEffect } from 'react';
import { useAdminToast } from '@/components/admin/AdminToast';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import {
  MetricItem,
  MetricMode,
  DEFAULT_PROOF_METRICS,
} from '@/types/metrics';
import {
  Sparkles,
  Save,
  RefreshCw,
  Eye,
  EyeOff,
  Cpu,
  Edit3,
  CheckCircle2,
  AlertCircle,
  HelpCircle,
} from 'lucide-react';
import { cn } from '@/lib/utils';

export const ProofMetricsManager: React.FC = () => {
  const { success, error } = useAdminToast();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [recalculating, setRecalculating] = useState(false);
  const [metrics, setMetrics] = useState<MetricItem[]>(DEFAULT_PROOF_METRICS);
  const [autoValues, setAutoValues] = useState<Record<string, string>>({
    projects: '+20',
    clients: '+15',
    inquiries: '100%',
    uptime: '99.9%',
    visitors: '12,480+',
  });

  useEffect(() => {
    fetchMetrics();
  }, []);

  const fetchMetrics = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/admin/metrics');
      const json = await res.json();
      if (json.success && json.data) {
        if (json.data.items && json.data.items.length > 0) {
          setMetrics(json.data.items);
        }
        if (json.data.autoValues) {
          setAutoValues(json.data.autoValues);
        }
      }
    } catch {
      error('Failed to load Proof Metrics configuration');
    } finally {
      setLoading(false);
    }
  };

  const handleRecalculate = async () => {
    setRecalculating(true);
    try {
      const res = await fetch('/api/admin/metrics');
      const json = await res.json();
      if (json.success && json.data?.autoValues) {
        setAutoValues(json.data.autoValues);
        success('Live system metrics recalculated successfully');
      }
    } catch {
      error('Failed to recalculate live system stats');
    } finally {
      setRecalculating(false);
    }
  };

  const handleModeChange = (id: string, mode: MetricMode) => {
    setMetrics((prev) =>
      prev.map((item) => (item.id === id ? { ...item, mode } : item))
    );
  };

  const handleVisibilityToggle = (id: string) => {
    setMetrics((prev) =>
      prev.map((item) =>
        item.id === id ? { ...item, isVisible: !item.isVisible } : item
      )
    );
  };

  const handleFieldChange = (
    id: string,
    field: 'manualValue' | 'label' | 'subtext',
    value: string
  ) => {
    setMetrics((prev) =>
      prev.map((item) => (item.id === id ? { ...item, [field]: value } : item))
    );
  };

  const handleSave = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setSaving(true);
    try {
      const res = await fetch('/api/admin/metrics', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ metrics }),
      });
      const json = await res.json();
      if (json.success) {
        success('Proof Metrics configuration saved and published');
      } else {
        error(json.error?.message || 'Failed to save proof metrics');
      }
    } catch {
      error('Network error while saving proof metrics');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="glass-panel p-8 rounded-2xl border border-white/10 bg-[#0A0E17]/40 text-center space-y-3">
        <RefreshCw className="w-5 h-5 text-[#00D2FF] animate-spin mx-auto" />
        <div className="text-xs font-mono text-slate-400">
          Loading Proof & Continuum Metrics...
        </div>
      </div>
    );
  }

  return (
    <div className="glass-panel p-6 sm:p-8 rounded-2xl border border-white/10 bg-[#0A0E17]/60 space-y-6">
      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/5 pb-4">
        <div>
          <div className="flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-[#00D2FF]" />
            <h2 className="text-lg font-bold text-white tracking-tight font-display">
              Proof & Continuum Metrics
            </h2>
            <Badge variant="cyan" size="sm">
              HOMEPAGE SHOWCASE
            </Badge>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Configure real-world social proof and business impact stats. Toggle
            between manual overrides and automated system aggregation.
          </p>
        </div>

        <div className="flex items-center gap-2 self-start sm:self-center">
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={handleRecalculate}
            disabled={recalculating}
            leftIcon={
              <RefreshCw
                className={cn('w-3.5 h-3.5', recalculating && 'animate-spin')}
              />
            }
          >
            {recalculating ? 'Syncing...' : 'Recalculate Stats'}
          </Button>

          <Button
            type="button"
            variant="primary"
            size="sm"
            onClick={() => handleSave()}
            disabled={saving}
            leftIcon={
              saving ? (
                <RefreshCw className="w-3.5 h-3.5 animate-spin" />
              ) : (
                <Save className="w-3.5 h-3.5" />
              )
            }
          >
            {saving ? 'Saving...' : 'Save Metrics'}
          </Button>
        </div>
      </div>

      {/* 4 Cards Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {metrics.map((item, index) => {
          const liveAutoVal = autoValues[item.key] || '0';
          const activeDisplayVal =
            item.mode === 'auto' ? liveAutoVal : item.manualValue;

          return (
            <div
              key={item.id}
              className={cn(
                'rounded-xl border p-5 space-y-5 transition-all',
                item.isVisible
                  ? 'bg-[#080D18]/90 border-white/10'
                  : 'bg-[#06080F]/60 border-white/5 opacity-60'
              )}
            >
              {/* Card Header & Controls */}
              <div className="flex items-center justify-between border-b border-white/5 pb-3">
                <div className="flex items-center gap-2">
                  <span className="w-6 h-6 rounded-md bg-white/5 border border-white/10 flex items-center justify-center font-mono text-[11px] text-cyan-400 font-bold">
                    0{index + 1}
                  </span>
                  <span className="font-mono text-xs text-white font-semibold uppercase tracking-wider">
                    {item.key}
                  </span>
                </div>

                <div className="flex items-center gap-3">
                  {/* Visibility Button */}
                  <button
                    type="button"
                    onClick={() => handleVisibilityToggle(item.id)}
                    className={cn(
                      'inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-[11px] font-mono border transition-colors cursor-pointer',
                      item.isVisible
                        ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400'
                        : 'bg-slate-800/40 border-white/10 text-slate-400'
                    )}
                  >
                    {item.isVisible ? (
                      <>
                        <Eye className="w-3 h-3" />
                        <span>Visible</span>
                      </>
                    ) : (
                      <>
                        <EyeOff className="w-3 h-3" />
                        <span>Hidden</span>
                      </>
                    )}
                  </button>

                  {/* Mode Pill Toggle */}
                  <div className="inline-flex rounded-lg bg-[#05070B] border border-white/10 p-0.5 text-[11px] font-mono">
                    <button
                      type="button"
                      onClick={() => handleModeChange(item.id, 'manual')}
                      className={cn(
                        'px-2.5 py-1 rounded-md transition-all flex items-center gap-1 cursor-pointer',
                        item.mode === 'manual'
                          ? 'bg-[#0066FF] text-white font-medium shadow-sm'
                          : 'text-slate-400 hover:text-white'
                      )}
                    >
                      <Edit3 className="w-3 h-3" />
                      <span>Manual</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => handleModeChange(item.id, 'auto')}
                      className={cn(
                        'px-2.5 py-1 rounded-md transition-all flex items-center gap-1 cursor-pointer',
                        item.mode === 'auto'
                          ? 'bg-cyan-500 text-black font-medium shadow-sm'
                          : 'text-slate-400 hover:text-white'
                      )}
                    >
                      <Cpu className="w-3 h-3" />
                      <span>Auto</span>
                    </button>
                  </div>
                </div>
              </div>

              {/* Form Input Fields */}
              <div className="space-y-4">
                {/* Metric Value */}
                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <label className="text-[11px] font-mono text-slate-300">
                      Metric Display Value
                    </label>
                    {item.mode === 'auto' && (
                      <span className="text-[10px] font-mono text-cyan-400 flex items-center gap-1">
                        <CheckCircle2 className="w-3 h-3" />
                        Auto-calculated from system: {liveAutoVal}
                      </span>
                    )}
                  </div>

                  <div className="relative">
                    <input
                      type="text"
                      value={activeDisplayVal}
                      disabled={item.mode === 'auto'}
                      onChange={(e) =>
                        handleFieldChange(item.id, 'manualValue', e.target.value)
                      }
                      placeholder={item.mode === 'auto' ? liveAutoVal : '+20'}
                      className={cn(
                        'w-full px-3.5 py-2 bg-[#05070B] border rounded-lg text-xs font-mono transition-colors',
                        item.mode === 'auto'
                          ? 'border-cyan-500/30 text-cyan-300 bg-cyan-950/10 cursor-not-allowed'
                          : 'border-white/10 text-white focus:outline-none focus:border-[#00D2FF]'
                      )}
                    />
                  </div>
                </div>

                {/* Metric Label */}
                <div>
                  <label className="text-[11px] font-mono text-slate-300 block mb-1.5">
                    Label (Uppercase Monospace)
                  </label>
                  <input
                    type="text"
                    value={item.label}
                    onChange={(e) =>
                      handleFieldChange(item.id, 'label', e.target.value)
                    }
                    placeholder="e.g. DELIVERED SOLUTIONS"
                    className="w-full px-3.5 py-2 bg-[#05070B] border border-white/10 rounded-lg text-xs font-mono text-white focus:outline-none focus:border-[#00D2FF]"
                  />
                </div>

                {/* Subtext Descriptor */}
                <div>
                  <label className="text-[11px] font-mono text-slate-300 block mb-1.5">
                    Subtext Descriptor
                  </label>
                  <input
                    type="text"
                    value={item.subtext}
                    onChange={(e) =>
                      handleFieldChange(item.id, 'subtext', e.target.value)
                    }
                    placeholder="e.g. Production Systems Launched"
                    className="w-full px-3.5 py-2 bg-[#05070B] border border-white/10 rounded-lg text-xs font-sans text-white focus:outline-none focus:border-[#00D2FF]"
                  />
                </div>
              </div>

              {/* Live Preview Card */}
              <div className="pt-3 border-t border-white/5 space-y-2">
                <span className="text-[10px] font-mono text-slate-500 uppercase tracking-wider block">
                  LIVE FRONTEND PREVIEW
                </span>

                <div className="relative p-4 rounded-xl backdrop-blur-md bg-[#080c14]/80 border border-white/[0.08] text-center overflow-hidden">
                  <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-cyan-500/30 to-transparent pointer-events-none" />

                  <div className="text-2xl font-bold font-mono tracking-tight text-white drop-shadow-[0_0_10px_rgba(0,210,255,0.35)] flex items-center justify-center">
                    {activeDisplayVal}
                  </div>

                  <div className="text-[10px] font-mono font-semibold tracking-wider text-cyan-400 uppercase mt-1.5">
                    {item.label || 'LABEL'}
                  </div>

                  <div className="text-[11px] font-sans text-slate-300 leading-tight mt-0.5">
                    {item.subtext || 'Subtext descriptor'}
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Bottom Save Bar */}
      <div className="flex items-center justify-between border-t border-white/5 pt-4 text-xs text-slate-400">
        <span className="font-mono text-[11px]">
          Changes will immediately take effect on the public landing page.
        </span>

        <Button
          type="button"
          variant="primary"
          onClick={() => handleSave()}
          disabled={saving}
          leftIcon={
            saving ? (
              <RefreshCw className="w-3.5 h-3.5 animate-spin" />
            ) : (
              <Save className="w-3.5 h-3.5" />
            )
          }
        >
          {saving ? 'Saving...' : 'Save & Publish Changes'}
        </Button>
      </div>
    </div>
  );
};
