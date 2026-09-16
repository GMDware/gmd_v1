import React from 'react';
import type { Metadata } from 'next';
import DataStore from '@/lib/db/data-store';
import { Container } from '@/components/ui/Container';
import { SectionHeading } from '@/components/ui/SectionHeading';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { TeamMemberCard } from '@/components/public/TeamMemberCard';
import { UnifiedTeamRail } from '@/components/public/UnifiedTeamRail';
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
    return <AtelierAbout teamMembers={teamMembers} settings={settings} isStandalone={true} />;
  }

  const brandName = settings.brand_name || 'GMDware';
  const companyDescription =
    settings.company_description ||
    'We are an independent software studio. We design, architect, and engineer dependable web applications, custom platforms, and digital products for teams with high technical expectations.';
  const mission =
    settings.mission_statement ||
    'To engineer resilient, scalable, and mathematically sound digital infrastructure that accelerates enterprise transformation and eliminates technical friction.';
  const vision =
    settings.vision_statement ||
    'Setting the global benchmark for modern software craftsmanship, zero-compromise security, and cinematic digital user experiences.';

  // Normalize and combine founders & team members together
  const allMembers = (teamMembers || [])
    .filter((m: any) => m && m.isActive !== false)
    .map((m: any) => {
      const cleanName =
        m.name && !m.name.startsWith('[')
          ? m.name
          : m.displayName && !m.displayName.startsWith('[')
          ? m.displayName
          : 'Senior Software Architect';

      const cleanDisplayName =
        m.displayName && !m.displayName.startsWith('[') ? m.displayName : cleanName;

      const roleTitle =
        m.role?.title || m.roleTitle || (m.isFounder ? 'Founder & Chief Architect' : 'Senior Software Engineer');

      const founderTitle =
        m.founderTitle || (m.isFounder ? 'Founder & Chief Architect' : null);

      const departmentName =
        m.department?.name || m.departmentName || (m.isFounder ? 'Leadership' : 'Engineering');

      const avatarUrl =
        m.image?.url || m.image?.storageUrl || m.avatarUrl || null;

      const shortBio =
        m.shortBio ||
        m.fullBio ||
        'Passionate software craftsman dedicated to engineering reliable, elegant, and maintainable digital solutions.';

      const skills: string[] = Array.isArray(m.skills) ? m.skills : [];

      const socials: { platform: string; url: string }[] = [];
      if (m.githubUrl) socials.push({ platform: 'GitHub', url: m.githubUrl });
      if (m.linkedinUrl) socials.push({ platform: 'LinkedIn', url: m.linkedinUrl });
      if (m.websiteUrl) socials.push({ platform: 'Website', url: m.websiteUrl });
      if (Array.isArray(m.socials)) {
        m.socials.forEach((s: any) => {
          if (s.url && !socials.some((existing) => existing.url === s.url)) {
            socials.push({ platform: s.platform || 'Link', url: s.url });
          }
        });
      }
      if (Array.isArray(m.socialLinks)) {
        m.socialLinks.forEach((s: any) => {
          if (s.url && !socials.some((existing) => existing.url === s.url)) {
            socials.push({ platform: s.platform || 'Link', url: s.url });
          }
        });
      }

      return {
        id: m.id,
        name: cleanName,
        displayName: cleanDisplayName,
        isFounder: Boolean(m.isFounder),
        roleTitle,
        founderTitle,
        departmentName,
        avatarUrl,
        shortBio,
        skills,
        socials,
        displayOrder: typeof m.displayOrder === 'number' ? m.displayOrder : 99,
      };
    })
    .sort((a: any, b: any) => {
      if (a.isFounder && !b.isFounder) return -1;
      if (!a.isFounder && b.isFounder) return 1;
      return a.displayOrder - b.displayOrder;
    });

  return (
    <div className="py-16 space-y-24 bg-[#05080F]">
      <Container size="wide">
        {/* ── 1. Company Overview & Narrative Header (نبذة عن الشركة) ── */}
        <div className="max-w-3xl space-y-4 mb-16">
          <div className="inline-flex items-center gap-2 text-xs font-semibold text-[#00D2FF] uppercase tracking-wider">
            <span className="w-1.5 h-1.5 rounded-full bg-[#00D2FF]" />
            <span>About {brandName}</span>
          </div>

          <h1 className="text-4xl sm:text-6xl font-extrabold text-white font-display tracking-tight leading-tight">
            An independent software studio built for craftsmanship.
          </h1>

          <p className="text-base sm:text-lg text-[#94A3B8] leading-relaxed font-sans max-w-2xl">
            {companyDescription}
          </p>
        </div>

        {/* ── 2. Purpose & Direction Cards (Mission & Vision) ── */}
        <div className="mb-20 space-y-6">
          <div className="space-y-1">
            <span className="text-xs uppercase tracking-wider text-[#00D2FF] font-semibold block">
              Our Purpose &amp; Direction
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-white font-display tracking-tight">
              Built with clear intent and long-term vision.
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Mission Card */}
            <div className="gmd-panel rounded-3xl p-8 space-y-4 border border-[#0066FF]/30 relative overflow-hidden group hover:border-[#00D2FF]/60 transition-all">
              <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-[#0066FF] to-[#00D2FF] scale-x-0 group-hover:scale-x-100 transition-transform origin-left duration-300" />
              <div className="flex items-center justify-between">
                <span className="px-3 py-1 rounded-full text-xs font-semibold bg-[#0066FF]/20 text-[#00D2FF] border border-[#0066FF]/40 flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#00D2FF]" />
                  <span>Our Mission</span>
                </span>
                <span className="text-xs font-mono text-slate-500 font-semibold">01</span>
              </div>
              <h3 className="text-2xl font-bold text-white font-display">Why We Build</h3>
              <p className="text-sm sm:text-base text-[#94A3B8] leading-relaxed font-sans">
                {mission}
              </p>
            </div>

            {/* Vision Card */}
            <div className="gmd-panel rounded-3xl p-8 space-y-4 border border-white/10 relative overflow-hidden group hover:border-white/30 transition-all">
              <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-white/20 via-[#00D2FF] to-[#0066FF] scale-x-0 group-hover:scale-x-100 transition-transform origin-left duration-300" />
              <div className="flex items-center justify-between">
                <span className="px-3 py-1 rounded-full text-xs font-semibold bg-white/10 text-white border border-white/20 flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-white" />
                  <span>Our Vision</span>
                </span>
                <span className="text-xs font-mono text-slate-500 font-semibold">02</span>
              </div>
              <h3 className="text-2xl font-bold text-white font-display">The Standard We Set</h3>
              <p className="text-sm sm:text-base text-[#94A3B8] leading-relaxed font-sans">
                {vision}
              </p>
            </div>
          </div>
        </div>

        {/* ── 3. Unified Leadership & Team Rail (4 Cards Side-by-Side with Horizontal Scroll) ── */}
        <div className="mb-20">
          <UnifiedTeamRail members={allMembers} brandName={brandName} />
        </div>

        {/* ── 4. Engineering Principles ── */}
        <div className="mb-20">
          <SectionHeading
            tag="OUR PRINCIPLES"
            title="Our Core Engineering Principles"
            subtitle="The fundamental philosophy guiding every product, interface, and system we deliver."
          />

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="gmd-panel rounded-2xl p-8 space-y-4 border-t-2 border-t-[#0066FF]">
              <div className="flex items-center justify-between font-mono text-xs text-[#00D2FF]">
                <span>01. DISCOVERY</span>
                <span>STRATEGY</span>
              </div>
              <h3 className="text-2xl font-bold text-white font-display">Architecture & Strategy</h3>
              <p className="text-sm text-[#94A3B8] leading-relaxed font-sans">
                First-principles design, domain modeling, and clear technical planning. We define system boundaries and architecture before writing production code.
              </p>
            </div>

            <div className="gmd-panel rounded-2xl p-8 space-y-4 border-t-2 border-t-[#FFFFFF]">
              <div className="flex items-center justify-between font-mono text-xs text-white">
                <span>02. CRAFTSMANSHIP</span>
                <span>EXECUTION</span>
              </div>
              <h3 className="text-2xl font-bold text-white font-display">Engineering & Design</h3>
              <p className="text-sm text-[#94A3B8] leading-relaxed font-sans">
                Modern full-stack construction, clean code practices, and refined interactive user experiences built with strict type safety and performance.
              </p>
            </div>

            <div className="gmd-panel rounded-2xl p-8 space-y-4 border-t-2 border-t-[#00D2FF]">
              <div className="flex items-center justify-between font-mono text-xs text-[#00D2FF]">
                <span>03. HORIZON</span>
                <span>GROWTH</span>
              </div>
              <h3 className="text-2xl font-bold text-white font-display">Scale & Reliability</h3>
              <p className="text-sm text-[#94A3B8] leading-relaxed font-sans">
                Scalable cloud deployment, automated CI/CD workflows, and continuous monitoring to ensure your product remains fast, reliable, and available as you scale.
              </p>
            </div>
          </div>
        </div>

        {/* ── 5. Core Values ── */}
        {values.length > 0 && (
          <div className="space-y-8 mb-20">
            <SectionHeading
              tag="OUR VALUES"
              title="Our Values & Standards"
              subtitle="The values that guide how we write code, build digital products, and collaborate with our clients."
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

      {/* ── 6. Conversion CTA ── */}
      <Container size="wide">
        <CallToAction
          headline="Looking for an Engineering Partner You Can Trust?"
          subtitle="Speak directly with our technical leadership to discuss your vision, constraints, and timeline."
        />
      </Container>
    </div>
  );
}
