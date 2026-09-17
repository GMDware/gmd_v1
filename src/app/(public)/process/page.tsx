import React from 'react';
import type { Metadata } from 'next';
import DataStore from '@/lib/db/data-store';
import { Container } from '@/components/ui/Container';
import { ProcessTimeline } from '@/components/public/ProcessTimeline';
import { SectionConduit } from '@/components/ui/SectionConduit';
import { CallToAction } from '@/components/public/CallToAction';

import { resolveActiveTheme } from '@/lib/theme/resolver';
import { NexusProcess } from '@/themes/nexus/components/NexusProcess';
import { AtelierProcess } from '@/themes/atelier/components/AtelierProcess';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export async function generateMetadata(): Promise<Metadata> {
  return DataStore.getSEO('/process');
}

export default async function ProcessPage({
  searchParams,
}: {
  searchParams?: Promise<Record<string, string | string[] | undefined>>;
}) {
  const resolvedParams = searchParams ? await searchParams : undefined;
  const { themeId } = await resolveActiveTheme(resolvedParams);
  const processSteps = await DataStore.getProcessSteps();

  if (themeId === 'nexus') {
    return <NexusProcess steps={processSteps} isStandalone={true} />;
  }

  if (themeId === 'atelier') {
    return <AtelierProcess steps={processSteps} isStandalone={true} />;
  }

  const PHASES_SUMMARY =
    processSteps && processSteps.length > 0
      ? processSteps.map((s: any, idx: number) => ({
          num: String(s.stepNumber || idx + 1).padStart(2, '0'),
          name: s.phase || s.title,
          role: s.title || s.description?.slice(0, 50) || 'Deterministic Delivery',
        }))
      : [
          { num: '01', name: 'Discover', role: 'Domain Modeling & Operational Constraints' },
          { num: '02', name: 'Strategize', role: 'System Architecture & Data Topologies' },
          { num: '03', name: 'Design', role: 'UI/UX Ergonomics & Cinematic Motion Systems' },
          { num: '04', name: 'Build', role: 'Core Engineering & Concurrency Pipelines' },
          { num: '05', name: 'Test', role: 'Security Hardening & Peak Load Benchmarks' },
          { num: '06', name: 'Deploy', role: 'Zero-Downtime Multi-Region Cutover' },
          { num: '07', name: 'Evolve', role: 'Real-Time APM Telemetry & Long-Term Stewardship' },
        ];

  return (
    <div className="py-20 space-y-24 bg-[#05080F]">
      <Container size="wide">
        {/* Editorial Header */}
        <div className="max-w-4xl space-y-5 mb-16">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-[#0066FF] animate-pulse" />
            <span className="font-mono text-xs tracking-[0.25em] uppercase text-[#00D2FF]">
              7-PHASE DETERMINISTIC DELIVERY PROTOCOL
            </span>
          </div>

          <h1 className="text-4xl sm:text-6xl md:text-7xl font-black text-white font-display tracking-tight leading-[1.08]">
            Predictable Execution From Architecture to Scale
          </h1>

          <p className="text-base sm:text-xl text-[#94A3B8] leading-relaxed font-sans max-w-3xl">
            Software engineering must not rely on guesswork or chaotic sprints. We operate a structured 7-phase protocol guaranteeing architectural integrity, strict type contracts, and zero operational surprises in production.
          </p>

          {/* Quick Continuum Navigation Strip */}
          <div className="pt-6 grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-2">
            {PHASES_SUMMARY.map((p) => (
              <div
                key={p.num}
                className="p-2.5 rounded-lg bg-[#070E1E] border border-white/[0.06] text-left"
              >
                <div className="font-mono text-[10px] text-[#00D2FF]">PHASE {p.num}</div>
                <div className="text-xs font-bold text-white font-display mt-0.5 truncate">{p.name}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Storytelling Conduit */}
        <SectionConduit label="PROTOCOL — CONTINUOUS FLOW" />

        {/* Detailed Process Timeline */}
        <div className="max-w-5xl mx-auto pt-8">
          <ProcessTimeline steps={processSteps} />
        </div>
      </Container>

      {/* Conversion Terminal */}
      <Container size="wide">
        <CallToAction
          headline="Ready for a Deterministic Engagement?"
          subtitle="Begin with Phase 01: Discover. An in-depth technical audit and architectural blueprint tailored directly to your domain constraints."
          buttonLabel="Initiate Phase 01 Discovery"
          buttonUrl="/contact"
        />
      </Container>
    </div>
  );
}
