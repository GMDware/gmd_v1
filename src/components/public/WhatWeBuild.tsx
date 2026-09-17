'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  Cloud,
  Cpu,
  Database,
  Layers,
  LayoutDashboard,
  Smartphone,
  ShoppingBag,
  Server,
  ArrowUpRight,
  CheckCircle2,
  Terminal,
  ShieldCheck,
  Zap,
} from 'lucide-react';
import { Button } from '@/components/ui/Button';

interface ProductArchetype {
  id: string;
  tag: string;
  name: string;
  category: string;
  headline: string;
  description: string;
  icon: React.ComponentType<{ className?: string }>;
  accentColor: string;
  architecturalHighlights: string[];
  keyDeliverables: string[];
  techStack: string[];
  schematic: {
    protocol: string;
    throughput: string;
    persistence: string;
    isolation: string;
  };
}

const ARCHETYPES: ProductArchetype[] = [
  {
    id: 'saas',
    tag: '01 — ARCHETYPE',
    name: 'SaaS Platforms',
    category: 'Cloud Software',
    headline: 'Multi-Tenant High-Scale SaaS Applications',
    description:
      'Engineered for rapid user onboarding, granular RBAC permissions, seamless subscription billing, and zero-downtime rolling deployments.',
    icon: Layers,
    accentColor: '#00D2FF',
    architecturalHighlights: [
      'Tenant isolation via row-level security or partitioned database schemas',
      'Event-driven asynchronous job processing and billing webhooks',
      'Self-serve organization onboarding with SSO (SAML / OAuth2 / Passkeys)',
      'Sub-50ms global edge API gateway routing with Cloudflare Workers',
    ],
    keyDeliverables: [
      'Production Web Application',
      'Admin Operations Console',
      'Stripe / LemonSqueezy Billing Engine',
      'Audit Logging & Compliance Vault',
    ],
    techStack: ['Next.js 15', 'TypeScript', 'PostgreSQL', 'Redis', 'TailwindCSS', 'Docker'],
    schematic: {
      protocol: 'HTTPS / GraphQL / REST',
      throughput: '10,000+ Req/Sec',
      persistence: 'Partitioned Postgres',
      isolation: 'Row-Level Tenant Isolation',
    },
  },
  {
    id: 'ecommerce',
    tag: '02 — ARCHETYPE',
    name: 'E-Commerce Engines',
    category: 'High-Volume Commerce',
    headline: 'Headless, Composable Global Commerce Architectures',
    description:
      'Engineered for lightning-fast catalog navigation, resilient cart checkouts under flash-sale traffic surges, and multi-currency internationalization.',
    icon: ShoppingBag,
    accentColor: '#38BDF8',
    architecturalHighlights: [
      'Headless storefront with instant static-cache hydration and edge SSR',
      'Distributed inventory locks to prevent overselling during flash traffic spikes',
      'Omnichannel checkout integrations with localized payment gateways',
      'Faceted elastic search with instant zero-latency filtering',
    ],
    keyDeliverables: [
      'Custom Headless Storefront',
      'Real-Time Inventory Engine',
      'Checkout & Fulfillment Bridge',
      'Analytics & Conversion Funnel',
    ],
    techStack: ['React', 'Next.js', 'PostgreSQL', 'Stripe API', 'Redis Caching', 'AWS CDN'],
    schematic: {
      protocol: 'HTTP/3 + Edge Cache',
      throughput: 'Peak 50,000 Concurrent Carts',
      persistence: 'Postgres + Redis Queue',
      isolation: 'Encrypted Tokenized PII',
    },
  },
  {
    id: 'business-systems',
    tag: '03 — ARCHETYPE',
    name: 'Business Systems',
    category: 'Enterprise Operations',
    headline: 'Custom ERPs, CRMs & Mission-Critical Operations',
    description:
      'Replace disconnected legacy spreadsheets with unified, deterministic enterprise platforms that automate workflows and maintain strict audit trails.',
    icon: Database,
    accentColor: '#0066FF',
    architecturalHighlights: [
      'Comprehensive relational data models reflecting complex internal domain logic',
      'Granular audit trails tracking every database state modification',
      'Automated batch data reconciliations and scheduled workflow pipelines',
      'Zero-trust role-based access control with field-level visibility rules',
    ],
    keyDeliverables: [
      'Unified Operations ERP',
      'Custom CRM & Pipeline Manager',
      'Workflow Automation Engine',
      'Granular Audit & Compliance Log',
    ],
    techStack: ['NestJS', 'Next.js', 'PostgreSQL', 'Prisma', 'BullMQ', 'Docker'],
    schematic: {
      protocol: 'gRPC / TLS Internal Mesh',
      throughput: 'Sub-second Complex Joins',
      persistence: 'ACID PostgreSQL Cluster',
      isolation: 'Department-Level Vaults',
    },
  },
  {
    id: 'dashboards',
    tag: '04 — ARCHETYPE',
    name: 'High-Frequency Dashboards',
    category: 'Real-Time Telemetry',
    headline: 'Low-Latency Financial & Operational Observability Consoles',
    description:
      'Designed for operators who cannot afford stale data. Stream hundreds of real-time metrics, live WebSocket feeds, and interactive time-series charts smoothly.',
    icon: LayoutDashboard,
    accentColor: '#60A5FA',
    architecturalHighlights: [
      'Sub-second data streaming via bidirectional WebSocket channels',
      'Optimized Canvas & WebGL data visualization engines for 100k+ data points',
      'Customizable modular widget layouts with persistent user view states',
      'Real-time anomaly threshold triggering with push alerts',
    ],
    keyDeliverables: [
      'Real-Time Metrics Center',
      'Interactive Charting Canvas',
      'Alert & Notification Matrix',
      'Data Export & Reporting Hub',
    ],
    techStack: ['Next.js', 'WebSockets', 'Canvas API', 'Redis Pub/Sub', 'TimescaleDB'],
    schematic: {
      protocol: 'WSS (WebSocket Secure)',
      throughput: '60 FPS Canvas Rerenders',
      persistence: 'In-Memory State + TSDB',
      isolation: 'Ephemeral Session Stream',
    },
  },
  {
    id: 'mobile',
    tag: '05 — ARCHETYPE',
    name: 'Mobile Applications',
    category: 'Native & Cross-Platform',
    headline: 'Fluid, Offline-First iOS & Android Applications',
    description:
      'Native-feel mobile experiences engineered with buttery-smooth 60fps animations, biometric authentication, offline synchronization, and push messaging.',
    icon: Smartphone,
    accentColor: '#00D2FF',
    architecturalHighlights: [
      'Local SQLite database with optimistic UI updates and background synchronization',
      'Secure biometrics integration (FaceID / TouchID / KeyStore)',
      'High-performance gesture mechanics and fluid page transitions',
      'Targeted push notifications powered by APNS and Firebase Cloud Messaging',
    ],
    keyDeliverables: [
      'Production iOS & Android App',
      'Offline Sync Engine',
      'Biometric Auth Security Layer',
      'Push Notification Gateway',
    ],
    techStack: ['React Native', 'Expo', 'TypeScript', 'SQLite', 'REST / GraphQL'],
    schematic: {
      protocol: 'mTLS / HTTP/2 + Offline Cache',
      throughput: '60 FPS Native Gestures',
      persistence: 'Local Encrypted SQLite',
      isolation: 'Hardware Secure Enclave',
    },
  },
  {
    id: 'apis',
    tag: '06 — ARCHETYPE',
    name: 'APIs & Microservices',
    category: 'Backend Architecture',
    headline: 'Resilient, Highly-Documented API Platforms',
    description:
      'High-throughput backend engines that connect distributed services, process external webhooks, enforce rate limits, and provide world-class developer ergonomics.',
    icon: Server,
    accentColor: '#3B82F6',
    architecturalHighlights: [
      'Strict OpenAPI / Swagger specifications and auto-generated typed SDKs',
      'Token-bucket rate limiting, IP throttling, and DDoS resilience via Redis',
      'Idempotent webhook delivery with exponential backoff and replay mechanics',
      'Structured JSON telemetry, distributed tracing, and automated health checks',
    ],
    keyDeliverables: [
      'Fully Typed API Gateway',
      'Interactive Swagger / OpenAPI Portal',
      'Webhook Dispatch Engine',
      'Automated CI/CD Integration Test Suite',
    ],
    techStack: ['Node.js', 'NestJS / Express', 'PostgreSQL', 'Redis', 'Docker', 'Swagger'],
    schematic: {
      protocol: 'REST / gRPC / OpenAPI 3.1',
      throughput: '15,000+ Req/Sec Latency <20ms',
      persistence: 'Postgres Connection Pooling',
      isolation: 'API Key & Scoped Bearer Tokens',
    },
  },
  {
    id: 'ai-products',
    tag: '07 — ARCHETYPE',
    name: 'AI Products & Agents',
    category: 'Intelligent Systems',
    headline: 'Domain-Specific LLM Workflows & Autonomous Agents',
    description:
      'Move beyond simple prompts. We build structured RAG pipelines, autonomous multi-step reasoning agents, vector search indexing, and deterministic validation guardrails.',
    icon: Cpu,
    accentColor: '#93C5FD',
    architecturalHighlights: [
      'Retrieval-Augmented Generation (RAG) with hybrid dense-sparse vector indexing',
      'Strict structured output validation with schema-enforced JSON parsing',
      'Human-in-the-loop review queues and audit logs for automated decisions',
      'Prompt caching, semantic query routing, and token optimization pipelines',
    ],
    keyDeliverables: [
      'Domain AI Agent System',
      'Vector Embedding & Ingestion Pipeline',
      'Model Guardrail & Evaluation Suite',
      'Streaming Inference UI Components',
    ],
    techStack: ['Python', 'LangChain', 'pgvector / Pinecone', 'OpenAI API', 'Next.js', 'FastAPI'],
    schematic: {
      protocol: 'SSE (Server-Sent Events) Stream',
      throughput: 'Sub-second TTFT (Time-to-first-token)',
      persistence: 'Vector DB + PostgreSQL',
      isolation: 'Zero Data Leakage / Strict Tenancy',
    },
  },
  {
    id: 'cloud-infrastructure',
    tag: '08 — ARCHETYPE',
    name: 'Cloud & DevOps',
    category: 'Platform Engineering',
    headline: 'Immutable, Self-Healing Infrastructure as Code',
    description:
      'Cloud architectures designed for 99.99% availability, zero single points of failure, automated preview environments, and rapid blue/green deployment pipelines.',
    icon: Cloud,
    accentColor: '#0066FF',
    architecturalHighlights: [
      'Infrastructure as Code (Terraform / Docker) versioned directly in Git',
      'Automated CI/CD pipelines with integrated static analysis and security scanning',
      'Multi-region redundancy with automated database failover and point-in-time recovery',
      'Real-time observability dashboards with Prometheus, Grafana, and uptime monitors',
    ],
    keyDeliverables: [
      'Production Cloud Architecture',
      'Automated CI/CD Pipeline',
      'Zero-Downtime Deployment Setup',
      'Disaster Recovery & Backup Plan',
    ],
    techStack: ['Docker', 'AWS / GCP', 'Terraform', 'GitHub Actions', 'Nginx', 'PostgreSQL'],
    schematic: {
      protocol: 'VPC Peering / Private Subnets',
      throughput: 'Auto-Scaling Pods (1-100 Nodes)',
      persistence: 'Multi-AZ Database Clustering',
      isolation: 'Zero-Trust IAM Policy Enforced',
    },
  },
];

export function WhatWeBuild() {
  const [activeId, setActiveId] = useState<string>('saas');
  const activeArchetype = ARCHETYPES.find((a) => a.id === activeId) || ARCHETYPES[0];
  const IconComponent = activeArchetype.icon;

  return (
    <section className="py-24 border-b border-white/[0.08] relative overflow-hidden bg-[#03060C]">
      {/* Background Architectural Grid Lines */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff05_1px,transparent_1px),linear-gradient(to_bottom,#ffffff05_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_50%,#000_70%,transparent_100%)] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6 border-b border-white/[0.08] pb-8">
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-[#0066FF] animate-pulse" />
              <span className="font-mono text-xs tracking-[0.25em] uppercase text-[#00D2FF]">
                03 — WHAT WE BUILD
              </span>
            </div>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-black text-white font-display tracking-tight">
              Architectural Product Archetypes
            </h2>
            <p className="text-sm sm:text-base text-[#94A3B8] max-w-2xl font-sans leading-relaxed">
              We do not build disposable software. We engineer scalable, mission-critical digital products built on solid mathematical foundations, resilient architectures, and pristine aesthetics.
            </p>
          </div>

          <div className="flex items-center gap-3 shrink-0">
            <Link href="/contact">
              <Button variant="primary" size="sm" rightIcon={<ArrowUpRight className="w-4 h-4" />}>
                Scope Your Product
              </Button>
            </Link>
          </div>
        </div>

        {/* Archetype Selector Tabs */}
        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-2 mb-8">
          {ARCHETYPES.map((archetype) => {
            const isSelected = archetype.id === activeId;
            const ArchetypeIcon = archetype.icon;
            return (
              <button
                key={archetype.id}
                onClick={() => setActiveId(archetype.id)}
                className={`p-3 rounded-lg border text-left transition-all duration-200 flex flex-col items-start gap-2.5 group relative ${
                  isSelected
                    ? 'bg-[#0A1224] border-[#0066FF] shadow-lg shadow-[#0066FF]/20 text-white'
                    : 'bg-[#060A14]/70 border-white/[0.06] hover:border-white/20 text-[#64748B] hover:text-[#94A3B8]'
                }`}
              >
                {isSelected && (
                  <span className="absolute top-1 right-1 w-1.5 h-1.5 rounded-full bg-[#00D2FF]" />
                )}
                <div
                  className={`p-2 rounded-md ${
                    isSelected
                      ? 'bg-[#0066FF]/20 text-[#00D2FF]'
                      : 'bg-white/[0.03] text-[#64748B] group-hover:text-white'
                  }`}
                >
                  <ArchetypeIcon className="w-4 h-4" />
                </div>
                <div>
                  <div className="font-mono text-[9px] uppercase tracking-wider text-[#475569] mb-0.5">
                    {archetype.id}
                  </div>
                  <div className="text-xs font-bold font-display leading-tight truncate w-full">
                    {archetype.name}
                  </div>
                </div>
              </button>
            );
          })}
        </div>

        {/* Active Product Archetype Stage */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
          {/* Left Column: Deep Specs & Description (7 Cols) */}
          <div className="lg:col-span-7 bg-[#070D1A] border border-white/[0.08] rounded-2xl p-6 sm:p-8 flex flex-col justify-between shadow-2xl relative overflow-hidden">
            {/* Ambient Corner Flare */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-[#0066FF]/10 blur-[80px] pointer-events-none rounded-full" />

            <div className="space-y-6 relative z-10">
              <div className="flex items-center justify-between gap-4">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#0066FF]/10 border border-[#0066FF]/30">
                  <IconComponent className="w-3.5 h-3.5 text-[#00D2FF]" />
                  <span className="font-mono text-[11px] text-[#00D2FF] font-semibold tracking-wider uppercase">
                    {activeArchetype.tag} — {activeArchetype.category}
                  </span>
                </div>
                <span className="font-mono text-xs text-[#64748B]">SPECIFICATION REVISION 4.1</span>
              </div>

              <div>
                <h3 className="text-2xl sm:text-3xl font-black text-white font-display tracking-tight mb-3">
                  {activeArchetype.headline}
                </h3>
                <p className="text-sm sm:text-base text-[#94A3B8] leading-relaxed font-sans">
                  {activeArchetype.description}
                </p>
              </div>

              {/* Architectural Highlights */}
              <div className="space-y-3 pt-2">
                <div className="font-mono text-xs uppercase tracking-widest text-[#64748B]">
                  Architectural Tenets
                </div>
                <div className="grid grid-cols-1 gap-2.5">
                  {activeArchetype.architecturalHighlights.map((highlight, idx) => (
                    <div
                      key={idx}
                      className="flex items-start gap-3 p-3 rounded-lg bg-[#040812]/80 border border-white/[0.04]"
                    >
                      <CheckCircle2 className="w-4 h-4 text-[#00D2FF] shrink-0 mt-0.5" />
                      <span className="text-xs sm:text-sm text-[#E2E8F0] font-sans leading-snug">
                        {highlight}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Verified Tech Stack */}
              <div className="space-y-2 pt-2">
                <div className="font-mono text-xs uppercase tracking-widest text-[#64748B]">
                  Primary Technology Vector
                </div>
                <div className="flex flex-wrap gap-2">
                  {activeArchetype.techStack.map((tech) => (
                    <span
                      key={tech}
                      className="px-2.5 py-1 rounded-md text-xs font-mono bg-white/[0.04] border border-white/10 text-[#CBD5E1]"
                    >
                      {tech}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {/* Bottom Actions */}
            <div className="pt-8 border-t border-white/[0.06] mt-8 flex flex-col sm:flex-row items-center justify-between gap-4 relative z-10">
              <div className="flex items-center gap-2 text-xs font-mono text-[#64748B]">
                <ShieldCheck className="w-4 h-4 text-[#10B981]" />
                <span>Enterprise SLA Guarantee • Strict ACID Compliance</span>
              </div>
              <Link href="/contact" className="w-full sm:w-auto">
                <Button variant="primary" size="sm" className="w-full sm:w-auto">
                  Architect This System
                </Button>
              </Link>
            </div>
          </div>

          {/* Right Column: Interactive Schematic Console (5 Cols) */}
          <div className="lg:col-span-5 flex flex-col gap-6">
            {/* Interactive Blueprint Console */}
            <div className="bg-[#050A14] border border-white/[0.08] rounded-2xl p-6 relative overflow-hidden flex-1 flex flex-col justify-between">
              <div className="space-y-5">
                {/* Console Bar */}
                <div className="flex items-center justify-between pb-3 border-b border-white/[0.06]">
                  <div className="flex items-center gap-2 font-mono text-xs text-[#64748B]">
                    <Terminal className="w-3.5 h-3.5 text-[#00D2FF]" />
                    <span>SYSTEM_BLUEPRINT_{activeArchetype.id.toUpperCase()}.SYS</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                    <span className="font-mono text-[10px] text-emerald-400">ACTIVE</span>
                  </div>
                </div>

                {/* Live Architectural Metrics */}
                <div className="space-y-3 font-mono text-xs">
                  <div className="p-3 rounded-lg bg-[#081020] border border-white/[0.05] flex justify-between items-center">
                    <span className="text-[#64748B]">Network Protocol</span>
                    <span className="text-[#00D2FF] font-semibold">{activeArchetype.schematic.protocol}</span>
                  </div>
                  <div className="p-3 rounded-lg bg-[#081020] border border-white/[0.05] flex justify-between items-center">
                    <span className="text-[#64748B]">Throughput Target</span>
                    <span className="text-white font-semibold">{activeArchetype.schematic.throughput}</span>
                  </div>
                  <div className="p-3 rounded-lg bg-[#081020] border border-white/[0.05] flex justify-between items-center">
                    <span className="text-[#64748B]">Persistence Strategy</span>
                    <span className="text-[#94A3B8] font-semibold">{activeArchetype.schematic.persistence}</span>
                  </div>
                  <div className="p-3 rounded-lg bg-[#081020] border border-white/[0.05] flex justify-between items-center">
                    <span className="text-[#64748B]">Security Isolation</span>
                    <span className="text-[#80B3FF] font-semibold">{activeArchetype.schematic.isolation}</span>
                  </div>
                </div>

                {/* Key Deliverables Checkcard */}
                <div className="space-y-2 pt-2">
                  <div className="font-mono text-xs uppercase tracking-widest text-[#64748B]">
                    Standard Deliverable Artifacts
                  </div>
                  <div className="space-y-2">
                    {activeArchetype.keyDeliverables.map((deliv, idx) => (
                      <div
                        key={idx}
                        className="flex items-center gap-2.5 text-xs text-[#CBD5E1] p-2 rounded bg-white/[0.02]"
                      >
                        <Zap className="w-3.5 h-3.5 text-[#0066FF] shrink-0" />
                        <span>{deliv}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* View Case Studies in this archetype */}
              <div className="pt-6 mt-6 border-t border-white/[0.06]">
                <Link
                  href="/projects"
                  className="inline-flex items-center justify-between w-full text-xs font-mono text-[#00D2FF] hover:text-white transition-colors group"
                >
                  <span>INSPECT VERIFIED {activeArchetype.name.toUpperCase()} PROJECTS</span>
                  <ArrowUpRight className="w-4 h-4 transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
