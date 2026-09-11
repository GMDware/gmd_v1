'use client';

import React, { useState } from 'react';
import { CheckCircle2, AlertCircle, ArrowUpRight } from 'lucide-react';

interface AtelierContactProps {
  isStandalone?: boolean;
}

export const AtelierContact: React.FC<AtelierContactProps> = ({ isStandalone = false }) => {
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
        throw new Error(json.error?.message || 'Inquiry failed to transmit');
      }

      setSuccessMessage(
        json.data?.message ||
          'Inquiry received. Our principal architects will review your specifications and contact you directly.'
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
      setErrorMessage(err.message || 'Submission error');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <section className={`relative bg-[#0A0A0A] text-[#F5F2EB] ${isStandalone ? 'pt-32 pb-24' : 'py-24 border-b border-white/[0.08]'}`}>
      <div className="max-w-4xl mx-auto px-6 sm:px-12 space-y-16">
        {/* Section Header */}
        <div className="space-y-4">
          <span className="text-xs font-mono uppercase tracking-[0.2em] text-stone-400 block">
            COMMISSION A SYSTEM // 2026
          </span>
          <h2 className="text-4xl sm:text-6xl font-normal font-serif text-[#F5F2EB] leading-tight">
            Let&apos;s build something enduring.
          </h2>
          <p className="text-base text-stone-400 font-sans font-light max-w-xl leading-relaxed">
            Directly share your system objectives, architectural bottlenecks, and timeline expectations.
          </p>
        </div>

        {/* Feedback Banners */}
        {successMessage && (
          <div className="p-6 rounded-xl bg-white/5 border border-white/20 text-[#F5F2EB] flex items-start gap-3 text-sm font-sans">
            <CheckCircle2 className="w-5 h-5 shrink-0 mt-0.5" />
            <div className="space-y-1">
              <span className="font-mono text-xs uppercase tracking-widest block text-stone-300">
                [COMMISSION TRANSMITTED]
              </span>
              <p>{successMessage}</p>
            </div>
          </div>
        )}

        {errorMessage && (
          <div className="p-6 rounded-xl bg-rose-950/30 border border-rose-800/40 text-rose-300 flex items-start gap-3 text-sm font-sans">
            <AlertCircle className="w-5 h-5 shrink-0 mt-0.5" />
            <div className="space-y-1">
              <span className="font-mono text-xs uppercase tracking-widest block">
                [TRANSMISSION NOTICE]
              </span>
              <p>{errorMessage}</p>
            </div>
          </div>
        )}

        {/* Inquiry Salon Form */}
        <form onSubmit={handleSubmit} className="space-y-10 font-sans">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
            <div className="space-y-2">
              <label className="text-xs font-mono uppercase tracking-wider text-stone-400 block">
                Your Full Name *
              </label>
              <input
                type="text"
                required
                placeholder="e.g. Eleanor Vance"
                value={formData.fullName}
                onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                className="w-full pb-3 bg-transparent border-b border-white/20 text-[#F5F2EB] placeholder-stone-600 focus:outline-none focus:border-white transition-colors text-base"
              />
            </div>

            <div className="space-y-2">
              <label className="text-xs font-mono uppercase tracking-wider text-stone-400 block">
                Company or Entity
              </label>
              <input
                type="text"
                placeholder="e.g. Horizon Labs"
                value={formData.companyName}
                onChange={(e) => setFormData({ ...formData, companyName: e.target.value })}
                className="w-full pb-3 bg-transparent border-b border-white/20 text-[#F5F2EB] placeholder-stone-600 focus:outline-none focus:border-white transition-colors text-base"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
            <div className="space-y-2">
              <label className="text-xs font-mono uppercase tracking-wider text-stone-400 block">
                Corporate Email Address *
              </label>
              <input
                type="email"
                required
                placeholder="e.g. eleanor@horizon.org"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="w-full pb-3 bg-transparent border-b border-white/20 text-[#F5F2EB] placeholder-stone-600 focus:outline-none focus:border-white transition-colors text-base"
              />
            </div>

            <div className="space-y-2">
              <label className="text-xs font-mono uppercase tracking-wider text-stone-400 block">
                Direct Phone (Optional)
              </label>
              <input
                type="tel"
                placeholder="+1 (555) 019-2834"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                className="w-full pb-3 bg-transparent border-b border-white/20 text-[#F5F2EB] placeholder-stone-600 focus:outline-none focus:border-white transition-colors text-base"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
            <div className="space-y-2">
              <label className="text-xs font-mono uppercase tracking-wider text-stone-400 block">
                Engagement Discipline
              </label>
              <select
                value={formData.projectType}
                onChange={(e) => setFormData({ ...formData, projectType: e.target.value })}
                className="w-full pb-3 bg-[#0A0A0A] border-b border-white/20 text-[#F5F2EB] focus:outline-none focus:border-white text-sm"
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
                <label htmlFor="budget-range" className="text-xs font-mono uppercase tracking-wider text-stone-400 block">
                  Budget Allocation
                </label>
                <span className="text-[10px] font-mono text-stone-400">
                  [FLEXIBLE SPECTRUM]
                </span>
              </div>
              <select
                id="budget-range"
                value={formData.budgetRange}
                onChange={(e) => setFormData({ ...formData, budgetRange: e.target.value })}
                className="w-full pb-3 bg-[#0A0A0A] border-b border-white/20 text-[#F5F2EB] focus:outline-none focus:border-white text-sm"
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
            <label htmlFor="message" className="text-xs font-mono uppercase tracking-wider text-stone-400 block">
              Problem Statement & Architectural Scope *
            </label>
            <textarea
              id="message"
              rows={4}
              required
              placeholder="Briefly describe your objectives, performance criteria, or existing software challenges..."
              value={formData.message}
              onChange={(e) => setFormData({ ...formData, message: e.target.value })}
              className="w-full pb-3 bg-transparent border-b border-white/20 text-[#F5F2EB] placeholder-stone-600 focus:outline-none focus:border-white transition-colors text-base leading-relaxed"
            />
          </div>

          <div className="pt-4">
            <button
              type="submit"
              disabled={isLoading}
              className="px-10 py-4 rounded-full bg-[#F5F2EB] text-black font-medium text-xs uppercase tracking-widest hover:bg-white transition-all flex items-center gap-3"
            >
              <span>{isLoading ? 'Transmitting Commission...' : 'Transmit Commission'}</span>
              <span>→</span>
            </button>
          </div>
        </form>
      </div>
    </section>
  );
};
