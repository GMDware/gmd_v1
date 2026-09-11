import React from 'react';
import type { Metadata } from 'next';
import Link from 'next/link';
import DataStore from '@/lib/db/data-store';
import { Container } from '@/components/ui/Container';
import { SectionHeading } from '@/components/ui/SectionHeading';
import { GuideNav } from '@/components/public/GuideNav';
import { SocialIcon } from '@/components/public/SocialIcons';
import {
  ArrowUpRight,
  Compass,
  FolderGit2,
  Layers,
  Workflow,
  Building2,
  BookOpen,
  Mail,
  CheckCircle2,
  Sparkles,
  ShieldCheck,
  Terminal,
} from 'lucide-react';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export async function generateMetadata(): Promise<Metadata> {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://gmdware.com';
  return {
    title: 'User Guide & Platform Directory — GMDware',
    description:
      'A comprehensive visitor guide to navigating the GMDware digital platform, exploring published work, engineering disciplines, delivery frameworks, and official company channels.',
    alternates: {
      canonical: `${siteUrl}/guide`,
    },
    openGraph: {
      title: 'User Guide & Platform Directory — GMDware',
      description:
        'Learn how to navigate the GMDware platform and access enterprise case studies, services, and direct communication channels.',
      url: `${siteUrl}/guide`,
      siteName: 'GMDware',
      locale: 'en_US',
      type: 'website',
    },
  };
}

export default async function UserGuidePage() {
  const [settings, socialLinks] = await Promise.all([
    DataStore.getSettings(),
    DataStore.getSocialLinks(),
  ]);

  const contactEmail = settings.contact_email || 'gmdware@gmail.com';

  const sections = [
    {
      title: 'Home',
      route: '/',
      tag: '01 // ORIGIN',
      icon: Sparkles,
      color: '#0066FF',
      summary: 'The digital flagship showcasing GMDware’s philosophy and core capabilities.',
      contents: [
        'Cinematic self-assembling hero and interactive GMD system',
        'Executive value proposition and core engineering triad (Genesis, Mechanics, Dynamics)',
        'Featured work preview, key service highlights, and active telemetry',
      ],
      whyUse:
        'Gain an immediate high-level overview of GMDware’s engineering standards and design capabilities.',
      actionText: 'Explore Flagship Home',
    },
    {
      title: 'Work / Projects',
      route: '/work',
      tag: '02 // PORTFOLIO',
      icon: FolderGit2,
      color: '#00D2FF',
      summary: 'Published case studies, technical breakdowns, and architectural briefs.',
      contents: [
        'Searchable, filterable project index categorized by domain',
        'In-depth architectural challenges, strategy, infrastructure, and delivery outcomes',
        'Verified technology stacks, performance targets, and client testimonials',
      ],
      whyUse:
        'Evaluate proven technical solutions, engineering methodologies, and real-world system implementations.',
      actionText: 'Browse Case Studies',
    },
    {
      title: 'Services',
      route: '/services',
      tag: '03 // CAPABILITIES',
      icon: Layers,
      color: '#80B3FF',
      summary: 'Specialized enterprise software engineering and cloud infrastructure disciplines.',
      contents: [
        'Bespoke Enterprise Software with domain-driven architectures and zero vendor lock-in',
        'Cloud & Systems Architecture featuring multi-region topologies and database optimization',
        'Cinematic Digital Platforms marrying brutalist performance with 60fps motion choreography',
      ],
      whyUse:
        'Understand the technical vectors, engineering specializations, and delivery scopes GMDware provides.',
      actionText: 'View Services & Disciplines',
    },
    {
      title: 'Delivery Process',
      route: '/process',
      tag: '04 // METHODOLOGY',
      icon: Workflow,
      color: '#0066FF',
      summary: 'The deterministic 7-phase software delivery engineering framework.',
      contents: [
        'Step 1–7: Discover, Strategize, Design, Build, Test, Deploy, and Evolve',
        'Concrete deliverables for every stage: ERD schemas, threat models, and APM telemetry',
        'Interactive phase inspector detailing input criteria and exit milestones',
      ],
      whyUse:
        'See how GMDware guarantees predictable execution, mathematical determinism, and zero downtime.',
      actionText: 'Inspect Delivery Framework',
    },
    {
      title: 'About GMDware',
      route: '/about',
      tag: '05 // LEADERSHIP',
      icon: Building2,
      color: '#00D2FF',
      summary: 'Corporate genesis, engineering values, and technical leadership.',
      contents: [
        'The Tripartite Engineering Triad: Genesis (Architecture), Mechanics (Engineering), Dynamics (Scale)',
        'Core organizational values: Architectural Integrity, Craftsmanship, and Zero-Compromise Security',
        'Leadership profiles, verified engineering skills, and departmental structure',
      ],
      whyUse:
        'Learn about the founders, architectural culture, and guiding principles behind GMDware.',
      actionText: 'Read Corporate Manifesto',
    },
    {
      title: 'Insights & Publications',
      route: '/insights',
      tag: '06 // RESEARCH',
      icon: BookOpen,
      color: '#80B3FF',
      summary: 'Technical essays, systems architecture whitepapers, and motion design mathematics.',
      contents: [
        'Architectural perspectives on first-principles software design and domain isolation',
        'Deep-dives into browser rendering budgets, GPU shaders, and fluid interactions',
        'Searchable publication repository with tag-based exploration and read-time telemetry',
      ],
      whyUse:
        'Explore our research and engineering insights on modern web scale and resilient distributed computing.',
      actionText: 'Explore Technical Insights',
    },
    {
      title: 'Consultation & Contact',
      route: '/contact',
      tag: '07 // ENGAGEMENT',
      icon: Mail,
      color: '#0066FF',
      summary: 'Direct consultation terminal for project scoping and RFP submissions.',
      contents: [
        'Structured consultation form for enterprise project requirements and timelines',
        'Direct email link to leadership for confidential correspondence',
        'SLA guarantees (< 24 business hours) and mutual non-disclosure agreement protection',
      ],
      whyUse:
        'Initiate a technical consultation, submit an RFP dossier, or contact leadership directly.',
      actionText: 'Initiate Consultation',
    },
  ];

  return (
    <div className="py-12 space-y-16 bg-[#05080F]">
      <Container size="wide">
        {/* Editorial Header */}
        <div className="max-w-4xl space-y-4 mb-8">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-[#0066FF] animate-pulse" />
            <span className="font-mono text-xs tracking-[0.25em] uppercase text-[#00D2FF]">
              // PLATFORM DIRECTORY & USER GUIDE
            </span>
          </div>

          <h1 className="text-4xl sm:text-6xl font-black text-white font-display tracking-tight leading-tight">
            How to Navigate & Utilize GMDware
          </h1>

          <p className="text-base sm:text-lg text-[#94A3B8] leading-relaxed font-sans max-w-3xl">
            Welcome to GMDware. This guide provides a clear walkthrough of the platform’s public
            sections, published case studies, engineering capabilities, and official communication
            channels.
          </p>
        </div>

        {/* Sub-Navigation */}
        <GuideNav />

        {/* Section 1: Welcome & Mission Overview */}
        <div className="gmd-panel rounded-2xl p-8 sm:p-10 space-y-6 border border-white/10 relative overflow-hidden mb-16">
          <div className="absolute top-0 right-0 p-8 opacity-5 pointer-events-none">
            <Compass className="w-48 h-48 text-[#0066FF]" />
          </div>

          <div className="flex items-center gap-2 text-xs font-mono text-[#00D2FF]">
            <span>[GENESIS]</span>
            <span>//</span>
            <span>WHAT IS GMDWARE?</span>
          </div>

          <h2 className="text-2xl sm:text-3xl font-bold text-white font-display">
            Architecting High-Performance Digital Solutions & Enterprise Software
          </h2>

          <p className="text-sm sm:text-base text-[#94A3B8] leading-relaxed font-sans max-w-3xl">
            GMDware is an enterprise software engineering studio. We build mission-critical web
            platforms, distributed backends, and digital flagship interfaces engineered from first
            principles. This website serves as both an interactive demonstration of our capabilities
            and an authoritative repository of our published work, technical methodology, and official
            channels.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-4 font-mono text-xs">
            <div className="p-4 rounded-xl bg-[#080D18] border border-white/5 space-y-1">
              <span className="text-[#00D2FF] font-semibold block">CMS-DRIVEN PLATFORM</span>
              <p className="text-[#64748B] text-[11px]">
                All case studies, services, team records, and settings are managed in real-time via our secure Admin Portal.
              </p>
            </div>
            <div className="p-4 rounded-xl bg-[#080D18] border border-white/5 space-y-1">
              <span className="text-white font-semibold block">60FPS MOTION SYSTEM</span>
              <p className="text-[#64748B] text-[11px]">
                Cinematic GPU-accelerated micro-interactions engineered within strict browser frame budgets.
              </p>
            </div>
            <div className="p-4 rounded-xl bg-[#080D18] border border-white/5 space-y-1">
              <span className="text-[#10B981] font-semibold block">PRODUCTION HARDENED</span>
              <p className="text-[#64748B] text-[11px]">
                Strict type safety, cryptographic sessions, CSRF & XSS defenses, and end-to-end Zod parsing.
              </p>
            </div>
          </div>
        </div>

        {/* Section 2: Explore Public Sections */}
        <div className="space-y-12 mb-20">
          <SectionHeading
            tag="SECTION DIRECTORY"
            title="Explore the Platform"
            subtitle="Understand what each section contains, why to use it, and where to take action."
          />

          <div className="grid grid-cols-1 gap-8">
            {sections.map((sec) => {
              const Icon = sec.icon;
              return (
                <div
                  key={sec.route}
                  className="gmd-panel rounded-2xl p-6 sm:p-8 border border-white/10 hover:border-white/20 transition-all space-y-6"
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/5 pb-4">
                    <div className="flex items-center gap-3">
                      <div className="p-2.5 rounded-xl bg-[#080D18] border border-white/10 text-[#00D2FF]">
                        <Icon className="w-5 h-5" />
                      </div>
                      <div>
                        <span className="text-[10px] font-mono text-[#0066FF] tracking-widest uppercase block">
                          {sec.tag}
                        </span>
                        <h3 className="text-xl sm:text-2xl font-bold text-white font-display">
                          {sec.title}
                        </h3>
                      </div>
                    </div>

                    <Link
                      href={sec.route}
                      className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-[#0066FF]/10 text-[#00D2FF] hover:bg-[#0066FF] hover:text-white border border-[#0066FF]/30 font-mono text-xs transition-all w-fit"
                    >
                      <span>{sec.actionText}</span>
                      <ArrowUpRight className="w-3.5 h-3.5" />
                    </Link>
                  </div>

                  <p className="text-sm text-slate-300 font-sans leading-relaxed">
                    {sec.summary}
                  </p>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2 text-xs">
                    {/* What it contains */}
                    <div className="space-y-2">
                      <span className="font-mono text-[#00D2FF] uppercase tracking-wider block font-semibold">
                        What it contains:
                      </span>
                      <ul className="space-y-1.5 text-[#94A3B8] font-sans">
                        {sec.contents.map((item, i) => (
                          <li key={i} className="flex items-start gap-2">
                            <CheckCircle2 className="w-3.5 h-3.5 text-[#10B981] shrink-0 mt-0.5" />
                            <span>{item}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    {/* Why a visitor would use it */}
                    <div className="space-y-2">
                      <span className="font-mono text-white uppercase tracking-wider block font-semibold">
                        Why use this section:
                      </span>
                      <p className="text-[#94A3B8] font-sans leading-relaxed">
                        {sec.whyUse}
                      </p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Section 3: Official Communication Channels */}
        <div className="gmd-panel rounded-2xl p-8 sm:p-10 border border-white/10 space-y-8">
          <SectionHeading
            tag="COMMUNICATION PROTOCOL"
            title="Official Company Presence & Inquiries"
            subtitle="Use official channels for direct communication with GMDware leadership."
          />

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
            {/* Direct Email vs Contact Form */}
            <div className="space-y-6">
              <div className="p-5 rounded-xl bg-[#080D18] border border-white/5 space-y-3">
                <div className="flex items-center gap-2 text-xs font-mono text-[#00D2FF] font-semibold">
                  <Mail className="w-4 h-4" />
                  <span>DIRECT COMPANY EMAIL</span>
                </div>
                <p className="text-xs text-[#94A3B8] leading-relaxed font-sans">
                  For formal business correspondence, technical inquiries, and direct communication with
                  GMDware leadership:
                </p>
                <a
                  href={`mailto:${contactEmail}`}
                  className="inline-flex items-center gap-2 px-3 py-2 rounded-lg bg-black/40 border border-white/10 text-xs font-mono text-[#00D2FF] hover:border-[#0066FF] transition-colors"
                >
                  <span>{contactEmail}</span>
                  <ArrowUpRight className="w-3 h-3 opacity-70" />
                </a>
              </div>

              <div className="p-5 rounded-xl bg-[#080D18] border border-white/5 space-y-3">
                <div className="flex items-center gap-2 text-xs font-mono text-[#10B981] font-semibold">
                  <Terminal className="w-4 h-4" />
                  <span>STRUCTURED PROJECT INQUIRIES</span>
                </div>
                <p className="text-xs text-[#94A3B8] leading-relaxed font-sans">
                  For scoping new enterprise software projects, providing timeline/budget criteria, and requesting
                  bilateral NDAs, submit via our intake terminal:
                </p>
                <Link
                  href="/contact"
                  className="inline-flex items-center gap-2 px-3 py-2 rounded-lg bg-[#0066FF] text-xs font-mono text-white hover:bg-[#0052CC] transition-colors"
                >
                  <span>Open Consultation Terminal</span>
                  <ArrowUpRight className="w-3 h-3" />
                </Link>
              </div>
            </div>

            {/* Official Social Media Links */}
            <div className="space-y-4">
              <span className="font-mono text-xs text-white uppercase tracking-wider block font-semibold">
                // OFFICIAL SOCIAL & REPOSITORY CHANNELS
              </span>
              <p className="text-xs text-[#94A3B8] leading-relaxed font-sans">
                Follow and inspect GMDware across authorized corporate social networks and our official GitHub organization:
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                {socialLinks.map((link) => {
                  const label =
                    link.platform.toLowerCase() === 'github' ? 'GMDware GitHub' : link.platform;
                  return (
                    <a
                      key={link.platform}
                      href={link.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-3 rounded-xl bg-[#080D18] border border-white/10 hover:border-[#0066FF]/50 hover:bg-white/[0.02] flex items-center justify-between group transition-all"
                    >
                      <div className="flex items-center gap-2.5">
                        <SocialIcon
                          platform={link.platform}
                          className="w-4 h-4 text-slate-400 group-hover:text-[#00D2FF] transition-colors"
                        />
                        <span className="text-xs font-mono text-white font-medium">{label}</span>
                      </div>
                      <ArrowUpRight className="w-3.5 h-3.5 text-slate-500 group-hover:text-[#00D2FF] group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                    </a>
                  );
                })}
              </div>

              <div className="flex items-center gap-2 text-[11px] font-mono text-[#64748B] pt-2">
                <ShieldCheck className="w-3.5 h-3.5 text-[#10B981]" />
                <span>All social links are verified and CMS-managed from PostgreSQL.</span>
              </div>
            </div>
          </div>
        </div>
      </Container>
    </div>
  );
}
