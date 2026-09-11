'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { ArrowUpRight, CheckCircle2, Cpu, ShieldCheck, Terminal, Server, Sparkles } from 'lucide-react';
import { cn } from '@/lib/utils';

export interface ServiceItem {
  id: string;
  title: string;
  slug: string;
  shortDescription: string;
  fullDescription?: string;
  features?: string[];
  technologies?: string[];
}

interface ServiceNavigationProps {
  services: ServiceItem[];
}

export const ServiceNavigation: React.FC<ServiceNavigationProps> = ({ services }) => {
  const [selectedIndex, setSelectedIndex] = useState(0);

  if (!services || services.length === 0) {
    return null;
  }

  const activeService = services[selectedIndex] || services[0];

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
      {/* Left Selector Rail (5 Cols) */}
      <div className="lg:col-span-5 space-y-2">
        <span className="font-mono text-[11px] text-[#64748B] uppercase tracking-[0.2em] block mb-3">
          // CAPABILITIES MATRIX ({services.length} DISCIPLINES)
        </span>

        {services.map((service, idx) => {
          const isSelected = selectedIndex === idx;
          return (
            <button
              key={service.id}
              onClick={() => setSelectedIndex(idx)}
              className={cn(
                'w-full text-left p-5 rounded-xl border transition-all duration-200 cursor-pointer flex items-center justify-between group',
                isSelected
                  ? 'bg-[#080D18] border-[#0066FF] shadow-[0_0_25px_-5px_rgba(0,102,255,0.25)]'
                  : 'bg-[#06090F] border-white/[0.06] hover:border-white/20 hover:bg-[#080D18]/50'
              )}
            >
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span
                    className={cn(
                      'font-mono text-xs',
                      isSelected ? 'text-[#00D2FF] font-semibold' : 'text-[#64748B]'
                    )}
                  >
                    0{idx + 1}
                  </span>
                  <span className="text-white/20">•</span>
                  <span className="text-sm sm:text-base font-bold text-white tracking-tight font-display">
                    {service.title}
                  </span>
                </div>
                <p className="text-xs text-[#94A3B8] line-clamp-1 pl-6">
                  {service.shortDescription}
                </p>
              </div>

              <div
                className={cn(
                  'w-2 h-2 rounded-full transition-all duration-200',
                  isSelected ? 'bg-[#00D2FF] scale-125' : 'bg-transparent'
                )}
              />
            </button>
          );
        })}
      </div>

      {/* Right Canvas: Blueprint Deep-Dive (7 Cols) */}
      <div className="lg:col-span-7">
        <div className="gmd-panel rounded-2xl p-6 sm:p-8 lg:p-10 space-y-8 relative overflow-hidden">
          {/* Blueprint Header */}
          <div className="space-y-4 border-b border-white/[0.08] pb-6">
            <div className="flex items-center justify-between">
              <span className="font-mono text-xs text-[#00D2FF] tracking-wider uppercase">
                // ARCHITECTURAL DOSSIER
              </span>
              <Badge variant="cobalt" size="sm">
                SPEC_v3
              </Badge>
            </div>

            <h3 className="text-2xl sm:text-3xl font-extrabold text-white font-display tracking-tight">
              {activeService.title}
            </h3>

            <p className="text-sm sm:text-base text-[#94A3B8] leading-relaxed font-sans">
              {activeService.fullDescription || activeService.shortDescription}
            </p>
          </div>

          {/* Feature Deliverables Checklist */}
          {activeService.features && activeService.features.length > 0 && (
            <div className="space-y-3">
              <span className="font-mono text-xs text-white uppercase tracking-wider font-semibold block">
                CORE DELIVERABLES & GUARANTEES:
              </span>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                {activeService.features.map((feat, i) => (
                  <div
                    key={i}
                    className="p-3 rounded-lg bg-[#080D18] border border-white/[0.05] flex items-start gap-2.5 text-xs text-slate-200"
                  >
                    <CheckCircle2 className="w-4 h-4 text-[#00D2FF] shrink-0 mt-0.5" />
                    <span>{feat}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Associated Technologies */}
          {activeService.technologies && activeService.technologies.length > 0 && (
            <div className="space-y-2">
              <span className="font-mono text-[11px] text-[#64748B] uppercase tracking-widest block">
                INTEGRATED STACK:
              </span>
              <div className="flex flex-wrap gap-1.5">
                {activeService.technologies.map((tech) => (
                  <span
                    key={tech}
                    className="px-2.5 py-1 rounded bg-[#0E1526] border border-white/[0.06] font-mono text-xs text-[#00D2FF]"
                  >
                    {tech}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Action Trigger */}
          <div className="pt-2 flex items-center justify-between">
            <Link href="/contact">
              <Button variant="primary" size="md" rightIcon={<ArrowUpRight className="w-4 h-4" />}>
                Consult on {activeService.title}
              </Button>
            </Link>
            <span className="font-mono text-xs text-[#64748B]">
              [DISPATCH: INSTANT]
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
