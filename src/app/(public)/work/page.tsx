import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import type { Metadata } from 'next';
import DataStore from '@/lib/db/data-store';
import { Container } from '@/components/ui/Container';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { CallToAction } from '@/components/public/CallToAction';
import {
  ArrowUpRight,
  Cpu,
  Shield,
  Layers,
  Server,
  CheckCircle2,
  ExternalLink,
  Sparkles,
} from 'lucide-react';

import { resolveActiveTheme } from '@/lib/theme/resolver';
import { NexusWork } from '@/themes/nexus/components/NexusWork';
import { AtelierWork } from '@/themes/atelier/components/AtelierWork';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export async function generateMetadata(): Promise<Metadata> {
  return DataStore.getSEO('/work');
}

export default async function WorkPage({
  searchParams,
}: {
  searchParams: Promise<{ category?: string; themePreview?: string }>;
}) {
  const resolvedParams = await searchParams;
  const activeCategorySlug = resolvedParams?.category;
  const { themeId } = await resolveActiveTheme(resolvedParams as any);

  const [projects, categories] = await Promise.all([
    DataStore.getProjects(),
    DataStore.getProjectCategories(),
  ]);

  const filteredProjects = activeCategorySlug
    ? projects.filter(
        (p: any) =>
          p.category?.slug?.toLowerCase() === activeCategorySlug.toLowerCase() ||
          p.categorySlug?.toLowerCase() === activeCategorySlug.toLowerCase()
      )
    : projects;

  if (themeId === 'nexus') {
    return (
      <NexusWork
        projects={filteredProjects}
        categories={categories}
        activeCategory={activeCategorySlug}
        isStandalone={true}
      />
    );
  }

  if (themeId === 'atelier') {
    return (
      <AtelierWork
        projects={filteredProjects}
        categories={categories}
        activeCategory={activeCategorySlug}
        isStandalone={true}
      />
    );
  }

  return (
    <div className="py-20 space-y-24 bg-[#05080F]">
      <Container size="wide">
        {/* Editorial Work Header */}
        <div className="max-w-4xl space-y-5 mb-14">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-[#0066FF] animate-pulse" />
            <span className="font-mono text-xs tracking-[0.25em] uppercase text-[#00D2FF]">
              // PRODUCTION SYSTEMS ARCHIVE
            </span>
          </div>

          <h1 className="text-4xl sm:text-6xl md:text-7xl font-black text-white font-display tracking-tight leading-[1.08]">
            Architectural Work & Case Studies
          </h1>

          <p className="text-base sm:text-xl text-[#94A3B8] leading-relaxed font-sans max-w-3xl">
            Inspect our deployed enterprise systems. Every case study documents our end-to-end engineering rigor: from domain problem modeling to zero-downtime distributed infrastructure.
          </p>
        </div>

        {/* Category Filter Pills */}
        <div className="flex flex-wrap items-center gap-2 border-b border-white/[0.08] pb-6 mb-14">
          <span className="text-xs font-mono text-[#64748B] uppercase mr-3">DOMAINS:</span>
          <Link href="/work">
            <Badge
              variant={!activeCategorySlug ? 'cobalt' : 'neutral'}
              className="cursor-pointer transition-all hover:border-[#0066FF]/50"
            >
              All Flagship Systems ({projects.length})
            </Badge>
          </Link>
          {categories.map((cat: any) => {
            const isSelected = activeCategorySlug === cat.slug;
            return (
              <Link key={cat.id} href={`/work?category=${cat.slug}`}>
                <Badge
                  variant={isSelected ? 'cobalt' : 'neutral'}
                  className="cursor-pointer transition-all hover:border-[#0066FF]/50"
                >
                  {cat.name}
                </Badge>
              </Link>
            );
          })}
        </div>

        {/* Projects Showcase Grid or Empty State */}
        {filteredProjects.length === 0 ? (
          <div className="gmd-panel rounded-2xl p-12 sm:p-16 border border-white/10 text-center space-y-6 max-w-2xl mx-auto">
            <div className="w-16 h-16 rounded-2xl bg-[#080D18] border border-white/10 mx-auto flex items-center justify-center text-[#0066FF]">
              <Layers className="w-8 h-8 text-[#00D2FF]" />
            </div>
            <div className="space-y-2">
              <span className="font-mono text-xs text-[#00D2FF] uppercase tracking-widest">
                // ARCHIVE STATUS: EMPTY
              </span>
              <h3 className="text-2xl font-bold text-white font-display">
                {activeCategorySlug
                  ? `No Published Systems Under "${activeCategorySlug}"`
                  : 'No Public Systems Currently Listed'}
              </h3>
              <p className="text-sm text-[#94A3B8] leading-relaxed max-w-md mx-auto font-sans">
                Case studies are being calibrated in the CMS. Contact our engineering directors directly to receive confidential enterprise case summaries.
              </p>
            </div>
            <div className="pt-2">
              <Link href="/contact">
                <Button variant="primary" size="md" rightIcon={<ArrowUpRight className="w-4 h-4" />}>
                  Request Architecture Portfolio
                </Button>
              </Link>
            </div>
          </div>
        ) : (
          <div className="space-y-16">
            {filteredProjects.map((project: any, idx: number) => {
              const heroUrl = project.heroImage?.url || project.heroImageUrl;
              const projectTechs =
                project.technologies?.map(
                  (t: any) => t.technology?.name || t.name
                ) || [];

              return (
                <article
                  key={project.id || idx}
                  id={project.slug}
                  className="gmd-panel rounded-2xl p-6 sm:p-10 lg:p-12 border border-white/10 hover:border-[#0066FF]/50 transition-all scroll-mt-28 relative overflow-hidden group shadow-2xl"
                >
                  {/* Background Index Watermark */}
                  <div className="absolute top-4 right-8 font-mono text-7xl sm:text-8xl font-black text-white/[0.02] select-none pointer-events-none">
                    0{idx + 1}
                  </div>

                  {/* Card Header Rail */}
                  <div className="flex flex-wrap items-center justify-between gap-4 border-b border-white/[0.08] pb-6 mb-8">
                    <div className="flex flex-wrap items-center gap-3">
                      <span className="font-mono text-xs text-[#00D2FF] font-semibold">
                        0{idx + 1} //
                      </span>
                      <Badge variant="cobalt">{project.projectType || 'Software System'}</Badge>
                      <Badge variant="neutral">
                        {project.clientName || 'Confidential Partner'}
                      </Badge>
                      {project.isFeatured && <Badge variant="cyan">FLAGSHIP</Badge>}
                    </div>
                    <div className="font-mono text-xs text-[#64748B]">
                      SPEC_UID: {project.slug}
                    </div>
                  </div>

                  {/* Main 2-Column Content */}
                  <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
                    {/* Left: Project Narrative & Specs (7 Cols) */}
                    <div className="lg:col-span-7 space-y-6">
                      <h2 className="text-2xl sm:text-4xl font-black text-white font-display tracking-tight group-hover:text-[#00D2FF] transition-colors">
                        <Link href={`/work/${project.slug}`}>
                          {project.title}
                        </Link>
                      </h2>

                      <p className="text-sm sm:text-base text-[#94A3B8] leading-relaxed font-sans">
                        {project.shortDescription || project.fullDescription}
                      </p>

                      {/* Highlights Grid */}
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                        {project.challenge && (
                          <div className="p-3.5 rounded-lg bg-[#080D18] border border-white/[0.05] space-y-1">
                            <span className="font-mono text-[10px] text-[#00D2FF] uppercase tracking-wider font-semibold flex items-center gap-1.5">
                              <Cpu className="w-3 h-3 text-[#0066FF]" />
                              THE CHALLENGE
                            </span>
                            <p className="text-xs text-slate-300 line-clamp-2 font-sans">
                              {project.challenge}
                            </p>
                          </div>
                        )}

                        {project.strategy && (
                          <div className="p-3.5 rounded-lg bg-[#080D18] border border-white/[0.05] space-y-1">
                            <span className="font-mono text-[10px] text-[#00D2FF] uppercase tracking-wider font-semibold flex items-center gap-1.5">
                              <Layers className="w-3 h-3 text-[#0066FF]" />
                              STRATEGY
                            </span>
                            <p className="text-xs text-slate-300 line-clamp-2 font-sans">
                              {project.strategy}
                            </p>
                          </div>
                        )}
                      </div>

                      {/* Technology Stack Tags */}
                      {projectTechs.length > 0 && (
                        <div className="space-y-2 pt-2">
                          <span className="font-mono text-[10px] text-[#64748B] uppercase tracking-widest block">
                            SYSTEM STACK:
                          </span>
                          <div className="flex flex-wrap gap-1.5">
                            {projectTechs.slice(0, 6).map((tech: string) => (
                              <span
                                key={tech}
                                className="px-2.5 py-1 rounded bg-[#0E1526] border border-white/[0.06] font-mono text-xs text-slate-300"
                              >
                                {tech}
                              </span>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* Actions */}
                      <div className="pt-4 flex flex-wrap items-center gap-4">
                        <Link href={`/work/${project.slug}`}>
                          <Button
                            variant="primary"
                            size="md"
                            rightIcon={<ArrowUpRight className="w-4 h-4" />}
                          >
                            Inspect 7-Dimensional Case Study
                          </Button>
                        </Link>
                        <Link href="/contact">
                          <Button variant="outline" size="md">
                            Inquire Similar Build
                          </Button>
                        </Link>
                      </div>
                    </div>

                    {/* Right: Visual Preview Frame (5 Cols) */}
                    <div className="lg:col-span-5">
                      <Link
                        href={`/work/${project.slug}`}
                        className="block relative aspect-video sm:aspect-[4/3] rounded-xl overflow-hidden border border-white/10 bg-[#080D18] group-hover:border-[#0066FF]/50 transition-all shadow-xl"
                      >
                        {heroUrl ? (
                          <Image
                            src={heroUrl}
                            alt={project.title}
                            fill
                            sizes="(max-width: 1024px) 100vw, 40vw"
                            className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                          />
                        ) : (
                          <div className="w-full h-full flex flex-col items-center justify-center p-8 blueprint-grid">
                            <div className="w-16 h-16 rounded-2xl bg-[#0066FF]/10 border border-[#0066FF]/30 flex items-center justify-center mb-4 text-[#0066FF]">
                              <Layers className="w-8 h-8" />
                            </div>
                            <span className="font-display font-bold text-white text-lg tracking-tight text-center">
                              {project.title}
                            </span>
                            <span className="font-mono text-xs text-[#64748B] mt-1">
                              [ARCHITECTURAL BLUEPRINT // DEPLOYED]
                            </span>
                          </div>
                        )}

                        {/* Vignette */}
                        <div className="absolute inset-0 bg-gradient-to-t from-[#05080F]/80 via-transparent to-transparent opacity-60" />

                        {/* Verified Badge */}
                        <div className="absolute bottom-3 left-3 px-2.5 py-1 rounded bg-[#05080F]/90 border border-white/10 font-mono text-[10px] text-[#00D2FF] flex items-center gap-1.5">
                          <CheckCircle2 className="w-3 h-3 text-[#10B981]" />
                          <span>PRODUCTION VERIFIED</span>
                        </div>
                      </Link>
                    </div>
                  </div>
                </article>
              );
            })}
          </div>
        )}
      </Container>

      {/* Conversion Terminal */}
      <Container size="wide">
        <CallToAction
          headline="Have an Ambitious Engineering Requirement?"
          subtitle="Our engineering leadership is prepared to evaluate your architectural constraints and produce an execution blueprint."
          buttonLabel="Schedule Technical Discovery"
          buttonUrl="/contact"
        />
      </Container>
    </div>
  );
}
