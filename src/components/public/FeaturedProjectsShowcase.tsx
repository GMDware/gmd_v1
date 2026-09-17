'use client';

import React, { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { ArrowUpRight, CheckCircle2, Cpu, ChevronLeft, ChevronRight, Layers, ExternalLink } from 'lucide-react';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { cn } from '@/lib/utils';
import { useCursor } from '@/components/motion/CursorProvider';

export interface ProjectShowcaseData {
  id: string;
  title: string;
  slug: string;
  shortDescription: string;
  fullDescription?: string;
  clientName?: string | null;
  projectType: string;
  heroImageUrl?: string;
  challenge?: string | null;
  strategy?: string | null;
  architecture?: string | null;
  results?: string | null;
  technologies?: Array<{ name: string; category?: string }>;
  isFeatured?: boolean;
}

interface FeaturedProjectsShowcaseProps {
  projects: ProjectShowcaseData[];
}

export const FeaturedProjectsShowcase: React.FC<FeaturedProjectsShowcaseProps> = ({ projects }) => {
  const [activeIndex, setActiveIndex] = useState(0);
  const [hasOverflow, setHasOverflow] = useState(false);
  const railRef = useRef<HTMLDivElement>(null);
  const cardRefs = useRef<(HTMLButtonElement | null)[]>([]);
  const { setCursorState } = useCursor();

  useEffect(() => {
    const checkOverflow = () => {
      if (railRef.current) {
        const { scrollWidth, clientWidth } = railRef.current;
        setHasOverflow(scrollWidth > clientWidth + 8);
      }
    };
    checkOverflow();
    window.addEventListener('resize', checkOverflow);
    return () => window.removeEventListener('resize', checkOverflow);
  }, [projects]);

  if (projects.length === 0) return null;

  const activeProject = projects[activeIndex] || projects[0];

  // Scroll Rail Helpers
  const scrollPrev = () => {
    if (!railRef.current) return;
    const step = 320;
    railRef.current.scrollBy({ left: -step, behavior: 'smooth' });
  };

  const scrollNext = () => {
    if (!railRef.current) return;
    const step = 320;
    railRef.current.scrollBy({ left: step, behavior: 'smooth' });
  };

  const selectProject = (index: number) => {
    setActiveIndex(index);
    const targetCard = cardRefs.current[index];
    if (targetCard && railRef.current) {
      const railWidth = railRef.current.clientWidth;
      const cardLeft = targetCard.offsetLeft;
      const cardWidth = targetCard.clientWidth;
      railRef.current.scrollTo({
        left: Math.max(0, cardLeft - railWidth / 2 + cardWidth / 2),
        behavior: 'smooth',
      });
    }
  };

  return (
    <div className="space-y-8">
      {/* ── 1. Top Stage: Single Featured Project on Stage ── */}
      <article
        className="relative gmd-panel rounded-3xl p-6 sm:p-10 lg:p-12 overflow-hidden border border-white/15 shadow-2xl transition-all duration-300 group"
        onMouseEnter={() => setCursorState('project')}
        onMouseLeave={() => setCursorState('default')}
      >
        {/* Top Glowing Gradient Accent Bar */}
        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-[#0066FF] via-[#00D2FF] to-blue-400" />

        {/* Background Architectural Watermark */}
        <div className="absolute top-4 right-8 font-mono text-8xl sm:text-9xl font-black text-white/[0.03] select-none pointer-events-none">
          0{activeIndex + 1}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center relative z-10">
          {/* Spec Column (5 Cols) */}
          <div className="lg:col-span-5 space-y-6">
            {/* Metadata Badges */}
            <div className="flex flex-wrap items-center gap-2">
              <span className="font-mono text-xs text-[#00D2FF] tracking-wider uppercase font-semibold">
                CASE_0{activeIndex + 1}
              </span>
              <span className="text-white/20">•</span>
              <span className="font-mono text-xs text-slate-400 uppercase">
                {activeProject.projectType}
              </span>
              {activeProject.isFeatured && (
                <Badge variant="cobalt" size="sm">
                  FLAGSHIP
                </Badge>
              )}
              {activeProject.clientName && (
                <Badge variant="neutral" size="sm">
                  {activeProject.clientName}
                </Badge>
              )}
            </div>

            {/* Title & Short Description */}
            <div className="space-y-3">
              <h3 className="text-2xl sm:text-4xl font-extrabold text-white font-display tracking-tight group-hover:text-[#00D2FF] transition-colors">
                <Link href={`/work/${activeProject.slug}`}>
                  {activeProject.title}
                </Link>
              </h3>
              <p className="text-sm sm:text-base text-[#94A3B8] leading-relaxed font-sans">
                {activeProject.shortDescription}
              </p>
            </div>

            {/* Key Pillars / Challenge & Results */}
            <div className="space-y-2.5 pt-1">
              {activeProject.challenge && (
                <div className="flex items-start gap-2.5 text-xs sm:text-sm text-slate-300">
                  <Cpu className="w-4 h-4 text-[#0066FF] shrink-0 mt-0.5" />
                  <span className="font-sans line-clamp-2">{activeProject.challenge}</span>
                </div>
              )}
              {activeProject.results && (
                <div className="flex items-start gap-2.5 text-xs sm:text-sm text-[#00D2FF]">
                  <CheckCircle2 className="w-4 h-4 text-[#00D2FF] shrink-0 mt-0.5" />
                  <span className="font-sans font-medium line-clamp-2">{activeProject.results}</span>
                </div>
              )}
            </div>

            {/* Technologies */}
            {activeProject.technologies && activeProject.technologies.length > 0 && (
              <div className="space-y-2 pt-2">
                <span className="text-[10px] font-mono uppercase tracking-wider text-slate-400 font-semibold block">
                  Core Stack:
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {activeProject.technologies.map((tech: any, tIdx: number) => (
                    <span
                      key={tIdx}
                      className="px-2.5 py-1 rounded-md bg-[#080D18] border border-white/10 text-xs font-mono text-slate-200"
                    >
                      {tech.name || tech}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Action CTA */}
            <div className="pt-2 flex items-center gap-3">
              <Link href={`/work/${activeProject.slug}`}>
                <Button variant="outline" size="md" rightIcon={<ArrowUpRight className="w-4 h-4" />}>
                  Inspect Case Study
                </Button>
              </Link>
            </div>
          </div>

          {/* Blueprint / Visual Stage Column (7 Cols) */}
          <div className="lg:col-span-7">
            <Link
              href={`/work/${activeProject.slug}`}
              className="block relative aspect-video w-full rounded-2xl overflow-hidden bg-[#0A0F1D] border border-white/10 group-hover:border-[#0066FF]/40 transition-all duration-300 shadow-xl"
            >
              {activeProject.heroImageUrl ? (
                <Image
                  src={activeProject.heroImageUrl}
                  alt={activeProject.title}
                  fill
                  sizes="(max-width: 1024px) 100vw, 60vw"
                  className="object-cover object-center group-hover:scale-105 transition-transform duration-500"
                  priority
                />
              ) : (
                <div className="w-full h-full flex flex-col items-center justify-center p-8 text-center bg-[#070B16] relative overflow-hidden">
                  {/* Subtle Grid Lines Overlay */}
                  <div
                    className="absolute inset-0 opacity-15 pointer-events-none"
                    style={{
                      backgroundImage:
                        'linear-gradient(to right, rgba(255,255,255,0.1) 1px, transparent 1px), linear-gradient(to bottom, rgba(255,255,255,0.1) 1px, transparent 1px)',
                      backgroundSize: '32px 32px',
                    }}
                  />

                  {/* Blueprint Central Icon */}
                  <div className="w-16 h-16 rounded-2xl bg-[#0066FF]/10 border border-[#0066FF]/30 flex items-center justify-center text-[#00D2FF] mb-4 relative z-10 shadow-[0_0_25px_rgba(0,102,255,0.25)]">
                    <Layers className="w-8 h-8 text-[#00D2FF]" />
                  </div>

                  <h4 className="text-xl sm:text-2xl font-bold text-white font-display relative z-10">
                    {activeProject.title}
                  </h4>
                  <p className="font-mono text-xs text-[#00D2FF] uppercase tracking-wider mt-2 relative z-10">
                    [BLUEPRINT — ARCHITECTURAL SCHEMATIC]
                  </p>

                  <span className="absolute top-4 left-4 font-mono text-[10px] text-slate-500">
                    SYS: {activeProject.slug}
                  </span>
                </div>
              )}
            </Link>
          </div>
        </div>
      </article>

      {/* ── 2. Bottom Rail: Horizontal Project Thumbnails & Switcher ── */}
      <div className="space-y-4 pt-2">
        {/* Rail Header & Navigation Controls */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3">
          <div className="space-y-1">
            <span className="text-xs uppercase tracking-wider text-[#00D2FF] font-semibold block">
              Architectural Archive
            </span>
            <p className="text-xs sm:text-sm text-slate-400">
              Click any project below to inspect its architecture above.
            </p>
          </div>

          {hasOverflow && (
            <div className="flex items-center gap-2 self-start sm:self-end">
              <button
                type="button"
                onClick={scrollPrev}
                aria-label="Previous project"
                className="w-9 h-9 rounded-xl bg-[#0A0E1A] border border-white/10 hover:border-white/30 text-white flex items-center justify-center transition-all hover:bg-white/5 active:scale-95 shadow-sm"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <button
                type="button"
                onClick={scrollNext}
                aria-label="Next project"
                className="w-9 h-9 rounded-xl bg-[#0A0E1A] border border-white/10 hover:border-white/30 text-white flex items-center justify-center transition-all hover:bg-white/5 active:scale-95 shadow-sm"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          )}
        </div>

        {/* Horizontal Track */}
        <div
          ref={railRef}
          className={cn(
            'flex items-stretch gap-4 pb-3 pt-1',
            hasOverflow
              ? 'overflow-x-auto snap-x snap-mandatory scroll-smooth [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden'
              : 'justify-center flex-wrap'
          )}
        >
          {projects.map((project, idx) => {
            const isActive = idx === activeIndex;
            return (
              <button
                key={project.id || idx}
                ref={(el) => {
                  cardRefs.current[idx] = el;
                }}
                type="button"
                onClick={() => selectProject(idx)}
                className={cn(
                  'shrink-0 w-[80vw] max-w-[280px] sm:w-[calc((100%-1rem)/2)] lg:w-[calc((100%-3rem)/3)] xl:w-[calc((100%-4.5rem)/4)] snap-start rounded-2xl p-4 text-left transition-all duration-300 flex flex-col justify-between space-y-3 relative group border',
                  isActive
                    ? 'bg-[#0A1329] border-[#00D2FF] shadow-[0_0_20px_rgba(0,210,255,0.2)] ring-1 ring-[#00D2FF]'
                    : 'bg-[#080D18] border-white/10 hover:border-white/30 hover:bg-[#0A0F1D]'
                )}
                aria-pressed={isActive}
              >
                {/* Visual Thumbnail / Schematic Indicator */}
                <div className="relative w-full h-28 rounded-xl overflow-hidden bg-[#0A0F1D] border border-white/10 shrink-0">
                  {project.heroImageUrl ? (
                    <Image
                      src={project.heroImageUrl}
                      alt={project.title}
                      fill
                      sizes="280px"
                      className="object-cover object-center group-hover:scale-105 transition-transform duration-300"
                    />
                  ) : (
                    <div className="w-full h-full flex flex-col items-center justify-center bg-gradient-to-br from-[#080D18] to-[#04060C] text-slate-400">
                      <Layers className={cn('w-6 h-6 mb-1', isActive ? 'text-[#00D2FF]' : 'text-slate-500')} />
                      <span className="font-mono text-[10px] text-slate-400">CASE_0{idx + 1}</span>
                    </div>
                  )}

                  {/* Active Badge Overlay */}
                  {isActive && (
                    <div className="absolute top-2 left-2 px-2 py-0.5 rounded-md bg-[#00D2FF] text-black font-mono text-[10px] font-bold shadow-md">
                      VIEWING
                    </div>
                  )}
                </div>

                {/* Info */}
                <div className="space-y-1 w-full">
                  <div className="flex items-center justify-between text-[11px] font-mono text-slate-400">
                    <span className={cn('font-semibold', isActive ? 'text-[#00D2FF]' : 'text-slate-400')}>
                      0{idx + 1}. {project.projectType.split(' ')[0]}
                    </span>
                    {project.clientName && (
                      <span className="truncate max-w-[90px] text-[10px] text-slate-500">
                        {project.clientName}
                      </span>
                    )}
                  </div>

                  <h5 className="text-sm font-bold text-white group-hover:text-[#00D2FF] transition-colors truncate font-display">
                    {project.title}
                  </h5>

                  <p className="text-xs text-slate-400 line-clamp-2 leading-relaxed">
                    {project.shortDescription}
                  </p>
                </div>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};
