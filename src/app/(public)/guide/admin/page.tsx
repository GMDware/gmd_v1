import React from 'react';
import type { Metadata } from 'next';
import Link from 'next/link';
import { Container } from '@/components/ui/Container';
import { SectionHeading } from '@/components/ui/SectionHeading';
import { GuideNav } from '@/components/public/GuideNav';
import {
  ShieldAlert,
  FolderGit2,
  Layout,
  Globe,
  Share2,
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
  Lock,
  ExternalLink,
} from 'lucide-react';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export const metadata: Metadata = {
  title: 'Administrator CMS Workflow Guide — GMDware',
  description:
    'Operating manual and step-by-step CMS workflows for authorized GMDware administrators.',
  robots: {
    index: false,
    follow: false,
  },
};

export default function AdminGuidePage() {
  const workflows = [
    {
      title: 'Publishing a Project / Case Study',
      icon: FolderGit2,
      tag: 'WORKFLOW 01',
      steps: [
        'Navigate to Administrative Portal: /admin/projects',
        'Click "New Project" or select an existing project card to edit',
        'Fill in core details: Title, slug, category, client visibility toggle, and project type',
        'Provide technical architectural breakdowns: Challenge, Strategy, Architecture, and Infrastructure',
        'Attach technologies and case study metrics (e.g., Latency, Ingestion capacity)',
        'Set Publication Status to "PUBLISHED" and click "Save Project"',
        'Verify live reflection immediately on public /work and individual project detail pages',
      ],
      pathString: 'Admin → Projects → Create/Edit → Add Content → Add Tech/Metrics → Save → Publish → Public /work Reflects Content',
    },
    {
      title: 'Updating Homepage Content & Propositions',
      icon: Layout,
      tag: 'WORKFLOW 02',
      steps: [
        'Navigate to Administrative Portal: /admin/homepage',
        'Review current flagship proposition, hero headline, and subheadings',
        'Update value proposition statements, call-to-action button labels, or featured flags',
        'Click "Save Homepage Content"',
        'Visit public root (/) to inspect real-time layout rendering',
      ],
      pathString: 'Admin → Homepage → Edit Content → Save → Public Homepage Reflects Update',
    },
    {
      title: 'Updating Dynamic SEO & OpenGraph Metadata',
      icon: Globe,
      tag: 'WORKFLOW 03',
      steps: [
        'Navigate to Administrative Portal: /admin/seo',
        'Select the target route from the route selector (e.g., /, /work, /services, /about, /contact)',
        'Edit meta Title, Description, Keywords, and Canonical URL',
        'Upload or select OpenGraph preview image URL',
        'Set search indexing directive (index / noindex)',
        'Click "Save SEO Settings" to commit changes to database SEOSetting table',
        'Inspect public page HTML head tags or OpenGraph social debugger',
      ],
      pathString: 'Admin → SEO → Select Route → Edit Metadata → Save → Public Route Metadata Updates',
    },
    {
      title: 'Managing Official Company Social Links',
      icon: Share2,
      tag: 'WORKFLOW 04',
      steps: [
        'Navigate to Administrative Portal: /admin/social',
        'View the authoritative list of social platforms and destination URLs',
        'Click "Edit" on a channel or click "Add Channel" to introduce a new platform',
        'Input platform name and verified HTTPS destination URL (with security protocol validation)',
        'Adjust numeric Display Order to reorder links in header and footer',
        'Toggle "Visible on Public Site" to activate or temporarily disable links',
        'Click "Save Channel" — Header, Footer, and Contact pages update immediately',
      ],
      pathString: 'Admin → Social Links → Edit Official Company Destinations → Save → Public Footer/Header Reflects Update',
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
              CMS OPERATIONAL MANUAL
            </span>
          </div>

          <h1 className="text-4xl sm:text-6xl font-black text-white font-display tracking-tight leading-tight">
            Administrator CMS Workflows
          </h1>

          <p className="text-base sm:text-lg text-[#94A3B8] leading-relaxed font-sans max-w-3xl">
            Step-by-step operating procedures for authorized administrators to manage projects,
            homepage copy, search engine metadata, and official company channels.
          </p>
        </div>

        {/* Sub-Navigation */}
        <GuideNav />

        {/* Security & Access Notice */}
        <div className="p-5 rounded-2xl bg-[#0D121F] border border-[#0066FF]/30 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <ShieldCheck className="w-5 h-5 text-[#00D2FF] shrink-0" />
            <div>
              <span className="text-xs font-mono font-bold text-white block">
                AUTHENTICATED ACCESS ONLY
              </span>
              <p className="text-xs text-slate-400 font-sans">
                These workflows require an active administrator session at <code>/admin/login</code>.
                Direct database access is never required for routine content management.
              </p>
            </div>
          </div>

          <Link
            href="/admin/login"
            className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-lg bg-[#0066FF] text-white font-mono text-xs hover:bg-[#0052CC] transition-colors shrink-0"
          >
            <span>Open Admin Portal</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </Link>
        </div>

        {/* Workflows List */}
        <div className="space-y-10">
          <SectionHeading
            tag="CORE WORKFLOWS"
            title="Standard Operating Procedures"
            subtitle="Follow these step-by-step procedures to maintain content freshness and SEO accuracy."
          />

          <div className="grid grid-cols-1 gap-8">
            {workflows.map((wf) => {
              const Icon = wf.icon;
              return (
                <div
                  key={wf.tag}
                  className="gmd-panel rounded-2xl p-6 sm:p-8 border border-white/10 space-y-6"
                >
                  <div className="flex items-center justify-between border-b border-white/5 pb-4">
                    <div className="flex items-center gap-3">
                      <div className="p-2.5 rounded-xl bg-[#080D18] border border-white/10 text-[#00D2FF]">
                        <Icon className="w-5 h-5" />
                      </div>
                      <div>
                        <span className="text-[10px] font-mono text-[#0066FF] uppercase tracking-widest block">
                          {wf.tag}
                        </span>
                        <h3 className="text-xl font-bold text-white font-display">
                          {wf.title}
                        </h3>
                      </div>
                    </div>
                  </div>

                  {/* Flow breadcrumb */}
                  <div className="p-3 rounded-lg bg-[#03060C] border border-white/5 font-mono text-[11px] text-[#00D2FF] overflow-x-auto whitespace-nowrap">
                    {wf.pathString}
                  </div>

                  {/* Steps */}
                  <div className="space-y-2.5 pt-2">
                    <span className="text-xs font-mono text-slate-400 uppercase tracking-wider block font-semibold">
                      Step-by-Step Procedure:
                    </span>
                    <ol className="space-y-2 text-xs text-slate-300 font-sans">
                      {wf.steps.map((step, idx) => (
                        <li key={idx} className="flex items-start gap-2.5">
                          <span className="font-mono text-[10px] text-[#0066FF] px-1.5 py-0.5 rounded bg-white/5 shrink-0 mt-0.5">
                            0{idx + 1}
                          </span>
                          <span className="leading-relaxed">{step}</span>
                        </li>
                      ))}
                    </ol>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </Container>
    </div>
  );
}
