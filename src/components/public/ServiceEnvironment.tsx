'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import {
  Code2,
  Globe,
  Palette,
  Cloud,
  Cpu,
  ShieldCheck,
  ArrowUpRight,
  CheckCircle2,
  Terminal,
  Activity,
  Layers,
} from 'lucide-react';
import { cn } from '@/lib/utils';

export interface ServiceSpec {
  id: string;
  name: string;
  category: string;
  headline: string;
  summary: string;
  deliverables: string[];
  techStack: string[];
  architectureSnippet: string;
}

const CORE_SERVICES: ServiceSpec[] = [
  {
    id: 'software-dev',
    name: 'Software Development',
    category: 'CORE SYSTEMS',
    headline: 'Deterministic, Mission-Critical Software Engineering',
    summary:
      'We engineer bespoke backend services, distributed data pipelines, and scalable enterprise logic with mathematical precision, strict type systems, and zero technical debt.',
    deliverables: [
      'Modular Microservices & Monolith Architecture',
      'Event-Driven Concurrency Pipelines',
      'ACID Compliant Transactional Workflows',
      'Automated Comprehensive Test Harnesses',
    ],
    techStack: ['TypeScript', 'Go', 'Rust', 'PostgreSQL', 'Docker', 'Kafka'],
    architectureSnippet: 'DomainDrivenDesign // EventBus.Dispatch(TxState)',
  },
  {
    id: 'web-dev',
    name: 'Web Development',
    category: 'FULL-STACK',
    headline: 'High-Performance, Scalable Web Applications',
    summary:
      'Fast, accessible, and cinematic web platforms engineered with Next.js App Router, edge server rendering, streaming hydration, and minimal client payload footprints.',
    deliverables: [
      'Server-Driven Streaming Architecture',
      'Sub-100ms Worldwide Edge Latency',
      'Automated SEO & OpenGraph Generation',
      'WCAG AA Accessibility Compliance',
    ],
    techStack: ['Next.js', 'React', 'Tailwind CSS', 'TypeScript', 'Prisma', 'Edge CDN'],
    architectureSnippet: 'NextServerComponent // React.Suspense(EdgeData)',
  },
  {
    id: 'ui-ux',
    name: 'UI/UX Design',
    category: 'PRODUCT CRAFT',
    headline: 'Cinematic Product Interfaces & Design Systems',
    summary:
      'We craft interfaces that feel like precision instruments. Clean editorial typography, purposeful micro-interactions, responsive tactile physics, and zero visual clutter.',
    deliverables: [
      'Bespoke Design Token & Component System',
      'Interactive Spring Physics & Motion Curves',
      'Figma Production Token Schematics',
      'Multi-Device Ergonomic Layouts',
    ],
    techStack: ['Figma', 'Framer Motion', 'Vanilla CSS Tokens', 'Design Systems'],
    architectureSnippet: 'MotionEngine.Spring({ stiffness: 350, damping: 25 })',
  },
  {
    id: 'cloud-devops',
    name: 'Cloud & DevOps',
    category: 'INFRASTRUCTURE',
    headline: 'Resilient Multi-Region Infrastructure & CI/CD',
    summary:
      'Zero-downtime containerized deployments, automated infrastructure-as-code, real-time observability, and self-healing multi-zone clusters.',
    deliverables: [
      'Infrastructure as Code (Terraform / Pulumi)',
      'Automated Blue/Green & Canary Pipelines',
      'Real-Time APM & Telemetry Dashboards',
      'Zero-Trust Network Perimeter & Encryption',
    ],
    techStack: ['Kubernetes', 'Docker', 'AWS', 'GCP', 'Terraform', 'Prometheus'],
    architectureSnippet: 'K8sCluster.Apply(ZeroDowntimeRolloutSpec)',
  },
  {
    id: 'ai-solutions',
    name: 'AI Solutions',
    category: 'INTELLIGENCE',
    headline: 'Autonomous Agent Pipelines & Enterprise Intelligence',
    summary:
      'We integrate specialized language models, vector knowledge graphs, and deterministic multi-agent workflows directly into your operational systems.',
    deliverables: [
      'Bespoke Multi-Agent Workflow Orchestration',
      'High-Dimension Vector Search & Retrieval',
      'Fine-Tuned Specialized Domain Models',
      'Local & Air-Gapped Private AI Deployments',
    ],
    techStack: ['Python', 'LangChain', 'OpenAI', 'Pinecone', 'vLLM', 'FastAPI'],
    architectureSnippet: 'AgentEngine.ExecuteWithGuards(ContextGraph)',
  },
  {
    id: 'maintenance-support',
    name: 'Maintenance & Support',
    category: 'RELIABILITY',
    headline: '24/7 SLA Guarantees & Proactive System Health',
    summary:
      'Long-term engineering stewardship, proactive security vulnerability patching, performance profiling, and guaranteed response SLAs.',
    deliverables: [
      '99.99% Availability Uptime Commitment',
      'Automated Vulnerability & Dependency Audits',
      'Continuous Latency & Query Optimization',
      'Dedicated Engineering On-Call Escalation',
    ],
    techStack: ['Datadog', 'Sentry', 'PagerDuty', 'Grafana', 'Security Scanning'],
    architectureSnippet: 'Monitor.OnAnomaly(TriggerAutoRemediation)',
  },
];

export interface ServiceEnvironmentProps {
  services?: any[];
}

export const ServiceEnvironment: React.FC<ServiceEnvironmentProps> = ({ services }) => {
  // Dynamically map CMS services if provided; otherwise use verified fallback
  const serviceList: ServiceSpec[] =
    services && services.length > 0
      ? services.map((s: any) => ({
          id: s.slug || s.id,
          name: s.title || s.name,
          category: s.category || 'CAPABILITY',
          headline: s.headline || s.shortDescription || s.title || s.name,
          summary:
            s.description ||
            s.fullDescription ||
            s.summary ||
            s.shortDescription ||
            'Enterprise engineered discipline.',
          deliverables:
            s.features && s.features.length > 0
              ? s.features.map((f: any) => f.title || f.name || (typeof f === 'string' ? f : 'Production Deliverable'))
              : [
                  'Modular Microservices & Monolith Architecture',
                  'ACID Compliant Transactional Workflows',
                  'Automated Comprehensive Test Harnesses',
                  'Zero-Downtime Deployment Blueprints',
                ],
          techStack:
            s.technologies && s.technologies.length > 0
              ? s.technologies.map(
                  (t: any) => t.technology?.name || t.name || (typeof t === 'string' ? t : 'TypeScript')
                )
              : ['TypeScript', 'Next.js', 'PostgreSQL', 'Docker'],
          architectureSnippet:
            s.codeSnippet || `${(s.title || s.name).replace(/\s+/g, '')} // Pipeline.Dispatch(TxState)`,
        }))
      : CORE_SERVICES;

  const [selectedId, setSelectedId] = useState(serviceList[0]?.id || 'software-dev');

  // Ensure selectedId is valid when serviceList changes
  useEffect(() => {
    if (!serviceList.some((s) => s.id === selectedId) && serviceList.length > 0) {
      setSelectedId(serviceList[0].id);
    }
  }, [serviceList, selectedId]);

  const activeService = serviceList.find((s) => s.id === selectedId) || serviceList[0] || CORE_SERVICES[0];

  const getServiceIcon = (id: string) => {
    switch (id) {
      case 'software-dev':
        return <Code2 className="w-5 h-5" />;
      case 'web-dev':
        return <Globe className="w-5 h-5" />;
      case 'ui-ux':
        return <Palette className="w-5 h-5" />;
      case 'cloud-devops':
        return <Cloud className="w-5 h-5" />;
      case 'ai-solutions':
        return <Cpu className="w-5 h-5" />;
      case 'maintenance-support':
        return <ShieldCheck className="w-5 h-5" />;
      default:
        return <Layers className="w-5 h-5" />;
    }
  };

  return (
    <div className="space-y-8">
      {/* Discipline Selector Tabs */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
        {serviceList.map((s) => {
          const isSelected = selectedId === s.id;
          return (
            <button
              key={s.id}
              onClick={() => setSelectedId(s.id)}
              className={cn(
                'p-4 rounded-xl border text-left transition-all duration-200 cursor-pointer flex flex-col justify-between h-28 group',
                isSelected
                  ? 'bg-[#080D18] border-[#0066FF] shadow-[0_0_20px_-5px_rgba(0,102,255,0.4)]'
                  : 'bg-[#06090F] border-white/[0.06] hover:border-white/20 hover:bg-[#080D18]/50'
              )}
            >
              <div className="flex items-center justify-between">
                <span
                  className={cn(
                    'p-1.5 rounded-lg transition-colors',
                    isSelected ? 'bg-[#0066FF] text-white' : 'bg-[#0E1526] text-[#64748B] group-hover:text-white'
                  )}
                >
                  {getServiceIcon(s.id)}
                </span>
                <span className="font-mono text-[9px] text-[#64748B] uppercase truncate max-w-[80px]">
                  {s.category}
                </span>
              </div>

              <div>
                <h4
                  className={cn(
                    'font-display font-bold text-sm tracking-tight transition-colors line-clamp-1',
                    isSelected ? 'text-[#00D2FF]' : 'text-white group-hover:text-white'
                  )}
                >
                  {s.name}
                </h4>
              </div>
            </button>
          );
        })}
      </div>

      {/* Dynamic Visual Environment Canvas */}
      <div className="gmd-panel rounded-3xl p-6 sm:p-10 lg:p-12 border border-white/10 relative overflow-hidden bg-gradient-to-b from-[#080D18] via-[#05080F] to-[#020408]">
        {/* Dynamic Ambient Glow Shift */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-[#0066FF]/10 rounded-full blur-3xl pointer-events-none" />

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 relative z-10 items-start">
          {/* Left: Capability Profile & Rationale (7 Cols) */}
          <div className="lg:col-span-7 space-y-6">
            <div className="flex items-center gap-3">
              <span className="font-mono text-xs text-[#00D2FF] uppercase tracking-wider font-semibold">
                // {activeService.category}: {activeService.name.toUpperCase()}
              </span>
              <Badge variant="cobalt" size="sm">
                PRODUCTION SLA
              </Badge>
            </div>

            <h3 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-white font-display tracking-tight leading-tight">
              {activeService.headline}
            </h3>

            <p className="text-sm sm:text-base text-[#94A3B8] leading-relaxed font-sans">
              {activeService.summary}
            </p>

            {/* Architecture Code Snippet */}
            <div className="p-3.5 rounded-xl bg-[#05080F] border border-white/[0.08] font-mono text-xs text-slate-300 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Terminal className="w-3.5 h-3.5 text-[#0066FF]" />
                <span className="text-[#00D2FF]">{activeService.architectureSnippet}</span>
              </div>
              <span className="text-[#64748B] text-[10px]">[EXEC]</span>
            </div>

            {/* Integrated Stack */}
            <div className="space-y-2 pt-2">
              <span className="font-mono text-[10px] text-[#64748B] uppercase tracking-widest block">
                INTEGRATED TECHNOLOGIES:
              </span>
              <div className="flex flex-wrap gap-1.5">
                {activeService.techStack.map((tech) => (
                  <span
                    key={tech}
                    className="px-2.5 py-1 rounded bg-[#0E1526] border border-white/[0.06] font-mono text-xs text-slate-200"
                  >
                    {tech}
                  </span>
                ))}
              </div>
            </div>

            <div className="pt-4">
              <Link href="/contact">
                <Button variant="primary" size="md" rightIcon={<ArrowUpRight className="w-4 h-4" />}>
                  Consult on {activeService.name}
                </Button>
              </Link>
            </div>
          </div>

          {/* Right: Live Interactive Architectural Visual & Deliverables Matrix (5 Cols) */}
          <div className="lg:col-span-5 space-y-4">
            {/* Dynamic Interactive Architectural Micro-Canvas */}
            <div className="p-5 rounded-2xl bg-[#050A14] border border-[#0066FF]/30 space-y-3 relative overflow-hidden">
              <div className="flex items-center justify-between border-b border-white/[0.06] pb-2 font-mono text-[11px]">
                <span className="text-[#00D2FF] flex items-center gap-1.5">
                  <Terminal className="w-3.5 h-3.5" />
                  <span>KINETIC_SPEC: {activeService.id.toUpperCase()}</span>
                </span>
                <span className="text-emerald-400 flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
                  REALTIME
                </span>
              </div>

              {/* 1. Software Dev: Architecture Node Assembly */}
              {selectedId === 'software-dev' && (
                <div className="h-32 rounded-lg bg-[#02050B] border border-white/[0.04] p-3 flex flex-col justify-between font-mono text-xs">
                  <div className="flex items-center justify-between text-[11px] text-[#64748B]">
                    <span>[INGRESS: API GATEWAY]</span>
                    <span className="text-[#00D2FF]">HTTP/3 TLS 1.3</span>
                  </div>
                  <div className="flex items-center justify-center gap-3">
                    <div className="p-2 rounded bg-[#0A162E] border border-[#0066FF]/40 text-white font-bold">
                      DomainBus
                    </div>
                    <div className="w-8 h-[2px] bg-gradient-to-r from-[#0066FF] to-[#00D2FF] relative">
                      <div className="w-2 h-2 rounded-full bg-[#00D2FF] -top-0.5 absolute animate-[ping_1.5s_infinite]" />
                    </div>
                    <div className="p-2 rounded bg-[#0A162E] border border-[#00D2FF]/40 text-white font-bold">
                      PostgreSQL
                    </div>
                  </div>
                  <div className="text-[10px] text-[#94A3B8] text-center">
                    ACID Strict Transactions // Zero State Drift
                  </div>
                </div>
              )}

              {/* 2. Web Dev: Streaming SSR Hydration */}
              {selectedId === 'web-dev' && (
                <div className="h-32 rounded-lg bg-[#02050B] border border-white/[0.04] p-3 flex flex-col justify-between font-mono text-xs">
                  <div className="flex items-center justify-between text-[11px] text-[#64748B]">
                    <span>[STREAMING HYDRATION]</span>
                    <span className="text-emerald-400">TTFB: 42ms</span>
                  </div>
                  <div className="space-y-1.5">
                    <div className="h-2 rounded bg-[#0066FF]/30 overflow-hidden">
                      <div className="h-full bg-[#00D2FF] w-4/5 animate-pulse" />
                    </div>
                    <div className="flex justify-between text-[10px] text-[#64748B]">
                      <span>Server Components (RSC)</span>
                      <span className="text-white font-bold">Hydrated</span>
                    </div>
                  </div>
                  <div className="text-[10px] text-[#94A3B8] text-center">
                    Edge SSR // Stale-While-Revalidate Caching
                  </div>
                </div>
              )}

              {/* 3. UI/UX: Wireframe to High-Fidelity Interface */}
              {selectedId === 'ui-ux' && (
                <div className="h-32 rounded-lg bg-[#02050B] border border-white/[0.04] p-3 flex flex-col justify-between font-mono text-xs">
                  <div className="flex items-center justify-between text-[11px] text-[#64748B]">
                    <span>[WIREFRAME ──► HIGH FIDELITY]</span>
                    <span className="text-[#00D2FF]">60 FPS SPRINGS</span>
                  </div>
                  <div className="grid grid-cols-3 gap-2">
                    <div className="h-12 rounded border border-dashed border-white/20 flex items-center justify-center text-[10px] text-[#64748B]">
                      Layout
                    </div>
                    <div className="h-12 rounded border border-dashed border-[#0066FF]/40 flex items-center justify-center text-[10px] text-[#0066FF]">
                      Tokens
                    </div>
                    <div className="h-12 rounded bg-[#0A162E] border border-[#00D2FF] flex items-center justify-center text-[10px] text-white font-bold shadow-[0_0_10px_rgba(0,210,255,0.3)]">
                      Interface
                    </div>
                  </div>
                  <div className="text-[10px] text-[#94A3B8] text-center">
                    Mathematical Ergonomics // Zero Visual Noise
                  </div>
                </div>
              )}

              {/* 4. Cloud: Infrastructure Nodes & Failover */}
              {selectedId === 'cloud-devops' && (
                <div className="h-32 rounded-lg bg-[#02050B] border border-white/[0.04] p-3 flex flex-col justify-between font-mono text-xs">
                  <div className="flex items-center justify-between text-[11px] text-[#64748B]">
                    <span>[MULTI-AZ CLOUD TOPOLOGY]</span>
                    <span className="text-emerald-400">99.99% HEALTH</span>
                  </div>
                  <div className="flex items-center justify-around">
                    <div className="text-center">
                      <div className="w-3 h-3 rounded-full bg-[#00D2FF] mx-auto mb-1 animate-ping" />
                      <span className="text-[9px] text-[#64748B]">US-East</span>
                    </div>
                    <div className="w-8 h-[1px] bg-white/20" />
                    <div className="text-center">
                      <div className="w-3 h-3 rounded-full bg-[#0066FF] mx-auto mb-1" />
                      <span className="text-[9px] text-[#64748B]">EU-Central</span>
                    </div>
                    <div className="w-8 h-[1px] bg-white/20" />
                    <div className="text-center">
                      <div className="w-3 h-3 rounded-full bg-[#80B3FF] mx-auto mb-1" />
                      <span className="text-[9px] text-[#64748B]">AP-South</span>
                    </div>
                  </div>
                  <div className="text-[10px] text-[#94A3B8] text-center">
                    Automated Self-Healing Pods // Zero Single Point of Failure
                  </div>
                </div>
              )}

              {/* 5. AI Solutions: Data to Intelligence Pipeline */}
              {selectedId === 'ai-solutions' && (
                <div className="h-32 rounded-lg bg-[#02050B] border border-white/[0.04] p-3 flex flex-col justify-between font-mono text-xs">
                  <div className="flex items-center justify-between text-[11px] text-[#64748B]">
                    <span>[DATA ──► RAG INFERENCE ──► RESULT]</span>
                    <span className="text-[#00D2FF]">DETERMINISTIC</span>
                  </div>
                  <div className="flex items-center justify-center gap-2">
                    <div className="px-2 py-1 rounded bg-white/[0.04] text-[10px]">DataTokens</div>
                    <span className="text-[#0066FF]">→</span>
                    <div className="px-2 py-1 rounded bg-[#0A162E] border border-[#0066FF] text-[#00D2FF] text-[10px] font-bold">
                      VectorEmbedding
                    </div>
                    <span className="text-[#0066FF]">→</span>
                    <div className="px-2 py-1 rounded bg-[#00D2FF]/20 border border-[#00D2FF] text-white text-[10px] font-bold">
                      VerifiedOutput
                    </div>
                  </div>
                  <div className="text-[10px] text-[#94A3B8] text-center">
                    Strict Schema Guardrails // Zero Hallucinations
                  </div>
                </div>
              )}

              {/* 6. Maintenance: Live SLA Telemetry */}
              {selectedId === 'maintenance-support' && (
                <div className="h-32 rounded-lg bg-[#02050B] border border-white/[0.04] p-3 flex flex-col justify-between font-mono text-xs">
                  <div className="flex items-center justify-between text-[11px] text-[#64748B]">
                    <span>[ACTIVE APM MONITOR]</span>
                    <span className="text-emerald-400">UPTIME: 99.998%</span>
                  </div>
                  <div className="h-6 flex items-center justify-center gap-1">
                    {[35, 60, 45, 80, 50, 90, 40, 70, 85, 95, 60, 100].map((val, i) => (
                      <div
                        key={i}
                        style={{ height: `${val}%` }}
                        className="w-2 rounded-t bg-gradient-to-t from-[#0066FF] to-[#00D2FF]"
                      />
                    ))}
                  </div>
                  <div className="text-[10px] text-[#94A3B8] text-center">
                    24/7 Guaranteed Response SLA // Continuous Vulnerability Scans
                  </div>
                </div>
              )}

              {/* Dynamic / Custom Service Schematic */}
              {!['software-dev', 'web-dev', 'ui-ux', 'cloud-devops', 'ai-solutions', 'maintenance-support'].includes(
                selectedId
              ) && (
                <div className="h-32 rounded-lg bg-[#02050B] border border-white/[0.04] p-3 flex flex-col justify-between font-mono text-xs">
                  <div className="flex items-center justify-between text-[11px] text-[#64748B]">
                    <span>[CMS MANAGED CAPABILITY]</span>
                    <span className="text-[#00D2FF]">PRODUCTION SLA</span>
                  </div>
                  <div className="flex items-center justify-center gap-3">
                    <div className="p-2 rounded bg-[#0A162E] border border-[#0066FF]/40 text-white font-bold">
                      {activeService.name}
                    </div>
                    <div className="w-8 h-[2px] bg-gradient-to-r from-[#0066FF] to-[#00D2FF] relative">
                      <div className="w-2 h-2 rounded-full bg-[#00D2FF] -top-0.5 absolute animate-[ping_1.5s_infinite]" />
                    </div>
                    <div className="p-2 rounded bg-[#0A162E] border border-[#00D2FF]/40 text-emerald-400 font-bold">
                      Active
                    </div>
                  </div>
                  <div className="text-[10px] text-[#94A3B8] text-center">
                    Deterministic Architecture // Live Specification
                  </div>
                </div>
              )}
            </div>

            {/* Deliverables Matrix */}
            <div className="p-6 rounded-2xl bg-[#080D18] border border-white/10 space-y-4">
              <h4 className="font-mono text-xs uppercase tracking-[0.2em] text-white font-semibold">
                // VERIFIED DELIVERABLES
              </h4>

              <div className="space-y-3">
                {activeService.deliverables.map((item, idx) => (
                  <div
                    key={idx}
                    className="p-3.5 rounded-xl bg-[#06090F] border border-white/[0.06] flex items-start gap-3 text-xs text-slate-200"
                  >
                    <CheckCircle2 className="w-4 h-4 text-[#00D2FF] shrink-0 mt-0.5" />
                    <span className="font-sans leading-normal">{item}</span>
                  </div>
                ))}
              </div>

              <div className="pt-3 border-t border-white/[0.06] flex items-center justify-between text-xs font-mono text-[#64748B]">
                <span>VERIFICATION</span>
                <span className="text-[#10B981]">100% DETERMINISTIC</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
