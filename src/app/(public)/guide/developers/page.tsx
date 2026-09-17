import React from 'react';
import type { Metadata } from 'next';
import Link from 'next/link';
import { Container } from '@/components/ui/Container';
import { SectionHeading } from '@/components/ui/SectionHeading';
import { GuideNav } from '@/components/public/GuideNav';
import {
  Code2,
  Cpu,
  Layers,
  Server,
  Database,
  ShieldAlert,
  Terminal,
  FileCode,
  Lock,
  Workflow,
  CheckCircle2,
  ExternalLink,
} from 'lucide-react';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export async function generateMetadata(): Promise<Metadata> {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://gmdware.com';
  return {
    title: 'Developer Technical Guide & Architecture — GMDware',
    description:
      'In-depth technical architecture specification, data flow topologies, DataStore layer documentation, and developer quick reference for GMDware engineers.',
    alternates: {
      canonical: `${siteUrl}/guide/developers`,
    },
    openGraph: {
      title: 'Developer Technical Guide & Architecture — GMDware',
      description:
        'Architectural reference for Next.js App Router, Prisma ORM, PostgreSQL, and DataStore caching layer.',
      url: `${siteUrl}/guide/developers`,
      siteName: 'GMDware',
      locale: 'en_US',
      type: 'website',
    },
  };
}

export default function DeveloperGuidePage() {
  const verifiedCommands = [
    { cmd: 'npm run dev', desc: 'Starts local Next.js development server on port 3000' },
    { cmd: 'npm run build', desc: 'Compiles production bundle across static and dynamic routes' },
    { cmd: 'npm run start', desc: 'Runs optimized production server' },
    { cmd: 'npx tsc --noEmit', desc: 'Validates strict TypeScript type soundness across client & server' },
    { cmd: 'npx tsx scripts/test-phase9-guide-socials.ts', desc: 'Runs Phase 9 social links, contact identity & guide test suite' },
    { cmd: 'npx tsx scripts/test-phase8-qa.ts', desc: 'Runs Phase 8 production quality assurance audit (22 tests)' },
    { cmd: 'npx tsx scripts/test-phase7-hardening.ts', desc: 'Runs Phase 7 security, performance & hardening audit (23 tests)' },
    { cmd: 'npx tsx scripts/test-phase6-integration.ts', desc: 'Runs Phase 6 CMS ↔ Public data integration verification (28 tests)' },
    { cmd: 'npx tsx scripts/test-phase4-public.ts', desc: 'Runs Phase 4 public UI & design system verification (22 tests)' },
    { cmd: 'npx tsx scripts/test-phase2-admin.ts', desc: 'Runs Phase 2 Admin CMS & authentication verification (49 tests)' },
    { cmd: 'npx prisma db seed', desc: 'Seeds database tables with baseline demo fixtures and permissions' },
    { cmd: 'npx prisma studio', desc: 'Launches local visual Prisma Studio database inspector' },
  ];

  const adminAreas = [
    { name: 'Projects & Work', path: '/admin/projects', desc: 'Create, edit, archive, and publish case studies, metrics, and technology associations.' },
    { name: 'Founders & Team', path: '/admin/team', desc: 'Manage leadership biographies, engineering staff, skills matrix, and departmental hierarchy.' },
    { name: 'Services & Features', path: '/admin/services', desc: 'Configure architectural disciplines, service features, and tech stack tags.' },
    { name: 'Technologies', path: '/admin/technologies', desc: 'Curate the company technology catalog across frontend, backend, and cloud.' },
    { name: 'Delivery Process', path: '/admin/process', desc: 'Adjust the 7 delivery phases, step titles, descriptions, and formal deliverables.' },
    { name: 'Company & Values', path: '/admin/company', desc: 'Control mission, vision statements, corporate identity declarations, and values.' },
    { name: 'Homepage Content', path: '/admin/homepage', desc: 'Edit the flagship proposition, hero copy, and featured capability toggles.' },
    { name: 'Navigation Menus', path: '/admin/navigation', desc: 'Manage header and footer navigation items, ordering, and external links.' },
    { name: 'Social Links', path: '/admin/social', desc: 'Update official company social presence URLs, ordering, and visibility.' },
    { name: 'SEO & Metadata', path: '/admin/seo', desc: 'Configure route-level OpenGraph cards, meta descriptions, and indexing directives.' },
    { name: 'Inbound Inquiries', path: '/admin/inquiries', desc: 'Triage inbound client consultation submissions, change status, and add notes.' },
    { name: 'Media Library', path: '/admin/media', desc: 'Upload, inspect, and organize media assets with strict file validation.' },
    { name: 'Site Settings', path: '/admin/settings', desc: 'Global operational constants, official contact emails, and office locations.' },
  ];

  return (
    <div className="py-12 space-y-16 bg-[#05080F]">
      <Container size="wide">
        {/* Editorial Header */}
        <div className="max-w-4xl space-y-4 mb-8">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-[#0066FF] animate-pulse" />
            <span className="font-mono text-xs tracking-[0.25em] uppercase text-[#00D2FF]">
              DEVELOPER DOCUMENTATION & ARCHITECTURE
            </span>
          </div>

          <h1 className="text-4xl sm:text-6xl font-black text-white font-display tracking-tight leading-tight">
            GMDware Platform Technical Specification
          </h1>

          <p className="text-base sm:text-lg text-[#94A3B8] leading-relaxed font-sans max-w-3xl">
            A comprehensive reference on the GMDware systems architecture, request lifecycle,
            DataStore abstraction layer, Admin CMS engine, and developer toolchain.
          </p>
        </div>

        {/* Sub-Navigation */}
        <GuideNav />

        {/* Section 1: Architecture Topology Diagram */}
        <div className="space-y-6">
          <SectionHeading
            tag="SYSTEM TOPOLOGY"
            title="End-to-End Architectural Data Flow"
            subtitle="How requests travel from the client browser through Next.js, DataStore, and PostgreSQL."
          />

          <div className="gmd-panel rounded-2xl p-6 sm:p-10 border border-white/10 space-y-6">
            <div className="p-6 rounded-xl bg-[#03060C] border border-white/10 font-mono text-xs overflow-x-auto text-slate-300 space-y-4">
              <div className="text-[#00D2FF] font-semibold">
                TOPOLOGICAL ARCHITECTURE & DATA ACCESS
              </div>
              <pre className="text-[12px] leading-relaxed text-slate-300">
{`┌─────────────────────────────────────────────────────────────────────────────┐
│                               CLIENT BROWSER                                │
└──────────────────────┬───────────────────────────────┬──────────────────────┘
                       │                               │
            [HTTP/HTTPS Requests]            [Admin Auth Session / JWT]
                       │                               │
                       ▼                               ▼
┌──────────────────────────────────────┐    ┌─────────────────────────────────┐
│     Next.js Public App Router        │    │    Next.js Admin CMS Engine     │
│   (Server Components & Streaming)    │    │   (/admin - Role-Based Access)  │
└──────────────────┬───────────────────┘    └─────────────────┬───────────────┘
                   │                                          │
                   ▼                                          ▼
┌──────────────────────────────────────┐    ┌─────────────────────────────────┐
│         DataStore Access Layer       │    │      API Route Handlers         │
│  (Authoritative DB + Fallback Resil) │    │      (/api/v1/* Protected)      │
└──────────────────┬───────────────────┘    └─────────────────┬───────────────┘
                   │                                          │
                   └───────────────────┬──────────────────────┘
                                       │
                                       ▼
                       ┌───────────────────────────────┐
                       │       Prisma ORM Layer        │
                       │    (Type-Safe Schema & ERD)   │
                       └───────────────┬───────────────┘
                                       │
                                       ▼
                       ┌───────────────────────────────┐
                       │     PostgreSQL Database       │
                       │   (Relational Persistence)    │
                       └───────────────────────────────┘`}
              </pre>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2 font-mono text-xs">
              <div className="p-4 rounded-xl bg-[#080D18] border border-white/5 space-y-2">
                <span className="text-[#00D2FF] font-semibold flex items-center gap-2">
                  <Server className="w-4 h-4" />
                  <span>Public Website ↕ DataStore</span>
                </span>
                <p className="text-[#94A3B8] font-sans leading-relaxed text-xs">
                  Public routes never execute unvalidated ad-hoc SQL. Instead, all data fetching flows through the centralized <code>DataStore</code> class. When PostgreSQL is online, database rows are 100% authoritative. If the database is unreachable, <code>DataStore</code> provides graceful fallback to baseline seed data, guaranteeing 100% uptime.
                </p>
              </div>

              <div className="p-4 rounded-xl bg-[#080D18] border border-white/5 space-y-2">
                <span className="text-[#10B981] font-semibold flex items-center gap-2">
                  <Database className="w-4 h-4" />
                  <span>PostgreSQL ↕ Admin CMS</span>
                </span>
                <p className="text-[#94A3B8] font-sans leading-relaxed text-xs">
                  The Admin CMS operates via type-safe API route handlers protected by Argon2id / bcrypt password hashing, encrypted JWT sessions, and granular RBAC permissions. Any change saved in Admin immediately updates the PostgreSQL tables and cascades to public pages without rebuilds.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Section 2: Public Website Architecture */}
        <div className="space-y-6">
          <SectionHeading
            tag="FRONTEND ARCHITECTURE"
            title="Public Website Engineering Principles"
            subtitle="Server components, dynamic SEO, empty states, error boundaries, and the motion system."
          />

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="gmd-panel rounded-2xl p-6 space-y-3 border border-white/10">
              <div className="flex items-center gap-2 text-xs font-mono text-[#00D2FF]">
                <Layers className="w-4 h-4" />
                <span>RSC & STREAMING</span>
              </div>
              <h3 className="text-lg font-bold text-white font-display">Server/Client Boundaries</h3>
              <p className="text-xs text-[#94A3B8] leading-relaxed font-sans">
                Pages are React Server Components (RSC) rendered on the server with zero client JavaScript overhead for static layout and metadata. Interactivity is isolated to focused client components with <code>&apos;use client&apos;</code> directives.
              </p>
            </div>

            <div className="gmd-panel rounded-2xl p-6 space-y-3 border border-white/10">
              <div className="flex items-center gap-2 text-xs font-mono text-white">
                <Cpu className="w-4 h-4" />
                <span>DYNAMIC SEO</span>
              </div>
              <h3 className="text-lg font-bold text-white font-display">Route Metadata Engine</h3>
              <p className="text-xs text-[#94A3B8] leading-relaxed font-sans">
                Every route exports <code>generateMetadata()</code> powered by <code>DataStore.getSEO(path)</code>. Admin changes to titles, OpenGraph descriptions, or canonical tags reflect dynamically on subsequent requests.
              </p>
            </div>

            <div className="gmd-panel rounded-2xl p-6 space-y-3 border border-white/10">
              <div className="flex items-center gap-2 text-xs font-mono text-[#10B981]">
                <Workflow className="w-4 h-4" />
                <span>MOTION PHYSICS</span>
              </div>
              <h3 className="text-lg font-bold text-white font-display">60FPS Motion System</h3>
              <p className="text-xs text-[#94A3B8] leading-relaxed font-sans">
                Interactive motion is choreographed using GPU-composited CSS transforms and Framer Motion spring physics. Respects <code>prefers-reduced-motion</code> across all viewports.
              </p>
            </div>
          </div>
        </div>

        {/* Section 3: Admin CMS Architecture */}
        <div className="space-y-6">
          <SectionHeading
            tag="ADMIN ENGINE"
            title="Admin CMS Areas & Modules"
            subtitle="Authorized administrators manage the entire platform through /admin without code modifications."
          />

          <div className="gmd-panel rounded-2xl p-6 sm:p-8 border border-white/10 space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {adminAreas.map((area) => (
                <div
                  key={area.path}
                  className="p-4 rounded-xl bg-[#080D18] border border-white/5 space-y-1.5"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-mono font-bold text-white">{area.name}</span>
                    <span className="text-[10px] font-mono text-[#0066FF]">{area.path}</span>
                  </div>
                  <p className="text-[11px] text-[#94A3B8] font-sans leading-relaxed">
                    {area.desc}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Section 4: Developer Quick Reference */}
        <div className="space-y-6">
          <SectionHeading
            tag="COMMAND REFERENCE"
            title="Developer Quick Reference & Test Suites"
            subtitle="Verified CLI scripts and test commands actively executable in this repository."
          />

          <div className="gmd-panel rounded-2xl p-6 sm:p-8 border border-white/10 space-y-6">
            <div className="space-y-3">
              <span className="text-xs font-mono text-[#00D2FF] uppercase tracking-wider block font-semibold">
                VERIFIED CLI COMMANDS
              </span>
              <div className="divide-y divide-white/5 font-mono text-xs">
                {verifiedCommands.map((item, idx) => (
                  <div key={idx} className="py-2.5 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                    <code className="px-2.5 py-1 rounded bg-[#03060C] text-[#00D2FF] border border-white/10 w-fit text-[11px]">
                      {item.cmd}
                    </code>
                    <span className="text-[#94A3B8] font-sans text-xs sm:text-right">
                      {item.desc}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Documentation Safety Box */}
            <div className="p-5 rounded-xl bg-[#0D121F] border border-[#0066FF]/30 space-y-2">
              <div className="flex items-center gap-2 text-xs font-mono text-white font-semibold">
                <ShieldAlert className="w-4 h-4 text-[#00D2FF]" />
                <span>DOCUMENTATION SAFETY & SECRET ISOLATION</span>
              </div>
              <p className="text-xs text-[#94A3B8] font-sans leading-relaxed">
                In strict accordance with GMDware Security Rule 10, no passwords, JWT session keys, database credentials, or private environment variables are stored or documented in plaintext. Configuration parameters should always be referenced via environment placeholders:
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 pt-1 font-mono text-[11px]">
                <div className="p-2 rounded bg-black/50 text-slate-400 border border-white/5">
                  DATABASE_URL: <code>&lt;DATABASE_URL&gt;</code>
                </div>
                <div className="p-2 rounded bg-black/50 text-slate-400 border border-white/5">
                  JWT_SECRET: <code>&lt;AUTH_SECRET&gt;</code>
                </div>
                <div className="p-2 rounded bg-black/50 text-slate-400 border border-white/5">
                  SITE_URL: <code>&lt;NEXT_PUBLIC_SITE_URL&gt;</code>
                </div>
              </div>
            </div>
          </div>
        </div>
      </Container>
    </div>
  );
}
