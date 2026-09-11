'use client';

import React from 'react';
import { NexusHero } from './NexusHero';
import { NexusWork } from './NexusWork';
import { NexusServices } from './NexusServices';
import { NexusProcess } from './NexusProcess';
import { NexusAbout } from './NexusAbout';
import { NexusContact } from './NexusContact';

interface NexusHomeProps {
  settings: Record<string, string>;
  featuredProjects: any[];
  services: any[];
  processSteps: any[];
  values: any[];
  technologies: any[];
  teamMembers: any[];
  faqs: any[];
}

export const NexusHome: React.FC<NexusHomeProps> = ({
  settings,
  featuredProjects,
  services,
  processSteps,
  values,
  technologies,
  teamMembers,
}) => {
  return (
    <div data-theme="nexus" className="relative bg-[#030509] text-slate-100 overflow-hidden">
      {/* 1. Orbital Living Network Hero */}
      <NexusHero
        headline={
          settings.homepage_hero_headline ? (
            settings.homepage_hero_headline
          ) : undefined
        }
        subtitle={settings.homepage_hero_subtitle}
        badge={settings.homepage_hero_badge}
        primaryCtaLabel={settings.homepage_primary_cta_label}
        primaryCtaUrl={settings.homepage_primary_cta_url}
        secondaryCtaLabel={settings.homepage_secondary_cta_label}
        secondaryCtaUrl={settings.homepage_secondary_cta_url}
      />

      {/* 2. Capabilities Core in Network Fabric */}
      <NexusServices services={services} technologies={technologies} />

      {/* 3. Fluid Transformation Protocol */}
      <NexusProcess steps={processSteps} />

      {/* 4. Constellation Work Clusters */}
      <NexusWork projects={featuredProjects} />

      {/* 5. Specialist Collective Network */}
      <NexusAbout teamMembers={teamMembers} values={values} />

      {/* 6. Connection Initialization Terminal */}
      <NexusContact />
    </div>
  );
};
