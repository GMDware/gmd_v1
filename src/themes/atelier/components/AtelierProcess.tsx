'use client';

import React from 'react';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';

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
      title: 'Discovery & Scope',
      phase: 'Week 1–2',
      summary:
        'We understand your business objectives, map user journeys, outline technical constraints, and agree on clear deliverables before writing any code.',
      deliverables: ['Product specification', 'User workflow diagrams', 'Technical roadmap'],
    },
    {
      num: '02',
      title: 'Design & Prototyping',
      phase: 'Week 2–4',
      summary:
        'We design intuitive interfaces and clickable prototypes so you can experience the product early, give feedback, and align team stakeholders.',
      deliverables: ['Interface designs', 'Clickable prototype', 'Design system'],
    },
    {
      num: '03',
      title: 'Full-Stack Engineering',
      phase: 'Week 4–10',
      summary:
        'We build your product using modern, proven frameworks. We implement clean database models, reliable APIs, and maintainable frontends with regular sprint reviews.',
      deliverables: ['Production-ready codebase', 'API integration', 'Staging preview environments'],
    },
    {
      num: '04',
      title: 'Launch & Ongoing Support',
      phase: 'Week 10+',
      summary:
        'We execute a smooth release, monitor platform performance, hand over complete documentation, and provide ongoing technical improvements as you grow.',
      deliverables: ['Production deployment', 'Technical documentation', 'Ongoing maintenance'],
    },
  ];

  const stages =
    steps.length > 0
      ? steps.map((s, idx) => ({
          num: `0${s.stepNumber || idx + 1}`,
          title: s.title || s.phase,
          phase: s.phase || `Phase ${idx + 1}`,
          summary: s.description || 'Structured project milestone with clear deliverables.',
          deliverables: Array.isArray(s.deliverables)
            ? s.deliverables
            : ['Milestone Review', 'Working Deliverable'],
        }))
      : defaultStages;

  return (
    <section
      className={`px-6 max-w-6xl mx-auto w-full ${
        isStandalone ? 'pt-8 pb-24' : 'py-20 border-t border-slate-200'
      }`}
      aria-label="Studio Working Process"
    >
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-12 border-b border-slate-200">
        <div className="space-y-3 max-w-2xl">
          <div className="text-xs font-semibold text-slate-500 uppercase tracking-wide">
            How We Work
          </div>

          <h2 className="text-2xl sm:text-4xl font-bold tracking-tight text-slate-900 font-sans">
            A clear, collaborative process from idea to launch.
          </h2>

          <p className="text-base text-slate-600 font-sans leading-relaxed">
            We operate with transparency, frequent communication, and short feedback loops to deliver dependable software on schedule.
          </p>
        </div>

        {!isStandalone && (
          <Link
            href="/process"
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl border border-slate-300 hover:border-slate-900 bg-white/50 hover:bg-slate-900 text-slate-800 hover:text-white font-medium text-xs transition-all duration-200 shadow-sm group active:scale-[0.98] shrink-0"
          >
            <span>Learn more about our approach</span>
            <ArrowRight className="w-3.5 h-3.5 text-slate-500 group-hover:text-white group-hover:translate-x-1 transition-transform" />
          </Link>
        )}
      </div>

      {/* Process Stages List */}
      <div className="divide-y divide-slate-200">
        {stages.map((stage, idx) => (
          <div
            key={idx}
            className="py-10 grid grid-cols-1 md:grid-cols-12 gap-6 md:gap-10 items-start"
          >
            {/* Step Number & Title (4 Cols) */}
            <div className="md:col-span-4 space-y-1">
              <span className="text-xs font-normal text-slate-400">
                {stage.num}
              </span>
              <h3 className="text-xl font-bold text-slate-900 tracking-tight">
                {stage.title}
              </h3>
              <span className="text-xs text-blue-600 font-medium block pt-0.5">
                {stage.phase}
              </span>
            </div>

            {/* Description (5 Cols) */}
            <div className="md:col-span-5 text-sm text-slate-600 leading-relaxed">
              <p>{stage.summary}</p>
            </div>

            {/* Deliverables (3 Cols) */}
            <div className="md:col-span-3">
              <span className="text-xs font-medium text-slate-400 block pb-1">
                Key deliverables
              </span>
              <ul className="space-y-1 text-xs text-slate-600">
                {stage.deliverables.map((item: string, dIdx: number) => (
                  <li key={dIdx} className="flex items-start gap-2">
                    <span className="text-slate-300 select-none">•</span>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};
