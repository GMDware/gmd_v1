'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { ArrowUpRight, Sparkles, Orbit, Radio, Layers, Activity } from 'lucide-react';

interface NexusWorkProps {
  projects: any[];
  categories?: any[];
  activeCategory?: string;
  isStandalone?: boolean;
}

export const NexusWork: React.FC<NexusWorkProps> = ({
  projects,
  categories = [],
  activeCategory,
  isStandalone = false,
}) => {
  const [hoveredId, setHoveredId] = useState<string | null>(null);

  return (
    <section data-theme="nexus" className={`relative overflow-hidden bg-[#030509] ${isStandalone ? 'pt-32 pb-24' : 'py-24'}`}>
      {/* Ambient background glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[500px] bg-cyan-500/5 blur-[160px] rounded-full pointer-events-none" />

      <div className="max-w-6xl mx-auto px-4 sm:px-8 relative z-10 space-y-12">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-6 border-b border-white/10">
          <div className="space-y-3">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/20 text-[11px] font-mono text-[#00F2FE]">
              <Orbit className="w-3 h-3" />
              <span>CONSTELLATION // PROJECT ECOSYSTEM</span>
            </div>
            <h2 className="text-3xl sm:text-5xl font-black text-white tracking-tight font-sans">
              Interconnected Systems in Production
            </h2>
            <p className="text-sm text-slate-400 max-w-xl leading-relaxed">
              Explore platforms architected to survive network turbulence, high-throughput distributed loads, and mission-critical scale.
            </p>
          </div>

          {!isStandalone && (
            <Link
              href="/work"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-white/5 hover:bg-white/10 border border-white/10 text-xs font-medium text-white transition-all group shrink-0"
            >
              <span>Explore All Constellations</span>
              <ArrowUpRight className="w-3.5 h-3.5 text-[#00F2FE] group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
            </Link>
          )}
        </div>

        {/* Categories if standalone */}
        {isStandalone && categories.length > 0 && (
          <div className="flex flex-wrap items-center gap-2 pt-2">
            <Link
              href="/work"
              className={`px-4 py-1.5 rounded-full text-xs font-mono transition-colors ${
                !activeCategory
                  ? 'bg-[#00F2FE] text-black font-bold shadow-[0_0_15px_rgba(0,242,254,0.3)]'
                  : 'bg-[#080D1A] text-slate-400 hover:text-white border border-white/10'
              }`}
            >
              ALL NODES ({projects.length})
            </Link>
            {categories.map((cat: any) => {
              const isSelected = activeCategory === cat.slug;
              return (
                <Link
                  key={cat.id}
                  href={`/work?category=${cat.slug}`}
                  className={`px-4 py-1.5 rounded-full text-xs font-mono transition-colors ${
                    isSelected
                      ? 'bg-[#00F2FE] text-black font-bold shadow-[0_0_15px_rgba(0,242,254,0.3)]'
                      : 'bg-[#080D1A] text-slate-400 hover:text-white border border-white/10'
                  }`}
                >
                  {cat.name.toUpperCase()}
                </Link>
              );
            })}
          </div>
        )}

        {/* Constellation Grid */}
        {projects.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {projects.map((project: any, index: number) => {
              const isHovered = hoveredId === project.id;
              const imgUrl = project.heroImageUrl || project.heroImage?.url || '/uploads/hero-telemetry-blueprint.png';

              return (
                <Link
                  key={project.id}
                  href={`/work/${project.slug}`}
                  onMouseEnter={() => setHoveredId(project.id)}
                  onMouseLeave={() => setHoveredId(null)}
                  className="group relative rounded-3xl bg-[#080D1A]/70 border border-cyan-500/20 hover:border-cyan-400/60 p-6 backdrop-blur-xl transition-all duration-500 flex flex-col justify-between overflow-hidden shadow-[0_0_30px_rgba(0,0,0,0.4)] hover:shadow-[0_0_40px_rgba(0,242,254,0.15)]"
                >
                  {/* Glowing orbital corner node */}
                  <div className="absolute -top-12 -right-12 w-28 h-28 rounded-full bg-cyan-500/10 blur-2xl group-hover:bg-cyan-500/25 transition-all" />

                  {/* Top Meta */}
                  <div className="space-y-4">
                    <div className="flex items-center justify-between text-xs font-mono">
                      <span className="text-[#00F2FE] flex items-center gap-1.5">
                        <span className="w-1.5 h-1.5 rounded-full bg-[#00F2FE] animate-pulse" />
                        NODE // 0{index + 1}
                      </span>
                      <span className="text-slate-400 uppercase">
                        {project.projectType || 'Enterprise Web Platform'}
                      </span>
                    </div>

                    {/* Image viewport */}
                    <div className="relative h-64 sm:h-72 w-full rounded-2xl overflow-hidden bg-black/40 border border-white/5">
                      <Image
                        src={imgUrl}
                        alt={project.title}
                        fill
                        className="object-cover object-top group-hover:scale-105 transition-transform duration-700 opacity-90 group-hover:opacity-100"
                        sizes="(max-width: 768px) 100vw, 50vw"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-[#080D1A] via-transparent to-transparent opacity-80" />

                      {/* Floating Case Link */}
                      <div className="absolute bottom-4 right-4 px-3 py-1.5 rounded-full bg-[#080D1A]/90 border border-cyan-500/30 text-white text-xs font-mono flex items-center gap-1.5 backdrop-blur-md opacity-0 group-hover:opacity-100 transition-opacity">
                        <span>Inspect Node</span>
                        <ArrowUpRight className="w-3.5 h-3.5 text-[#00F2FE]" />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <h3 className="text-xl sm:text-2xl font-bold text-white group-hover:text-[#00F2FE] transition-colors">
                        {project.title}
                      </h3>
                      <p className="text-xs sm:text-sm text-slate-400 line-clamp-2 leading-relaxed">
                        {project.shortDescription || project.fullDescription}
                      </p>
                    </div>
                  </div>

                  {/* Technology vectors */}
                  <div className="pt-6 mt-6 border-t border-white/5 flex flex-wrap items-center gap-2">
                    {project.technologies?.slice(0, 4).map((tech: any, tIdx: number) => (
                      <span
                        key={tIdx}
                        className="px-2.5 py-1 rounded-full bg-white/5 text-[10px] font-mono text-cyan-300 border border-cyan-500/20"
                      >
                        {tech.name || tech.technology?.name}
                      </span>
                    ))}
                    {project.technologies?.length > 4 && (
                      <span className="text-[10px] font-mono text-slate-500">
                        +{project.technologies.length - 4} more
                      </span>
                    )}
                  </div>
                </Link>
              );
            })}
          </div>
        ) : (
          <div className="p-12 rounded-3xl bg-[#080D1A]/50 border border-white/10 text-center space-y-4 max-w-xl mx-auto">
            <Orbit className="w-8 h-8 text-[#00F2FE] mx-auto animate-spin" />
            <p className="text-sm text-slate-300">
              Constellation nodes currently synchronizing with CMS telemetry.
            </p>
          </div>
        )}
      </div>
    </section>
  );
};
