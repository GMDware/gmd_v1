'use client';

import React, { useState } from 'react';
import { ArrowUpRight, Radio, CheckCircle2, AlertCircle, Sparkles, Orbit, ShieldCheck } from 'lucide-react';

interface NexusContactProps {
  isStandalone?: boolean;
}

export const NexusContact: React.FC<NexusContactProps> = ({ isStandalone = false }) => {
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    companyName: '',
    projectType: 'Enterprise Web Platform',
    budgetRange: 'Flexible / Open to Architectural Consultation',
    timeline: '1 – 3 Months (Standard Build)',
    message: '',
  });

  const [isLoading, setIsLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const isDiscoveryTier =
    formData.budgetRange.includes('< $5,000') ||
    formData.budgetRange.toLowerCase().includes('flexible');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setSuccessMessage(null);
    setErrorMessage(null);

    try {
      const payload = {
        ...formData,
        intakeRoute: isDiscoveryTier ? 'SCOPED_DISCOVERY_CALL' : 'STANDARD_ENGAGEMENT',
        routingTag: isDiscoveryTier ? 'Scoped Discovery Call' : 'Standard Evaluation',
      };

      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const json = await res.json();
      if (!res.ok || !json.success) {
        throw new Error(json.error?.message || 'Connection initialization failed');
      }

      setSuccessMessage(
        json.data?.message ||
          'Connection beacon received. Architectural leads are preparing your discovery session.'
      );
      setFormData({
        fullName: '',
        email: '',
        phone: '',
        companyName: '',
        projectType: 'Enterprise Web Platform',
        budgetRange: 'Flexible / Open to Architectural Consultation',
        timeline: '1 – 3 Months (Standard Build)',
        message: '',
      });
    } catch (err: any) {
      setErrorMessage(err.message || 'Signal transmission error');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <section className={`relative overflow-hidden bg-[#030509] ${isStandalone ? 'pt-32 pb-24' : 'py-24 border-t border-white/5'}`}>
      {/* Background glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-cyan-500/10 blur-[150px] rounded-full pointer-events-none" />

      <div className="max-w-4xl mx-auto px-4 sm:px-8 relative z-10 space-y-12">
        {/* Header */}
        <div className="text-center space-y-4">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-[11px] font-mono text-[#00F2FE]">
            <Radio className="w-3 h-3 animate-pulse" />
            <span>DIRECT NETWORK DISPATCH — ZERO INTERMEDIARIES</span>
          </div>
          <h2 className="text-3xl sm:text-5xl font-black text-white tracking-tight font-sans">
            Initiate a Connection
          </h2>
          <p className="text-sm text-slate-400 max-w-xl mx-auto leading-relaxed">
            Transmit your system specifications directly to our engineering leadership. We evaluate every inquiry with mathematical rigor.
          </p>
        </div>

        {/* Transmission Card */}
        <div className="p-8 sm:p-10 rounded-3xl bg-[#080D1A]/85 border border-cyan-500/30 backdrop-blur-2xl shadow-[0_0_50px_rgba(0,0,0,0.8)]">
          {successMessage && (
            <div className="mb-6 p-4 rounded-2xl bg-[#00F2FE]/10 border border-[#00F2FE]/40 text-[#00F2FE] flex items-start gap-3 text-sm">
              <CheckCircle2 className="w-5 h-5 shrink-0 mt-0.5" />
              <div>
                <span className="font-mono text-xs font-bold uppercase block">[BEACON TRANSMITTED]</span>
                <p>{successMessage}</p>
              </div>
            </div>
          )}

          {errorMessage && (
            <div className="mb-6 p-4 rounded-2xl bg-rose-500/10 border border-rose-500/30 text-rose-300 flex items-start gap-3 text-sm">
              <AlertCircle className="w-5 h-5 shrink-0 mt-0.5" />
              <div>
                <span className="font-mono text-xs font-bold uppercase block">[TRANSMISSION REJECTED]</span>
                <p>{errorMessage}</p>
              </div>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <div className="space-y-2">
                <label className="text-xs font-mono text-cyan-300 uppercase tracking-wider block">
                  Your Full Name *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Maya Lin"
                  value={formData.fullName}
                  onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                  className="w-full px-4 py-3 rounded-xl bg-black/50 border border-cyan-500/20 text-white placeholder-slate-500 focus:outline-none focus:border-[#00F2FE] text-sm font-sans"
                />
              </div>

              <div className="space-y-2">
                <label className="text-xs font-mono text-cyan-300 uppercase tracking-wider block">
                  Company / Organization
                </label>
                <input
                  type="text"
                  placeholder="e.g. Apex Orbital Systems"
                  value={formData.companyName}
                  onChange={(e) => setFormData({ ...formData, companyName: e.target.value })}
                  className="w-full px-4 py-3 rounded-xl bg-black/50 border border-cyan-500/20 text-white placeholder-slate-500 focus:outline-none focus:border-[#00F2FE] text-sm font-sans"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <div className="space-y-2">
                <label className="text-xs font-mono text-cyan-300 uppercase tracking-wider block">
                  Corporate Email *
                </label>
                <input
                  type="email"
                  required
                  placeholder="name@organization.com"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full px-4 py-3 rounded-xl bg-black/50 border border-cyan-500/20 text-white placeholder-slate-500 focus:outline-none focus:border-[#00F2FE] text-sm font-sans"
                />
              </div>

              <div className="space-y-2">
                <label className="text-xs font-mono text-cyan-300 uppercase tracking-wider block">
                  Direct Phone (Optional)
                </label>
                <input
                  type="tel"
                  placeholder="+1 (555) 019-2834"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  className="w-full px-4 py-3 rounded-xl bg-black/50 border border-cyan-500/20 text-white placeholder-slate-500 focus:outline-none focus:border-[#00F2FE] text-sm font-sans"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <div className="space-y-2">
                <label className="text-xs font-mono text-cyan-300 uppercase tracking-wider block">
                  Project Type / Discipline
                </label>
                <select
                  value={formData.projectType}
                  onChange={(e) => setFormData({ ...formData, projectType: e.target.value })}
                  className="w-full px-4 py-3 rounded-xl bg-black/50 border border-cyan-500/20 text-white focus:outline-none focus:border-[#00F2FE] text-sm font-sans"
                >
                  <option value="Enterprise Web Platform">Enterprise Web Platform</option>
                  <option value="Cloud Systems Architecture">Cloud Systems Architecture</option>
                  <option value="Cinematic Digital Flagship">Cinematic Digital Flagship</option>
                  <option value="Distributed Real-time Backend">Distributed Real-time Backend</option>
                  <option value="AI / LLM Product Engineering">AI / LLM Product Engineering</option>
                  <option value="Architectural Audit / Consultation">Architectural Audit / Consultation</option>
                </select>
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <label htmlFor="budget-range" className="text-xs font-mono text-cyan-300 uppercase tracking-wider block">
                    Budget Allocation
                  </label>
                  <span className="text-[10px] font-mono text-[#00F2FE]">
                    [FLEXIBLE SPECTRUM]
                  </span>
                </div>
                <select
                  id="budget-range"
                  value={formData.budgetRange}
                  onChange={(e) => setFormData({ ...formData, budgetRange: e.target.value })}
                  className="w-full px-4 py-3 rounded-xl bg-black/50 border border-cyan-500/20 text-white focus:outline-none focus:border-[#00F2FE] text-sm font-sans"
                >
                  <option value="Flexible / Open to Architectural Consultation">
                    Flexible / Open to Architectural Consultation
                  </option>
                  <option value="< $5,000 (MVP / Focused Scope)">
                    &lt; $5,000 (MVP / Focused Scope)
                  </option>
                  <option value="$5,000 – $10,000 (Standard Module / Optimization)">
                    $5,000 – $10,000 (Standard Module / Optimization)
                  </option>
                  <option value="$10,000 – $25,000 (Full-Stack System)">
                    $10,000 – $25,000 (Full-Stack System)
                  </option>
                  <option value="$25,000 – $50,000 (Enterprise Solution)">
                    $25,000 – $50,000 (Enterprise Solution)
                  </option>
                  <option value="$50,000+ (High-Scale Architecture)">
                    $50,000+ (High-Scale Architecture)
                  </option>
                </select>
              </div>
            </div>

            <div className="space-y-2">
              <label htmlFor="message" className="text-xs font-mono text-cyan-300 uppercase tracking-wider block">
                System Scope & Bottlenecks *
              </label>
              <textarea
                id="message"
                rows={4}
                required
                placeholder="Describe your architectural scope, concurrency requirements, or existing bottlenecks..."
                value={formData.message}
                onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                className="w-full px-4 py-3 rounded-xl bg-black/50 border border-cyan-500/20 text-white placeholder-slate-500 focus:outline-none focus:border-[#00F2FE] text-sm font-sans leading-relaxed"
              />
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-4 rounded-2xl bg-gradient-to-r from-[#00F2FE] to-[#38BDF8] text-black font-bold text-sm shadow-[0_0_30px_rgba(0,242,254,0.3)] hover:shadow-[0_0_40px_rgba(0,242,254,0.5)] transition-all flex items-center justify-center gap-2"
            >
              <Radio className="w-4 h-4 text-black" />
              <span>{isLoading ? 'Transmitting Signal...' : 'Transmit Connection Beacon'}</span>
              <ArrowUpRight className="w-4 h-4" />
            </button>
          </form>
        </div>
      </div>
    </section>
  );
};
