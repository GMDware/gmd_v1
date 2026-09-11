'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { ArrowUpRight, CheckCircle2, Layers, Cpu, Shield } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useCursor } from '@/components/motion/CursorProvider';

export interface ProjectData {
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

interface ProjectPreviewProps {
  project: ProjectData;
  index: number;
}

export const ProjectPreview: React.FC<ProjectPreviewProps> = ({ project, index }) => {
  const isEven = index % 2 === 0;
  const { setCursorState } = useCursor();

  return (
    <article
      className="relative gmd-panel rounded-2xl p-6 sm:p-8 lg:p-10 overflow-hidden group hover:border-[#0066FF]/40 transition-all duration-300"
      onMouseEnter={() => setCursorState('project')}
      onMouseLeave={() => setCursorState('default')}
    >
      {/* Background Architectural Watermark Index */}
      <div className="absolute top-4 right-8 font-mono text-7xl sm:text-8xl font-black text-white/[0.03] select-none pointer-events-none">
        0{index + 1}
      </div>

      <div
        className={cn(
          'grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center relative z-10',
          !isEven && 'lg:flex-row-reverse'
        )}
      >
        {/* Spec Sheet Column (5 Cols) */}
        <div className={cn('lg:col-span-5 space-y-6', !isEven && 'lg:order-2')}>
          {/* Metadata Rail */}
          <div className="flex flex-wrap items-center gap-2">
            <span className="font-mono text-xs text-[#00D2FF] tracking-wider uppercase">
              // CASE_0{index + 1}
            </span>
            <span className="text-white/20">•</span>
            <span className="font-mono text-xs text-slate-400 uppercase">
              {project.projectType}
            </span>
            {project.isFeatured && (
              <Badge variant="cobalt" size="sm">
                FLAGSHIP
              </Badge>
            )}
            {project.clientName && (
              <Badge variant="neutral" size="sm">
                {project.clientName}
              </Badge>
            )}
          </div>

          {/* Title & Short Description */}
          <div className="space-y-3">
            <h3 className="text-2xl sm:text-3xl font-bold text-white font-display tracking-tight group-hover:text-[#00D2FF] group-hover:translate-x-1 transition-all duration-300">
              <Link href={`/work/${project.slug}`}>{project.title}</Link>
            </h3>
            <p className="text-sm text-[#94A3B8] leading-relaxed font-sans">
              {project.shortDescription}
            </p>
          </div>

          {/* Architectural Pillars / Challenge & Results Snippets */}
          <div className="space-y-2 pt-2">
            {project.challenge && (
              <div className="flex items-start gap-2 text-xs text-slate-300">
                <Cpu className="w-3.5 h-3.5 text-[#0066FF] shrink-0 mt-0.5" />
                <span className="line-clamp-1 font-sans">{project.challenge}</span>
              </div>
            )}
            {project.results && (
              <div className="flex items-start gap-2 text-xs text-[#00D2FF]">
                <CheckCircle2 className="w-3.5 h-3.5 text-[#00D2FF] shrink-0 mt-0.5" />
                <span className="line-clamp-1 font-sans font-medium">{project.results}</span>
              </div>
            )}
          </div>

          {/* Technology Pills */}
          {project.technologies && project.technologies.length > 0 && (
            <div className="space-y-2">
              <span className="font-mono text-[10px] text-[#64748B] uppercase tracking-widest block">
                CORE STACK:
              </span>
              <div className="flex flex-wrap gap-1.5">
                {project.technologies.slice(0, 5).map((tech) => (
                  <span
                    key={tech.name}
                    className="px-2 py-1 rounded bg-[#0E1526] border border-white/[0.06] font-mono text-[11px] text-slate-300"
                  >
                    {tech.name}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Action Trigger */}
          <div className="pt-2">
            <Link href={`/work/${project.slug}`}>
              <Button variant="outline" size="md" rightIcon={<ArrowUpRight className="w-4 h-4" />}>
                Inspect Case Study
              </Button>
            </Link>
          </div>
        </div>

        {/* Panoramic Visual Frame (7 Cols) */}
        <div className={cn('lg:col-span-7', !isEven && 'lg:order-1')}>
          <Link
            href={`/work/${project.slug}`}
            className="block relative aspect-video rounded-xl overflow-hidden border border-white/10 bg-[#080D18] group-hover:border-[#0066FF]/50 transition-colors shadow-2xl"
          >
            {project.heroImageUrl ? (
              <Image
                src={project.heroImageUrl}
                alt={project.title}
                fill
                sizes="(max-width: 1024px) 100vw, 60vw"
                className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
              />
            ) : (
              <div className="w-full h-full flex flex-col items-center justify-center p-8 blueprint-grid">
                <div className="w-16 h-16 rounded-2xl bg-[#0066FF]/10 border border-[#0066FF]/30 flex items-center justify-center mb-4 text-[#0066FF]">
                  <Layers className="w-8 h-8" />
                </div>
                <span className="font-display font-bold text-white text-lg tracking-tight">
                  {project.title}
                </span>
                <span className="font-mono text-xs text-[#64748B] mt-1">
                  [BLUEPRINT // ARCHITECTURE_SCHEMATIC]
                </span>
              </div>
            )}

            {/* Subtle Gradient Vignette */}
            <div className="absolute inset-0 bg-gradient-to-t from-[#05080F] via-transparent to-transparent opacity-50 pointer-events-none" />

            {/* Corner Precision Crosshairs */}
            <div className="absolute top-3 left-3 px-2 py-1 rounded bg-[#05080F]/90 border border-white/10 font-mono text-[10px] text-[#00D2FF]">
              SYS: {project.slug}
            </div>
          </Link>
        </div>
      </div>
    </article>
  );
};
