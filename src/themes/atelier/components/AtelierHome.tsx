'use client';

import React from 'react';
import { AtelierHero } from './AtelierHero';
import { AtelierStats } from './AtelierStats';
import { AtelierServices } from './AtelierServices';
import { AtelierWork } from './AtelierWork';
import { AtelierAbout } from './AtelierAbout';
import { AtelierContact } from './AtelierContact';
import { ResolvedMetric } from '@/types/metrics';

interface AtelierHomeProps {
  settings: Record<string, string>;
  featuredProjects: any[];
  services: any[];
  processSteps: any[];
  values: any[];
  technologies: any[];
  teamMembers: any[];
  faqs?: any[];
  proofMetrics?: ResolvedMetric[];
}

export const AtelierHome: React.FC<AtelierHomeProps> = ({
  settings,
  featuredProjects,
  services,
  values,
  technologies,
  teamMembers,
  proofMetrics,
}) => {
  return (
    <div data-theme="atelier" className="relative bg-[#FAF9F6] text-slate-900 selection:bg-blue-600 selection:text-white">
      {/* 1. Studio Statement Hero */}
      <AtelierHero
        headline={settings.homepage_hero_headline}
        subtitle={settings.homepage_hero_subtitle}
        badge={settings.homepage_hero_badge}
        primaryCtaLabel={settings.homepage_primary_cta_label}
        primaryCtaUrl={settings.homepage_primary_cta_url}
        secondaryCtaLabel={settings.homepage_secondary_cta_label}
        secondaryCtaUrl={settings.homepage_secondary_cta_url}
      />

      {/* Editorial Narrative Transition Bridge with Scroll Motion */}
      <section className="relative border-y border-slate-200/80 bg-white/80 backdrop-blur-sm py-16 px-6 overflow-hidden">
        <div className="max-w-4xl mx-auto text-center space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 text-blue-700 text-xs font-semibold uppercase tracking-wider">
            <span>Studio Thesis</span>
          </div>

          <p className="text-xl sm:text-3xl font-serif text-slate-800 leading-relaxed font-normal max-w-3xl mx-auto">
            &ldquo;From early concept to production launch, we design and engineer practical digital tools that solve real problems for growing companies.&rdquo;
          </p>

          <div className="pt-4 flex flex-wrap items-center justify-center gap-6 sm:gap-8 text-xs text-slate-600 font-sans">
            <span className="flex items-center gap-2 font-medium">
              <span className="w-2 h-2 rounded-full bg-blue-600" />
              Modern Architecture
            </span>
            <span className="flex items-center gap-2 font-medium">
              <span className="w-2 h-2 rounded-full bg-emerald-600" />
              Production Engineering
            </span>
            <span className="flex items-center gap-2 font-medium">
              <span className="w-2 h-2 rounded-full bg-orange-600" />
              Senior-Led Execution
            </span>
          </div>
        </div>
      </section>

      {/* 2. Studio Proof & Audience Statistics */}
      <AtelierStats initialMetrics={proofMetrics} />

      {/* 3. Services & Capabilities */}
      <AtelierServices services={services} technologies={technologies} />

      {/* 4. Selected Client Work */}
      <AtelierWork projects={featuredProjects} />

      {/* 5. Studio Principles & Team */}
      <AtelierAbout teamMembers={teamMembers} settings={settings} />

      {/* 6. Project Inquiry */}
      <AtelierContact />
    </div>
  );
};
