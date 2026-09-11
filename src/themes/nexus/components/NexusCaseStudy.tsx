'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { ArrowLeft, ArrowUpRight, Orbit, Sparkles, CheckCircle2, ShieldCheck, Cpu } from 'lucide-react';

interface NexusCaseStudyProps {
  project: any;
  nextProject?: any;
}

export const NexusCaseStudy: React.FC<NexusCaseStudyProps> = ({ project, nextProject }) => {
  const imgUrl = project.heroImageUrl || project.heroImage?.url || '/uploads/hero-telemetry-blueprint.png';

  return (
    <article className="min-h-screen pt-32 pb-24 px-4 sm:px-8 bg-[#030509] text-slate-100 relative overflow-hidden">
      {/* Ambient background glow */}
      <div className="absolute top-20 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-cyan-500/10 blur-[180px] rounded-full pointer-events-none" />

      <div className="max-w-5xl mx-auto space-y-16 relative z-10">
        {/* Back Link & Breadcrumb */}
        <div className="flex items-center justify-between text-xs font-mono text-cyan-300">
          <Link
            href="/work"
            className="inline-flex items-center gap-2 hover:text-white transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>RETURN TO CONSTELLATION</span>
          </Link>
          <span className="text-slate-500">
            NODE SPECIFICATION // {project.slug?.toUpperCase()}
          </span>
        </div>

        {/* Hero Title & Meta */}
        <div className="space-y-6">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-xs font-mono text-[#00F2FE]">
            <Orbit className="w-3.5 h-3.5 animate-spin" />
            <span>{project.projectType || 'High-Concurrency Systems Platform'}</span>
          </div>

          <h1 className="text-4xl sm:text-6xl md:text-7xl font-black text-white tracking-tight font-sans leading-tight">
            {project.title}
          </h1>

          <p className="text-base sm:text-xl text-slate-300 max-w-3xl leading-relaxed font-sans">
            {project.shortDescription || project.fullDescription}
          </p>

          {/* Quick Metrics Bar */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 p-5 rounded-2xl bg-[#080D1A]/80 border border-cyan-500/20 backdrop-blur-xl text-xs font-mono">
            <div>
              <span className="text-slate-500 block text-[10px] uppercase">CLIENT ENTITY</span>
              <span className="text-white font-bold">{project.clientName || 'Confidential Enterprise'}</span>
            </div>
            <div>
              <span className="text-slate-500 block text-[10px] uppercase">CATEGORY</span>
              <span className="text-[#00F2FE] font-bold">{project.category?.name || 'Enterprise'}</span>
            </div>
            <div>
              <span className="text-slate-500 block text-[10px] uppercase">STATUS</span>
              <span className="text-emerald-400 font-bold">PRODUCTION VERIFIED</span>
            </div>
            <div>
              <span className="text-slate-500 block text-[10px] uppercase">ARCHITECTURE</span>
              <span className="text-purple-300 font-bold">DISTRIBUTED CLUSTERS</span>
            </div>
          </div>
        </div>

        {/* Featured Image Node Viewport */}
        <div className="relative h-[380px] sm:h-[500px] w-full rounded-3xl overflow-hidden bg-black/60 border border-cyan-500/30 shadow-[0_0_40px_rgba(0,242,254,0.15)]">
          <Image
            src={imgUrl}
            alt={project.title}
            fill
            className="object-cover object-top"
            priority
            sizes="100vw"
          />
        </div>

        {/* Narrative Dimensions Grid */}
        <div className="space-y-12">
          {project.challenge && (
            <div className="p-8 rounded-3xl bg-[#080D1A]/70 border border-white/10 space-y-3">
              <span className="text-xs font-mono text-rose-400 uppercase tracking-widest block">
                // 01 ARCHITECTURAL CHALLENGE
              </span>
              <h3 className="text-xl font-bold text-white">The Structural Bottleneck</h3>
              <p className="text-sm text-slate-300 leading-relaxed font-sans">{project.challenge}</p>
            </div>
          )}

          {project.strategy && (
            <div className="p-8 rounded-3xl bg-[#080D1A]/70 border border-white/10 space-y-3">
              <span className="text-xs font-mono text-[#00F2FE] uppercase tracking-widest block">
                // 02 RESOLUTION STRATEGY
              </span>
              <h3 className="text-xl font-bold text-white">Systemic Strategy & Decomposition</h3>
              <p className="text-sm text-slate-300 leading-relaxed font-sans">{project.strategy}</p>
            </div>
          )}

          {project.architecture && (
            <div className="p-8 rounded-3xl bg-[#080D1A]/70 border border-cyan-500/20 space-y-3">
              <span className="text-xs font-mono text-purple-400 uppercase tracking-widest block">
                // 03 CLUSTER TOPOLOGY
              </span>
              <h3 className="text-xl font-bold text-white">Distributed Node Architecture</h3>
              <p className="text-sm text-slate-300 leading-relaxed font-sans">{project.architecture}</p>
            </div>
          )}

          {project.results && (
            <div className="p-8 rounded-3xl bg-[#080D1A]/70 border border-emerald-500/30 space-y-3">
              <span className="text-xs font-mono text-emerald-400 uppercase tracking-widest block">
                // 04 EMPIRICAL OUTCOMES
              </span>
              <h3 className="text-xl font-bold text-white">Production Performance Verified</h3>
              <p className="text-sm text-slate-300 leading-relaxed font-sans">{project.results}</p>
            </div>
          )}
        </div>

        {/* Technologies Grid */}
        {project.technologies && project.technologies.length > 0 && (
          <div className="space-y-4 pt-8 border-t border-white/10">
            <span className="text-xs font-mono text-cyan-300 uppercase tracking-widest block">
              // ACTIVE TECHNOLOGY FABRIC
            </span>
            <div className="flex flex-wrap gap-2">
              {project.technologies.map((t: any, idx: number) => (
                <span
                  key={idx}
                  className="px-3.5 py-1.5 rounded-full bg-[#080D1A] border border-cyan-500/30 text-xs font-mono text-white"
                >
                  {t.technology?.name || t.name}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Next Project Footer */}
        {nextProject && (
          <div className="pt-12 border-t border-white/10 flex items-center justify-between">
            <div className="space-y-1">
              <span className="text-[10px] font-mono text-slate-500 uppercase">NEXT NODE</span>
              <h4 className="text-lg font-bold text-white">{nextProject.title}</h4>
            </div>

            <Link
              href={`/work/${nextProject.slug}`}
              className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-[#00F2FE] text-black font-bold text-xs shadow-lg shadow-cyan-500/20 hover:bg-cyan-300 transition-colors"
            >
              <span>Transition Node</span>
              <ArrowUpRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        )}
      </div>
    </article>
  );
};
