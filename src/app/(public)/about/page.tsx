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
    return <AtelierAbout teamMembers={teamMembers} settings={settings} isStandalone={true} />;
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
          <h1 className="text-4xl sm:text-6xl font-extrabold text-white font-display tracking-tight leading-tight">
            Built for Craftsmanship & Scalability
          </h1>

          <p className="text-base sm:text-lg text-[#94A3B8] leading-relaxed font-sans max-w-2xl">
            {settings.vision_statement ||
              'GMDware is an independent software studio dedicated to engineering reliable, beautifully designed digital products and scalable systems.'}
          </p>
        </div>

        {/* ── G - M - D Principles Section ── */}
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

        {/* Mission & Vision Statements */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-20">
          <div className="gmd-panel rounded-2xl p-8 space-y-4 border border-[#0066FF]/30">
            <div className="text-xs text-[#00D2FF] uppercase tracking-wider font-semibold flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-[#00D2FF]" />
              Our Vision
            </div>
            <h3 className="text-2xl font-bold text-white font-display">Craftsmanship Standard</h3>
            <p className="text-sm sm:text-base text-[#94A3B8] leading-relaxed font-sans">
              {settings.vision_statement ||
                'Setting the standard for modern software craftsmanship, zero-compromise security, and refined digital user experiences.'}
            </p>
          </div>

          <div className="gmd-panel rounded-2xl p-8 space-y-4 border border-white/10">
            <div className="text-xs text-white uppercase tracking-wider font-semibold flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-white" />
              Our Mission
            </div>
            <h3 className="text-2xl font-bold text-white font-display">Why We Build</h3>
            <p className="text-sm sm:text-base text-[#94A3B8] leading-relaxed font-sans">
              {settings.mission_statement ||
                'To engineer resilient, scalable, and beautifully crafted software products that help ambitious teams grow and succeed.'}
            </p>
          </div>

          <div className="gmd-panel rounded-2xl p-8 space-y-4 border border-white/10">
            <div className="text-xs text-[#80B3FF] uppercase tracking-wider font-semibold flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-[#80B3FF]" />
              Our Commitment
            </div>
            <h3 className="text-2xl font-bold text-white font-display">Quality Without Bloat</h3>
            <p className="text-sm sm:text-base text-[#94A3B8] leading-relaxed font-sans">
              We reject fragile shortcuts, unnecessary dependency bloat, and poor architectural habits. We engineer clean, maintainable systems that stand the test of time.
            </p>
          </div>
        </div>

        {/* Leadership & Founders Section */}
        {founders.length > 0 && (
          <div className="space-y-8 mb-20">
            <SectionHeading
              tag="LEADERSHIP"
              title="Founders & Leadership"
              subtitle="Directing GMDware's engineering standards, product strategy, and client engagements."
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
              tag="THE TEAM"
              title="Software Engineers & Designers"
              subtitle="Specialists dedicated to full-stack engineering, cloud architecture, and intuitive user experiences."
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
              <h4 className="text-xl font-bold text-white font-display">Team Directory Updating</h4>
              <p className="text-xs text-[#94A3B8] leading-relaxed">
                Staff and leadership profiles are being updated in the studio directory.
              </p>
            </div>
          </div>
        )}

        {/* Core Values Grid */}
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
