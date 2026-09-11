'use client';

import React, { useState, useEffect } from 'react';
import { AdminBreadcrumb } from '@/components/admin/AdminBreadcrumb';
import { useAdminToast } from '@/components/admin/AdminToast';
import { ProofMetricsManager } from '@/components/admin/ProofMetricsManager';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import {
  Layout,
  Save,
  Sparkles,
  Sliders,
  CheckCircle2,
  ExternalLink,
  Layers,
  FolderGit2,
  Workflow,
  Award,
  Cpu,
  MessageSquare,
  HelpCircle,
} from 'lucide-react';

export default function AdminHomepagePage() {
  const { success, error } = useAdminToast();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [homepageSettings, setHomepageSettings] = useState({
    homepage_hero_badge: 'Software Engineering & High-Performance Architecture',
    homepage_hero_headline: 'Architecting Resilient Enterprise Software & Cinematic Digital Systems',
    homepage_hero_subtitle:
      'We engineer resilient, scalable, and mathematically sound digital infrastructure that accelerates enterprise transformation.',
    homepage_primary_cta_label: 'Explore Featured Systems',
    homepage_primary_cta_url: '/projects',
    homepage_secondary_cta_label: 'Initiate Technical Engagement',
    homepage_secondary_cta_url: '/contact',
    homepage_final_cta_headline: 'Ready to Engineer Your Flagship Digital Platform?',
    homepage_final_cta_subtitle:
      'Consult directly with our systems architects. We analyze technical debt, design high-concurrency systems, and deliver mission-critical software.',
    homepage_final_cta_button_label: 'Initiate Architecture Consultation',
    homepage_final_cta_button_url: '/contact',
    homepage_section_services_enabled: 'true',
    homepage_section_projects_enabled: 'true',
    homepage_section_process_enabled: 'true',
    homepage_section_values_enabled: 'true',
    homepage_section_technologies_enabled: 'true',
    homepage_section_faqs_enabled: 'true',
  });

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/v1/content/homepage');
      const json = await res.json();
      if (json.success && json.data) {
        setHomepageSettings((prev) => ({ ...prev, ...json.data }));
      }
    } catch {
      error('Failed to load homepage configuration');
    } finally {
      setLoading(false);
    }
  };

  const handleSaveHomepage = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      const res = await fetch('/api/v1/content/homepage', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(homepageSettings),
      });
      const json = await res.json();
      if (json.success) {
        success('Homepage content updated and live on website');
      } else {
        error(json.error || 'Failed to save homepage settings');
      }
    } catch {
      error('Network error saving homepage settings');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-6">
      <AdminBreadcrumb items={[{ label: 'Homepage Content Manager' }]} />

      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/5 pb-4">
        <div>
          <h1 className="text-2xl font-bold text-white tracking-tight">
            Homepage Content & Structured Controls
          </h1>
          <p className="text-xs text-slate-400">
            Control the hero messaging, call-to-actions, and section visibility without modifying source code.
          </p>
        </div>

        <a
          href="/"
          target="_blank"
          rel="noreferrer"
          className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-xs text-slate-300 hover:text-white transition-colors self-start sm:self-center"
        >
          <span>Preview Live Homepage</span>
          <ExternalLink className="w-3.5 h-3.5 text-slate-400" />
        </a>
      </div>

      {loading ? (
        <div className="py-20 text-center text-slate-500 font-mono text-xs">
          Loading homepage configuration...
        </div>
      ) : (
        <form onSubmit={handleSaveHomepage} className="space-y-8">
          {/* Hero Section Configuration */}
          <div className="glass-panel p-6 rounded-2xl border border-white/10 bg-[#0A0E17]/40 space-y-5">
            <div className="flex items-center justify-between border-b border-white/5 pb-3">
              <h2 className="text-sm font-bold text-white uppercase tracking-wider font-mono flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-[#00F2FE]" />
                1. Hero Showcase Configuration
              </h2>
              <Badge variant="cyan" size="sm">PRIMARY VIEWPORT</Badge>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-mono text-slate-300">Status Pill / Top Badge</label>
              <input
                type="text"
                value={homepageSettings.homepage_hero_badge}
                onChange={(e) =>
                  setHomepageSettings({ ...homepageSettings, homepage_hero_badge: e.target.value })
                }
                placeholder="e.g. Software Engineering & High-Performance Architecture"
                className="w-full px-3.5 py-2 bg-[#05070B] border border-white/10 rounded-lg text-xs text-white focus:outline-none focus:border-[#00F2FE]"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-mono text-slate-300">Primary Headline</label>
              <textarea
                rows={2}
                value={homepageSettings.homepage_hero_headline}
                onChange={(e) =>
                  setHomepageSettings({ ...homepageSettings, homepage_hero_headline: e.target.value })
                }
                placeholder="Primary impact statement..."
                className="w-full px-3.5 py-2 bg-[#05070B] border border-white/10 rounded-lg text-xs text-white focus:outline-none focus:border-[#00F2FE]"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-mono text-slate-300">Supporting Subtitle / Proposition</label>
              <textarea
                rows={2}
                value={homepageSettings.homepage_hero_subtitle}
                onChange={(e) =>
                  setHomepageSettings({ ...homepageSettings, homepage_hero_subtitle: e.target.value })
                }
                placeholder="Secondary proposition..."
                className="w-full px-3.5 py-2 bg-[#05070B] border border-white/10 rounded-lg text-xs text-white focus:outline-none focus:border-[#00F2FE]"
              />
            </div>

            {/* CTAs */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2 border-t border-white/5">
              <div className="space-y-3 p-4 rounded-xl bg-[#05070B] border border-white/5">
                <span className="text-[11px] font-mono text-[#00F2FE] uppercase block">
                  Primary Action Button
                </span>
                <div className="space-y-2">
                  <div>
                    <label className="text-[10px] font-mono text-slate-400 block mb-1">Label</label>
                    <input
                      type="text"
                      value={homepageSettings.homepage_primary_cta_label}
                      onChange={(e) =>
                        setHomepageSettings({
                          ...homepageSettings,
                          homepage_primary_cta_label: e.target.value,
                        })
                      }
                      className="w-full px-3 py-1.5 bg-[#0A0E17] border border-white/10 rounded-lg text-xs text-white"
                    />
                  </div>
                  <div>
                    <label className="text-[10px] font-mono text-slate-400 block mb-1">Target Link</label>
                    <input
                      type="text"
                      value={homepageSettings.homepage_primary_cta_url}
                      onChange={(e) =>
                        setHomepageSettings({
                          ...homepageSettings,
                          homepage_primary_cta_url: e.target.value,
                        })
                      }
                      className="w-full px-3 py-1.5 bg-[#0A0E17] border border-white/10 rounded-lg text-xs font-mono text-white"
                    />
                  </div>
                </div>
              </div>

              <div className="space-y-3 p-4 rounded-xl bg-[#05070B] border border-white/5">
                <span className="text-[11px] font-mono text-[#7F00FF] uppercase block">
                  Secondary Action Button
                </span>
                <div className="space-y-2">
                  <div>
                    <label className="text-[10px] font-mono text-slate-400 block mb-1">Label</label>
                    <input
                      type="text"
                      value={homepageSettings.homepage_secondary_cta_label}
                      onChange={(e) =>
                        setHomepageSettings({
                          ...homepageSettings,
                          homepage_secondary_cta_label: e.target.value,
                        })
                      }
                      className="w-full px-3 py-1.5 bg-[#0A0E17] border border-white/10 rounded-lg text-xs text-white"
                    />
                  </div>
                  <div>
                    <label className="text-[10px] font-mono text-slate-400 block mb-1">Target Link</label>
                    <input
                      type="text"
                      value={homepageSettings.homepage_secondary_cta_url}
                      onChange={(e) =>
                        setHomepageSettings({
                          ...homepageSettings,
                          homepage_secondary_cta_url: e.target.value,
                        })
                      }
                      className="w-full px-3 py-1.5 bg-[#0A0E17] border border-white/10 rounded-lg text-xs font-mono text-white"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Section Visibility Toggles */}
          <div className="glass-panel p-6 rounded-2xl border border-white/10 bg-[#0A0E17]/40 space-y-4">
            <div className="flex items-center justify-between border-b border-white/5 pb-3">
              <h2 className="text-sm font-bold text-white uppercase tracking-wider font-mono flex items-center gap-2">
                <Sliders className="w-4 h-4 text-[#10B981]" />
                2. Section Visibility Matrix
              </h2>
              <span className="text-xs text-slate-400">Toggle sections shown on homepage</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {[
                {
                  key: 'homepage_section_services_enabled',
                  label: 'Architectural Services',
                  icon: Layers,
                },
                {
                  key: 'homepage_section_projects_enabled',
                  label: 'Flagship Projects',
                  icon: FolderGit2,
                },
                {
                  key: 'homepage_section_process_enabled',
                  label: '5-Phase Delivery Process',
                  icon: Workflow,
                },
                {
                  key: 'homepage_section_values_enabled',
                  label: 'Engineering Core Values',
                  icon: Award,
                },
                {
                  key: 'homepage_section_technologies_enabled',
                  label: 'Technology Framework Matrix',
                  icon: Cpu,
                },
                {
                  key: 'homepage_section_faqs_enabled',
                  label: 'Technical FAQs',
                  icon: HelpCircle,
                },
              ].map((sec) => {
                const isEnabled =
                  (homepageSettings as any)[sec.key] === 'true' ||
                  (homepageSettings as any)[sec.key] === true;
                const Icon = sec.icon;

                return (
                  <label
                    key={sec.key}
                    className={`p-3.5 rounded-xl border flex items-center justify-between cursor-pointer transition-all ${
                      isEnabled
                        ? 'bg-[#00F2FE]/5 border-[#00F2FE]/30 text-white'
                        : 'bg-[#05070B] border-white/5 text-slate-500'
                    }`}
                  >
                    <div className="flex items-center gap-2.5">
                      <Icon className={`w-4 h-4 ${isEnabled ? 'text-[#00F2FE]' : 'text-slate-600'}`} />
                      <span className="text-xs font-mono">{sec.label}</span>
                    </div>

                    <input
                      type="checkbox"
                      checked={isEnabled}
                      onChange={(e) =>
                        setHomepageSettings({
                          ...homepageSettings,
                          [sec.key]: e.target.checked ? 'true' : 'false',
                        })
                      }
                      className="w-4 h-4 rounded bg-[#0A0E17] border-white/10 text-[#00F2FE] focus:ring-0"
                    />
                  </label>
                );
              })}
            </div>
          </div>

          {/* Final Call To Action */}
          <div className="glass-panel p-6 rounded-2xl border border-white/10 bg-[#0A0E17]/40 space-y-4">
            <h2 className="text-sm font-bold text-white uppercase tracking-wider font-mono border-b border-white/5 pb-3">
              3. Final Conversion Call-to-Action Banner
            </h2>

            <div className="space-y-1.5">
              <label className="text-xs font-mono text-slate-300">Conversion Headline</label>
              <input
                type="text"
                value={homepageSettings.homepage_final_cta_headline}
                onChange={(e) =>
                  setHomepageSettings({
                    ...homepageSettings,
                    homepage_final_cta_headline: e.target.value,
                  })
                }
                className="w-full px-3.5 py-2 bg-[#05070B] border border-white/10 rounded-lg text-xs text-white focus:outline-none focus:border-[#00F2FE]"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-mono text-slate-300">Supporting Pitch</label>
              <textarea
                rows={2}
                value={homepageSettings.homepage_final_cta_subtitle}
                onChange={(e) =>
                  setHomepageSettings({
                    ...homepageSettings,
                    homepage_final_cta_subtitle: e.target.value,
                  })
                }
                className="w-full px-3.5 py-2 bg-[#05070B] border border-white/10 rounded-lg text-xs text-white focus:outline-none focus:border-[#00F2FE]"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-xs font-mono text-slate-300">Button Label</label>
                <input
                  type="text"
                  value={homepageSettings.homepage_final_cta_button_label}
                  onChange={(e) =>
                    setHomepageSettings({
                      ...homepageSettings,
                      homepage_final_cta_button_label: e.target.value,
                    })
                  }
                  className="w-full px-3.5 py-2 bg-[#05070B] border border-white/10 rounded-lg text-xs text-white focus:outline-none focus:border-[#00F2FE]"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-mono text-slate-300">Button Destination URL</label>
                <input
                  type="text"
                  value={homepageSettings.homepage_final_cta_button_url}
                  onChange={(e) =>
                    setHomepageSettings({
                      ...homepageSettings,
                      homepage_final_cta_button_url: e.target.value,
                    })
                  }
                  className="w-full px-3.5 py-2 bg-[#05070B] border border-white/10 rounded-lg text-xs font-mono text-white focus:outline-none focus:border-[#00F2FE]"
                />
              </div>
            </div>
          </div>

          {/* Submit */}
          <div className="flex items-center justify-end">
            <Button
              type="submit"
              variant="primary"
              size="lg"
              isLoading={saving}
              leftIcon={<Save className="w-4 h-4" />}
            >
              Save Homepage Changes
            </Button>
          </div>
        </form>
      )}

      {/* Proof & Continuum Metrics Management Widget */}
      <ProofMetricsManager />
    </div>
  );
}
