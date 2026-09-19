'use client';

import React, { useState } from 'react';
import { Send, CheckCircle2, AlertCircle, RefreshCw, Mail, ShieldCheck, ArrowRight } from 'lucide-react';
import { motion, useReducedMotion } from 'framer-motion';
import { editorialEasing } from '../motion';

interface AtelierContactProps {
  isStandalone?: boolean;
}

export const AtelierContact: React.FC<AtelierContactProps> = ({
  isStandalone = false,
}) => {
  const shouldReduceMotion = useReducedMotion();

  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    companyName: '',
    projectType: 'Web Application',
    budgetRange: 'Flexible / Open to Consultation',
    timeline: '1 – 3 Months',
    message: '',
  });

  const [isLoading, setIsLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setSuccessMessage(null);
    setErrorMessage(null);

    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          fullName: formData.fullName,
          email: formData.email,
          phone: formData.phone || undefined,
          companyName: formData.companyName || undefined,
          projectType: formData.projectType,
          budget: formData.budgetRange,
          timeline: formData.timeline,
          message: formData.message,
        }),
      });

      const json = await res.json();

      if (res.ok && json.success) {
        setSuccessMessage(
          json.data?.message ||
            'Thank you for reaching out. We have received your inquiry and will follow up shortly.'
        );
        setFormData({
          fullName: '',
          email: '',
          phone: '',
          companyName: '',
          projectType: 'Web Application',
          budgetRange: 'Flexible / Open to Consultation',
          timeline: '1 – 3 Months',
          message: '',
        });
      } else {
        setErrorMessage(
          json.error?.message ||
            'We encountered an issue transmitting your message. Please verify your fields or email us directly.'
        );
      }
    } catch {
      setErrorMessage(
        'Unable to connect to the server. Please check your internet connection or email us directly at gmdware@gmail.com.'
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <section
      className={`px-6 max-w-6xl mx-auto w-full overflow-hidden ${
        isStandalone ? 'pt-8 pb-24' : 'py-20 border-t border-slate-200'
      }`}
      aria-label="Contact GMDware Studio"
    >
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
        {/* Left Column: Clear Invitation & Studio Details (5 Cols) */}
        <motion.div
          initial={shouldReduceMotion ? false : { opacity: 0, x: -25 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.6, ease: editorialEasing }}
          className="lg:col-span-5 space-y-8"
        >
          <div className="space-y-3">
            <div className="text-xs font-semibold text-blue-600 uppercase tracking-wide">
              Start a Conversation
            </div>

            <h2 className="text-2xl sm:text-4xl font-bold tracking-tight text-slate-900 font-sans">
              Let&apos;s talk about your project.
            </h2>

            <p className="text-base text-slate-600 font-sans leading-relaxed">
              Have a digital product, web platform, or website to build? Share your goals and timeline, and we will arrange a direct conversation with our technical team.
            </p>
          </div>

          {/* Practical Reassurances */}
          <div className="space-y-4 pt-4 border-t border-slate-200 text-sm">
            <div className="flex items-start gap-3">
              <div className="p-2 rounded-lg bg-blue-50 text-blue-600 shrink-0 mt-0.5">
                <Mail className="w-4 h-4" />
              </div>
              <div>
                <span className="font-semibold text-slate-900 block text-xs">
                  Direct Email
                </span>
                <a
                  href="mailto:gmdware@gmail.com"
                  className="text-slate-600 hover:text-blue-600 text-xs transition-colors"
                >
                  gmdware@gmail.com
                </a>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <div className="p-2 rounded-lg bg-blue-50 text-blue-600 shrink-0 mt-0.5">
                <ShieldCheck className="w-4 h-4" />
              </div>
              <div>
                <span className="font-semibold text-slate-900 block text-xs">
                  Confidentiality Guaranteed
                </span>
                <p className="text-slate-500 text-xs leading-relaxed">
                  We treat all project discussions with strict confidence and routinely execute NDAs prior to in-depth technical reviews.
                </p>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Right Column: Clean Project Inquiry Form (7 Cols) */}
        <motion.div
          initial={shouldReduceMotion ? false : { opacity: 0, y: 25 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.15 }}
          transition={{ duration: 0.65, delay: 0.1, ease: editorialEasing }}
          className="lg:col-span-7"
        >
          <div className="p-7 sm:p-9 rounded-2xl bg-white border border-slate-200/90 shadow-md shadow-slate-200/50 space-y-6 relative overflow-hidden">
            {/* Animated accent line */}
            <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-blue-600 via-indigo-600 to-transparent" />

            {/* Success Banner */}
            {successMessage && (
              <motion.div
                initial={{ opacity: 0, scale: 0.96 }}
                animate={{ opacity: 1, scale: 1 }}
                className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-900 flex items-start gap-3 text-xs sm:text-sm font-sans"
              >
                <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
                <div className="space-y-1">
                  <span className="font-semibold text-emerald-800 text-xs block">
                    Message Sent Successfully
                  </span>
                  <p className="leading-relaxed text-xs">{successMessage}</p>
                </div>
              </motion.div>
            )}

            {/* Error Banner */}
            {errorMessage && (
              <motion.div
                initial={{ opacity: 0, scale: 0.96 }}
                animate={{ opacity: 1, scale: 1 }}
                className="p-4 rounded-xl bg-rose-50 border border-rose-200 text-rose-900 flex items-start gap-3 text-xs sm:text-sm font-sans"
              >
                <AlertCircle className="w-5 h-5 text-rose-600 shrink-0 mt-0.5" />
                <div className="space-y-1">
                  <span className="font-semibold text-rose-800 text-xs block">
                    Submission Notice
                  </span>
                  <p className="leading-relaxed text-xs">{errorMessage}</p>
                </div>
              </motion.div>
            )}

            <form onSubmit={handleSubmit} noValidate className="space-y-5 text-xs font-sans">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label htmlFor="full-name" className="font-medium text-slate-700 block text-xs">
                    Your name *
                  </label>
                  <input
                    id="full-name"
                    type="text"
                    required
                    placeholder="e.g. Eleanor Vance"
                    value={formData.fullName}
                    onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-white border border-slate-200 text-slate-900 text-sm focus:outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-500/20 transition-all"
                  />
                </div>

                <div className="space-y-1.5">
                  <label htmlFor="company-name" className="font-medium text-slate-700 block text-xs">
                    Company or organization
                  </label>
                  <input
                    id="company-name"
                    type="text"
                    placeholder="e.g. Horizon Dynamics"
                    value={formData.companyName}
                    onChange={(e) => setFormData({ ...formData, companyName: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-white border border-slate-200 text-slate-900 text-sm focus:outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-500/20 transition-all"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label htmlFor="email" className="font-medium text-slate-700 block text-xs">
                    Work email address *
                  </label>
                  <input
                    id="email"
                    type="email"
                    required
                    placeholder="e.g. eleanor@horizon.org"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-white border border-slate-200 text-slate-900 text-sm focus:outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-500/20 transition-all"
                  />
                </div>

                <div className="space-y-1.5">
                  <label htmlFor="phone" className="font-medium text-slate-700 block text-xs">
                    Phone number (optional)
                  </label>
                  <input
                    id="phone"
                    type="tel"
                    placeholder="+1 (555) 019-2834"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-white border border-slate-200 text-slate-900 text-sm focus:outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-500/20 transition-all"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label htmlFor="project-type" className="font-medium text-slate-700 block text-xs">
                    Project type
                  </label>
                  <select
                    id="project-type"
                    value={formData.projectType}
                    onChange={(e) => setFormData({ ...formData, projectType: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-white border border-slate-200 text-slate-900 text-sm focus:outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-500/20 transition-all cursor-pointer"
                  >
                    <option value="Web Application">Web Application</option>
                    <option value="Digital Product">Digital Product</option>
                    <option value="Internal Operations Platform">Internal Operations Platform</option>
                    <option value="Website & Brand Flagship">Website & Brand Flagship</option>
                    <option value="Technical Architecture & Audit">Technical Architecture & Audit</option>
                  </select>
                </div>

                <div className="space-y-1.5">
                  <label htmlFor="budget-range" className="font-medium text-slate-700 block text-xs">
                    Estimated budget
                  </label>
                  <select
                    id="budget-range"
                    value={formData.budgetRange}
                    onChange={(e) => setFormData({ ...formData, budgetRange: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-white border border-slate-200 text-slate-900 text-sm focus:outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-500/20 transition-all cursor-pointer"
                  >
                    <option value="Flexible / Open to Consultation">Flexible / Open to Consultation</option>
                    <option value="< $10,000">&lt; $10,000 (Focused Scope / Prototype)</option>
                    <option value="$10,000 – $25,000">$10,000 – $25,000 (Standard Project)</option>
                    <option value="$25,000 – $50,000">$25,000 – $50,000 (Comprehensive Platform)</option>
                    <option value="$50,000+">$50,000+ (Multi-Phase Enterprise)</option>
                  </select>
                </div>
              </div>

              <div className="space-y-1.5">
                <label htmlFor="delivery-timeline" className="font-medium text-slate-700 block text-xs">
                  Desired timeline
                </label>
                <select
                  id="delivery-timeline"
                  value={formData.timeline}
                  onChange={(e) => setFormData({ ...formData, timeline: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-white border border-slate-200 text-slate-900 text-sm focus:outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-500/20 transition-all cursor-pointer"
                >
                  <option value="Immediate (Under 1 Month)">Immediate (Under 1 Month)</option>
                  <option value="1 – 3 Months">1 – 3 Months (Standard Build)</option>
                  <option value="3 – 6 Months">3 – 6 Months (Multi-Phase)</option>
                  <option value="6+ Months">6+ Months (Long-Term Retainer)</option>
                </select>
              </div>

              <div className="space-y-1.5">
                <label htmlFor="message" className="font-medium text-slate-700 block text-xs">
                  How can we help? *
                </label>
                <textarea
                  id="message"
                  rows={4}
                  required
                  placeholder="Tell us about what you are building, your primary goals, and any key requirements..."
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-white border border-slate-200 text-slate-900 text-sm focus:outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-500/20 transition-all leading-relaxed"
                />
              </div>

              <motion.button
                type="submit"
                disabled={isLoading}
                whileHover={shouldReduceMotion ? undefined : { y: -1 }}
                whileTap={{ scale: 0.98 }}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl border border-slate-300 hover:border-slate-900 bg-white/50 hover:bg-slate-900 text-slate-800 hover:text-white font-medium text-sm transition-all duration-200 shadow-sm group active:scale-[0.98] cursor-pointer disabled:opacity-50 disabled:pointer-events-none"
              >
                {isLoading ? (
                  <>
                    <RefreshCw className="w-4 h-4 animate-spin text-slate-500 group-hover:text-white" />
                    <span>Sending message...</span>
                  </>
                ) : (
                  <>
                    <span>Send message</span>
                    <ArrowRight className="w-4 h-4 text-slate-500 group-hover:text-white group-hover:translate-x-1 transition-transform" />
                  </>
                )}
              </motion.button>
            </form>
          </div>
        </motion.div>
      </div>
    </section>
  );
};
