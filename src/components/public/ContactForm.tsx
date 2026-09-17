'use client';

import React, { useState } from 'react';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { CheckCircle2, AlertCircle, ArrowUpRight, Terminal } from 'lucide-react';

export const ContactForm: React.FC = () => {
  const [formData, setFormData] = useState({
    fullName: '',
    companyName: '',
    email: '',
    phone: '',
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
        throw new Error(json.error?.message || 'Failed to submit inquiry');
      }

      setSuccessMessage(
        json.data?.message ||
          (isDiscoveryTier
            ? 'Inquiry received. Your project has been routed for a scoped architectural discovery call.'
            : 'Inquiry successfully transmitted to engineering leadership.')
      );
      setFormData({
        fullName: '',
        companyName: '',
        email: '',
        phone: '',
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
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Success Banner */}
      {successMessage && (
        <div className="p-4 rounded-xl bg-[#10B981]/10 border border-[#10B981]/25 flex items-start gap-3 text-sm text-[#10B981] animate-in fade-in">
          <CheckCircle2 className="w-5 h-5 shrink-0 mt-0.5" />
          <div className="space-y-1">
            <span className="font-mono text-xs uppercase font-bold block">[STATUS: TRANSMITTED]</span>
            <p>{successMessage}</p>
          </div>
        </div>
      )}

      {/* Error Banner */}
      {errorMessage && (
        <div className="p-4 rounded-xl bg-[#F43F5E]/10 border border-[#F43F5E]/25 flex items-start gap-3 text-sm text-[#F43F5E] animate-in fade-in">
          <AlertCircle className="w-5 h-5 shrink-0 mt-0.5" />
          <div className="space-y-1">
            <span className="font-mono text-xs uppercase font-bold block">[TRANSMISSION ERROR]</span>
            <p>{errorMessage}</p>
          </div>
        </div>
      )}

      {/* Name & Company */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Input
          label="Your Full Name"
          placeholder="e.g. Alex Morgan"
          required
          value={formData.fullName}
          onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
        />
        <Input
          label="Company or Organization"
          placeholder="e.g. Acme Global Technologies"
          value={formData.companyName}
          onChange={(e) => setFormData({ ...formData, companyName: e.target.value })}
        />
      </div>

      {/* Email & Phone */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Input
          label="Corporate Email Address"
          type="email"
          placeholder="alex@enterprise.com"
          required
          value={formData.email}
          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
        />
        <Input
          label="Direct Phone Number (Optional)"
          type="tel"
          placeholder="e.g. +1 (555) 019-2834"
          value={formData.phone}
          onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
        />
      </div>

      {/* Project Type & Budget */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="space-y-1.5">
          <label htmlFor="project-type" className="block text-xs font-mono uppercase tracking-wider text-[#94A3B8]">
            Project Type / Discipline
          </label>
          <select
            id="project-type"
            value={formData.projectType}
            onChange={(e) => setFormData({ ...formData, projectType: e.target.value })}
            className="w-full rounded-lg bg-[#080D18] border border-white/10 px-3.5 py-2.5 text-sm text-white focus:border-[#0066FF] focus:outline-none focus:ring-1 focus:ring-[#0066FF] font-sans"
          >
            <option value="Enterprise Web Platform">Enterprise Web Platform</option>
            <option value="Cloud Systems Architecture">Cloud Systems Architecture</option>
            <option value="Cinematic Digital Flagship">Cinematic Digital Flagship</option>
            <option value="Distributed Real-time Backend">Distributed Real-time Backend</option>
            <option value="AI / LLM Product Engineering">AI / LLM Product Engineering</option>
            <option value="Architectural Audit / Consultation">Architectural Audit / Consultation</option>
          </select>
        </div>

        <div className="space-y-1.5">
          <div className="flex items-center justify-between">
            <label htmlFor="budget-range" className="block text-xs font-mono uppercase tracking-wider text-[#94A3B8]">
              Estimated Budget Allocation
            </label>
            <span className="text-[10px] font-mono text-[#00F2FE]/90 tracking-wide uppercase">
              [Flexible Tiers]
            </span>
          </div>
          <select
            id="budget-range"
            value={formData.budgetRange}
            onChange={(e) => setFormData({ ...formData, budgetRange: e.target.value })}
            className="w-full rounded-lg bg-[#080D18] border border-white/10 px-3.5 py-2.5 text-sm text-white focus:border-[#0066FF] focus:outline-none focus:ring-1 focus:ring-[#0066FF] font-sans transition-colors"
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
          <p className="text-[11px] font-mono text-slate-500 pt-0.5">
            Calibrates system architecture, sprint capacity, and delivery pace.
          </p>
        </div>
      </div>

      {/* Target Timeline */}
      <div className="space-y-1.5">
        <label htmlFor="delivery-timeline" className="block text-xs font-mono uppercase tracking-wider text-[#94A3B8]">
          Target Delivery Timeline
        </label>
        <select
          id="delivery-timeline"
          value={formData.timeline}
          onChange={(e) => setFormData({ ...formData, timeline: e.target.value })}
          className="w-full rounded-lg bg-[#080D18] border border-white/10 px-3.5 py-2.5 text-sm text-white focus:border-[#0066FF] focus:outline-none focus:ring-1 focus:ring-[#0066FF] font-sans"
        >
          <option value="Immediate (Under 1 Month)">Immediate (Under 1 Month)</option>
          <option value="1 – 3 Months">1 – 3 Months (Standard Build)</option>
          <option value="3 – 6 Months">3 – 6 Months (Multi-Phase Enterprise)</option>
          <option value="6+ Months">6+ Months (Long-Term Retainer / Dedicated Team)</option>
        </select>
      </div>

      {/* Description / Message */}
      <div className="space-y-1.5">
        <label htmlFor="message" className="block text-xs font-mono uppercase tracking-wider text-[#94A3B8]">
          Architectural Scope & Problem Statement
        </label>
        <textarea
          id="message"
          rows={5}
          required
          placeholder="Briefly describe your systems objectives, timeline constraints, scale requirements, or existing technical bottlenecks..."
          value={formData.message}
          onChange={(e) => setFormData({ ...formData, message: e.target.value })}
          className="w-full rounded-lg bg-[#080D18] border border-white/10 px-3.5 py-2.5 text-sm text-white placeholder-[#64748B] transition-colors focus:border-[#0066FF] focus:outline-none focus:ring-1 focus:ring-[#0066FF] font-sans leading-relaxed"
        />
      </div>

      {/* Submit Trigger */}
      <Button
        type="submit"
        size="lg"
        variant="primary"
        className="w-full justify-center"
        isLoading={isLoading}
        rightIcon={<ArrowUpRight className="w-4 h-4" />}
      >
        Transmit Technical Inquiry
      </Button>

      {/* Security Guarantee */}
      <div className="flex items-center justify-center gap-2 text-[11px] font-mono text-[#64748B]">
        <Terminal className="w-3.5 h-3.5 text-[#0066FF]" />
        <span>ENCRYPTED TRANSMISSION — DIRECT INQUIRY TRIAGE</span>
      </div>
    </form>
  );
};
