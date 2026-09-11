'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { ArrowUpRight } from 'lucide-react';

interface AtelierWorkProps {
  projects: any[];
  categories?: any[];
  activeCategory?: string;
  isStandalone?: boolean;
}

export const AtelierWork: React.FC<AtelierWorkProps> = ({
  projects,
  categories = [],
  activeCategory,
  isStandalone = false,
}) => {
  return (
    <section data-theme="atelier" className={`relative bg-[#0A0A0A] text-[#F5F2EB] ${isStandalone ? 'pt-32 pb-24' : 'py-24 border-b border-white/[0.08]'}`}>
      <div className="max-w-6xl mx-auto px-6 sm:px-12 space-y-16">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-6 border-b border-white/[0.08]">
          <div className="space-y-3">
            <span className="text-xs font-mono uppercase tracking-[0.2em] text-stone-400 block">
              SELECTED PORTFOLIO // 2026
            </span>
            <h2 className="text-3xl sm:text-5xl font-normal font-serif text-[#F5F2EB]">
              Proven Systems in the Wild
            </h2>
          </div>

          {!isStandalone && (
            <Link
              href="/work"
              className="text-xs uppercase tracking-widest text-stone-400 hover:text-white transition-colors flex items-center gap-2 pb-1"
            >
              <span>View All Commissions</span>
              <span>→</span>
            </Link>
          )}
        </div>

        {/* Categories if standalone */}
        {isStandalone && categories.length > 0 && (
          <div className="flex flex-wrap items-center gap-4 text-xs font-mono">
            <Link
              href="/work"
              className={`pb-1 transition-colors uppercase tracking-widest ${
                !activeCategory ? 'text-[#F5F2EB] border-b border-[#F5F2EB]' : 'text-stone-500 hover:text-stone-300'
              }`}
            >
              All Works ({projects.length})
            </Link>
            {categories.map((cat: any) => {
              const isSelected = activeCategory === cat.slug;
              return (
                <Link
                  key={cat.id}
                  href={`/work?category=${cat.slug}`}
                  className={`pb-1 transition-colors uppercase tracking-widest ${
                    isSelected ? 'text-[#F5F2EB] border-b border-[#F5F2EB]' : 'text-stone-500 hover:text-stone-300'
                  }`}
                >
                  {cat.name}
                </Link>
              );
            })}
          </div>
        )}

        {/* Editorial Tearsheets Stack */}
        <div className="space-y-24">
          {projects.map((project: any, index: number) => {
            const imgUrl = project.heroImageUrl || project.heroImage?.url || '/uploads/hero-telemetry-blueprint.png';

            return (
              <article
                key={project.id}
                className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center pt-8 border-t border-white/[0.08]"
              >
                {/* Visual Viewport (7 Cols) */}
                <div className="lg:col-span-7 order-2 lg:order-1">
                  <Link href={`/work/${project.slug}`} className="group block relative overflow-hidden rounded-xl bg-black/40 border border-white/10">
                    <div className="relative h-72 sm:h-96 w-full overflow-hidden">
                      <Image
                        src={imgUrl}
                        alt={project.title}
                        fill
                        className="object-cover object-top group-hover:scale-105 transition-transform duration-700 opacity-90 group-hover:opacity-100"
                        sizes="(max-width: 1024px) 100vw, 60vw"
                      />
                    </div>
                  </Link>
                </div>

                {/* Editorial Column (5 Cols) */}
                <div className="lg:col-span-5 order-1 lg:order-2 space-y-6">
                  <div className="flex items-center justify-between text-xs font-mono text-stone-500">
                    <span>INDEX // 0{index + 1}</span>
                    <span className="uppercase">{project.category?.name || 'Enterprise Solution'}</span>
                  </div>

                  <h3 className="text-2xl sm:text-4xl font-serif text-[#F5F2EB] leading-tight">
                    <Link href={`/work/${project.slug}`} className="hover:text-stone-300 transition-colors">
                      {project.title}
                    </Link>
                  </h3>

                  <p className="text-sm sm:text-base text-stone-400 font-sans leading-relaxed">
                    {project.shortDescription || project.fullDescription}
                  </p>

                  <div className="pt-2 flex flex-wrap gap-2 text-[11px] font-mono text-stone-400">
                    {project.technologies?.slice(0, 4).map((tech: any, tIdx: number) => (
                      <span key={tIdx} className="px-2.5 py-1 rounded border border-white/10">
                        {tech.name || tech.technology?.name}
                      </span>
                    ))}
                  </div>

                  <div className="pt-4">
                    <Link
                      href={`/work/${project.slug}`}
                      className="inline-flex items-center gap-2 text-xs uppercase tracking-widest font-mono text-[#F5F2EB] hover:text-white group"
                    >
                      <span>Read Architectural Case Study</span>
                      <span className="group-hover:translate-x-1 transition-transform">→</span>
                    </Link>
                  </div>
                </div>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
};
