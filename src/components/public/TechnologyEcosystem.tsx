'use client';

import React, { useState } from 'react';
import {
  Users,
  Monitor,
  Network,
  Cpu,
  Database,
  Cloud,
  ArrowRight,
  ShieldCheck,
  Zap,
  Activity,
  Layers,
  Terminal,
} from 'lucide-react';
import { TechItem } from './TechnologyGraph';

interface EcosystemTier {
  id: string;
  step: string;
  name: string;
  category: string;
  role: string;
  protocols: string;
  latencyTarget: string;
  resilienceMechanism: string;
  icon: React.ComponentType<{ className?: string }>;
  defaultTechs: string[];
}

const ECOSYSTEM_TIERS: EcosystemTier[] = [
  {
    id: 'user',
    step: '01',
    name: 'Client Edge',
    category: 'User Tier',
    role: 'Global end-users accessing applications via mobile, desktop, and embedded interfaces.',
    protocols: 'TLS 1.3 / HTTP/3 / QUIC',
    latencyTarget: '< 20ms Edge RTT',
    resilienceMechanism: 'Anycast DNS routing with Cloudflare edge failover',
    icon: Users,
    defaultTechs: ['Web Browsers', 'iOS Native', 'Android Native', 'Desktop Clients'],
  },
  {
    id: 'frontend',
    step: '02',
    name: 'Presentation & Edge SSR',
    category: 'Frontend Tier',
    role: 'Server-side rendered components, dynamic client-side hydration, and streaming UI boundaries.',
    protocols: 'React 19 / RSC / Next.js',
    latencyTarget: '< 80ms TTFB Hydration',
    resilienceMechanism: 'Static incremental regeneration (ISR) with stale-while-revalidate',
    icon: Monitor,
    defaultTechs: ['Next.js 15', 'React', 'TypeScript', 'TailwindCSS', 'Framer Motion'],
  },
  {
    id: 'api',
    step: '03',
    name: 'API Gateway & Mesh',
    category: 'Gateway Tier',
    role: 'Ingress traffic management, JWT authentication, rate limiting, and distributed request tracing.',
    protocols: 'gRPC / GraphQL / REST',
    latencyTarget: '< 15ms Ingress Overhead',
    resilienceMechanism: 'Token-bucket rate limiting, circuit breaking, automatic retry with jitter',
    icon: Network,
    defaultTechs: ['Kong Gateway', 'Cloudflare Workers', 'OpenAPI 3.1', 'Traefik', 'Envoy'],
  },
  {
    id: 'backend',
    step: '04',
    name: 'Application Services',
    category: 'Backend Tier',
    role: 'Business domain logic execution, asynchronous worker queues, and event orchestration.',
    protocols: 'Node.js / NestJS / Python / Go',
    latencyTarget: '< 35ms Service Execution',
    resilienceMechanism: 'Stateless horizontally autoscaled pods, BullMQ dead-letter queues',
    icon: Cpu,
    defaultTechs: ['Node.js', 'NestJS', 'Express', 'Python', 'FastAPI', 'BullMQ'],
  },
  {
    id: 'database',
    step: '05',
    name: 'Data & Persistence',
    category: 'Data Tier',
    role: 'ACID-compliant relational storage, in-memory caching, and vector indexing for AI retrieval.',
    protocols: 'PostgreSQL / Prisma / Redis',
    latencyTarget: '< 5ms Query Execution',
    resilienceMechanism: 'Multi-AZ replication, point-in-time recovery (PITR), connection pooling',
    icon: Database,
    defaultTechs: ['PostgreSQL', 'Prisma ORM', 'Redis', 'pgvector', 'TimescaleDB'],
  },
  {
    id: 'cloud',
    step: '06',
    name: 'Cloud & Orchestration',
    category: 'Infrastructure Tier',
    role: 'Containerized deployment infrastructure, automated CI/CD pipelines, and multi-region networking.',
    protocols: 'Docker / Kubernetes / AWS',
    latencyTarget: '99.99% Availability SLA',
    resilienceMechanism: 'Automated health-check self-healing, blue/green zero-downtime cutover',
    icon: Cloud,
    defaultTechs: ['Docker', 'AWS', 'Google Cloud', 'Terraform', 'GitHub Actions', 'Nginx'],
  },
];

interface TechnologyEcosystemProps {
  technologies?: TechItem[];
}

export function TechnologyEcosystem({ technologies = [] }: TechnologyEcosystemProps) {
  const [activeTierId, setActiveTierId] = useState<string>('frontend');
  const activeTier = ECOSYSTEM_TIERS.find((t) => t.id === activeTierId) || ECOSYSTEM_TIERS[1];
  const ActiveIcon = activeTier.icon;

  // Correlate database technologies with tiers
  const getTierTechs = (tier: EcosystemTier) => {
    if (!technologies || technologies.length === 0) return tier.defaultTechs;

    const matched = technologies.filter((t) => {
      const cat = t.category?.toLowerCase() || '';
      const name = t.name.toLowerCase();
      if (tier.id === 'frontend' && (cat.includes('front') || name.includes('react') || name.includes('next'))) return true;
      if (tier.id === 'backend' && (cat.includes('back') || name.includes('node') || name.includes('nest') || name.includes('express'))) return true;
      if (tier.id === 'database' && (cat.includes('data') || name.includes('postgre') || name.includes('prisma') || name.includes('redis') || name.includes('sql'))) return true;
      if (tier.id === 'cloud' && (cat.includes('cloud') || cat.includes('devops') || name.includes('docker') || name.includes('aws') || name.includes('linux'))) return true;
      if (tier.id === 'api' && (cat.includes('api') || name.includes('graphql') || name.includes('rest') || name.includes('swagger'))) return true;
      return false;
    });

    if (matched.length > 0) {
      return Array.from(new Set([...matched.map((m) => m.name), ...tier.defaultTechs])).slice(0, 6);
    }
    return tier.defaultTechs;
  };

  return (
    <section className="py-24 border-b border-white/[0.08] relative overflow-hidden bg-[#05080F]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-6 border-b border-white/[0.08] pb-8">
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-[#0066FF] animate-pulse" />
              <span className="font-mono text-xs tracking-[0.25em] uppercase text-[#00D2FF]">
                04 — ARCHITECTURAL TOPOLOGY
              </span>
            </div>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-black text-white font-display tracking-tight">
              Technology Ecosystem & Pipeline
            </h2>
            <p className="text-sm sm:text-base text-[#94A3B8] max-w-2xl font-sans leading-relaxed">
              Every request traverses an unbroken, mathematically determinable pipeline: from client edge interaction down to resilient database clusters and cloud infrastructure.
            </p>
          </div>

          <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-[#081020] border border-white/10 font-mono text-xs text-[#64748B]">
            <Activity className="w-3.5 h-3.5 text-[#10B981] animate-pulse" />
            <span>GLOBAL LATENCY BUDGET: &lt;150ms</span>
          </div>
        </div>

        {/* The 6-Tier Interactive Pipeline Continuum */}
        <div className="relative mb-12">
          {/* Connecting Backbone Conduit */}
          <div className="hidden lg:block absolute top-1/2 left-8 right-8 h-0.5 bg-gradient-to-r from-[#0066FF]/20 via-[#00D2FF]/40 to-[#0066FF]/20 -translate-y-1/2 z-0">
            {/* Animated Traveling Packet */}
            <div className="absolute top-1/2 -translate-y-1/2 w-4 h-1 bg-[#00D2FF] rounded-full shadow-[0_0_12px_#00D2FF] animate-[pulse_2s_infinite]" />
          </div>

          {/* Tier Nodes */}
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 relative z-10">
            {ECOSYSTEM_TIERS.map((tier) => {
              const isSelected = tier.id === activeTierId;
              const TierIcon = tier.icon;
              return (
                <button
                  key={tier.id}
                  onClick={() => setActiveTierId(tier.id)}
                  className={`p-4 rounded-xl border text-left transition-all duration-300 relative flex flex-col justify-between group cursor-pointer ${
                    isSelected
                      ? 'bg-[#081226] border-[#00D2FF] shadow-[0_0_25px_rgba(0,210,255,0.2)]'
                      : 'bg-[#060A14]/90 border-white/[0.07] hover:border-white/20 hover:bg-[#0A1020]'
                  }`}
                >
                  <div>
                    <div className="flex items-center justify-between mb-3">
                      <span
                        className={`font-mono text-[10px] tracking-widest uppercase ${
                          isSelected ? 'text-[#00D2FF]' : 'text-[#64748B]'
                        }`}
                      >
                        TIER {tier.step}
                      </span>
                      <div
                        className={`w-2 h-2 rounded-full ${
                          isSelected ? 'bg-[#00D2FF] shadow-[0_0_8px_#00D2FF]' : 'bg-white/10'
                        }`}
                      />
                    </div>
                    <div
                      className={`w-9 h-9 rounded-lg flex items-center justify-center mb-3 ${
                        isSelected
                          ? 'bg-[#00D2FF]/20 text-[#00D2FF]'
                          : 'bg-white/[0.04] text-[#94A3B8] group-hover:text-white'
                      }`}
                    >
                      <TierIcon className="w-5 h-5" />
                    </div>
                    <div className="text-sm font-bold text-white font-display leading-tight mb-1">
                      {tier.name}
                    </div>
                    <div className="text-[11px] font-mono text-[#64748B]">{tier.category}</div>
                  </div>

                  <div className="mt-4 pt-3 border-t border-white/[0.06] flex items-center justify-between text-[10px] font-mono">
                    <span className={isSelected ? 'text-[#00D2FF]' : 'text-[#475569]'}>
                      {tier.latencyTarget}
                    </span>
                    <ArrowRight
                      className={`w-3 h-3 transform group-hover:translate-x-1 transition-transform ${
                        isSelected ? 'text-[#00D2FF]' : 'text-[#475569]'
                      }`}
                    />
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Selected Tier Architectural Inspection Panel */}
        <div className="bg-[#070E1E] border border-white/[0.09] rounded-2xl p-6 sm:p-8 shadow-2xl relative overflow-hidden">
          {/* Ambient Glow */}
          <div className="absolute -top-12 -left-12 w-64 h-64 bg-[#0066FF]/15 blur-[90px] pointer-events-none rounded-full" />

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center relative z-10">
            {/* Left: Tier Role & Overview (7 Cols) */}
            <div className="lg:col-span-7 space-y-6">
              <div className="flex items-center gap-3">
                <div className="p-3 rounded-xl bg-[#0066FF]/20 border border-[#0066FF]/40 text-[#00D2FF]">
                  <ActiveIcon className="w-6 h-6" />
                </div>
                <div>
                  <div className="font-mono text-xs text-[#00D2FF] tracking-wider uppercase">
                    SYSTEM LAYER {activeTier.step} — {activeTier.category.toUpperCase()}
                  </div>
                  <h3 className="text-2xl sm:text-3xl font-black text-white font-display">
                    {activeTier.name} Architecture
                  </h3>
                </div>
              </div>

              <p className="text-sm sm:text-base text-[#CBD5E1] leading-relaxed font-sans">
                {activeTier.role}
              </p>

              {/* Technologies in this layer */}
              <div className="space-y-2">
                <div className="font-mono text-xs uppercase tracking-widest text-[#64748B]">
                  Applied Technologies & Standard Tools
                </div>
                <div className="flex flex-wrap gap-2">
                  {getTierTechs(activeTier).map((tech) => (
                    <span
                      key={tech}
                      className="px-3 py-1.5 rounded-lg text-xs font-mono bg-[#0B152B] border border-white/10 text-white font-medium flex items-center gap-1.5"
                    >
                      <span className="w-1.5 h-1.5 rounded-full bg-[#00D2FF]" />
                      {tech}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {/* Right: Technical Telemetry (5 Cols) */}
            <div className="lg:col-span-5 bg-[#050A14] border border-white/[0.08] rounded-xl p-5 space-y-4">
              <div className="font-mono text-xs text-[#64748B] uppercase tracking-wider pb-2 border-b border-white/[0.06] flex items-center justify-between">
                <span>OPERATIONAL SPECIFICATION</span>
                <span className="text-[#00D2FF]">DETERMINISTIC</span>
              </div>

              <div className="space-y-3 font-mono text-xs">
                <div className="flex justify-between items-center p-2.5 rounded bg-white/[0.02]">
                  <span className="text-[#64748B]">Transmission Protocol</span>
                  <span className="text-white font-semibold">{activeTier.protocols}</span>
                </div>
                <div className="flex justify-between items-center p-2.5 rounded bg-white/[0.02]">
                  <span className="text-[#64748B]">Target Latency SLA</span>
                  <span className="text-[#00D2FF] font-semibold">{activeTier.latencyTarget}</span>
                </div>
                <div className="flex flex-col gap-1 p-2.5 rounded bg-white/[0.02]">
                  <span className="text-[#64748B]">Fault Isolation & Resilience</span>
                  <span className="text-[#94A3B8] text-[11px] leading-relaxed">
                    {activeTier.resilienceMechanism}
                  </span>
                </div>
              </div>

              <div className="p-3 rounded-lg bg-[#0066FF]/10 border border-[#0066FF]/20 flex items-center gap-2.5 text-xs text-[#80B3FF]">
                <ShieldCheck className="w-4 h-4 text-[#00D2FF] shrink-0" />
                <span>Zero single-point-of-failure topology guaranteed across all tiers.</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
