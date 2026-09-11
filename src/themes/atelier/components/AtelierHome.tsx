'use client';

import React from 'react';
import { AtelierHero } from './AtelierHero';
import { AtelierWork } from './AtelierWork';
import { AtelierServices } from './AtelierServices';
import { AtelierProcess } from './AtelierProcess';
import { AtelierAbout } from './AtelierAbout';
import { AtelierContact } from './AtelierContact';

interface AtelierHomeProps {
  settings: Record<string, string>;
  featuredProjects: any[];
  services: any[];
  processSteps: any[];
  values: any[];
  technologies: any[];
  teamMembers: any[];
  faqs: any[];
}

export const AtelierHome: React.FC<AtelierHomeProps> = ({
  settings,
  featuredProjects,
  services,
  processSteps,
  values,
  technologies,
  teamMembers,
}) => {
  return (
    <div data-theme="atelier" className="relative bg-[#0A0A0A] text-[#F5F2EB]">
      {/* 1. Typographic & Editorial Hero */}
      <AtelierHero
        headline={settings.homepage_hero_headline}
        subtitle={settings.homepage_hero_subtitle}
        badge={settings.homepage_hero_badge}
        primaryCtaLabel={settings.homepage_primary_cta_label}
        primaryCtaUrl={settings.homepage_primary_cta_url}
        secondaryCtaLabel={settings.homepage_secondary_cta_label}
        secondaryCtaUrl={settings.homepage_secondary_cta_url}
      />

      {/* 2. Selected Works Tearsheets */}
      <AtelierWork projects={featuredProjects} />

      {/* 3. Numbered Capabilities Directory */}
      <AtelierServices services={services} technologies={technologies} />

      {/* 4. Monograph Delivery Sequence */}
      <AtelierProcess steps={processSteps} />

      {/* 5. Manifesto & Practitioners */}
      <AtelierAbout teamMembers={teamMembers} values={values} />

      {/* 6. Minimalist Inquiry Salon */}
      <AtelierContact />
    </div>
  );
};
