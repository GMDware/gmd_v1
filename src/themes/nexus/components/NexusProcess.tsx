'use client';

import React, { useState } from 'react';
import { ArrowRight, Orbit, Sparkles, CheckCircle2 } from 'lucide-react';

interface NexusProcessProps {
  steps?: any[];
  isStandalone?: boolean;
}

export const NexusProcess: React.FC<NexusProcessProps> = ({
  steps = [],
  isStandalone = false,
}) => {
  const [activeStage, setActiveStage] = useState(0);

  const defaultPhases = [
    {
      num: '01',
      title: 'Discover & Model',
      concept: 'Deep domain modeling and operational bottleneck mapping.',
      deliverables: ['Domain Bounded Contexts', 'Latency Budgets', 'Data Topology Blueprint'],
    },
    {
      num: '02',
      title: 'Connect & Strategize',
      concept: 'Distributed interface contracts and resilient schema models.',
      deliverables: ['API & Event Schemas', 'Database Migration Graph', 'Security Threat Vectoring'],
    },
    {
      num: '03',
      title: 'Design & Synthesize',
      concept: 'Fluid ergonomic interfaces and continuous spatial motion design.',
      deliverables: ['Design Token Architecture', 'Kinetic Ergonomics', 'Micro-Interactions'],
    },
    {
      num: '04',
      title: 'Engineer & Harden',
      concept: 'High-concurrency backend workers and deterministic frontend code.',
      deliverables: ['Production TypeScript Suite', 'Strict Isolation', 'Zero Cascade Failures'],
    },
    {
      num: '05',
      title: 'Deploy & Evolve',
      concept: 'Zero-downtime multi-region cutover and telemetry monitoring.',
      deliverables: ['Automated Deploy Pipelines', 'APM Telemetry', 'Active Operational Support'],
    },
  ];

  const phases =
    steps.length > 0
      ? steps.map((s, idx) => ({
          num: `0${s.stepNumber || idx + 1}`,
          title: s.phase || s.title,
          concept: s.description || 'Continuous architectural transformation.',
          deliverables: s.deliverables || ['Architectural Milestone', 'Verified Deliverable'],
        }))
      : defaultPhases;

  const current = phases[activeStage] || phases[0];

  return (
    <section className={`relative overflow-hidden bg-[#030509] ${isStandalone ? 'pt-32 pb-24' : 'py-24 border-t border-white/5'}`}>
      <div className="max-w-6xl mx-auto px-4 sm:px-8 relative z-10 space-y-12">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/25 text-[11px] font-mono text-[#00F2FE]">
            <Orbit className="w-3 h-3" />
            <span>CONTINUOUS ENERGY PATHWAY</span>
          </div>
          <h2 className="text-3xl sm:text-5xl font-black text-white tracking-tight font-sans">
            Fluid Transformation Protocol
          </h2>
          <p className="text-sm text-slate-400">
            From initial domain resonance to live global deployment, the software flows through structured evolutionary stages.
          </p>
        </div>

        {/* Horizontal Fluid Nodes Stepper */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3">
          {phases.map((stage, idx) => {
            const isActive = activeStage === idx;
            return (
              <button
                key={idx}
                type="button"
                onClick={() => setActiveStage(idx)}
                className={`p-4 rounded-2xl border text-left transition-all duration-300 relative overflow-hidden ${
                  isActive
                    ? 'bg-[#00F2FE]/15 border-[#00F2FE] shadow-[0_0_20px_rgba(0,242,254,0.2)]'
                    : 'bg-[#080D1A]/60 border-white/10 hover:border-white/20 text-slate-400'
                }`}
              >
                <div className="text-[10px] font-mono font-bold tracking-widest text-cyan-400">
                  STAGE // {stage.num}
                </div>
                <div className={`text-xs sm:text-sm font-bold mt-1 line-clamp-1 ${isActive ? 'text-white' : 'text-slate-300'}`}>
                  {stage.title}
                </div>
              </button>
            );
          })}
        </div>

        {/* Active Stage Deep Dive Hologram */}
        {current && (
          <div className="p-8 sm:p-10 rounded-3xl bg-[#080D1A]/80 border border-cyan-500/30 backdrop-blur-2xl shadow-[0_0_50px_rgba(0,0,0,0.7)] grid grid-cols-1 md:grid-cols-12 gap-8 items-center relative overflow-hidden">
            <div className="absolute -bottom-16 -right-16 w-64 h-64 bg-purple-500/10 blur-3xl rounded-full pointer-events-none" />

            <div className="md:col-span-7 space-y-4">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-xs font-mono text-[#00F2FE]">
                <span>STAGE {current.num} // SPECIFICATION</span>
              </div>
              <h3 className="text-2xl sm:text-4xl font-bold text-white tracking-tight">
                {current.title}
              </h3>
              <p className="text-sm sm:text-base text-slate-300 leading-relaxed">
                {current.concept}
              </p>
            </div>

            <div className="md:col-span-5 p-6 rounded-2xl bg-black/40 border border-white/10 space-y-3">
              <span className="text-[10px] font-mono text-cyan-300 uppercase tracking-widest block">
                // GUARANTEED STAGE DELIVERABLES
              </span>
              <div className="space-y-2">
                {current.deliverables.map((item: string, i: number) => (
                  <div key={i} className="flex items-center gap-2.5 text-xs text-slate-200">
                    <CheckCircle2 className="w-3.5 h-3.5 text-[#00F2FE] shrink-0" />
                    <span>{item}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
};
