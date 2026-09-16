import React from 'react';
import Link from 'next/link';
import type { Metadata } from 'next';
import { Container } from '@/components/ui/Container';
import { SectionHeading } from '@/components/ui/SectionHeading';
import { Button } from '@/components/ui/Button';
import { HeroCanvasClient } from '@/components/three/HeroCanvasClient';
import { HeroAssemblySystem } from '@/components/public/HeroAssemblySystem';
import { HeroMetrics } from '@/components/public/HeroMetrics';
import { SectionConduit } from '@/components/ui/SectionConduit';
import { TransformationPipeline } from '@/components/public/TransformationPipeline';
import { ServiceEnvironment } from '@/components/public/ServiceEnvironment';
import { WhatWeBuild } from '@/components/public/WhatWeBuild';
import { ProjectPreview } from '@/components/public/ProjectPreview';
import { TechnologyEcosystem } from '@/components/public/TechnologyEcosystem';
import { ProcessTimeline } from '@/components/public/ProcessTimeline';
import { TeamMemberCard } from '@/components/public/TeamMemberCard';
import { CallToAction } from '@/components/public/CallToAction';
import { Magnetic } from '@/components/motion/Magnetic';
import { PinnedScrollStory } from '@/components/public/PinnedScrollStory';
import DataStore from '@/lib/db/data-store';
import { resolveActiveTheme } from '@/lib/theme/resolver';
import { NexusHome } from '@/themes/nexus/components/NexusHome';
import { AtelierHome } from '@/themes/atelier/components/AtelierHome';
import {
  ArrowUpRight,
  Terminal,
  Cpu,
  Layers,
  Shield,
  Zap,
  ChevronRight,
} from 'lucide-react';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export async function generateMetadata(): Promise<Metadata> {
  return DataStore.getSEO('/');
}

export default async function HomePage({
  searchParams,
}: {
  searchParams?: Promise<Record<string, string | string[] | undefined>>;
}) {
  const resolvedParams = searchParams ? await searchParams : undefined;
  const { themeId } = await resolveActiveTheme(resolvedParams);

  const [
    settings,
    featuredProjects,
    services,
    processSteps,
    values,
    technologies,
    teamMembers,
    faqs,
    proofMetrics,
  ] = await Promise.all([
    DataStore.getSettings(),
    DataStore.getProjects({ featuredOnly: true }),
    DataStore.getServices(),
    DataStore.getProcessSteps(),
    DataStore.getValues(),
    DataStore.getTechnologies(),
    DataStore.getTeamMembers(),
    DataStore.getFAQs(),
    DataStore.getProofMetrics(),
  ]);

  // Format projects for ProjectPreview
  const formattedProjects = featuredProjects.map((p: any) => ({
    id: p.id,
    title: p.title,
    slug: p.slug,
    shortDescription: p.shortDescription,
    fullDescription: p.fullDescription,
    clientName: p.clientName,
    projectType: p.projectType,
    heroImageUrl: p.heroImage?.url || p.heroImageUrl,
    challenge: p.challenge,
    strategy: p.strategy,
    architecture: p.architecture,
    results: p.results,
    technologies: p.technologies?.map((t: any) => ({ name: t.technology?.name || t.name })) || [],
    isFeatured: p.isFeatured,
  }));

  // Format team members
  const formattedMembers = teamMembers.map((m: any) => ({
    id: m.id,
    name: m.name,
    displayName: m.displayName || m.name,
    isFounder: m.isFounder,
    founderTitle: m.founderTitle,
    roleTitle: m.role?.title || m.roleTitle,
    departmentName: m.department?.name || m.departmentName,
    shortBio: m.shortBio,
    skills: m.skills || [],
    avatarUrl: m.image?.url || m.image?.storageUrl || m.avatarUrl,
    socials: m.socials?.map((s: any) => ({ platform: s.platform, url: s.url })) || [],
  }));

  // Render Theme 02: NEXUS (Futuristic / Networked / Living Digital Ecosystem)
  if (themeId === 'nexus') {
    return (
      <NexusHome
        settings={settings}
        featuredProjects={formattedProjects}
        services={services}
        processSteps={processSteps}
        values={values}
        technologies={technologies}
        teamMembers={formattedMembers}
        faqs={faqs}
      />
    );
  }

  // Render Theme 03: KINETIC (Architectural / Light Monograph / Digital Craft)
  if (themeId === 'atelier') {
    const allProjects = await DataStore.getProjects();
    const formattedAllProjects = (allProjects && allProjects.length > 0 ? allProjects : featuredProjects).map((p: any) => ({
      id: p.id,
      title: p.title,
      slug: p.slug,
      shortDescription: p.shortDescription,
      fullDescription: p.fullDescription,
      clientName: p.clientName,
      projectType: p.projectType,
      heroImageUrl: p.heroImage?.url || p.heroImageUrl,
      challenge: p.challenge,
      strategy: p.strategy,
      architecture: p.architecture,
      results: p.results,
      technologies: p.technologies?.map((t: any) => ({ name: t.technology?.name || t.name })) || [],
      isFeatured: p.isFeatured,
      category: p.category,
    }));

    return (
      <AtelierHome
        settings={settings}
        featuredProjects={formattedAllProjects}
        services={services}
        processSteps={processSteps}
        values={values}
        technologies={technologies}
        teamMembers={formattedMembers}
        faqs={faqs}
        proofMetrics={proofMetrics}
      />
    );
  }

  // Render Theme 01: SYSTEMS (Original Flagship Preserved 100%)
  return (
    <div data-theme="systems" className="relative overflow-hidden bg-[#05080F]">
      {/* ─────────────────────────────────────────────────────────────────
          1. HERO SECTION (ARCHITECTURAL COORDINATE VOID & KINETIC CORE)
      ───────────────────────────────────────────────────────────────── */}
      <section className="relative min-h-[92vh] flex flex-col justify-center pt-24 pb-20 border-b border-white/[0.08] overflow-hidden">
        {/* Background 3D Wireframe Constellation */}
        <HeroCanvasClient />

        {/* Blueprint Coordinate Grid Overlay */}
        <div className="absolute inset-0 blueprint-grid opacity-25 pointer-events-none" />

        {/* Ambient Cobalt Aura */}
        <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[850px] h-[550px] bg-[#0066FF]/10 blur-[150px] pointer-events-none rounded-full" />

        <Container size="wide" className="relative z-10 text-center space-y-8">
          {/* Primary Cinematic Display Headline */}
          <h1 className="text-4xl sm:text-6xl md:text-7xl lg:text-8xl font-black tracking-tight text-white font-display leading-[1.04] max-w-5xl mx-auto">
            {settings.homepage_hero_headline || (
              <>
                FROM IDEA <br />
                <span className="text-gradient-blue">TO DIGITAL PRODUCT.</span>
              </>
            )}
          </h1>

          {/* Architectural Subtitle */}
          <p className="text-base sm:text-xl text-[#94A3B8] max-w-2xl mx-auto leading-relaxed font-sans">
            {settings.homepage_hero_subtitle ||
              'GMDware engineers high-performance digital platforms, scalable software systems, and bespoke web architecture for ambitious organizations.'}
          </p>

          {/* Primary Action Suite with Tactile Magnetic Physics */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-2">
            <Magnetic strength={0.25}>
              <Link href={settings.homepage_secondary_cta_url || '/contact'}>
                <Button size="lg" variant="primary" rightIcon={<ArrowUpRight className="w-4 h-4" />}>
                  {settings.homepage_secondary_cta_label || 'Start a Project'}
                </Button>
              </Link>
            </Magnetic>
            <Magnetic strength={0.25}>
              <Link href={settings.homepage_primary_cta_url || '/work'}>
                <Button
                  size="lg"
                  variant="secondary"
                  leftIcon={<Terminal className="w-4 h-4 text-[#00D2FF]" />}
                >
                  {settings.homepage_primary_cta_label || 'Inspect Flagship Work'}
                </Button>
              </Link>
            </Magnetic>
          </div>

          {/* Interactive Self-Assembling System Demo */}
          <div className="pt-10 max-w-4xl mx-auto">
            <HeroAssemblySystem />
          </div>

          {/* Key Metrics / Social Proof Stats Row */}
          <HeroMetrics initialMetrics={proofMetrics} />
        </Container>
      </section>

      {/* Structural Storytelling Conduit */}
      <SectionConduit label="CONTINUUM // 01 PIPELINE TRANSFORMATION" />

      {/* ─────────────────────────────────────────────────────────────────
          2. TRANSFORMATION PIPELINE: FROM IDEA TO IMPACT
      ───────────────────────────────────────────────────────────────── */}
      <section className="py-16 border-b border-white/[0.08]">
        <Container size="wide">
          <SectionHeading
            tag="01 // TRANSFORMATION PIPELINE"
            title="From Idea to Operational Impact"
            subtitle="Software is not created in disjointed stages. We operate an unbroken engineering continuum from raw domain hypothesis to global multi-region production."
            align="center"
          />

          <div className="pt-6">
            <TransformationPipeline />
          </div>
        </Container>
      </section>

      {/* Structural Storytelling Conduit */}
      <SectionConduit label="CONTINUUM // 02 SERVICE ENVIRONMENT" />

      {/* ─────────────────────────────────────────────────────────────────
          3. INTERACTIVE SERVICE ENVIRONMENT
      ───────────────────────────────────────────────────────────────── */}
      <section className="py-16 border-b border-white/[0.08]">
        <Container size="wide">
          <SectionHeading
            tag="02 // CAPABILITIES ENVIRONMENT"
            title="Disciplined Full-Stack Engineering"
            subtitle="Selecting a capability alters the canvas, revealing concrete deliverables, verified architectures, and execution parameters."
            action={
              <Link href="/services">
                <Button variant="outline" size="sm" rightIcon={<ArrowUpRight className="w-3.5 h-3.5" />}>
                  Full Capabilities Index
                </Button>
              </Link>
            }
          />

          <ServiceEnvironment services={services} />
        </Container>
      </section>

      {/* Structural Storytelling Conduit */}
      <SectionConduit label="CONTINUUM // 03 PRODUCT ARCHETYPES" />

      {/* ─────────────────────────────────────────────────────────────────
          4. WHAT WE BUILD: 8 ARCHITECTURAL PRODUCT ARCHETYPES
      ───────────────────────────────────────────────────────────────── */}
      <WhatWeBuild />

      {/* Structural Storytelling Conduit */}
      <SectionConduit label="CONTINUUM // 04 PINNED NARRATIVE ARCHITECTURE" />

      {/* ─────────────────────────────────────────────────────────────────
          5. PINNED NARRATIVE ARCHITECTURE: THE CONTINUOUS CONTINUUM
      ───────────────────────────────────────────────────────────────── */}
      <PinnedScrollStory steps={processSteps} />

      {/* Structural Storytelling Conduit */}
      <SectionConduit label="CONTINUUM // 05 VERIFIED DEPLOYMENTS" />

      {/* ─────────────────────────────────────────────────────────────────
          6. FEATURED SYSTEMS & CASE STUDY TEARSHEETS
      ───────────────────────────────────────────────────────────────── */}
      <section className="py-24 border-b border-white/[0.08]">
        <Container size="wide">
          <SectionHeading
            tag="04 // FLAGSHIP WORK"
            title="Architectural Work & Case Studies"
            subtitle="Explore real systems built to withstand high concurrency, distributed network partitions, and mission-critical enterprise workloads."
            action={
              <Link href="/work">
                <Button variant="outline" size="sm" rightIcon={<ChevronRight className="w-4 h-4" />}>
                  View All Case Studies
                </Button>
              </Link>
            }
          />

          {formattedProjects.length > 0 ? (
            <div className="space-y-12">
              {formattedProjects.map((project, idx) => (
                <ProjectPreview key={project.id} project={project} index={idx} />
              ))}
            </div>
          ) : (
            <div className="gmd-panel rounded-2xl p-10 border border-white/10 text-center space-y-4 max-w-xl mx-auto">
              <div className="w-12 h-12 rounded-xl bg-[#080D18] border border-white/10 mx-auto flex items-center justify-center text-[#0066FF]">
                <Layers className="w-6 h-6 text-[#00D2FF]" />
              </div>
              <div className="space-y-1">
                <span className="font-mono text-xs text-[#00D2FF] uppercase tracking-wider">
                  // DEPLOYMENT PIPELINE
                </span>
                <h4 className="text-xl font-bold text-white font-display">
                  Featured Systems Currently Under Verification
                </h4>
                <p className="text-xs text-[#94A3B8] leading-relaxed">
                  Flagship case studies are being calibrated in the CMS. Inquire directly for confidential enterprise architecture teardowns.
                </p>
              </div>
              <Link href="/contact">
                <Button variant="outline" size="sm" rightIcon={<ArrowUpRight className="w-3.5 h-3.5" />}>
                  Request Case Teardown
                </Button>
              </Link>
            </div>
          )}
        </Container>
      </section>

      {/* Structural Storytelling Conduit */}
      <SectionConduit label="CONTINUUM // 05 ARCHITECTURAL TOPOLOGY" />

      {/* ─────────────────────────────────────────────────────────────────
          6. TECHNOLOGY TOPOLOGY & PIPELINE ECOSYSTEM
      ───────────────────────────────────────────────────────────────── */}
      <TechnologyEcosystem technologies={technologies} />

      {/* Structural Storytelling Conduit */}
      <SectionConduit label="CONTINUUM // 06 DELIVERY PROTOCOL" />

      {/* ─────────────────────────────────────────────────────────────────
          7. DELIVERY PROTOCOL & ENGINEERING METHODOLOGY (7 PHASES)
      ───────────────────────────────────────────────────────────────── */}
      <section className="py-24 border-b border-white/[0.08]">
        <Container size="wide">
          <SectionHeading
            tag="06 // METHODOLOGY"
            title="7-Phase Deterministic Delivery Protocol"
            subtitle="We eliminate delivery ambiguity through structured mathematical milestones, explicit deliverables, and continuous architectural verification."
            align="center"
          />

          <div className="max-w-5xl mx-auto pt-6">
            <ProcessTimeline steps={processSteps} />
          </div>
        </Container>
      </section>

      {/* Structural Storytelling Conduit */}
      <SectionConduit label="CONTINUUM // 07 THE GMDWARE CODE" />

      {/* ─────────────────────────────────────────────────────────────────
          8. CORE VALUES & FIRST-PRINCIPLES PHILOSOPHY
      ───────────────────────────────────────────────────────────────── */}
      {values.length > 0 && (
        <section className="py-24 border-b border-white/[0.08]">
          <Container size="wide">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
              {/* Manifesto Column (5 Cols) */}
              <div className="lg:col-span-5 space-y-6">
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-[#0066FF] animate-pulse" />
                  <span className="font-mono text-xs tracking-[0.25em] uppercase text-[#00D2FF]">
                    07 // THE GMDWARE CODE
                  </span>
                </div>

                <h2 className="text-3xl sm:text-4xl font-extrabold text-white font-display tracking-tight leading-tight">
                  Uncompromising Standards in Every Line of Code
                </h2>

                <p className="text-sm sm:text-base text-[#94A3B8] leading-relaxed font-sans">
                  We do not treat engineering as an assembly line. We treat it as digital architecture: requiring mathematical rigor, deep domain empathy, and enduring craftsmanship.
                </p>

                <div className="pt-2">
                  <Link href="/about">
                    <Button variant="outline" size="md" rightIcon={<ArrowUpRight className="w-4 h-4" />}>
                      Explore Our Philosophy
                    </Button>
                  </Link>
                </div>
              </div>

              {/* Values Grid (7 Cols) */}
              <div className="lg:col-span-7 grid grid-cols-1 sm:grid-cols-2 gap-4">
                {values.map((val, idx) => (
                  <div key={idx} className="gmd-panel rounded-xl p-6 space-y-3 hover:border-[#0066FF]/50 transition-colors">
                    <div className="w-10 h-10 rounded-lg bg-[#0E1526] border border-white/10 flex items-center justify-center text-[#00D2FF]">
                      {idx === 0 ? (
                        <Cpu className="w-5 h-5 text-[#00D2FF]" />
                      ) : idx === 1 ? (
                        <Layers className="w-5 h-5 text-[#0066FF]" />
                      ) : idx === 2 ? (
                        <Shield className="w-5 h-5 text-[#80B3FF]" />
                      ) : (
                        <Zap className="w-5 h-5 text-[#00D2FF]" />
                      )}
                    </div>
                    <h4 className="text-base font-bold text-white font-display">{val.title}</h4>
                    <p className="text-xs text-[#94A3B8] leading-relaxed font-sans">{val.summary}</p>
                  </div>
                ))}
              </div>
            </div>
          </Container>
        </section>
      )}

      {/* ─────────────────────────────────────────────────────────────────
          9. LEADERSHIP & ARCHITECTURAL DIRECTORS
      ───────────────────────────────────────────────────────────────── */}
      {formattedMembers.length > 0 && (
        <section className="py-24 border-b border-white/[0.08]">
          <Container size="wide">
            <SectionHeading
              tag="08 // ARCHITECTURAL DIRECTORS"
              title="Built by Practitioners"
              subtitle="Directly engage with veteran software architects, distributed systems engineers, and technical founders."
              action={
                <Link href="/about">
                  <Button variant="outline" size="sm" rightIcon={<ArrowUpRight className="w-3.5 h-3.5" />}>
                    Meet Leadership
                  </Button>
                </Link>
              }
            />

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {formattedMembers.slice(0, 3).map((member) => (
                <TeamMemberCard key={member.id} member={member} />
              ))}
            </div>
          </Container>
        </section>
      )}

      {/* ─────────────────────────────────────────────────────────────────
          10. TECHNICAL FAQS
      ───────────────────────────────────────────────────────────────── */}
      {faqs.length > 0 && (
        <section className="py-24 border-b border-white/[0.08]">
          <Container size="narrow">
            <SectionHeading
              tag="09 // TECHNICAL CLARIFICATIONS"
              title="Direct Answers to Technical Questions"
              subtitle="Clear architectural expectations, engagement models, and delivery governance."
              align="center"
            />

            <div className="space-y-4">
              {faqs.map((faq, idx) => (
                <div key={idx} className="gmd-panel rounded-xl p-6 space-y-2 hover:border-[#0066FF]/40 transition-colors">
                  <h4 className="text-sm sm:text-base font-bold text-white flex items-start gap-3">
                    <span className="text-[#00D2FF] font-mono text-xs mt-0.5 shrink-0">0{idx + 1}.</span>
                    <span>{faq.question}</span>
                  </h4>
                  <p className="text-xs sm:text-sm text-[#94A3B8] leading-relaxed pl-7 font-sans">
                    {faq.answer}
                  </p>
                </div>
              ))}
            </div>
          </Container>
        </section>
      )}

      {/* ─────────────────────────────────────────────────────────────────
          11. FINAL CONVERSION TERMINAL
      ───────────────────────────────────────────────────────────────── */}
      <section className="py-24">
        <Container size="wide">
          <CallToAction
            headline={settings.homepage_final_cta_headline || "HAVE AN IDEA? LET'S BUILD IT."}
            subtitle={
              settings.homepage_final_cta_subtitle ||
              'Engage our principal software architects to design, engineer, and deploy your next mission-critical digital platform.'
            }
            buttonLabel={settings.homepage_final_cta_button_label || 'Start a Project'}
            buttonUrl={settings.homepage_final_cta_button_url || '/contact'}
          />
        </Container>
      </section>
    </div>
  );
}
