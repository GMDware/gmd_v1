'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import {
  ArrowUpRight,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  Code2,
  Server,
  Layout,
  Cpu,
  ShieldCheck,
  Zap,
} from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { cn } from '@/lib/utils';

export interface ServiceItemData {
  id: string;
  title: string;
  slug: string;
  summary?: string;
  content?: string;
  description?: string;
  shortDescription?: string;
  iconName?: string | null;
  features?: Array<{ title?: string; name?: string; description?: string }>;
  technologies?: Array<any>;
}

interface FeaturedServicesShowcaseProps {
  services: ServiceItemData[];
  defaultTechsMap?: Record<string, Array<{ name: string; category?: string }>>;
}

const DEFAULT_SERVICE_TECHS_FALLBACK: Record<string, Array<{ name: string; category?: string }>> = {
  'enterprise-software-development': [
    { name: 'TypeScript', category: 'Frontend' },
    { name: 'Next.js', category: 'Frontend' },
    { name: 'Node.js', category: 'Backend' },
    { name: 'PostgreSQL', category: 'Backend' },
  ],
  'cloud-infrastructure-devops': [
    { name: 'Docker', category: 'DevOps & Cloud' },
    { name: 'Node.js', category: 'Backend' },
    { name: 'PostgreSQL', category: 'Backend' },
    { name: 'Next.js', category: 'Frontend' },
  ],
  'web-applications-digital-platforms': [
    { name: 'React', category: 'Frontend' },
    { name: 'Next.js', category: 'Frontend' },
    { name: 'TypeScript', category: 'Frontend' },
    { name: 'Tailwind CSS', category: 'Frontend' },
  ],
  'mobile-application-engineering': [
    { name: 'React', category: 'Frontend' },
    { name: 'TypeScript', category: 'Frontend' },
    { name: 'Node.js', category: 'Backend' },
  ],
  'distributed-apis-realtime-systems': [
    { name: 'Node.js', category: 'Backend' },
    { name: 'Redis', category: 'Backend' },
    { name: 'PostgreSQL', category: 'Backend' },
    { name: 'TypeScript', category: 'Frontend' },
  ],
  'ai-integration-automation': [
    { name: 'Python & AI', category: 'AI & Data' },
    { name: 'Node.js', category: 'Backend' },
    { name: 'TypeScript', category: 'Frontend' },
    { name: 'PostgreSQL', category: 'Backend' },
  ],
};

function renderServiceIcon(iconName: string | null | undefined, idx: number, className = 'w-6 h-6') {
  switch (iconName?.toLowerCase()) {
    case 'code2':
    case 'code':
      return <Code2 className={cn(className, 'text-[#00D2FF]')} />;
    case 'server':
    case 'cloud':
      return <Server className={cn(className, 'text-[#0066FF]')} />;
    case 'layout':
    case 'web':
      return <Layout className={cn(className, 'text-[#80B3FF]')} />;
    case 'cpu':
    case 'mobile':
      return <Cpu className={cn(className, 'text-[#00D2FF]')} />;
    case 'shieldcheck':
    case 'shield':
    case 'api':
      return <ShieldCheck className={cn(className, 'text-[#0066FF]')} />;
    case 'zap':
    case 'ai':
      return <Zap className={cn(className, 'text-amber-400')} />;
    default: {
      const icons = [Code2, Server, Layout, Cpu, ShieldCheck, Zap];
      const Icon = icons[idx % icons.length];
      return <Icon className={cn(className, 'text-[#00D2FF]')} />;
    }
  }
}

export const FeaturedServicesShowcase: React.FC<FeaturedServicesShowcaseProps> = ({
  services,
  defaultTechsMap = DEFAULT_SERVICE_TECHS_FALLBACK,
}) => {
  const [activeIndex, setActiveIndex] = useState(0);
  const [hasOverflow, setHasOverflow] = useState(false);
  const railRef = useRef<HTMLDivElement>(null);
  const cardRefs = useRef<(HTMLButtonElement | null)[]>([]);

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
  }, [services]);

  if (services.length === 0) return null;

  const activeService = services[activeIndex] || services[0];

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

  const selectService = (index: number) => {
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

  // Resolve technologies for the active service
  const s = activeService as any;
  const activeTechs = (s.technologies && s.technologies.length > 0)
    ? s.technologies.map((t: any) => t.technology || t).filter(Boolean)
    : (defaultTechsMap[activeService.slug] || [
        { name: 'TypeScript', category: 'Frontend' },
        { name: 'Node.js', category: 'Backend' },
        { name: 'PostgreSQL', category: 'Backend' },
      ]);

  return (
    <div className="space-y-10">
      {/* ── 1. Top Stage: Single Active Service on Stage ── */}
      <article
        id={activeService.slug}
        className="gmd-panel rounded-3xl p-6 sm:p-10 lg:p-12 border border-white/15 hover:border-[#0066FF]/50 transition-all shadow-2xl relative overflow-hidden space-y-8"
      >
        {/* Top Glowing Gradient Accent Bar */}
        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-[#0066FF] via-[#00D2FF] to-blue-400" />

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start relative z-10">
          {/* Left Column: Service Profile (5 Cols) */}
          <div className="lg:col-span-5 space-y-6">
            <div className="flex items-center justify-between">
              <div className="w-14 h-14 rounded-2xl bg-[#080D18] border border-white/10 flex items-center justify-center shadow-md shadow-blue-500/5">
                {renderServiceIcon(activeService.iconName, activeIndex, 'w-7 h-7')}
              </div>
              <span className="font-mono text-xs text-[#00D2FF] font-semibold tracking-wider">
                SERVICE 0{activeIndex + 1}
              </span>
            </div>

            <h2 className="text-2xl sm:text-4xl font-extrabold text-white font-display tracking-tight">
              {activeService.title}
            </h2>

            <p className="text-sm sm:text-base text-[#94A3B8] leading-relaxed font-sans">
              {activeService.description ||
                activeService.content ||
                activeService.summary ||
                activeService.shortDescription}
            </p>

            <div className="pt-2">
              <Link href="/contact">
                <Button variant="primary" size="md" rightIcon={<ArrowUpRight className="w-4 h-4" />}>
                  Get Started with {activeService.title}
                </Button>
              </Link>
            </div>
          </div>

          {/* Right Column: Key Capabilities + Technologies Used (7 Cols) */}
          <div className="lg:col-span-7 space-y-6">
            {/* 1. Key Capabilities & Deliverables */}
            <div className="space-y-3">
              <h3 className="text-xs uppercase tracking-wider text-[#00D2FF] font-semibold flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-[#00D2FF]" />
                <span>Key Capabilities &amp; Deliverables</span>
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                {activeService.features &&
                  activeService.features.map((feat: any, fIdx: number) => (
                    <div
                      key={fIdx}
                      className="p-4 rounded-xl bg-[#080D18] border border-white/[0.06] space-y-1.5 hover:border-[#0066FF]/40 transition-colors"
                    >
                      <div className="flex items-center gap-2 text-white text-sm font-semibold">
                        <CheckCircle2 className="w-4 h-4 text-[#00D2FF] shrink-0" />
                        <span>{feat.title || feat.name}</span>
                      </div>
                      {feat.description && (
                        <p className="text-xs text-[#94A3B8] leading-relaxed pl-6 font-sans">
                          {feat.description}
                        </p>
                      )}
                    </div>
                  ))}
              </div>
            </div>

            {/* 2. Technologies & Stack Used */}
            {activeTechs.length > 0 && (
              <div className="pt-4 border-t border-white/[0.08] space-y-3">
                <h4 className="text-xs uppercase tracking-wider text-slate-400 font-semibold flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#0066FF]" />
                  <span>Technologies &amp; Frameworks</span>
                </h4>

                <div className="flex flex-wrap gap-2">
                  {activeTechs.map((tech: any, tIdx: number) => {
                    const name = tech.name || tech.title || String(tech);
                    const category = tech.category || null;
                    return (
                      <span
                        key={tIdx}
                        className="px-3 py-1.5 rounded-xl bg-[#080D18] border border-white/10 hover:border-[#00D2FF]/40 text-xs font-mono text-slate-200 flex items-center gap-2 transition-colors shadow-sm"
                      >
                        <span className="w-1.5 h-1.5 rounded-full bg-[#00D2FF]" />
                        <span className="font-medium text-white">{name}</span>
                        {category && (
                          <span className="text-[10px] text-slate-400 font-sans border-l border-white/15 pl-2">
                            {category}
                          </span>
                        )}
                      </span>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
        </div>
      </article>

      {/* ── 2. Bottom Rail: Horizontal Service Cards & Switcher ── */}
      <div className="space-y-4 pt-2">
        {/* Rail Header & Navigation Controls */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3">
          <div className="space-y-1">
            <span className="text-xs uppercase tracking-wider text-[#00D2FF] font-semibold block">
              Services Catalog
            </span>
            <p className="text-xs sm:text-sm text-slate-400">
              Click any service below to inspect its architecture, deliverables, and tech stack above.
            </p>
          </div>

          {hasOverflow && (
            <div className="flex items-center gap-2 self-start sm:self-end">
              <button
                type="button"
                onClick={scrollPrev}
                aria-label="Previous service"
                className="w-9 h-9 rounded-xl bg-[#0A0E1A] border border-white/10 hover:border-white/30 text-white flex items-center justify-center transition-all hover:bg-white/5 active:scale-95 shadow-sm"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <button
                type="button"
                onClick={scrollNext}
                aria-label="Next service"
                className="w-9 h-9 rounded-xl bg-[#0A0E1A] border border-white/10 hover:border-white/30 text-white flex items-center justify-center transition-all hover:bg-white/5 active:scale-95 shadow-sm"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          )}
        </div>

        {/* Horizontal Scroll Track */}
        <div
          ref={railRef}
          className={cn(
            'flex items-stretch gap-4 pb-3 pt-1',
            hasOverflow
              ? 'overflow-x-auto snap-x snap-mandatory scroll-smooth [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden'
              : 'justify-center flex-wrap'
          )}
        >
          {services.map((service, idx) => {
            const isActive = idx === activeIndex;
            return (
              <button
                key={service.id || idx}
                ref={(el) => {
                  cardRefs.current[idx] = el;
                }}
                type="button"
                onClick={() => selectService(idx)}
                className={cn(
                  'shrink-0 w-[80vw] max-w-[280px] sm:w-[calc((100%-1rem)/2)] lg:w-[calc((100%-3rem)/3)] xl:w-[calc((100%-4.5rem)/4)] snap-start rounded-2xl p-5 text-left transition-all duration-300 flex flex-col justify-between space-y-4 relative group border',
                  isActive
                    ? 'bg-[#0A1329] border-[#00D2FF] shadow-[0_0_20px_rgba(0,210,255,0.2)] ring-1 ring-[#00D2FF]'
                    : 'bg-[#080D18] border-white/10 hover:border-white/30 hover:bg-[#0A0F1D]'
                )}
                aria-pressed={isActive}
              >
                <div className="space-y-3 w-full">
                  {/* Top Bar: Icon + Service Badge */}
                  <div className="flex items-center justify-between">
                    <div className={cn(
                      'w-10 h-10 rounded-xl flex items-center justify-center border transition-colors',
                      isActive
                        ? 'bg-[#00D2FF]/20 border-[#00D2FF]/40 text-[#00D2FF]'
                        : 'bg-white/5 border-white/10 text-slate-400 group-hover:text-white'
                    )}>
                      {renderServiceIcon(service.iconName, idx, 'w-5 h-5')}
                    </div>

                    {isActive ? (
                      <span className="px-2 py-0.5 rounded-md bg-[#00D2FF] text-black font-mono text-[10px] font-bold shadow-xs">
                        VIEWING
                      </span>
                    ) : (
                      <span className="font-mono text-[10px] text-slate-500">
                        0{idx + 1}
                      </span>
                    )}
                  </div>

                  {/* Title & Summary */}
                  <div className="space-y-1">
                    <h5 className="text-base font-bold text-white group-hover:text-[#00D2FF] transition-colors truncate font-display">
                      {service.title}
                    </h5>
                    <p className="text-xs text-slate-400 line-clamp-2 leading-relaxed font-sans">
                      {service.description || service.content || service.summary || service.shortDescription}
                    </p>
                  </div>
                </div>

                {/* Features Count pill */}
                <div className="pt-2 border-t border-white/[0.06] flex items-center justify-between text-[11px] font-mono text-slate-400">
                  <span>{service.features?.length || 4} Deliverables</span>
                  <span className={cn('text-xs transition-transform group-hover:translate-x-0.5', isActive ? 'text-[#00D2FF]' : 'text-slate-500')}>
                    →
                  </span>
                </div>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};
