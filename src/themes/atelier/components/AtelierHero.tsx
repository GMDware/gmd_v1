'use client';

import React from 'react';
import Link from 'next/link';
import { ArrowUpRight } from 'lucide-react';

interface AtelierHeroProps {
  headline?: string;
  subtitle?: string;
  badge?: string;
  primaryCtaLabel?: string;
  primaryCtaUrl?: string;
  secondaryCtaLabel?: string;
  secondaryCtaUrl?: string;
}

export const AtelierHero: React.FC<AtelierHeroProps> = ({
  headline,
  subtitle,
  badge,
  primaryCtaLabel = 'View Selected Works',
  primaryCtaUrl = '/work',
  secondaryCtaLabel = 'Commission a System',
  secondaryCtaUrl = '/contact',
}) => {
  return (
    <section className="relative min-h-[88vh] flex flex-col justify-center pt-32 pb-24 px-6 sm:px-12 lg:px-16 bg-[#0A0A0A] text-[#F5F2EB] border-b border-white/[0.08]">
      <div className="max-w-6xl mx-auto w-full space-y-12">
        {/* Editorial Masthead Metadata */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-white/[0.08] text-xs font-mono text-stone-400">
          <div className="flex items-center gap-3">
            <span className="w-1.5 h-1.5 rounded-full bg-[#F5F2EB]" />
            <span className="uppercase tracking-widest">
              {badge || 'EDITION 2026 // PRINCIPAL DIGITAL ATELIER'}
            </span>
          </div>
          <div className="uppercase tracking-widest text-stone-500">
            DIGITAL SYSTEMS • WEB PLATFORMS • BESPOKE ARCHITECTURE
          </div>
        </div>

        {/* Primary Editorial Headline */}
        <div className="space-y-6 max-w-5xl">
          <h1 className="text-4xl sm:text-7xl md:text-8xl lg:text-9xl font-normal tracking-tight font-serif leading-[1.02] text-[#F5F2EB]">
            {headline || (
              <>
                DIGITAL PRODUCTS <br />
                <span className="italic font-light text-stone-400">BUILT WITH INTENT.</span>
              </>
            )}
          </h1>

          {/* Subtitle / Manifesto paragraph */}
          <div className="grid grid-cols-1 md:grid-cols-12 gap-8 pt-4">
            <div className="md:col-span-8 lg:col-span-7">
              <p className="text-base sm:text-xl text-stone-300 font-sans font-light leading-relaxed">
                {subtitle ||
                  'GMDware operates as an intimate digital product atelier. We eliminate agency noise to engineer enduring software architectures, bespoke enterprise platforms, and quiet technical perfection.'}
              </p>
            </div>

            {/* Action Buttons */}
            <div className="md:col-span-4 lg:col-span-5 flex flex-col sm:flex-row items-start md:items-end justify-end gap-4">
              <Link
                href={secondaryCtaUrl}
                className="px-8 py-3.5 rounded-full bg-[#F5F2EB] text-black font-sans font-medium text-xs uppercase tracking-wider hover:bg-white transition-all shadow-md"
              >
                {secondaryCtaLabel}
              </Link>
              <Link
                href={primaryCtaUrl}
                className="px-8 py-3.5 rounded-full border border-white/20 hover:border-white/60 text-[#F5F2EB] font-sans text-xs uppercase tracking-wider transition-colors"
              >
                {primaryCtaLabel}
              </Link>
            </div>
          </div>
        </div>

        {/* Editorial Values Strip */}
        <div className="pt-16 grid grid-cols-2 md:grid-cols-4 gap-8 border-t border-white/[0.08] text-xs font-mono">
          <div className="space-y-1">
            <span className="text-stone-500 block">01 / INTEGRITY</span>
            <span className="text-[#F5F2EB] font-sans font-medium text-sm">Deterministic Code</span>
          </div>
          <div className="space-y-1">
            <span className="text-stone-500 block">02 / ERGONOMICS</span>
            <span className="text-[#F5F2EB] font-sans font-medium text-sm">Quiet Human Experience</span>
          </div>
          <div className="space-y-1">
            <span className="text-stone-500 block">03 / PRECISION</span>
            <span className="text-[#F5F2EB] font-sans font-medium text-sm">Zero Waste Architecture</span>
          </div>
          <div className="space-y-1">
            <span className="text-stone-500 block">04 / DISCIPLINE</span>
            <span className="text-[#F5F2EB] font-sans font-medium text-sm">Principal Practitioners</span>
          </div>
        </div>
      </div>
    </section>
  );
};
