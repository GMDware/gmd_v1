'use client';

import React from 'react';
import { Check } from 'lucide-react';

interface AtelierProcessProps {
  steps?: any[];
  isStandalone?: boolean;
}

export const AtelierProcess: React.FC<AtelierProcessProps> = ({
  steps = [],
  isStandalone = false,
}) => {
  const defaultStages = [
    {
      num: '01',
      title: 'Discover & Hypothesize',
      summary: 'Rigorous domain deconstruction and mathematical boundary mapping before writing code.',
      deliverables: ['Domain Bounded Context', 'Latency Budgets', 'Data Topology Blueprint'],
    },
    {
      num: '02',
      title: 'Strategize & Specify',
      summary: 'Authoring architectural blueprints, schema contracts, and distributed state boundaries.',
      deliverables: ['System Architecture Document', 'Data Migration Blueprint', 'Threat Assessment'],
    },
    {
      num: '03',
      title: 'Design with Intent',
      summary: 'Creating ergonomic user experiences with quiet visual dignity and disciplined motion.',
      deliverables: ['Design Token Architecture', 'Component Library', 'Interactive Prototypes'],
    },
    {
      num: '04',
      title: 'Build & Prove',
      summary: 'Crafting high-concurrency engines with end-to-end type safety and deterministic guarantees.',
      deliverables: ['Clean Production Code', 'Comprehensive Test Harness', 'Zero Cascade Failures'],
    },
    {
      num: '05',
      title: 'Deliver & Steward',
      summary: 'Zero-downtime cutovers, real-time observability telemetry, and long-term architectural care.',
      deliverables: ['Automated CI/CD', 'Telemetry Dashboard', 'Architectural Documentation'],
    },
  ];

  const stages =
    steps.length > 0
      ? steps.map((s, idx) => ({
          num: `0${s.stepNumber || idx + 1}`,
          title: s.phase || s.title,
          summary: s.description || 'Structured engineering milestone.',
          deliverables: s.deliverables || ['Architectural Deliverable', 'Verified Milestone'],
        }))
      : defaultStages;

  return (
    <section className={`relative bg-[#0A0A0A] text-[#F5F2EB] ${isStandalone ? 'pt-32 pb-24' : 'py-24 border-b border-white/[0.08]'}`}>
      <div className="max-w-6xl mx-auto px-6 sm:px-12 space-y-16">
        {/* Section Header */}
        <div className="max-w-2xl space-y-3">
          <span className="text-xs font-mono uppercase tracking-[0.2em] text-stone-400 block">
            DELIVERY SEQUENCE // 2026
          </span>
          <h2 className="text-3xl sm:text-5xl font-normal font-serif text-[#F5F2EB]">
            A Disciplined Delivery Protocol
          </h2>
          <p className="text-sm text-stone-400 leading-relaxed font-sans font-light">
            We reject chaotic agile theater in favor of structured architectural progression, explicit deliverables, and continuous proof.
          </p>
        </div>

        {/* Monograph Sequence Stack */}
        <div className="space-y-16">
          {stages.map((stage, idx) => (
            <div
              key={idx}
              className="grid grid-cols-1 md:grid-cols-12 gap-8 pt-10 border-t border-white/[0.08] items-start"
            >
              <div className="md:col-span-2">
                <span className="text-3xl sm:text-4xl font-serif text-stone-500 font-light block">
                  {stage.num}
                </span>
              </div>

              <div className="md:col-span-5 space-y-3">
                <h3 className="text-xl sm:text-2xl font-serif text-[#F5F2EB]">
                  {stage.title}
                </h3>
                <p className="text-sm text-stone-400 font-sans leading-relaxed font-light">
                  {stage.summary}
                </p>
              </div>

              <div className="md:col-span-5 space-y-2 pt-1">
                <span className="text-[11px] font-mono uppercase tracking-widest text-stone-500 block mb-2">
                  VERIFIED DELIVERABLES
                </span>
                <div className="space-y-2">
                  {stage.deliverables.map((item: string, dIdx: number) => (
                    <div key={dIdx} className="flex items-center gap-2 text-xs font-mono text-stone-300">
                      <span className="w-1 h-1 rounded-full bg-[#F5F2EB]" />
                      <span>{item}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
