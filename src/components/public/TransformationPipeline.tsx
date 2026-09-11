'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Lightbulb, Compass, Palette, Code2, Server, Box, TrendingUp, ChevronRight } from 'lucide-react';
import { cn } from '@/lib/utils';

interface Stage {
  id: number;
  label: string;
  sublabel: string;
  icon: any;
  description: string;
  output: string;
}

const STAGES: Stage[] = [
  {
    id: 1,
    label: 'Idea',
    sublabel: 'PHASE 01',
    icon: Lightbulb,
    description: 'Raw domain hypothesis, operational constraints, and ambition.',
    output: 'System Requirements & Feasibility Model',
  },
  {
    id: 2,
    label: 'Strategy',
    sublabel: 'PHASE 02',
    icon: Compass,
    description: 'Mathematical architecture, domain boundary definition, and tech selection.',
    output: 'Architectural Blueprint & Topology Spec',
  },
  {
    id: 3,
    label: 'Design',
    sublabel: 'PHASE 03',
    icon: Palette,
    description: 'Bespoke UI/UX design, ergonomic layout systems, and cinematic motion curves.',
    output: 'Design System & Interactive Prototypes',
  },
  {
    id: 4,
    label: 'Code',
    sublabel: 'PHASE 04',
    icon: Code2,
    description: 'Full-stack engineering, strict type safety, clean abstractions, and unit testing.',
    output: 'Modular, Maintainable Codebase',
  },
  {
    id: 5,
    label: 'Infrastructure',
    sublabel: 'PHASE 05',
    icon: Server,
    description: 'Containerized deployment pipelines, edge CDN caching, and automated failover.',
    output: 'Multi-Region High-Availability Cluster',
  },
  {
    id: 6,
    label: 'Product',
    sublabel: 'PHASE 06',
    icon: Box,
    description: 'A cohesive digital platform delivering instant response times and rock-solid stability.',
    output: 'Production Flagship Release',
  },
  {
    id: 7,
    label: 'Impact',
    sublabel: 'PHASE 07',
    icon: TrendingUp,
    description: 'Accelerated enterprise transformation, measurable business ROI, and zero technical debt.',
    output: 'Autonomous Telemetry & Compounding Growth',
  },
];

export const TransformationPipeline: React.FC = () => {
  const [activeStage, setActiveStage] = useState(1);
  const [isPaused, setIsPaused] = useState(false);

  React.useEffect(() => {
    if (isPaused) return;
    if (typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      return;
    }

    const interval = setInterval(() => {
      setActiveStage((prev) => (prev >= STAGES.length ? 1 : prev + 1));
    }, 3200);

    return () => clearInterval(interval);
  }, [isPaused]);

  const current = STAGES[activeStage - 1];

  return (
    <div
      className="gmd-panel rounded-3xl p-6 sm:p-10 lg:p-12 border border-white/10 space-y-10"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      {/* Title & Tagline */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-6 border-b border-white/[0.08]">
        <div className="space-y-2">
          <span className="font-mono text-xs uppercase tracking-[0.25em] text-[#00D2FF]">
            // TRANSFORMATION CONTINUUM
          </span>
          <h3 className="text-3xl sm:text-4xl font-extrabold text-white font-display tracking-tight">
            From Idea to Impact
          </h3>
        </div>
        <p className="text-sm text-[#94A3B8] max-w-md font-sans">
          Software development is not an isolated step. We escort your ambition across seven seamless, continuous phases of engineering evolution.
        </p>
      </div>

      {/* Horizontal Pipeline Steps Track */}
      <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-2 relative">
        {STAGES.map((stage) => {
          const isSelected = activeStage === stage.id;
          const Icon = stage.icon;

          return (
            <button
              key={stage.id}
              onClick={() => setActiveStage(stage.id)}
              className={cn(
                'p-4 rounded-xl border text-left transition-all duration-200 cursor-pointer relative overflow-hidden group',
                isSelected
                  ? 'bg-[#080D18] border-[#0066FF] shadow-[0_0_20px_-5px_rgba(0,102,255,0.3)]'
                  : 'bg-[#06090F] border-white/[0.06] hover:border-white/20 hover:bg-[#080D18]/40'
              )}
            >
              {isSelected && (
                <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-[#00D2FF] to-[#0066FF]" />
              )}

              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span
                    className={cn(
                      'p-2 rounded-lg transition-colors',
                      isSelected ? 'bg-[#0066FF] text-white' : 'bg-[#0E1526] text-[#64748B] group-hover:text-white'
                    )}
                  >
                    <Icon className="w-4 h-4" />
                  </span>
                  <span className="font-mono text-[10px] text-[#64748B]">0{stage.id}</span>
                </div>

                <div>
                  <span className="font-mono text-[9px] text-[#00D2FF] uppercase block">
                    {stage.sublabel}
                  </span>
                  <h4 className="font-display font-bold text-white text-base tracking-tight">
                    {stage.label}
                  </h4>
                </div>
              </div>
            </button>
          );
        })}
      </div>

      {/* Stage Detail Spotlight Box */}
      <div className="p-6 sm:p-8 rounded-2xl bg-[#080D18] border border-[#0066FF]/30 grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
        <div className="md:col-span-8 space-y-2">
          <div className="flex items-center gap-2 font-mono text-xs text-[#00D2FF]">
            <span>PHASE 0{current.id} SPOTLIGHT:</span>
            <span className="text-white font-bold">{current.label.toUpperCase()}</span>
          </div>
          <p className="text-base text-slate-200 font-sans leading-relaxed">
            {current.description}
          </p>
        </div>

        <div className="md:col-span-4 p-4 rounded-xl bg-[#0E1526] border border-white/[0.06] space-y-1">
          <span className="font-mono text-[10px] text-[#64748B] uppercase tracking-widest block">
            VERIFIED DELIVERABLE:
          </span>
          <div className="font-mono text-xs text-[#10B981] font-semibold flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-[#10B981]" />
            <span>{current.output}</span>
          </div>
        </div>
      </div>
    </div>
  );
};
