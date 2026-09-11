'use client';

import React, { useState, useEffect } from 'react';
import { AdminBreadcrumb } from '@/components/admin/AdminBreadcrumb';
import { useAdminToast } from '@/components/admin/AdminToast';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import {
  Settings,
  Save,
  ShieldCheck,
  Building,
  Mail,
  MapPin,
  Clock,
  Key,
} from 'lucide-react';

export default function AdminSettingsPage() {
  const { success, error } = useAdminToast();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [settings, setSettings] = useState<Record<string, string>>({
    brand_name: 'GMDware',
    legal_entity_name: 'GMDware Digital Solutions LLC',
    tagline: 'Architecting High-Performance Digital Solutions & Enterprise Software',
    contact_email: 'inquiries@gmdware.com',
    support_email: 'support@gmdware.com',
    headquarters_location: 'Delaware, USA / Global Remote Engineering',
    business_hours: 'Monday – Friday, 09:00 – 18:00 UTC',
    system_version: 'v1.2.0-production',
  });

  useEffect(() => {
    loadSettings();
  }, []);

  const loadSettings = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/v1/content/settings');
      const json = await res.json();
      if (json.success && json.data) {
        setSettings((prev) => ({ ...prev, ...json.data }));
      }
    } catch {
      error('Failed to load site settings');
    } finally {
      setLoading(false);
    }
  };

  const handleSaveSettings = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      // Save all keys via PUT to settings
      const promises = Object.entries(settings).map(([key, value]) =>
        fetch('/api/v1/content/settings', {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ key, value }),
        })
      );

      await Promise.all(promises);
      success('Global site settings updated successfully');
    } catch {
      error('Failed to save settings');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-6">
      <AdminBreadcrumb items={[{ label: 'Site Settings' }]} />

      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/5 pb-4">
        <div>
          <h1 className="text-2xl font-bold text-white tracking-tight">
            Global Site Settings & Operational Constants
          </h1>
          <p className="text-xs text-slate-400">
            System identifiers, official communication emails, business hours, and operational metadata.
          </p>
        </div>
      </div>

      {loading ? (
        <div className="py-20 text-center text-slate-500 font-mono text-xs">
          Loading site configuration from database...
        </div>
      ) : (
        <form onSubmit={handleSaveSettings} className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            <div className="lg:col-span-8 space-y-6">
              {/* Brand and entity */}
              <div className="glass-panel p-6 rounded-2xl border border-white/10 bg-[#0A0E17]/40 space-y-4">
                <h2 className="text-sm font-bold text-white uppercase tracking-wider font-mono flex items-center gap-2">
                  <Building className="w-4 h-4 text-[#00F2FE]" />
                  Corporate Identification
                </h2>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-xs font-mono text-slate-300">Brand Name</label>
                    <input
                      type="text"
                      value={settings.brand_name || ''}
                      onChange={(e) => setSettings({ ...settings, brand_name: e.target.value })}
                      className="w-full px-3.5 py-2 bg-[#05070B] border border-white/10 rounded-lg text-xs text-white focus:outline-none focus:border-[#00F2FE]"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-mono text-slate-300">Legal Entity Name</label>
                    <input
                      type="text"
                      value={settings.legal_entity_name || ''}
                      onChange={(e) => setSettings({ ...settings, legal_entity_name: e.target.value })}
                      className="w-full px-3.5 py-2 bg-[#05070B] border border-white/10 rounded-lg text-xs text-white focus:outline-none focus:border-[#00F2FE]"
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-mono text-slate-300">Corporate Proposition Tagline</label>
                  <input
                    type="text"
                    value={settings.tagline || ''}
                    onChange={(e) => setSettings({ ...settings, tagline: e.target.value })}
                    className="w-full px-3.5 py-2 bg-[#05070B] border border-white/10 rounded-lg text-xs text-white focus:outline-none focus:border-[#00F2FE]"
                  />
                </div>
              </div>

              {/* Communication addresses */}
              <div className="glass-panel p-6 rounded-2xl border border-white/10 bg-[#0A0E17]/40 space-y-4">
                <h2 className="text-sm font-bold text-white uppercase tracking-wider font-mono flex items-center gap-2">
                  <Mail className="w-4 h-4 text-[#7F00FF]" />
                  Communication Endpoints
                </h2>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-xs font-mono text-slate-300">Inbound Inquiries Email</label>
                    <input
                      type="email"
                      value={settings.contact_email || ''}
                      onChange={(e) => setSettings({ ...settings, contact_email: e.target.value })}
                      className="w-full px-3.5 py-2 bg-[#05070B] border border-white/10 rounded-lg text-xs text-white focus:outline-none focus:border-[#00F2FE]"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-mono text-slate-300">Technical Support Email</label>
                    <input
                      type="email"
                      value={settings.support_email || ''}
                      onChange={(e) => setSettings({ ...settings, support_email: e.target.value })}
                      className="w-full px-3.5 py-2 bg-[#05070B] border border-white/10 rounded-lg text-xs text-white focus:outline-none focus:border-[#00F2FE]"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-xs font-mono text-slate-300">Headquarters / Jurisdictional Location</label>
                    <input
                      type="text"
                      value={settings.headquarters_location || ''}
                      onChange={(e) => setSettings({ ...settings, headquarters_location: e.target.value })}
                      className="w-full px-3.5 py-2 bg-[#05070B] border border-white/10 rounded-lg text-xs text-white focus:outline-none focus:border-[#00F2FE]"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-mono text-slate-300">Operational SLA Hours</label>
                    <input
                      type="text"
                      value={settings.business_hours || ''}
                      onChange={(e) => setSettings({ ...settings, business_hours: e.target.value })}
                      className="w-full px-3.5 py-2 bg-[#05070B] border border-white/10 rounded-lg text-xs text-white focus:outline-none focus:border-[#00F2FE]"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Diagnostics and Security Info */}
            <div className="lg:col-span-4 space-y-6">
              <div className="glass-panel p-6 rounded-2xl border border-white/10 bg-[#0A0E17]/40 space-y-4">
                <h3 className="text-xs font-bold text-white uppercase tracking-wider font-mono flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-[#10B981]" />
                  Security Specifications
                </h3>

                <div className="space-y-2 text-xs">
                  <div className="p-3 bg-[#05070B] rounded-lg border border-white/5 space-y-0.5">
                    <span className="text-[10px] font-mono text-slate-500 block">SESSION PROTOCOL</span>
                    <span className="font-mono text-white">JOSE HS256 JWT (HttpOnly Cookie)</span>
                  </div>

                  <div className="p-3 bg-[#05070B] rounded-lg border border-white/5 space-y-0.5">
                    <span className="text-[10px] font-mono text-slate-500 block">PASSWORD CRYPTOGRAPHY</span>
                    <span className="font-mono text-white">Bcrypt Salted Work Factor 12</span>
                  </div>

                  <div className="p-3 bg-[#05070B] rounded-lg border border-white/5 space-y-0.5">
                    <span className="text-[10px] font-mono text-slate-500 block">MEDIA VALIDATION</span>
                    <span className="font-mono text-white">Magic-Byte Binary Header Verification</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="flex justify-end pt-4 border-t border-white/5">
            <Button
              type="submit"
              variant="primary"
              size="lg"
              isLoading={saving}
              leftIcon={<Save className="w-4 h-4" />}
            >
              Save Global Settings
            </Button>
          </div>
        </form>
      )}
    </div>
  );
}
