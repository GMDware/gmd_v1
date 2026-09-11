import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { notFound } from 'next/navigation';
import { Metadata } from 'next';
import DataStore from '@/lib/db/data-store';
import { Container } from '@/components/ui/Container';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { CallToAction } from '@/components/public/CallToAction';
import { JsonLd } from '@/components/public/JsonLd';
import {
  ArrowLeft,
  ArrowUpRight,
  Cpu,
  Layers,
  Shield,
  Server,
  Code2,
  CheckCircle2,
  Activity,
  Terminal,
  ExternalLink,
  Lock,
  Globe,
  Quote,
} from 'lucide-react';

import { resolveActiveTheme } from '@/lib/theme/resolver';
import { NexusCaseStudy } from '@/themes/nexus/components/NexusCaseStudy';
import { AtelierCaseStudy } from '@/themes/atelier/components/AtelierCaseStudy';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

interface CaseStudyPageProps {
  params: Promise<{ slug: string }>;
  searchParams?: Promise<Record<string, string | string[] | undefined>>;
}

export async function generateMetadata({ params }: CaseStudyPageProps): Promise<Metadata> {
  const { slug } = await params;
  const project = await DataStore.getProjectBySlug(slug);

  if (!project) {
    return {
      title: 'Case Study Not Found | GMDware',
    };
  }

  const p = project as any;
  const title = p.seoTitle || `${p.title} | GMDware Case Study`;
  const description =
    p.seoDescription ||
    p.shortDescription ||
    `Architectural case study detailing the engineering and systems architecture of ${p.title}.`;
  const heroUrl = p.heroImage?.url || p.heroImageUrl;
  const canonical = `${process.env.NEXT_PUBLIC_SITE_URL || 'https://gmdware.com'}/work/${slug}`;

  return {
    title,
    description,
    keywords: p.seoKeywords && p.seoKeywords.length > 0 ? p.seoKeywords : undefined,
    alternates: {
      canonical,
    },
    openGraph: {
      title,
      description,
      url: canonical,
      images: heroUrl ? [{ url: heroUrl }] : [{ url: '/og-image.png' }],
      type: 'article',
      siteName: 'GMDware',
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: heroUrl ? [heroUrl] : undefined,
    },
  };
}

export default async function CaseStudyPage({ params, searchParams }: CaseStudyPageProps) {
  const { slug } = await params;
  const resolvedParams = searchParams ? await searchParams : undefined;
  const { themeId } = await resolveActiveTheme(resolvedParams);
  const project = await DataStore.getProjectBySlug(slug);

  if (!project) {
    notFound();
  }

  if (themeId === 'nexus') {
    return <NexusCaseStudy project={project} />;
  }

  if (themeId === 'atelier') {
    return <AtelierCaseStudy project={project} />;
  }

  const p = project as any;
  const heroUrl = p.heroImage?.url || p.heroImageUrl;
  const technologies = p.technologies?.map((t: any) => t.technology || t) || [];
  const gallery = p.gallery || [];
  const caseStudy = p.caseStudy;

  // 7 Structured Architectural Dimensions:
  const dimensions = [
    {
      id: 'challenge',
      num: '01',
      title: 'Problem & Operational Challenge',
      subtitle: 'DOMAIN CONSTRAINTS & THREAT MODEL',
      icon: Cpu,
      content: p.challenge,
      accent: '#00D2FF',
    },
    {
      id: 'strategy',
      num: '02',
      title: 'Strategy & Systems Architecture',
      subtitle: 'MATHEMATICAL DETERMINISM & BOUNDARIES',
      icon: Layers,
      content: p.strategy,
      accent: '#0066FF',
    },
    {
      id: 'design',
      num: '03',
      title: 'UX & Interaction Engineering',
      subtitle: 'ERGONOMICS & COGNITIVE EFFICIENCY',
      icon: Shield,
      content: p.designApproach,
      accent: '#80B3FF',
    },
    {
      id: 'architecture',
      num: '04',
      title: 'Technical Stack & Distributed Abstractions',
      subtitle: 'TYPE CONTRACTS & SERVICE INTERFACES',
      icon: Terminal,
      content: p.architecture,
      accent: '#38BDF8',
    },
    {
      id: 'development',
      num: '05',
      title: 'Full-Stack Implementation & Concurrency',
      subtitle: 'PIPELINES, THREADING & RESILIENCE',
      icon: Code2,
      content: p.development,
      accent: '#60A5FA',
    },
    {
      id: 'infrastructure',
      num: '06',
      title: 'Cloud Infrastructure & High-Availability',
      subtitle: 'MULTI-REGION CLUSTERING & SECURITY SLA',
      icon: Server,
      content: p.infrastructure,
      accent: '#00D2FF',
    },
    {
      id: 'results',
      num: '07',
      title: 'Measurable Impact & Production Outcomes',
      subtitle: 'VERIFIED TELEMETRY & BUSINESS DELIVERABLES',
      icon: Activity,
      content: p.results,
      accent: '#10B981',
    },
  ].filter((d) => Boolean(d.content && d.content.trim().length > 0));

  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://gmdware.com';
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'TechArticle',
    headline: p.title,
    description: p.shortDescription || p.seoDescription,
    image: heroUrl ? [heroUrl] : undefined,
    datePublished: p.createdAt ? new Date(p.createdAt).toISOString() : undefined,
    dateModified: p.updatedAt ? new Date(p.updatedAt).toISOString() : undefined,
    author: {
      '@type': 'Organization',
      name: 'GMDware',
      url: siteUrl,
    },
    publisher: {
      '@type': 'Organization',
      name: 'GMDware',
      logo: {
        '@type': 'ImageObject',
        url: `${siteUrl}/og-image.png`,
      },
    },
    about: {
      '@type': 'SoftwareApplication',
      name: p.title,
      applicationCategory: p.projectType || 'Software System',
      operatingSystem: 'Cross-platform',
    },
  };

  return (
    <div className="py-16 space-y-20 bg-[#05080F]">
      <JsonLd data={jsonLd} />
      <Container size="wide">
        {/* Navigation Breadcrumb & Back Link */}
        <div className="flex items-center justify-between border-b border-white/[0.08] pb-6 mb-12">
          <Link
            href="/work"
            className="inline-flex items-center gap-2 text-xs font-mono text-[#94A3B8] hover:text-[#00D2FF] transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>RETURN TO WORK DIRECTORY</span>
          </Link>

          <div className="flex items-center gap-2 font-mono text-xs text-[#64748B]">
            <span>CASE_UID:</span>
            <span className="text-[#00D2FF] font-semibold">{p.slug}</span>
          </div>
        </div>

        {/* Hero Section of Case Study */}
        <div className="space-y-8 max-w-5xl">
          <div className="flex flex-wrap items-center gap-3">
            <span className="w-2 h-2 rounded-full bg-[#0066FF] animate-pulse" />
            <span className="font-mono text-xs tracking-[0.25em] uppercase text-[#00D2FF]">
              // ARCHITECTURAL CASE STUDY
            </span>
            <Badge variant="cobalt">{p.projectType || 'Software System'}</Badge>
            {p.clientName && (
              <Badge variant="neutral">{p.clientName}</Badge>
            )}
            {p.isFeatured && <Badge variant="cyan">FLAGSHIP SYSTEM</Badge>}
          </div>

          <h1 className="text-4xl sm:text-6xl md:text-7xl font-black text-white font-display tracking-tight leading-[1.06]">
            {p.title}
          </h1>

          <p className="text-lg sm:text-2xl text-[#CBD5E1] leading-relaxed font-sans max-w-4xl">
            {p.shortDescription}
          </p>
        </div>

        {/* Hero Media Frame */}
        <div className="mt-12 relative aspect-[21/9] rounded-2xl overflow-hidden border border-white/10 bg-[#080D18] shadow-2xl">
          {heroUrl ? (
            <Image
              src={heroUrl}
              alt={p.title}
              fill
              priority
              sizes="100vw"
              className="object-cover"
            />
          ) : (
            <div className="w-full h-full flex flex-col items-center justify-center p-8 blueprint-grid">
              <div className="w-20 h-20 rounded-2xl bg-[#0066FF]/10 border border-[#0066FF]/30 flex items-center justify-center mb-4 text-[#0066FF]">
                <Layers className="w-10 h-10" />
              </div>
              <span className="font-display font-bold text-white text-2xl tracking-tight">
                {p.title}
              </span>
              <span className="font-mono text-xs text-[#64748B] mt-2">
                [SYSTEM SCHEMATIC // DEPLOYED PRODUCTION ARTIFACT]
              </span>
            </div>
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-[#05080F] via-transparent to-transparent opacity-60" />
        </div>

        {/* Project Metadata Rail */}
        <div className="mt-12 grid grid-cols-2 md:grid-cols-4 gap-4 p-6 rounded-2xl bg-[#070D1A] border border-white/[0.08] font-mono text-xs">
          <div>
            <div className="text-[#64748B] uppercase tracking-wider mb-1">DOMAIN TYPE</div>
            <div className="text-white font-semibold text-sm">{p.projectType || 'Platform'}</div>
          </div>
          <div>
            <div className="text-[#64748B] uppercase tracking-wider mb-1">ENTERPRISE CLIENT</div>
            <div className="text-[#00D2FF] font-semibold text-sm">
              {p.clientName || 'Confidential Partner'}
            </div>
          </div>
          <div>
            <div className="text-[#64748B] uppercase tracking-wider mb-1">AVAILABILITY SLA</div>
            <div className="text-[#10B981] font-semibold text-sm flex items-center gap-1">
              <CheckCircle2 className="w-3.5 h-3.5" /> 99.99% Guaranteed
            </div>
          </div>
          <div>
            <div className="text-[#64748B] uppercase tracking-wider mb-1">DEPLOYMENT STATUS</div>
            <div className="text-white font-semibold text-sm flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" /> ACTIVE PRODUCTION
            </div>
          </div>
        </div>

        {/* Deep Full Description Overview */}
        {p.fullDescription && (
          <div className="mt-16 max-w-4xl space-y-6">
            <h2 className="text-2xl sm:text-3xl font-black text-white font-display tracking-tight">
              Executive Architectural Summary
            </h2>
            <div className="text-base text-[#94A3B8] leading-relaxed font-sans space-y-4 whitespace-pre-line">
              {p.fullDescription}
            </div>
          </div>
        )}

        {/* 7 Structured Dimensions Continuum */}
        {dimensions.length > 0 && (
          <div className="mt-24 space-y-12">
            <div className="border-b border-white/[0.08] pb-6">
              <div className="flex items-center gap-2 mb-2">
                <span className="w-2 h-2 rounded-full bg-[#0066FF] animate-pulse" />
                <span className="font-mono text-xs tracking-[0.25em] uppercase text-[#00D2FF]">
                  7-DIMENSIONAL DECONSTRUCTION
                </span>
              </div>
              <h2 className="text-3xl sm:text-4xl font-black text-white font-display tracking-tight">
                Architectural Breakdown & Execution
              </h2>
            </div>

            <div className="grid grid-cols-1 gap-6">
              {dimensions.map((dim) => {
                const DimIcon = dim.icon;
                return (
                  <div
                    key={dim.id}
                    className="p-6 sm:p-8 rounded-2xl bg-[#070D1A] border border-white/[0.08] hover:border-[#0066FF]/40 transition-colors space-y-4"
                  >
                    <div className="flex flex-wrap items-center justify-between gap-4 border-b border-white/[0.06] pb-4">
                      <div className="flex items-center gap-3">
                        <div className="p-2.5 rounded-lg bg-[#0066FF]/15 border border-[#0066FF]/30 text-[#00D2FF]">
                          <DimIcon className="w-5 h-5" />
                        </div>
                        <div>
                          <div className="font-mono text-[10px] tracking-widest uppercase text-[#64748B]">
                            DIMENSION {dim.num} // {dim.subtitle}
                          </div>
                          <h3 className="text-xl sm:text-2xl font-bold text-white font-display">
                            {dim.title}
                          </h3>
                        </div>
                      </div>
                    </div>

                    <div className="text-sm sm:text-base text-[#CBD5E1] leading-relaxed font-sans pl-1 pt-2 whitespace-pre-line">
                      {dim.content}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Verified Technologies Stack */}
        {technologies.length > 0 && (
          <div className="mt-20 p-8 rounded-2xl bg-[#060B16] border border-white/[0.08] space-y-6">
            <div className="flex items-center justify-between border-b border-white/[0.06] pb-4">
              <div className="space-y-1">
                <span className="font-mono text-xs text-[#00D2FF] uppercase tracking-wider">
                  VERIFIED STACK COMPOSITION
                </span>
                <h3 className="text-xl sm:text-2xl font-bold text-white font-display">
                  Applied Technologies & Tooling
                </h3>
              </div>
              <span className="font-mono text-xs text-[#64748B] hidden sm:inline">
                ZERO DEPRECATIONS
              </span>
            </div>

            <div className="flex flex-wrap gap-2.5">
              {technologies.map((t: any, idx: number) => {
                const name = t.name || t.id;
                const cat = t.category || 'Core';
                return (
                  <div
                    key={idx}
                    className="px-3.5 py-2 rounded-lg bg-[#0B152B] border border-white/10 flex items-center gap-2.5 text-xs font-mono text-white"
                  >
                    <span className="w-1.5 h-1.5 rounded-full bg-[#00D2FF]" />
                    <span className="font-semibold">{name}</span>
                    <span className="text-[#64748B] text-[10px] uppercase">// {cat}</span>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Client Testimonial (if populated in CaseStudy) */}
        {caseStudy && (caseStudy as any).testimonial && (
          <div className="mt-20 p-8 sm:p-12 rounded-2xl bg-[#091122] border border-[#0066FF]/30 relative overflow-hidden shadow-2xl">
            <div className="absolute top-6 right-8 text-[#0066FF]/20 pointer-events-none">
              <Quote className="w-24 h-24" />
            </div>

            <div className="relative z-10 max-w-3xl space-y-6">
              <div className="font-mono text-xs text-[#00D2FF] tracking-wider uppercase">
                PARTNER ENDORSEMENT
              </div>
              <p className="text-lg sm:text-2xl font-serif italic text-white leading-relaxed">
                &ldquo;{(caseStudy as any).testimonial.quote || (caseStudy as any).testimonial}&rdquo;
              </p>
              {(caseStudy as any).testimonial.author && (
                <div className="font-mono text-xs text-[#94A3B8]">
                  <span className="text-white font-bold">{(caseStudy as any).testimonial.author}</span>
                  {(caseStudy as any).testimonial.role && (
                    <span> — {(caseStudy as any).testimonial.role}</span>
                  )}
                </div>
              )}
            </div>
          </div>
        )}

        {/* Media / Gallery Items (if populated) */}
        {gallery.length > 0 && (
          <div className="mt-20 space-y-6">
            <div className="border-b border-white/[0.08] pb-4">
              <span className="font-mono text-xs text-[#00D2FF] tracking-wider uppercase">
                SYSTEM ARTIFACTS
              </span>
              <h3 className="text-2xl font-bold text-white font-display">
                Interface Gallery & Schematics
              </h3>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {gallery.map((item: any, idx: number) => {
                const url = item.mediaAsset?.url;
                if (!url) return null;
                return (
                  <div
                    key={item.id || idx}
                    className="relative aspect-video rounded-xl overflow-hidden border border-white/10 bg-[#080D18]"
                  >
                    <Image
                      src={url}
                      alt={item.caption || `${p.title} gallery item`}
                      fill
                      sizes="(max-width: 768px) 100vw, 50vw"
                      className="object-cover"
                    />
                    {item.caption && (
                      <div className="absolute bottom-0 inset-x-0 p-3 bg-black/80 font-mono text-xs text-white">
                        {item.caption}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </Container>

      {/* Conversion Terminal */}
      <Container size="wide">
        <CallToAction
          headline={`Interested in an Architecture Like ${p.title}?`}
          subtitle="Speak directly with our software architects to analyze your domain problem, determine feasibility, and schedule an engineering sprint."
          buttonLabel="Start a Project"
          buttonUrl="/contact"
        />
      </Container>
    </div>
  );
}
