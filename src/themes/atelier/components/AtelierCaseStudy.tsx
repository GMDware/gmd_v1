'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { ArrowLeft, ArrowUpRight } from 'lucide-react';

interface AtelierCaseStudyProps {
  project: any;
  nextProject?: any;
}

export const AtelierCaseStudy: React.FC<AtelierCaseStudyProps> = ({ project, nextProject }) => {
  const imgUrl = project.heroImageUrl || project.heroImage?.url || '/uploads/hero-telemetry-blueprint.png';

  return (
    <article className="min-h-screen pt-32 pb-24 px-6 sm:px-12 bg-[#0A0A0A] text-[#F5F2EB]">
      <div className="max-w-5xl mx-auto space-y-20">
        {/* Navigation & Index */}
        <div className="flex items-center justify-between text-xs font-mono text-stone-500 pb-4 border-b border-white/[0.08]">
          <Link href="/work" className="inline-flex items-center gap-2 hover:text-white transition-colors">
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>RETURN TO SELECTED WORKS</span>
          </Link>
          <span className="uppercase">COMMISSION ARCHIVE // {project.slug}</span>
        </div>

        {/* Title & Commission Credits */}
        <header className="space-y-8 max-w-4xl">
          <div className="text-xs font-mono text-stone-400 uppercase tracking-[0.2em]">
            {project.category?.name || 'COMMISSION SPECIFICATION'}
          </div>

          <h1 className="text-4xl sm:text-6xl md:text-7xl font-normal font-serif text-[#F5F2EB] leading-tight">
            {project.title}
          </h1>

          <p className="text-lg sm:text-2xl text-stone-300 font-sans font-light leading-relaxed">
            {project.shortDescription || project.fullDescription}
          </p>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-6 pt-6 border-t border-white/[0.08] text-xs font-mono">
            <div>
              <span className="text-stone-500 block uppercase">CLIENT</span>
              <span className="text-white font-sans">{project.clientName || 'Confidential'}</span>
            </div>
            <div>
              <span className="text-stone-500 block uppercase">DISCIPLINE</span>
              <span className="text-white font-sans">{project.projectType || 'Enterprise Platform'}</span>
            </div>
            <div>
              <span className="text-stone-500 block uppercase">DELIVERY</span>
              <span className="text-stone-300 font-sans">Production Verified</span>
            </div>
            <div>
              <span className="text-stone-500 block uppercase">YEAR</span>
              <span className="text-stone-300 font-sans">2026</span>
            </div>
          </div>
        </header>

        {/* Full Bleed Image Viewport */}
        <div className="relative h-[400px] sm:h-[550px] w-full rounded-2xl overflow-hidden bg-black/60 border border-white/10">
          <Image
            src={imgUrl}
            alt={project.title}
            fill
            className="object-cover object-top"
            priority
            sizes="100vw"
          />
        </div>

        {/* Editorial Narrative Sections */}
        <div className="space-y-16 max-w-3xl">
          {project.challenge && (
            <div className="space-y-4">
              <span className="text-xs font-mono text-stone-500 uppercase tracking-widest block">
                01 / THE CONTEXT & BOTTLENECK
              </span>
              <h2 className="text-2xl sm:text-3xl font-serif text-[#F5F2EB]">The Operational Challenge</h2>
              <p className="text-base text-stone-300 font-sans font-light leading-relaxed">{project.challenge}</p>
            </div>
          )}

          {project.strategy && (
            <div className="space-y-4 pt-8 border-t border-white/[0.08]">
              <span className="text-xs font-mono text-stone-500 uppercase tracking-widest block">
                02 / ARCHITECTURAL APPROACH
              </span>
              <h2 className="text-2xl sm:text-3xl font-serif text-[#F5F2EB]">Strategic Resolution</h2>
              <p className="text-base text-stone-300 font-sans font-light leading-relaxed">{project.strategy}</p>
            </div>
          )}

          {project.architecture && (
            <div className="space-y-4 pt-8 border-t border-white/[0.08]">
              <span className="text-xs font-mono text-stone-500 uppercase tracking-widest block">
                03 / SYSTEM TOPOLOGY
              </span>
              <h2 className="text-2xl sm:text-3xl font-serif text-[#F5F2EB]">Distributed Architecture</h2>
              <p className="text-base text-stone-300 font-sans font-light leading-relaxed">{project.architecture}</p>
            </div>
          )}

          {project.results && (
            <div className="space-y-4 pt-8 border-t border-white/[0.08]">
              <span className="text-xs font-mono text-stone-500 uppercase tracking-widest block">
                04 / VERIFIED RESULTS
              </span>
              <h2 className="text-2xl sm:text-3xl font-serif text-[#F5F2EB]">Production Impact</h2>
              <p className="text-base text-stone-300 font-sans font-light leading-relaxed">{project.results}</p>
            </div>
          )}
        </div>

        {/* Technologies Employed */}
        {project.technologies && project.technologies.length > 0 && (
          <div className="pt-12 border-t border-white/[0.08] space-y-4">
            <span className="text-xs font-mono text-stone-500 uppercase tracking-widest block">
              TECHNOLOGIES EMPLOYED
            </span>
            <div className="flex flex-wrap gap-2 text-xs font-mono">
              {project.technologies.map((t: any, idx: number) => (
                <span key={idx} className="px-3 py-1.5 rounded border border-white/15 text-stone-300">
                  {t.technology?.name || t.name}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Next Case Study Navigation */}
        {nextProject && (
          <div className="pt-16 border-t border-white/[0.08] flex items-center justify-between">
            <div className="space-y-1">
              <span className="text-xs font-mono text-stone-500 uppercase">NEXT COMMISSION</span>
              <h4 className="text-xl font-serif text-[#F5F2EB]">{nextProject.title}</h4>
            </div>

            <Link
              href={`/work/${nextProject.slug}`}
              className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-[#F5F2EB] text-black font-medium text-xs uppercase tracking-wider hover:bg-white transition-colors"
            >
              <span>View Case Study</span>
              <ArrowUpRight className="w-4 h-4" />
            </Link>
          </div>
        )}
      </div>
    </article>
  );
};
