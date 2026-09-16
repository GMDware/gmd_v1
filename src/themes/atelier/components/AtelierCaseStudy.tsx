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
  const imgUrl =
    project.heroImageUrl ||
    project.heroImage?.url ||
    project.heroImage?.storageUrl ||
    '/uploads/hero-telemetry-blueprint.png';

  const technologies =
    project.technologies?.map((t: any) => t.technology?.name || t.name) || [];

  return (
    <article className="min-h-screen pt-12 pb-24 px-6 max-w-4xl mx-auto w-full space-y-12">
      {/* Return Link */}
      <div>
        <Link
          href="/work"
          className="inline-flex items-center gap-2 px-4 py-2 rounded-xl border border-slate-300 hover:border-slate-900 bg-white/50 hover:bg-slate-900 text-slate-800 hover:text-white font-medium text-xs transition-all duration-200 shadow-sm group active:scale-[0.98]"
        >
          <ArrowLeft className="w-3.5 h-3.5 text-slate-500 group-hover:text-white group-hover:-translate-x-0.5 transition-transform" />
          <span>Back to selected work</span>
        </Link>
      </div>

      {/* Case Study Header */}
      <header className="space-y-4">
        <div className="text-xs font-semibold text-blue-600 uppercase tracking-wide">
          {project.category?.name || project.projectType || 'Case Study'}
        </div>

        <h1 className="text-3xl sm:text-5xl font-bold tracking-tight text-slate-900 font-sans leading-tight">
          {project.title}
        </h1>

        <p className="text-base sm:text-lg text-slate-600 font-sans leading-relaxed max-w-2xl">
          {project.shortDescription || project.fullDescription}
        </p>

        {/* Project Metadata Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 py-4 border-y border-slate-200 text-xs">
          <div>
            <span className="text-slate-400 block pb-0.5">Client</span>
            <span className="text-slate-900 font-semibold">{project.clientName || 'Confidential Client'}</span>
          </div>
          <div>
            <span className="text-slate-400 block pb-0.5">Project Type</span>
            <span className="text-slate-900 font-semibold">{project.projectType || 'Web Platform'}</span>
          </div>
          <div>
            <span className="text-slate-400 block pb-0.5">Status</span>
            <span className="text-emerald-700 font-semibold">Active in Production</span>
          </div>
          <div>
            <span className="text-slate-400 block pb-0.5">Role</span>
            <span className="text-slate-900 font-semibold">Full-Stack Execution</span>
          </div>
        </div>
      </header>

      {/* Hero Image */}
      <div className="relative h-72 sm:h-[420px] w-full rounded-xl overflow-hidden bg-slate-100 border border-slate-200 shadow-sm">
        <Image
          src={imgUrl}
          alt={project.title}
          fill
          className="object-cover object-top"
          priority
          sizes="(max-width: 1024px) 100vw, 896px"
        />
      </div>

      {/* Narrative Sections */}
      <div className="space-y-10 max-w-3xl">
        {project.challenge && (
          <div className="space-y-2">
            <h2 className="text-xl font-bold text-slate-900">
              The Challenge
            </h2>
            <p className="text-sm sm:text-base text-slate-600 leading-relaxed">
              {project.challenge}
            </p>
          </div>
        )}

        {project.strategy && (
          <div className="space-y-2 pt-6 border-t border-slate-100">
            <h2 className="text-xl font-bold text-slate-900">
              Strategy & Solution
            </h2>
            <p className="text-sm sm:text-base text-slate-600 leading-relaxed">
              {project.strategy}
            </p>
          </div>
        )}

        {project.architecture && (
          <div className="space-y-2 pt-6 border-t border-slate-100">
            <h2 className="text-xl font-bold text-slate-900">
              Engineering & Implementation
            </h2>
            <p className="text-sm sm:text-base text-slate-600 leading-relaxed">
              {project.architecture}
            </p>
          </div>
        )}

        {project.results && (
          <div className="p-6 rounded-xl bg-slate-50 border border-slate-200 space-y-2">
            <h2 className="text-lg font-bold text-slate-900">
              Results & Business Impact
            </h2>
            <p className="text-sm text-slate-700 leading-relaxed">
              {project.results}
            </p>
          </div>
        )}
      </div>

      {/* Technologies Employed */}
      {technologies.length > 0 && (
        <div className="pt-6 border-t border-slate-200 space-y-3">
          <span className="text-xs font-semibold text-slate-400 uppercase tracking-wide block">
            Technologies Used
          </span>
          <div className="flex flex-wrap gap-2">
            {technologies.map((tech: string, idx: number) => (
              <span
                key={idx}
                className="px-3 py-1 rounded bg-slate-100 text-slate-700 text-xs font-normal"
              >
                {tech}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Next Case Study Bar */}
      {nextProject && (
        <div className="pt-8 border-t border-slate-200 flex items-center justify-between">
          <div className="space-y-0.5">
            <span className="text-xs text-slate-400 block">Next Project</span>
            <h4 className="text-base font-bold text-slate-900">
              {nextProject.title}
            </h4>
          </div>

          <Link
            href={`/work/${nextProject.slug}`}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl border border-slate-300 hover:border-slate-900 bg-white/50 hover:bg-slate-900 text-slate-800 hover:text-white font-medium text-xs transition-all duration-200 shadow-sm group active:scale-[0.98]"
          >
            <span>View case study</span>
            <ArrowUpRight className="w-3.5 h-3.5 text-slate-500 group-hover:text-white group-hover:-translate-y-0.5 group-hover:translate-x-0.5 transition-transform" />
          </Link>
        </div>
      )}
    </article>
  );
};
