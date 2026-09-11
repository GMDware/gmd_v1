import React from 'react';
import type { Metadata } from 'next';
import DataStore from '@/lib/db/data-store';
import { Container } from '@/components/ui/Container';
import { SectionHeading } from '@/components/ui/SectionHeading';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { TeamMemberCard } from '@/components/public/TeamMemberCard';
import { CallToAction } from '@/components/public/CallToAction';
import Link from 'next/link';
import { ArrowUpRight, Terminal, Shield, Cpu, Layers, Zap, Users } from 'lucide-react';

import { resolveActiveTheme } from '@/lib/theme/resolver';
import { NexusAbout } from '@/themes/nexus/components/NexusAbout';
import { AtelierAbout } from '@/themes/atelier/components/AtelierAbout';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export async function generateMetadata(): Promise<Metadata> {
  return DataStore.getSEO('/about');
}

export default async function AboutPage({
  searchParams,
}: {
  searchParams?: Promise<Record<string, string | string[] | undefined>>;
}) {
  const resolvedParams = searchParams ? await searchParams : undefined;
  const { themeId } = await resolveActiveTheme(resolvedParams);

  const [settings, values, teamMembers] = await Promise.all([
    DataStore.getSettings(),
    DataStore.getValues(),
    DataStore.getTeamMembers(),
  ]);

  if (themeId === 'nexus') {
    return <NexusAbout teamMembers={teamMembers} values={values} isStandalone={true} />;
  }

  if (themeId === 'atelier') {
    return <AtelierAbout teamMembers={teamMembers} values={values} isStandalone={true} />;
  }

  const founders = teamMembers.filter((m: any) => m.isFounder);
  const engineers = teamMembers.filter((m: any) => !m.isFounder);
  const brandName = settings.brand_name || 'GMDware';

  const formatMember = (m: any) => ({
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
  });

  return (
    <div className="py-16 space-y-24 bg-[#05080F]">
      <Container size="wide">
        {/* Editorial Header */}
        <div className="max-w-3xl space-y-4 mb-16">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-[#0066FF] animate-pulse" />
            <span className="font-mono text-xs tracking-[0.25em] uppercase text-[#00D2FF]">
              // PHILOSOPHY, GENESIS & LEADERSHIP
            </span>
          </div>

          <h1 className="text-4xl sm:text-6xl font-black text-white font-display tracking-tight leading-tight">
            Architectural Discipline. Digital Craftsmanship.
          </h1>

          <p className="text-base sm:text-lg text-[#94A3B8] leading-relaxed font-sans">
            {settings.vision_statement ||
              'Setting the benchmark for modern software craftsmanship, zero-compromise security, and cinematic digital user experiences.'}
          </p>
        </div>

        {/* ── G - M - D Tripartite Philosophy Section ── */}
        <div className="mb-20">
          <SectionHeading
            tag="01 // THE GMD CONCEPT"
            title="The Tripartite Engineering Triad"
            subtitle="The fundamental framework guiding every system, interface, and infrastructure rollout."
          />

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="gmd-panel rounded-2xl p-8 space-y-4 border-t-2 border-t-[#0066FF]">
              <div className="flex items-center justify-between font-mono text-xs text-[#00D2FF]">
                <span>[G] // PHASE_01</span>
                <span>ORIGIN</span>
              </div>
              <h3 className="text-2xl font-bold text-white font-display">GENESIS</h3>
              <p className="text-sm text-[#94A3B8] leading-relaxed font-sans">
                First-principles architecture, formal domain modeling, and algorithmic foundations. We define system boundaries before writing a single line of production code.
              </p>
            </div>

            <div className="gmd-panel rounded-2xl p-8 space-y-4 border-t-2 border-t-[#FFFFFF]">
              <div className="flex items-center justify-between font-mono text-xs text-white">
                <span>[M] // PHASE_02</span>
                <span>STRUCTURE</span>
              </div>
              <h3 className="text-2xl font-bold text-white font-display">MECHANICS</h3>
              <p className="text-sm text-[#94A3B8] leading-relaxed font-sans">
                Precision full-stack construction, high-concurrency distributed data pipelines, and cinematic interactive interfaces executed with strict type integrity.
              </p>
            </div>

            <div className="gmd-panel rounded-2xl p-8 space-y-4 border-t-2 border-t-[#00D2FF]">
              <div className="flex items-center justify-between font-mono text-xs text-[#00D2FF]">
                <span>[D] // PHASE_03</span>
                <span>HORIZON</span>
              </div>
              <h3 className="text-2xl font-bold text-white font-display">DYNAMICS</h3>
              <p className="text-sm text-[#94A3B8] leading-relaxed font-sans">
                Global cloud orchestration, automated CI/CD deployment vectors, and live telemetry. Ensuring 99.99% availability under extreme operational load.
              </p>
            </div>
          </div>
        </div>

        {/* Mission & Vision Statements */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-20">
          <div className="gmd-panel rounded-2xl p-8 space-y-4 border border-[#0066FF]/30">
            <div className="font-mono text-xs text-[#00D2FF] uppercase tracking-wider font-semibold flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-[#00D2FF]" />
              // OUR VISION
            </div>
            <h3 className="text-2xl font-bold text-white font-display">The Benchmark Standard</h3>
            <p className="text-sm sm:text-base text-[#94A3B8] leading-relaxed font-sans">
              {settings.vision_statement ||
                'Setting the global benchmark for modern software craftsmanship, zero-compromise security, and cinematic digital user experiences.'}
            </p>
          </div>

          <div className="gmd-panel rounded-2xl p-8 space-y-4 border border-white/10">
            <div className="font-mono text-xs text-white uppercase tracking-wider font-semibold flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-white" />
              // OUR MISSION
            </div>
            <h3 className="text-2xl font-bold text-white font-display">Why GMDware Exists</h3>
            <p className="text-sm sm:text-base text-[#94A3B8] leading-relaxed font-sans">
              {settings.mission_statement ||
                'To engineer resilient, scalable, and mathematically sound digital infrastructure that accelerates enterprise transformation.'}
            </p>
          </div>

          <div className="gmd-panel rounded-2xl p-8 space-y-4 border border-white/10">
            <div className="font-mono text-xs text-[#80B3FF] uppercase tracking-wider font-semibold flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-[#80B3FF]" />
              // THE GMD CODE
            </div>
            <h3 className="text-2xl font-bold text-white font-display">Mathematical Determinism</h3>
            <p className="text-sm sm:text-base text-[#94A3B8] leading-relaxed font-sans">
              We reject fragile abstractions, dependency bloat, and premature optimization. We design systems from domain boundaries outward, guaranteeing predictable performance.
            </p>
          </div>
        </div>

        {/* Leadership & Founders Section */}
        {founders.length > 0 && (
          <div className="space-y-8 mb-20">
            <SectionHeading
              tag="02 // EXECUTIVE ARCHITECTS"
              title="Founders & Leadership"
              subtitle="Directing GMDware engineering methodology, technical standards, and client architecture engagements."
            />

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
              {founders.map((founder: any) => (
                <TeamMemberCard key={founder.id} member={formatMember(founder)} />
              ))}
            </div>
          </div>
        )}

        {/* Engineering Staff */}
        {engineers.length > 0 && (
          <div className="space-y-8 mb-20">
            <SectionHeading
              tag="03 // CORE ENGINEERING"
              title="Systems Specialists & UI Architects"
              subtitle="Senior practitioners dedicated to distributed backends, algorithmic optimization, and cinematic motion design."
            />

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {engineers.map((member: any) => (
                <TeamMemberCard key={member.id} member={formatMember(member)} />
              ))}
            </div>
          </div>
        )}

        {/* Empty State when no team records exist */}
        {founders.length === 0 && engineers.length === 0 && (
          <div className="gmd-panel rounded-2xl p-10 border border-white/10 text-center space-y-4 max-w-xl mx-auto mb-20">
            <div className="w-12 h-12 rounded-xl bg-[#080D18] border border-white/10 mx-auto flex items-center justify-center text-[#0066FF]">
              <Users className="w-6 h-6 text-[#00D2FF]" />
            </div>
            <div className="space-y-1">
              <span className="font-mono text-xs text-[#00D2FF] uppercase tracking-wider">
                // PRACTITIONER ROSTER
              </span>
              <h4 className="text-xl font-bold text-white font-display">Team Directory Updating</h4>
              <p className="text-xs text-[#94A3B8] leading-relaxed">
                Staff and leadership profiles are being calibrated in the CMS.
              </p>
            </div>
          </div>
        )}

        {/* Core Values Grid */}
        {values.length > 0 && (
          <div className="space-y-8 mb-20">
            <SectionHeading
              tag="04 // OPERATIONAL VALUES"
              title="The GMDware Principles"
              subtitle="Standards that govern every pull request, architecture review, and deployment protocol."
            />

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {values.map((val: any, idx: number) => (
                <div key={idx} className="gmd-panel rounded-xl p-6 space-y-3 hover:border-[#0066FF]/50 transition-colors">
                  <div className="w-8 h-8 rounded-lg bg-[#080D18] border border-white/10 flex items-center justify-center text-[#00D2FF]">
                    {idx === 0 ? <Cpu className="w-4 h-4" /> : idx === 1 ? <Layers className="w-4 h-4" /> : <Shield className="w-4 h-4" />}
                  </div>
                  <h4 className="text-base font-bold text-white font-display">{val.title}</h4>
                  <p className="text-xs text-[#94A3B8] leading-relaxed font-sans">{val.summary}</p>
                </div>
              ))}
            </div>
          </div>
        )}
      </Container>

      {/* Conversion Terminal */}
      <Container size="wide">
        <CallToAction
          headline="Looking for an Engineering Partner You Can Trust?"
          subtitle="Speak directly with our technical leadership to discuss your vision, constraints, and timeline."
        />
      </Container>
    </div>
  );
}
