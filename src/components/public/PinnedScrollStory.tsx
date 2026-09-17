'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Compass,
  Layers,
  Palette,
  Code2,
  Shield,
  Rocket,
  Activity,
  Terminal,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  Cpu,
  Zap,
} from 'lucide-react';
import { Container } from '@/components/ui/Container';

export interface PinnedStage {
  id: number;
  tag: string;
  phase: string;
  title: string;
  summary: string;
  condensed: string;
  bulletPoints: string[];
  metrics: { label: string; value: string };
  target: string;
  icon: React.ComponentType<{ className?: string }>;
}

const DEFAULT_STAGES: PinnedStage[] = [
  {
    id: 1,
    tag: 'STAGE 01 — DISCOVER',
    phase: 'Discover',
    title: 'Discover: Domain Modeling & Discovery',
    summary:
      'Auditing organizational bottlenecks, domain constraints, and requirements to construct mathematically determinable architectural models before authoring production code.',
    condensed: 'Domain modeling & constraints audit',
    bulletPoints: [
      'Domain Problem Audit',
      'System Requirements Spec',
      'Feasibility Model',
    ],
    metrics: { label: 'SPECIFICATION FIDELITY', value: '100% FORMAL' },
    target: 'DETERMINISTIC',
    icon: Compass,
  },
  {
    id: 2,
    tag: 'STAGE 02 — STRATEGIZE',
    phase: 'Strategize',
    title: 'Strategize: Systems Architecture & Topologies',
    summary:
      'Constructing high-scale domain boundaries, data models, and API contracts. Specifying decoupled event loops, relational schemas, and microservice topologies.',
    condensed: 'Systems topology & API architecture',
    bulletPoints: [
      'Architecture Blueprint',
      'Database ERD & Schema',
      'API Specification & Contracts',
    ],
    metrics: { label: 'SYSTEM TOPOLOGY', value: 'EVENT-DRIVEN' },
    target: 'ACID COMPLIANT',
    icon: Layers,
  },
  {
    id: 3,
    tag: 'STAGE 03 — DESIGN',
    phase: 'Design',
    title: 'Design: UI/UX & Design Systems',
    summary:
      'Translating complex enterprise workflows into intuitive digital flagships with ergonomic motion, tailored dark-mode tokens, and zero cognitive friction.',
    condensed: 'Ergonomic UI/UX & token systems',
    bulletPoints: [
      'Design Tokens System',
      'Interactive Figma Prototypes',
      'Viewport Matrix & a11y AA',
    ],
    metrics: { label: 'COGNITIVE EFFICIENCY', value: 'SUB-SECOND READ' },
    target: 'WCAG AA + 60FPS',
    icon: Palette,
  },
  {
    id: 4,
    tag: 'STAGE 04 — BUILD',
    phase: 'Build',
    title: 'Build: Core Engineering & Concurrency Pipelines',
    summary:
      'Full-stack engineering executed with mathematical determinism, strict TypeScript boundaries, clean domain abstractions, and high-concurrency queues.',
    condensed: 'Type-safe concurrency & pipelines',
    bulletPoints: [
      'Type-Safe Backend Services',
      'Next.js Client Application',
      'Automated Test Suite',
    ],
    metrics: { label: 'TYPE SAFETY STANDARD', value: 'STRICT ZERO-ANY' },
    target: 'PRODUCTION GRADE',
    icon: Code2,
  },
  {
    id: 5,
    tag: 'STAGE 05 — TEST',
    phase: 'Test',
    title: 'Test: Automated Verification & Load Hardening',
    summary:
      'Subjecting the platform to automated end-to-end verification, penetration testing, peak load benchmarking, and query optimization to eliminate regressions.',
    condensed: 'Automated verification & load hardening',
    bulletPoints: [
      'Security Audit Report',
      'Load & Stress Benchmarks',
      'Query Optimization',
    ],
    metrics: { label: 'TEST COVERAGE', value: '> 95% AUTOMATED' },
    target: 'ZERO REGRESSIONS',
    icon: Shield,
  },
  {
    id: 6,
    tag: 'STAGE 06 — DEPLOY',
    phase: 'Deploy',
    title: 'Deploy: Zero-Downtime Multi-Region Cutover',
    summary:
      'Continuous deployment into multi-region cloud infrastructure with immutable container rollouts, automated blue/green pipelines, and edge CDN routing.',
    condensed: 'Zero-downtime multi-region cutover',
    bulletPoints: [
      'Multi-Region Cluster',
      'Anycast Edge Routing',
      'Canary Rollout Pipeline',
    ],
    metrics: { label: 'UPTIME COMMITMENT', value: '99.99% SLA' },
    target: 'HIGH AVAILABILITY',
    icon: Rocket,
  },
  {
    id: 7,
    tag: 'STAGE 07 — EVOLVE',
    phase: 'Evolve',
    title: 'Evolve: Observability, Scaling & Stewardship',
    summary:
      'Continuous APM telemetry, distributed request tracing, automated backups, and proactive engineering stewardship to guarantee ongoing operational excellence.',
    condensed: 'Telemetry observability & scaling',
    bulletPoints: [
      'APM Telemetry Dashboard',
      'Distributed Request Tracing',
      'Guaranteed Stewardship SLA',
    ],
    metrics: { label: 'OBSERVABILITY', value: 'REAL-TIME APM' },
    target: 'CONTINUOUS DRIFT-FREE',
    icon: Activity,
  },
];

export interface PinnedScrollStoryProps {
  steps?: any[];
}

export const PinnedScrollStory: React.FC<PinnedScrollStoryProps> = ({ steps }) => {
  const [activeStageIndex, setActiveStageIndex] = useState(0);

  // Dynamically map CMS process steps if provided, else use the 7-stage baseline
  const stages: PinnedStage[] =
    steps && steps.length > 0
      ? steps.map((step: any, idx: number) => {
          const fallback = DEFAULT_STAGES[idx % DEFAULT_STAGES.length];
          return {
            id: step.stepNumber || idx + 1,
            tag: `STAGE 0${step.stepNumber || idx + 1} — ${(step.phase || fallback.phase).toUpperCase()}`,
            phase: step.phase || fallback.phase,
            title: step.title || fallback.title,
            summary: step.description || fallback.summary,
            condensed: fallback.condensed,
            bulletPoints:
              step.deliverables && step.deliverables.length > 0
                ? step.deliverables.slice(0, 3)
                : fallback.bulletPoints,
            metrics: fallback.metrics,
            target: fallback.target,
            icon: fallback.icon,
          };
        })
      : DEFAULT_STAGES;

  const activeStage = stages[activeStageIndex] || stages[0];
  const ActiveIcon = activeStage.icon;

  const handlePrev = useCallback(() => {
    setActiveStageIndex((prev) => (prev > 0 ? prev - 1 : stages.length - 1));
  }, [stages.length]);

  const handleNext = useCallback(() => {
    setActiveStageIndex((prev) => (prev < stages.length - 1 ? prev + 1 : 0));
  }, [stages.length]);

  // Keyboard navigation support (Arrow keys)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowRight') {
        handleNext();
      } else if (e.key === 'ArrowLeft') {
        handlePrev();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleNext, handlePrev]);

  return (
    <section className="relative py-20 border-b border-white/[0.08] bg-[#03060C] overflow-hidden">
      {/* Ambient Cosmic Backlight Glow */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[900px] h-[450px] bg-[#0066FF]/10 blur-[150px] pointer-events-none rounded-full" />
      <div className="absolute inset-0 blueprint-grid opacity-20 pointer-events-none" />

      <Container size="wide" className="relative z-10 space-y-12">
        {/* ── 1. Header ── */}
        <div className="max-w-4xl space-y-4">
          <div className="flex items-center gap-2.5">
            <span className="w-2 h-2 rounded-full bg-[#00D2FF] animate-pulse" />
            <span className="font-mono text-xs tracking-[0.25em] uppercase text-[#00D2FF] font-semibold">
              04 — PINNED NARRATIVE ARCHITECTURE
            </span>
          </div>

          <h2 className="text-3xl sm:text-5xl md:text-6xl font-black text-white font-display tracking-tight leading-[1.08]">
            The Engineering Continuum
          </h2>

          <p className="text-sm sm:text-base text-[#94A3B8] max-w-2xl font-sans leading-relaxed">
            Witness how a complex enterprise hypothesis matures through continuous architectural discipline into an immutable, battle-tested software platform.
          </p>
        </div>

        {/* ── 2. Main Stage: Hero Card ── */}
        <div className="relative rounded-3xl border border-white/10 bg-[#060B18]/90 backdrop-blur-2xl shadow-2xl shadow-black/80 overflow-hidden">
          {/* Subtle Top Accent Beam */}
          <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-[#00D2FF]/60 to-transparent" />
          <div className="absolute -top-24 right-1/4 w-72 h-72 bg-[#0066FF]/20 blur-[100px] pointer-events-none rounded-full" />

          {/* Console Header Bar */}
          <div className="flex items-center justify-between px-6 sm:px-8 py-4 border-b border-white/[0.08] bg-black/40 font-mono text-xs">
            <div className="flex items-center gap-2.5 text-[#00D2FF]">
              <Terminal className="w-4 h-4" />
              <span className="font-semibold tracking-wider">
                {`NARRATIVE_STAGE_0${activeStage.id}.SYS`}
              </span>
              <span className="hidden sm:inline text-white/20">—</span>
              <span className="hidden sm:inline text-[#64748B]">
                CONTINUUM_PROTOCOL
              </span>
            </div>

            <div className="flex items-center gap-4 text-xs">
              <div className="hidden sm:flex items-center gap-2 px-2.5 py-1 rounded-full bg-[#081226] border border-white/[0.08] text-[#94A3B8]">
                <span>STAGE</span>
                <span className="text-white font-bold">{`0${activeStage.id}`}</span>
                <span>/</span>
                <span>{`0${stages.length}`}</span>
              </div>
              <div className="flex items-center gap-2 text-[#64748B]">
                <span className="text-[#00D2FF] font-semibold">
                  {`PROGRESS: ${Math.round(((activeStageIndex + 1) / stages.length) * 100)}%`}
                </span>
                <span className="w-2 h-2 rounded-full bg-[#10B981] animate-pulse" />
              </div>
            </div>
          </div>

          {/* Dynamic Hero Card Stage Content (Animated on Stage Change) */}
          <div className="p-6 sm:p-10 lg:p-12 min-h-[380px] flex flex-col justify-center">
            <AnimatePresence mode="wait">
              <motion.div
                key={activeStage.id}
                initial={{ opacity: 0, y: 14 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -14 }}
                transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
                className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center"
              >
                {/* Left Column: Stage Visuals, Tag, Title, Summary */}
                <div className="lg:col-span-7 space-y-6">
                  {/* Holographic Icon & Stage Tag */}
                  <div className="flex items-start gap-5">
                    <div className="relative shrink-0">
                      <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-2xl bg-[#0066FF]/15 border border-[#0066FF]/40 flex items-center justify-center text-[#00D2FF] shadow-[0_0_40px_rgba(0,102,255,0.35)]">
                        <ActiveIcon className="w-10 h-10 sm:w-12 sm:h-12" />
                      </div>
                      {/* Orbiting Concentric Reticle */}
                      <div className="absolute -inset-2 border border-[#00D2FF]/20 rounded-3xl animate-[spin_20s_linear_infinite]" />
                    </div>

                    <div className="space-y-1.5 pt-1">
                      <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#0066FF]/10 border border-[#0066FF]/30 font-mono text-xs text-[#00D2FF] font-semibold tracking-wider uppercase">
                        <Cpu className="w-3 h-3 text-[#00D2FF]" />
                        {activeStage.tag}
                      </div>
                      <h3 className="text-2xl sm:text-3xl md:text-4xl font-black text-white font-display tracking-tight leading-tight">
                        {activeStage.phase}
                      </h3>
                    </div>
                  </div>

                  {/* Stage Summary Description */}
                  <p className="text-sm sm:text-base text-[#94A3B8] font-sans leading-relaxed max-w-xl">
                    {activeStage.summary}
                  </p>

                  {/* Telemetry Status Pills */}
                  <div className="flex flex-wrap items-center gap-3 pt-2">
                    <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-xl bg-[#081329] border border-[#0066FF]/30 font-mono text-xs">
                      <span className="text-[#64748B]">DELIVERY TARGET:</span>
                      <span className="text-[#00D2FF] font-bold tracking-wide">
                        {activeStage.target}
                      </span>
                    </div>

                    <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-xl bg-[#081329] border border-white/[0.08] font-mono text-xs">
                      <span className="text-[#64748B]">{activeStage.metrics.label}:</span>
                      <span className="text-white font-semibold">
                        {activeStage.metrics.value}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Right Column: Stage Deliverables & Engineering Specifications */}
                <div className="lg:col-span-5">
                  <div className="p-6 rounded-2xl bg-[#040813]/90 border border-white/[0.08] shadow-inner space-y-4">
                    <div className="flex items-center justify-between pb-3 border-b border-white/[0.06]">
                      <span className="font-mono text-xs tracking-wider uppercase text-[#94A3B8] font-semibold flex items-center gap-2">
                        <Zap className="w-3.5 h-3.5 text-[#00D2FF]" />
                        STAGE DELIVERABLES & SPECS
                      </span>
                      <span className="font-mono text-[10px] text-[#00D2FF] bg-[#00D2FF]/10 px-2 py-0.5 rounded border border-[#00D2FF]/20">
                        VERIFIED
                      </span>
                    </div>

                    <div className="space-y-2.5">
                      {activeStage.bulletPoints.map((bullet, bIdx) => (
                        <div
                          key={bIdx}
                          className="p-3 rounded-xl bg-[#081021]/80 border border-white/[0.05] flex items-center gap-3 transition-colors hover:border-[#0066FF]/40"
                        >
                          <div className="w-5 h-5 rounded-full bg-[#00D2FF]/10 flex items-center justify-center shrink-0">
                            <CheckCircle2 className="w-3.5 h-3.5 text-[#00D2FF]" />
                          </div>
                          <span className="text-xs sm:text-sm text-slate-200 font-sans font-medium">
                            {bullet}
                          </span>
                        </div>
                      ))}
                    </div>

                    <div className="pt-2 text-right">
                      <span className="font-mono text-[10px] text-[#64748B] tracking-widest uppercase">
                        ZERO SPECIFICATION DRIFT
                      </span>
                    </div>
                  </div>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Console Footer & Navigation Controls */}
          <div className="flex items-center justify-between px-6 sm:px-8 py-4 border-t border-white/[0.08] bg-black/40 font-mono text-xs">
            {/* Prev / Next Stage Buttons */}
            <div className="flex items-center gap-2">
              <button
                onClick={handlePrev}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#081226] border border-white/10 text-slate-300 hover:text-white hover:border-[#0066FF]/50 transition-all active:scale-95 cursor-pointer"
                aria-label="Previous Stage"
              >
                <ChevronLeft className="w-4 h-4 text-[#00D2FF]" />
                <span className="hidden sm:inline">PREV</span>
              </button>
              <button
                onClick={handleNext}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#081226] border border-white/10 text-slate-300 hover:text-white hover:border-[#0066FF]/50 transition-all active:scale-95 cursor-pointer"
                aria-label="Next Stage"
              >
                <span className="hidden sm:inline">NEXT</span>
                <ChevronRight className="w-4 h-4 text-[#00D2FF]" />
              </button>
              <span className="hidden md:inline text-[#64748B] ml-2 text-[11px]">
                [USE ← / → ARROW KEYS]
              </span>
            </div>

            {/* Segmented Quick Stage Indicators */}
            <div className="flex items-center gap-1.5 sm:gap-2">
              {stages.map((s, idx) => (
                <button
                  key={s.id}
                  onClick={() => setActiveStageIndex(idx)}
                  className={`h-1.5 rounded-full transition-all duration-300 cursor-pointer ${
                    idx === activeStageIndex
                      ? 'w-8 sm:w-10 bg-[#00D2FF] shadow-[0_0_10px_#00D2FF]'
                      : idx < activeStageIndex
                      ? 'w-3 sm:w-4 bg-[#0066FF]/60 hover:bg-[#0066FF]'
                      : 'w-2 sm:w-3 bg-white/20 hover:bg-white/40'
                  }`}
                  aria-label={`Jump to Stage 0${s.id} - ${s.phase}`}
                />
              ))}
            </div>

            <span className="font-mono text-[11px] text-[#64748B] hidden sm:inline">
              CONTINUOUS ARCHITECTURAL THREAD
            </span>
          </div>
        </div>

        {/* ── 3. Horizontal Interactive Stepper / Timeline ── */}
        <div className="space-y-3">
          <div className="flex items-center justify-between text-xs font-mono text-[#64748B]">
            <span className="tracking-widest uppercase">
              INTERACTIVE PIPELINE TIMELINE — SELECT STAGE
            </span>
            <span className="text-[#00D2FF]">
              {`ACTIVE: 0${activeStage.id} / 0${stages.length} — ${activeStage.phase.toUpperCase()}`}
            </span>
          </div>

          {/* Stepper Scroll Container with hidden scrollbar */}
          <div className="relative overflow-x-auto pb-4 pt-4 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
            {/* Connecting Track Line Behind Nodes */}
            <div className="absolute top-[26px] left-6 right-6 h-[2px] bg-white/[0.08] pointer-events-none hidden xl:block">
              {/* Dynamic Progress Fill on Line */}
              <div
                className="h-full bg-gradient-to-r from-[#0066FF] via-[#00D2FF] to-[#00D2FF] transition-all duration-500 ease-out"
                style={{
                  width: `${(activeStageIndex / (stages.length - 1)) * 100}%`,
                }}
              />
            </div>

            {/* Stepper Cards Row */}
            <div className="grid grid-cols-7 gap-3 min-w-[940px] xl:min-w-0">
              {stages.map((stage, idx) => {
                const isActive = idx === activeStageIndex;
                const isPassed = idx < activeStageIndex;
                const StageIcon = stage.icon;

                return (
                  <button
                    key={stage.id}
                    onClick={() => setActiveStageIndex(idx)}
                    className={`group relative flex flex-col justify-between p-4 rounded-2xl border text-left transition-all duration-300 cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-[#00D2FF] min-h-[148px] ${
                      isActive
                        ? 'bg-[#0A162B] border-[#00D2FF]/70 shadow-[0_0_28px_rgba(0,102,255,0.28)] ring-1 ring-[#00D2FF]/40'
                        : 'bg-[#050811]/70 border-white/[0.07] hover:border-white/20 hover:bg-[#080E1C] opacity-75 hover:opacity-100'
                    }`}
                  >
                    {/* Top Connector Node / Dot */}
                    <div className="flex items-center justify-between mb-3">
                      <div className="relative flex items-center justify-center">
                        {isActive ? (
                          <div className="relative flex items-center justify-center">
                            <span className="w-3.5 h-3.5 rounded-full bg-[#00D2FF] shadow-[0_0_12px_#00D2FF] border-2 border-white ring-4 ring-[#00D2FF]/25 animate-pulse" />
                          </div>
                        ) : isPassed ? (
                          <span className="w-2.5 h-2.5 rounded-full bg-[#0066FF] border border-[#00D2FF]/60" />
                        ) : (
                          <span className="w-2 h-2 rounded-full bg-white/20 border border-white/10 group-hover:bg-white/40" />
                        )}
                      </div>

                      {/* Stage Index */}
                      <span
                        className={`font-mono text-[11px] tracking-wider transition-colors ${
                          isActive
                            ? 'text-[#00D2FF] font-bold'
                            : 'text-[#64748B] group-hover:text-slate-300'
                        }`}
                      >
                        {`0${stage.id} / 0${stages.length}`}
                      </span>
                    </div>

                    {/* Stage Icon & Concise Title */}
                    <div className="space-y-1.5 my-1">
                      <div className="flex items-center gap-2">
                        <div
                          className={`p-1.5 rounded-lg shrink-0 transition-colors ${
                            isActive
                              ? 'bg-[#0066FF]/25 text-[#00D2FF] border border-[#0066FF]/40 shadow-[0_0_12px_rgba(0,102,255,0.3)]'
                              : 'bg-white/[0.04] text-[#64748B] border border-white/[0.06] group-hover:text-white group-hover:bg-white/[0.08]'
                          }`}
                        >
                          <StageIcon className="w-4 h-4" />
                        </div>
                        <h4
                          className={`font-display text-sm font-bold tracking-tight truncate transition-colors ${
                            isActive
                              ? 'text-white'
                              : 'text-[#94A3B8] group-hover:text-white'
                          }`}
                        >
                          {stage.phase}
                        </h4>
                      </div>

                      {/* 1-Line Condensed Descriptor */}
                      <p
                        className={`text-[11px] font-sans leading-snug line-clamp-2 transition-colors ${
                          isActive
                            ? 'text-slate-200 font-medium'
                            : 'text-[#64748B] group-hover:text-slate-400'
                        }`}
                      >
                        {stage.condensed}
                      </p>
                    </div>

                    {/* Active Bottom Glow Indicator */}
                    <div className="pt-2">
                      <div
                        className={`h-[2px] rounded-full transition-all duration-300 ${
                          isActive
                            ? 'w-full bg-gradient-to-r from-[#0066FF] to-[#00D2FF]'
                            : 'w-0 bg-transparent group-hover:w-4 group-hover:bg-white/20'
                        }`}
                      />
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
};
