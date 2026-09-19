'use client';

import React, { useState, useEffect, useCallback, useRef } from 'react';
import Link from 'next/link';
import { ArrowUpRight, ArrowRight, ChevronLeft, ChevronRight, ExternalLink, Sparkles, Layers, Globe, Play, Pause } from 'lucide-react';
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion';
import { editorialEasing, springPhysics } from '../motion';
import { normalizeProject, normalizeTechnologies, NormalizedProject } from '../utils/normalize-project';

interface AtelierWorkProps {
  projects: any[];
  categories?: any[];
  activeCategory?: string;
  isStandalone?: boolean;
}

export const AtelierWork: React.FC<AtelierWorkProps> = ({
  projects = [],
  categories = [],
  activeCategory,
  isStandalone = false,
}) => {
  const shouldReduceMotion = useReducedMotion();

  // Curated, honestly labeled concept explorations when needed
  const fallbackConcepts: NormalizedProject[] = [
    {
      id: 'concept-apex',
      title: 'Apex — Operations & Logistics Interface',
      slug: 'apex-logistics',
      description:
        'A unified web interface designed for coordinating inventory logistics, dispatch schedules, and team operations with responsive precision.',
      category: 'Internal Platform',
      categorySlug: 'internal-platform',
      href: '/work/apex-logistics',
      liveUrl: null,
      image: null,
      technologies: ['React', 'Node.js', 'PostgreSQL'],
      isConcept: true,
      isFeatured: false,
      conceptBadge: 'Studio Concept',
      archetype: 'browser',
    },
    {
      id: 'concept-horizon',
      title: 'Horizon — Structured Onboarding Engine',
      slug: 'horizon-onboarding',
      description:
        'A multi-step digital onboarding tool streamlining verification, document capture, and permission assignment with high visual polish.',
      category: 'Digital Product',
      categorySlug: 'digital-product',
      href: '/work/horizon-onboarding',
      liveUrl: null,
      image: null,
      technologies: ['Next.js', 'TypeScript', 'Tailwind CSS'],
      isConcept: true,
      isFeatured: false,
      conceptBadge: 'Product Exploration',
      archetype: 'editorial',
    },
    {
      id: 'concept-pulse',
      title: 'Pulse — Component Architecture Kit',
      slug: 'pulse-system',
      description:
        'A comprehensive design system and component architecture engineered for cross-functional software teams to move faster.',
      category: 'Design System',
      categorySlug: 'design-system',
      href: '/work/pulse-system',
      liveUrl: null,
      image: null,
      technologies: ['TypeScript', 'Design Tokens', 'React'],
      isConcept: true,
      isFeatured: false,
      conceptBadge: 'Internal Prototype',
      archetype: 'compact',
    },
  ];

  // 1. Normalize all incoming CMS projects safely
  const normalizedCmsProjects: NormalizedProject[] = (projects || []).map((p, idx) =>
    normalizeProject(p, `cms-proj-${idx}`)
  );

  // 2. Build full project list: real CMS projects if available, otherwise fallback concepts
  const allProjects: NormalizedProject[] =
    normalizedCmsProjects.length > 0 ? normalizedCmsProjects : fallbackConcepts;

  // Active showcase project index & horizontal rail refs
  const [activeIndex, setActiveIndex] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);
  const [isHovered, setIsHovered] = useState(false);
  const [stageProgress, setStageProgress] = useState(0);

  const [hasOverflow, setHasOverflow] = useState(false);

  const railRef = useRef<HTMLDivElement>(null);
  const cardRefs = useRef<(HTMLButtonElement | null)[]>([]);

  useEffect(() => {
    const el = railRef.current;
    if (!el) return;

    const checkOverflow = () => {
      setHasOverflow(el.scrollWidth > el.clientWidth + 8);
    };

    checkOverflow();

    const ro = new ResizeObserver(checkOverflow);
    ro.observe(el);
    return () => ro.disconnect();
  }, [allProjects.length]);

  const ROTATION_INTERVAL = 4500; // 4.5 seconds per project cycle

  const handlePrev = useCallback(() => {
    setActiveIndex((prev) => (prev > 0 ? prev - 1 : allProjects.length - 1));
    setStageProgress(0);
  }, [allProjects.length]);

  const handleNext = useCallback(() => {
    setActiveIndex((prev) => (prev < allProjects.length - 1 ? prev + 1 : 0));
    setStageProgress(0);
  }, [allProjects.length]);

  // Automated continuous rotation cycle
  useEffect(() => {
    if (!isAutoPlaying || isHovered || shouldReduceMotion) return;
    if (allProjects.length <= 1) return;

    const tickMs = 50;
    const increment = (tickMs / ROTATION_INTERVAL) * 100;

    const progressTimer = setInterval(() => {
      setStageProgress((prev) => {
        if (prev >= 100) {
          setActiveIndex((cur) => (cur + 1) % allProjects.length);
          return 0;
        }
        return prev + increment;
      });
    }, tickMs);

    return () => clearInterval(progressTimer);
  }, [isAutoPlaying, isHovered, shouldReduceMotion, allProjects.length]);

  // Smoothly center active card in the horizontal rail upon index change
  useEffect(() => {
    const activeEl = cardRefs.current[activeIndex];
    const rail = railRef.current;
    if (activeEl && rail) {
      const railWidth = rail.clientWidth;
      const elLeft = activeEl.offsetLeft;
      const elWidth = activeEl.clientWidth;
      const targetScroll = elLeft - railWidth / 2 + elWidth / 2;
      rail.scrollTo({
        left: Math.max(0, targetScroll),
        behavior: 'smooth',
      });
    }
  }, [activeIndex]);

  // Keyboard navigation support
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowLeft') handlePrev();
      if (e.key === 'ArrowRight') handleNext();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handlePrev, handleNext]);

  // Manual horizontal scroll step buttons for rail
  const handleRailScroll = (direction: 'left' | 'right') => {
    if (!railRef.current) return;
    const scrollAmount = 350;
    railRef.current.scrollBy({
      left: direction === 'left' ? -scrollAmount : scrollAmount,
      behavior: 'smooth',
    });
  };

  const activeProject = allProjects[activeIndex] || allProjects[0] || fallbackConcepts[0];

  return (
    <section
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className={`px-6 max-w-6xl mx-auto w-full overflow-hidden ${
        isStandalone ? 'pt-8 pb-24' : 'py-24 border-t border-slate-200'
      }`}
      aria-label="Selected Client Work and Case Studies"
    >
      {/* Section Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-12 border-b border-slate-200">
        <div className="space-y-3 max-w-2xl">
          <div className="inline-flex items-center gap-2 text-xs font-semibold text-blue-600 uppercase tracking-wide">
            <span>Selected Work</span>
          </div>

          <h2 className="text-2xl sm:text-4xl font-bold tracking-tight text-slate-900 font-sans">
            Products and platforms built for real teams.
          </h2>

          <p className="text-base text-slate-600 font-sans leading-relaxed">
            A curated look at software products, customer portals, and web applications we have conceptualized, engineered, and launched.
          </p>
        </div>

        {/* Carousel Controls & Secondary Action */}
        <div className="flex items-center gap-3 shrink-0">
          {/* Auto-Play Toggle Indicator */}
          <button
            type="button"
            onClick={() => setIsAutoPlaying((prev) => !prev)}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 text-xs font-medium transition-all active:scale-95 shadow-sm"
            title={isAutoPlaying ? 'Pause rotation' : 'Resume auto-rotation'}
          >
            {isAutoPlaying ? (
              <>
                <Pause className="w-3 h-3 text-blue-600 fill-blue-600" />
                <span className="text-[11px] font-semibold text-blue-700 hidden sm:inline">
                  {isHovered ? 'Paused' : 'Rotating'}
                </span>
              </>
            ) : (
              <>
                <Play className="w-3 h-3 text-slate-600 fill-slate-600" />
                <span className="text-[11px] text-slate-600 hidden sm:inline">Auto-play</span>
              </>
            )}
          </button>

          <div className="flex items-center gap-2" role="group" aria-label="Project slider controls">
            <button
              onClick={handlePrev}
              className="p-2.5 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 hover:border-slate-300 text-slate-700 transition-all active:scale-95 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              aria-label="Previous project"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>

            <span className="font-mono text-xs font-semibold text-slate-500 px-2 select-none">
              0{activeIndex + 1} <span className="text-slate-300">/</span> 0{allProjects.length}
            </span>

            <button
              onClick={handleNext}
              className="p-2.5 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 hover:border-slate-300 text-slate-700 transition-all active:scale-95 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              aria-label="Next project"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>

          {!isStandalone && (
            <Link
              href="/work"
              className="hidden sm:inline-flex items-center gap-2 px-4 py-2 rounded-xl border border-slate-300 hover:border-slate-900 bg-white/50 hover:bg-slate-900 text-slate-800 hover:text-white font-medium text-xs transition-all duration-200 shadow-sm group active:scale-[0.98]"
            >
              <span>View all projects</span>
              <ArrowRight className="w-3.5 h-3.5 text-slate-500 group-hover:text-white group-hover:translate-x-1 transition-transform" />
            </Link>
          )}
        </div>
      </div>

      {/* Standalone Category Filter */}
      {isStandalone && categories.length > 0 && (
        <div className="flex flex-wrap items-center gap-2 py-8 border-b border-slate-200">
          <Link
            href="/work"
            className={`px-3.5 py-1.5 rounded-lg text-xs font-medium transition-colors ${
              !activeCategory
                ? 'bg-slate-900 text-white shadow-sm'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
            }`}
          >
            All projects ({allProjects.length})
          </Link>

          {categories.map((cat: any) => {
            const isActive = activeCategory === cat.slug;
            return (
              <Link
                key={cat.id || cat.slug}
                href={`/work?category=${cat.slug}`}
                className={`px-3.5 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                  isActive
                    ? 'bg-slate-900 text-white shadow-sm'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                }`}
              >
                {cat.name}
              </Link>
            );
          })}
        </div>
      )}

      {/* Interactive Active Project Showcase (Panoramic Experience) */}
      <div className="pt-8">
        <AnimatePresence mode="wait" initial={false}>
          <motion.article
            key={activeProject.id || activeIndex}
            initial={{ opacity: 1, y: 0, scale: 1 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={shouldReduceMotion ? undefined : { opacity: 0, y: -15, scale: 0.98 }}
            transition={{ duration: 0.35, ease: editorialEasing }}
            className="rounded-3xl bg-white border border-slate-200/90 shadow-lg shadow-slate-200/40 p-8 sm:p-12 relative overflow-hidden group"
          >
            {/* Top Accent Line */}
            <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-blue-600 via-indigo-600 to-transparent" />

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
              {/* Left Column: Context, Title, Description, Tech (7 Cols) */}
              <div className="lg:col-span-7 space-y-6">
                <div className="flex flex-wrap items-center gap-2.5 text-xs">
                  <span className="px-3 py-1 rounded-full bg-blue-50 text-blue-700 font-semibold">
                    {activeProject.category}
                  </span>
                  <span className="text-slate-300">•</span>
                  <span className={`px-2.5 py-0.5 rounded-md font-medium text-[11px] ${
                    activeProject.isConcept
                      ? 'bg-amber-50 text-amber-800 border border-amber-200/60'
                      : 'bg-emerald-50 text-emerald-800 border border-emerald-200/60'
                  }`}>
                    {activeProject.conceptBadge || (activeProject.isConcept ? 'Studio Concept' : 'Live in Production')}
                  </span>
                  {activeProject.clientName && (
                    <>
                      <span className="text-slate-300">•</span>
                      <span className="text-slate-600 font-medium">{activeProject.clientName}</span>
                    </>
                  )}
                </div>

                <div className="space-y-3">
                  <h3 className="text-2xl sm:text-3xl lg:text-4xl font-bold tracking-tight text-slate-900 font-sans">
                    {activeProject.title}
                  </h3>

                  <p className="text-sm sm:text-base text-slate-600 font-sans leading-relaxed">
                    {activeProject.description}
                  </p>
                </div>

                {/* Technologies Pill Row - Safe primitive strings only */}
                {activeProject.technologies.length > 0 && (
                  <div className="space-y-1.5 pt-1">
                    <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider block">
                      Core Stack & Architecture
                    </span>
                    <div className="flex flex-wrap items-center gap-2">
                      {activeProject.technologies.map((tech: string, tIdx: number) => (
                        <span
                          key={tIdx}
                          className="px-3 py-1 rounded-lg bg-slate-100 text-slate-800 text-xs font-medium border border-slate-200/60"
                        >
                          {tech}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {/* Primary & Secondary Actions */}
                <div className="flex flex-wrap items-center gap-3 pt-3">
                  {activeProject.liveUrl ? (
                    <a
                      href={activeProject.liveUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl border border-slate-300 hover:border-slate-900 bg-white/50 hover:bg-slate-900 text-slate-800 hover:text-white font-medium text-xs sm:text-sm transition-all duration-200 shadow-sm group active:scale-[0.98]"
                    >
                      <Globe className="w-3.5 h-3.5 text-slate-500 group-hover:text-white transition-colors" />
                      <span>Open live project</span>
                      <ArrowUpRight className="w-3.5 h-3.5 text-slate-500 group-hover:text-white group-hover:-translate-y-0.5 group-hover:translate-x-0.5 transition-transform" />
                    </a>
                  ) : null}

                  <Link
                    href={`/work/${activeProject.slug}`}
                    className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl border border-slate-300 hover:border-slate-900 bg-white/50 hover:bg-slate-900 text-slate-800 hover:text-white font-medium text-xs sm:text-sm transition-all duration-200 shadow-sm group active:scale-[0.98]"
                  >
                    <span>Explore case study</span>
                    <ArrowRight className="w-3.5 h-3.5 text-slate-500 group-hover:text-white group-hover:translate-x-1 transition-transform" />
                  </Link>
                </div>
              </div>

              {/* Right Column: Visual Product Simulation & Preview (5 Cols) */}
              <div className="lg:col-span-5">
                <div className="rounded-2xl bg-gradient-to-br from-slate-900 via-slate-950 to-slate-900 text-white p-6 space-y-4 shadow-xl border border-slate-800 relative overflow-hidden">
                  {/* Subtle ambient accent glow */}
                  <div className="absolute -top-12 -right-12 w-40 h-40 rounded-full bg-blue-500/10 blur-2xl pointer-events-none" />

                  {/* Browser Chrome Header */}
                  <div className="flex items-center justify-between pb-3 border-b border-white/10 text-xs">
                    <div className="flex items-center gap-1.5">
                      <span className="w-2.5 h-2.5 rounded-full bg-[#FF5F56]" />
                      <span className="w-2.5 h-2.5 rounded-full bg-[#FFBD2E]" />
                      <span className="w-2.5 h-2.5 rounded-full bg-[#27C93F]" />
                    </div>
                    <div className="font-mono text-[11px] text-slate-400 truncate max-w-[200px]">
                      {activeProject.liveUrl ? activeProject.liveUrl.replace(/^https?:\/\//, '') : `studio/work/${activeProject.slug}`}
                    </div>
                  </div>

                  {/* Product Visual Mockup / Interface Canvas */}
                  <div className="rounded-xl bg-slate-900/90 border border-white/10 p-4 space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="space-y-1">
                        <span className="text-[10px] font-mono text-blue-400 uppercase tracking-wider block">
                          Verified Deployment
                        </span>
                        <h4 className="text-sm font-bold text-white tracking-tight">
                          {activeProject.title}
                        </h4>
                      </div>
                      <span className="px-2 py-0.5 rounded-md bg-blue-500/20 text-blue-300 text-[10px] font-mono">
                        Active
                      </span>
                    </div>

                    {/* Interface Layout Composition / Visual Preview */}
                    {activeProject.image ? (
                      <div className="relative w-full h-48 rounded-lg overflow-hidden border border-white/10 bg-slate-950/80 group/img">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                          src={activeProject.image}
                          alt={activeProject.title}
                          className="w-full h-full object-cover object-top transition-transform duration-500 group-hover/img:scale-105"
                        />
                      </div>
                    ) : (
                      <div className="space-y-2 pt-1">
                        <div className="h-2.5 w-3/4 rounded-full bg-white/15" />
                        <div className="h-2 w-full rounded-full bg-white/10" />
                        <div className="h-2 w-5/6 rounded-full bg-white/10" />
                      </div>
                    )}

                    {/* Feature Highlight Tags */}
                    <div className="grid grid-cols-2 gap-2 pt-2 text-[11px]">
                      <div className="p-2.5 rounded-lg bg-white/5 border border-white/5">
                        <span className="text-[9px] font-mono text-slate-400 uppercase block">Domain</span>
                        <span className="font-semibold text-slate-200 block truncate">{activeProject.category}</span>
                      </div>
                      <div className="p-2.5 rounded-lg bg-white/5 border border-white/5">
                        <span className="text-[9px] font-mono text-slate-400 uppercase block">Delivery</span>
                        <span className="font-semibold text-emerald-400 block truncate">
                          {activeProject.isConcept ? 'Prototype' : 'Production'}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Bottom Verification Label */}
                  <div className="flex items-center justify-between text-[11px] text-slate-400 pt-1 font-mono">
                    <span>STATUS: READY</span>
                    {activeProject.liveUrl && (
                      <a
                        href={activeProject.liveUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-400 hover:text-blue-300 transition-colors inline-flex items-center gap-1"
                      >
                        <span>Visit site</span>
                        <ExternalLink className="w-3 h-3" />
                      </a>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </motion.article>
        </AnimatePresence>
      </div>

      {/* Interactive Project Selector Rail (Horizontal Scroll Carousel) */}
      <div className="pt-10 space-y-4">
        <div className="flex items-center justify-between text-xs text-slate-500">
          <div className="flex items-center gap-2">
            <span className="font-semibold text-slate-800 text-sm">All Projects</span>
            <span className="text-slate-300">•</span>
            <span className="font-mono text-xs text-blue-600 font-semibold">
              0{activeIndex + 1} / 0{allProjects.length}
            </span>
          </div>

          {hasOverflow && (
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => handleRailScroll('left')}
                className="p-2 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-600 hover:text-slate-900 transition-all active:scale-95 shadow-2xs"
                aria-label="Scroll projects track left"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <button
                type="button"
                onClick={() => handleRailScroll('right')}
                className="p-2 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-600 hover:text-slate-900 transition-all active:scale-95 shadow-2xs"
                aria-label="Scroll projects track right"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          )}
        </div>

        {/* Horizontal Track with Gradient Edge Fades */}
        <div className="relative">
          {/* Subtle edge fades for modern aesthetic */}
          <div className="pointer-events-none absolute left-0 top-0 bottom-4 w-10 bg-gradient-to-r from-[#FAF9F6] via-[#FAF9F6]/80 to-transparent z-10 opacity-80 hidden sm:block" />
          <div className="pointer-events-none absolute right-0 top-0 bottom-4 w-10 bg-gradient-to-l from-[#FAF9F6] via-[#FAF9F6]/80 to-transparent z-10 opacity-80 hidden sm:block" />

          <div
            ref={railRef}
            className={`flex items-stretch gap-5 pb-4 pt-1 overflow-x-auto flex-nowrap scroll-smooth snap-x snap-mandatory [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none] ${
              hasOverflow ? 'justify-start' : 'justify-center'
            }`}
          >
            {allProjects.map((project, idx) => {
              const isCurrent = idx === activeIndex;

              return (
                <button
                  key={project.id || idx}
                  ref={(el) => {
                    cardRefs.current[idx] = el;
                  }}
                  onClick={() => {
                    setActiveIndex(idx);
                    setStageProgress(0);
                  }}
                  className={`text-left rounded-2xl p-6 transition-all border flex flex-col justify-between space-y-4 relative group shrink-0 w-[290px] sm:w-[350px] snap-center cursor-pointer ${
                    isCurrent
                      ? 'bg-blue-50/40 border-blue-500 shadow-md ring-2 ring-blue-500/20'
                      : 'bg-white border-slate-200 hover:border-slate-300 hover:shadow-sm'
                  }`}
                  aria-label={`Select ${project.title}`}
                >
                  {/* Active Indicator Top Bar with Progress Fill */}
                  {isCurrent && (
                    <div className="absolute top-0 left-0 right-0 h-1 bg-blue-100 rounded-t-2xl overflow-hidden">
                      <div
                        className="h-full bg-blue-600 transition-all duration-75"
                        style={{
                          width: isAutoPlaying && !isHovered ? `${stageProgress}%` : '100%',
                        }}
                      />
                    </div>
                  )}

                    <div className="space-y-2">
                      <div className="flex items-center justify-between text-xs">
                        <span className="font-mono text-[11px] font-semibold text-blue-600">
                          0{idx + 1}
                        </span>
                        <span
                          className={`px-2 py-0.5 rounded text-[10px] font-medium ${
                            project.isConcept
                              ? 'bg-amber-100/70 text-amber-800'
                              : 'bg-slate-100 text-slate-700'
                          }`}
                        >
                          {project.conceptBadge || (project.isConcept ? 'Studio Concept' : 'Live')}
                        </span>
                      </div>

                      {project.image && (
                        <div className="relative w-full h-24 rounded-lg overflow-hidden border border-slate-100 bg-slate-100">
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img
                            src={project.image}
                            alt={project.title}
                            className="w-full h-full object-cover object-top transition-transform duration-300 group-hover:scale-105"
                          />
                        </div>
                      )}

                      <h4 className="font-bold text-slate-900 group-hover:text-blue-600 transition-colors text-base line-clamp-1">
                      {project.title}
                    </h4>

                    <p className="text-xs text-slate-500 line-clamp-2 leading-relaxed">
                      {project.description}
                    </p>
                  </div>

                  <div className="pt-2 flex items-center justify-between text-xs border-t border-slate-100">
                    <span className="font-medium text-slate-400 text-[11px]">
                      {project.category}
                    </span>
                    <span
                      className={`font-semibold text-xs flex items-center gap-1 transition-transform ${
                        isCurrent ? 'text-blue-600 font-bold' : 'text-slate-400 group-hover:text-slate-900'
                      }`}
                    >
                      {isCurrent ? 'Active Project' : 'View'}
                      <ArrowRight className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" />
                    </span>
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
};
