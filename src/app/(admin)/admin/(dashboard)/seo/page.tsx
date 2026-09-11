'use client';

import React, { useState, useEffect } from 'react';
import { AdminBreadcrumb } from '@/components/admin/AdminBreadcrumb';
import { useAdminToast } from '@/components/admin/AdminToast';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import {
  Globe,
  Save,
  Search,
  CheckCircle2,
  Share2,
  Lock,
  Compass,
} from 'lucide-react';

interface SEOSetting {
  id?: string;
  route: string;
  title: string;
  description: string;
  keywords?: string[];
  ogTitle?: string | null;
  ogDescription?: string | null;
  ogImage?: string | null;
  canonicalUrl?: string | null;
  noIndex: boolean;
}

const ROUTES = [
  { id: 'global', label: 'Default / Global Site Metadata' },
  { id: 'homepage', label: 'Homepage (/)' },
  { id: 'services', label: 'Services Catalog (/services)' },
  { id: 'projects', label: 'Case Studies Showcase (/projects)' },
  { id: 'about', label: 'About & Leadership (/about)' },
  { id: 'process', label: 'Engineering Process (/process)' },
  { id: 'contact', label: 'Contact & Engagement (/contact)' },
];

export default function AdminSEOPage() {
  const { success, error } = useAdminToast();
  const [selectedRoute, setSelectedRoute] = useState('global');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [form, setForm] = useState<SEOSetting>({
    route: 'global',
    title: 'GMDware — Modern Software Development & Digital Solutions',
    description:
      'GMDware architects mission-critical enterprise platforms, distributed cloud systems, and cinematic digital flagship experiences.',
    ogTitle: 'GMDware — Enterprise Software & Systems Architecture',
    ogDescription:
      'Architecting resilient enterprise software, real-time distributed telemetry, and cinematic digital flagships.',
    ogImage: 'https://gmdware.com/og-image.png',
    canonicalUrl: 'https://gmdware.com',
    noIndex: false,
  });

  useEffect(() => {
    loadRouteSEO(selectedRoute);
  }, [selectedRoute]);

  const loadRouteSEO = async (route: string) => {
    setLoading(true);
    try {
      const res = await fetch(`/api/v1/seo?route=${route}`);
      const json = await res.json();
      if (json.success && json.data) {
        setForm(json.data);
      } else {
        // Reset with route default
        setForm({
          route,
          title: `GMDware — ${route.charAt(0).toUpperCase() + route.slice(1)}`,
          description: 'High-performance enterprise software and systems engineering by GMDware.',
          ogTitle: '',
          ogDescription: '',
          ogImage: '',
          canonicalUrl: `https://gmdware.com/${route === 'global' ? '' : route}`,
          noIndex: false,
        });
      }
    } catch {
      error('Failed to load SEO metadata for this route');
    } finally {
      setLoading(false);
    }
  };

  const handleSaveSEO = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      const res = await fetch('/api/v1/seo', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...form, route: selectedRoute }),
      });

      const json = await res.json();
      if (json.success) {
        success(`SEO configuration for "${selectedRoute}" saved successfully`);
      } else {
        error(json.error || 'Failed to save SEO configuration');
      }
    } catch {
      error('Network error saving SEO configuration');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-6">
      <AdminBreadcrumb items={[{ label: 'SEO & Metadata' }]} />

      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/5 pb-4">
        <div>
          <h1 className="text-2xl font-bold text-white tracking-tight">
            Search Engine & OpenGraph Metadata
          </h1>
          <p className="text-xs text-slate-400">
            Control titles, descriptions, social share cards, canonical URLs, and indexing preferences.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Route Selector Sidebar */}
        <div className="lg:col-span-4 space-y-2">
          <span className="text-xs font-mono text-slate-400 uppercase tracking-wider block mb-2">
            Target Route / View
          </span>

          <div className="space-y-1">
            {ROUTES.map((r) => (
              <button
                key={r.id}
                type="button"
                onClick={() => setSelectedRoute(r.id)}
                className={`w-full text-left p-3 rounded-xl border text-xs font-mono transition-all flex items-center justify-between ${
                  selectedRoute === r.id
                    ? 'bg-[#00F2FE]/10 border-[#00F2FE] text-white font-bold'
                    : 'bg-[#0A0E17] border-white/5 text-slate-400 hover:text-white hover:border-white/10'
                }`}
              >
                <span>{r.label}</span>
                {selectedRoute === r.id && <span className="w-1.5 h-1.5 rounded-full bg-[#00F2FE]" />}
              </button>
            ))}
          </div>
        </div>

        {/* SEO Configuration Form */}
        <div className="lg:col-span-8">
          {loading ? (
            <div className="py-20 text-center text-slate-500 font-mono text-xs">
              Loading metadata for {selectedRoute}...
            </div>
          ) : (
            <form onSubmit={handleSaveSEO} className="glass-panel p-6 rounded-2xl border border-white/10 bg-[#0A0E17]/40 space-y-6">
              <div className="flex items-center justify-between border-b border-white/5 pb-3">
                <div className="flex items-center gap-2">
                  <Globe className="w-4 h-4 text-[#00F2FE]" />
                  <h2 className="text-sm font-bold text-white font-mono uppercase">
                    Configuring: {selectedRoute}
                  </h2>
                </div>

                <Button type="submit" variant="primary" size="sm" isLoading={saving} leftIcon={<Save className="w-3.5 h-3.5" />}>
                  Save Configuration
                </Button>
              </div>

              {/* Standard HTML Metadata */}
              <div className="space-y-4">
                <h3 className="text-xs font-mono text-slate-400 uppercase tracking-wider">
                  1. Search Engine Crawler Metadata
                </h3>

                <div className="space-y-1.5">
                  <div className="flex items-center justify-between">
                    <label className="text-xs font-mono text-slate-300">Page Title (&lt;title&gt;)</label>
                    <span className="text-[10px] font-mono text-slate-500">
                      {form.title.length}/60 characters recommended
                    </span>
                  </div>
                  <input
                    type="text"
                    required
                    value={form.title}
                    onChange={(e) => setForm({ ...form, title: e.target.value })}
                    className="w-full px-3.5 py-2 bg-[#05070B] border border-white/10 rounded-lg text-xs text-white focus:outline-none focus:border-[#00F2FE]"
                  />
                </div>

                <div className="space-y-1.5">
                  <div className="flex items-center justify-between">
                    <label className="text-xs font-mono text-slate-300">Meta Description</label>
                    <span className="text-[10px] font-mono text-slate-500">
                      {form.description.length}/160 characters recommended
                    </span>
                  </div>
                  <textarea
                    rows={3}
                    required
                    value={form.description}
                    onChange={(e) => setForm({ ...form, description: e.target.value })}
                    className="w-full px-3.5 py-2 bg-[#05070B] border border-white/10 rounded-lg text-xs text-white focus:outline-none focus:border-[#00F2FE]"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-mono text-slate-300">Canonical URL</label>
                  <input
                    type="url"
                    value={form.canonicalUrl || ''}
                    onChange={(e) => setForm({ ...form, canonicalUrl: e.target.value })}
                    placeholder="https://gmdware.com"
                    className="w-full px-3.5 py-2 bg-[#05070B] border border-white/10 rounded-lg text-xs font-mono text-white focus:outline-none focus:border-[#00F2FE]"
                  />
                </div>
              </div>

              {/* OpenGraph & Social Sharing */}
              <div className="space-y-4 pt-4 border-t border-white/5">
                <h3 className="text-xs font-mono text-slate-400 uppercase tracking-wider flex items-center gap-2">
                  <Share2 className="w-3.5 h-3.5 text-[#00F2FE]" />
                  2. OpenGraph / Social Share Preview
                </h3>

                <div className="space-y-1.5">
                  <label className="text-xs font-mono text-slate-300">OG Title</label>
                  <input
                    type="text"
                    value={form.ogTitle || ''}
                    onChange={(e) => setForm({ ...form, ogTitle: e.target.value })}
                    placeholder="Defaults to page title if left empty"
                    className="w-full px-3.5 py-2 bg-[#05070B] border border-white/10 rounded-lg text-xs text-white focus:outline-none focus:border-[#00F2FE]"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-mono text-slate-300">OG Description</label>
                  <textarea
                    rows={2}
                    value={form.ogDescription || ''}
                    onChange={(e) => setForm({ ...form, ogDescription: e.target.value })}
                    placeholder="Defaults to meta description if left empty"
                    className="w-full px-3.5 py-2 bg-[#05070B] border border-white/10 rounded-lg text-xs text-white focus:outline-none focus:border-[#00F2FE]"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-mono text-slate-300">OG Image URL</label>
                  <input
                    type="url"
                    value={form.ogImage || ''}
                    onChange={(e) => setForm({ ...form, ogImage: e.target.value })}
                    placeholder="https://gmdware.com/og-image.png"
                    className="w-full px-3.5 py-2 bg-[#05070B] border border-white/10 rounded-lg text-xs font-mono text-white focus:outline-none focus:border-[#00F2FE]"
                  />
                </div>
              </div>

              {/* Robots & Indexing Preference */}
              <div className="pt-4 border-t border-white/5 space-y-3">
                <h3 className="text-xs font-mono text-slate-400 uppercase tracking-wider">
                  3. Indexing & Crawler Rules
                </h3>

                <label className="flex items-center gap-3 p-3.5 rounded-xl border border-white/5 bg-[#05070B] cursor-pointer">
                  <input
                    type="checkbox"
                    checked={form.noIndex || false}
                    onChange={(e) => setForm({ ...form, noIndex: e.target.checked })}
                    className="w-4 h-4 rounded bg-[#0A0E17] border-white/10 text-[#F43F5E] focus:ring-0"
                  />
                  <div>
                    <span className="text-xs font-bold text-white block">
                      Disallow Search Indexing (noindex, nofollow)
                    </span>
                    <span className="text-[11px] text-slate-400">
                      Instructs Google and search spiders not to index this specific route.
                    </span>
                  </div>
                </label>
              </div>

              <div className="pt-2 flex justify-end">
                <Button type="submit" variant="primary" size="sm" isLoading={saving} leftIcon={<Save className="w-3.5 h-3.5" />}>
                  Save Configuration
                </Button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
