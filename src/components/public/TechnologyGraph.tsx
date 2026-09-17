'use client';

import React, { useState, useRef, useEffect } from 'react';
import { cn } from '@/lib/utils';
import { Layers, Terminal, Cloud, Cpu, Code2, ExternalLink, ChevronLeft, ChevronRight } from 'lucide-react';

export interface TechItem {
  id: string;
  name: string;
  category: string;
  icon?: string | null;
  docsUrl?: string | null;
  description?: string | null;
}

interface TechnologyGraphProps {
  technologies: TechItem[];
}

export const TechnologyGraph: React.FC<TechnologyGraphProps> = ({ technologies }) => {
  const categories = ['ALL', 'Frontend', 'Backend', 'Cloud', 'AI', 'Database', 'Systems'];
  const [activeCategory, setActiveCategory] = useState('ALL');
  const [hoveredTech, setHoveredTech] = useState<TechItem | null>(null);
  const [hasOverflow, setHasOverflow] = useState(false);
  const railRef = useRef<HTMLDivElement>(null);

  const filtered = activeCategory === 'ALL'
    ? technologies
    : technologies.filter((t) => t.category?.toLowerCase() === activeCategory.toLowerCase());

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
  }, [filtered]);

  const scrollPrev = () => {
    if (!railRef.current) return;
    railRef.current.scrollBy({ left: -280, behavior: 'smooth' });
  };

  const scrollNext = () => {
    if (!railRef.current) return;
    railRef.current.scrollBy({ left: 280, behavior: 'smooth' });
  };

  const getCategoryIcon = (cat: string) => {
    switch (cat.toLowerCase()) {
      case 'frontend':
        return <Layers className="w-3.5 h-3.5 text-[#00D2FF]" />;
      case 'backend':
        return <Terminal className="w-3.5 h-3.5 text-[#0066FF]" />;
      case 'cloud':
        return <Cloud className="w-3.5 h-3.5 text-[#80B3FF]" />;
      case 'ai':
      case 'database':
      case 'systems':
        return <Cpu className="w-3.5 h-3.5 text-[#00D2FF]" />;
      default:
        return <Code2 className="w-3.5 h-3.5 text-[#64748B]" />;
    }
  };

  return (
    <div className="space-y-6">
      {/* Category Navigation Pills & Scroll Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex flex-wrap items-center gap-2 pb-1">
          {categories.map((cat) => {
            const isSelected = activeCategory === cat;
            return (
              <button
                key={cat}
                type="button"
                onClick={() => setActiveCategory(cat)}
                className={cn(
                  'px-3.5 py-1.5 rounded-lg font-mono text-xs tracking-wider transition-all duration-200 cursor-pointer select-none',
                  isSelected
                    ? 'bg-[#0066FF] text-white font-semibold shadow-[0_0_15px_-3px_rgba(0,102,255,0.5)]'
                    : 'bg-[#080D18] border border-white/[0.06] text-[#94A3B8] hover:text-white hover:border-white/20'
                )}
              >
                {cat}
              </button>
            );
          })}
        </div>

        {hasOverflow && (
          <div className="flex items-center gap-2 self-start sm:self-end">
            <button
              type="button"
              onClick={scrollPrev}
              aria-label="Previous technologies"
              className="w-8 h-8 rounded-xl bg-[#0A0E1A] border border-white/10 hover:border-white/30 text-white flex items-center justify-center transition-all hover:bg-white/5 active:scale-95 shadow-sm"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button
              type="button"
              onClick={scrollNext}
              aria-label="Next technologies"
              className="w-8 h-8 rounded-xl bg-[#0A0E1A] border border-white/10 hover:border-white/30 text-white flex items-center justify-center transition-all hover:bg-white/5 active:scale-95 shadow-sm"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        )}
      </div>

      {/* Horizontal Tech Nodes Track */}
      <div
        ref={railRef}
        className={cn(
          'flex items-stretch gap-3.5 pb-2 pt-1 overflow-x-auto flex-nowrap snap-x snap-mandatory scroll-smooth [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden',
          hasOverflow ? 'justify-start' : 'justify-center'
        )}
      >
        {filtered.map((tech) => (
          <div
            key={tech.id}
            onMouseEnter={() => setHoveredTech(tech)}
            onMouseLeave={() => setHoveredTech(null)}
            className="shrink-0 w-[160px] sm:w-[180px] p-4 rounded-xl bg-[#06090F] border border-white/[0.08] hover:border-[#0066FF]/60 hover:bg-[#080D18] transition-all duration-200 cursor-pointer flex flex-col justify-between group h-28 snap-start shadow-sm"
          >
            <div className="flex items-center justify-between">
              <span className="p-1.5 rounded-md bg-[#0E1526] border border-white/[0.05]">
                {getCategoryIcon(tech.category)}
              </span>
              <span className="font-mono text-[9px] text-[#64748B] uppercase truncate max-w-[80px]">
                {tech.category}
              </span>
            </div>

            <div>
              <h4 className="font-mono text-sm font-bold text-white tracking-tight group-hover:text-[#00D2FF] transition-colors truncate">
                {tech.name}
              </h4>
              <span className="text-[10px] font-mono text-[#64748B] block truncate">
                PROD-READY
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* Active Telemetry Inspection Drawer */}
      {hoveredTech && (
        <div className="p-4 rounded-xl bg-[#080D18] border border-[#0066FF]/40 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 animate-in fade-in duration-200">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="font-mono text-xs text-[#00D2FF] uppercase font-bold">
                ACTIVE NODE: {hoveredTech.name}
              </span>
              <span className="text-white/20">•</span>
              <span className="font-mono text-xs text-slate-400">CATEGORY: {hoveredTech.category}</span>
            </div>
            {hoveredTech.description && (
              <p className="text-xs text-[#94A3B8] font-sans">{hoveredTech.description}</p>
            )}
          </div>

          {hoveredTech.docsUrl && (
            <a
              href={hoveredTech.docsUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#0E1526] border border-white/10 font-mono text-xs text-white hover:text-[#00D2FF] transition-colors shrink-0"
            >
              <span>Official Docs</span>
              <ExternalLink className="w-3 h-3" />
            </a>
          )}
        </div>
      )}
    </div>
  );
};
