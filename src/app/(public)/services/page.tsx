import React from 'react';
import type { Metadata } from 'next';
import DataStore from '@/lib/db/data-store';
import { Container } from '@/components/ui/Container';
import { SectionHeading } from '@/components/ui/SectionHeading';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { TechnologyGraph } from '@/components/public/TechnologyGraph';
import { CallToAction } from '@/components/public/CallToAction';
import { JsonLd } from '@/components/public/JsonLd';
import Link from 'next/link';
import { ArrowUpRight, CheckCircle2, Code2, Server, Layout, ShieldCheck, Cpu, Zap } from 'lucide-react';

import { resolveActiveTheme } from '@/lib/theme/resolver';
import { NexusServices } from '@/themes/nexus/components/NexusServices';
import { AtelierServices } from '@/themes/atelier/components/AtelierServices';

const DEFAULT_SERVICE_TECHS: Record<string, Array<{ name: string; category?: string }>> = {
  'enterprise-software-development': [
    { name: 'TypeScript', category: 'Frontend' },
    { name: 'Next.js', category: 'Frontend' },
    { name: 'Node.js', category: 'Backend' },
    { name: 'PostgreSQL', category: 'Backend' },
  ],
  'cloud-infrastructure-devops': [
    { name: 'Docker', category: 'DevOps & Cloud' },
    { name: 'Node.js', category: 'Backend' },
    { name: 'PostgreSQL', category: 'Backend' },
    { name: 'Next.js', category: 'Frontend' },
  ],
  'web-applications-digital-platforms': [
    { name: 'React', category: 'Frontend' },
    { name: 'Next.js', category: 'Frontend' },
    { name: 'TypeScript', category: 'Frontend' },
    { name: 'Tailwind CSS', category: 'Frontend' },
  ],
  'mobile-application-engineering': [
    { name: 'React', category: 'Frontend' },
    { name: 'TypeScript', category: 'Frontend' },
    { name: 'Node.js', category: 'Backend' },
  ],
  'distributed-apis-realtime-systems': [
    { name: 'Node.js', category: 'Backend' },
    { name: 'Redis', category: 'Backend' },
    { name: 'PostgreSQL', category: 'Backend' },
    { name: 'TypeScript', category: 'Frontend' },
  ],
  'ai-integration-automation': [
    { name: 'Python & AI', category: 'AI & Data' },
    { name: 'Node.js', category: 'Backend' },
    { name: 'TypeScript', category: 'Frontend' },
    { name: 'PostgreSQL', category: 'Backend' },
  ],
};

function renderServiceIcon(iconName: string | undefined, idx: number) {
  switch (iconName?.toLowerCase()) {
    case 'code2':
    case 'code':
      return <Code2 className="w-6 h-6 text-[#00D2FF]" />;
    case 'server':
    case 'cloud':
      return <Server className="w-6 h-6 text-[#0066FF]" />;
    case 'layout':
    case 'web':
      return <Layout className="w-6 h-6 text-[#80B3FF]" />;
    case 'cpu':
    case 'mobile':
      return <Cpu className="w-6 h-6 text-[#00D2FF]" />;
    case 'shieldcheck':
    case 'shield':
    case 'api':
      return <ShieldCheck className="w-6 h-6 text-[#0066FF]" />;
    case 'zap':
    case 'ai':
      return <Zap className="w-6 h-6 text-amber-400" />;
    default: {
      const icons = [Code2, Server, Layout, Cpu, ShieldCheck, Zap];
      const Icon = icons[idx % icons.length];
      return <Icon className="w-6 h-6 text-[#00D2FF]" />;
    }
  }
}

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export async function generateMetadata(): Promise<Metadata> {
  return DataStore.getSEO('/services');
}

export default async function ServicesPage({
  searchParams,
}: {
  searchParams?: Promise<Record<string, string | string[] | undefined>>;
}) {
  const resolvedParams = searchParams ? await searchParams : undefined;
  const { themeId } = await resolveActiveTheme(resolvedParams);

  const [services, technologies] = await Promise.all([
    DataStore.getServices(),
    DataStore.getTechnologies(),
  ]);

  if (themeId === 'nexus') {
    return <NexusServices services={services} technologies={technologies} isStandalone={true} />;
  }

  if (themeId === 'atelier') {
    return <AtelierServices services={services} technologies={technologies} isStandalone={true} />;
  }

  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://gmdware.com';
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    name: 'GMDware Enterprise Software Services',
    description: 'Disciplined full-stack engineering disciplines and architectural deliverables.',
    itemListElement: services.map((service, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      item: {
        '@type': 'Service',
        name: service.title || (service as any).name,
        description:
          (service as any).description ||
          (service as any).content ||
          service.summary ||
          (service as any).shortDescription,
        provider: {
          '@type': 'Organization',
          name: 'GMDware',
          url: siteUrl,
        },
        url: `${siteUrl}/services#${service.slug}`,
      },
    })),
  };

  return (
    <div className="py-16 space-y-24 bg-[#05080F]">
      <JsonLd data={jsonLd} />
      <Container size="wide">
        {/* Editorial Header */}
        <div className="max-w-3xl space-y-4 mb-16">
          <h1 className="text-4xl sm:text-6xl font-extrabold text-white font-display tracking-tight leading-tight">
            Software Engineering & Digital Services
          </h1>

          <p className="text-base sm:text-lg text-[#94A3B8] leading-relaxed font-sans max-w-2xl">
            From end-to-end web applications and cloud architecture to custom digital platforms, we engineer reliable, high-performance software tailored to your business goals.
          </p>
        </div>

        {/* Detailed Services Dossier or Empty State */}
        {services.length === 0 ? (
          <div className="gmd-panel rounded-2xl p-12 sm:p-16 border border-white/10 text-center space-y-6 max-w-2xl mx-auto">
            <div className="w-16 h-16 rounded-2xl bg-[#080D18] border border-white/10 mx-auto flex items-center justify-center text-[#0066FF]">
              <Server className="w-8 h-8 text-[#00D2FF]" />
            </div>
            <div className="space-y-2">
              <h3 className="text-2xl font-bold text-white font-display">
                Services & Offerings
              </h3>
              <p className="text-sm text-[#94A3B8] leading-relaxed max-w-md mx-auto font-sans">
                We build bespoke web platforms, scalable backend architectures, and modern digital applications. Contact our team directly to discuss your project.
              </p>
            </div>
            <div className="pt-2">
              <Link href="/contact">
                <Button variant="primary" size="md" rightIcon={<ArrowUpRight className="w-4 h-4" />}>
                  Get in Touch
                </Button>
              </Link>
            </div>
          </div>
        ) : (
          <div className="space-y-16">
            {services.map((service, idx) => {
              const s = service as any;
              const serviceTechs = (s.technologies && s.technologies.length > 0)
                ? s.technologies.map((t: any) => t.technology || t).filter(Boolean)
                : (DEFAULT_SERVICE_TECHS[service.slug] || [
                    { name: 'TypeScript', category: 'Frontend' },
                    { name: 'Node.js', category: 'Backend' },
                    { name: 'PostgreSQL', category: 'Backend' },
                  ]);

              return (
                <article
                  key={service.id || idx}
                  id={service.slug}
                  className="gmd-panel rounded-2xl p-6 sm:p-10 lg:p-12 border border-white/10 hover:border-[#0066FF]/50 transition-all scroll-mt-28 space-y-8"
                >
                  <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
                    {/* Left Column: Service Profile (5 Cols) */}
                    <div className="lg:col-span-5 space-y-6">
                      <div className="flex items-center justify-between">
                        <div className="w-12 h-12 rounded-xl bg-[#080D18] border border-white/10 flex items-center justify-center">
                          {renderServiceIcon(service.iconName || undefined, idx)}
                        </div>
                        <span className="font-mono text-xs text-[#64748B]">
                          SERVICE {String(idx + 1).padStart(2, '0')}
                        </span>
                      </div>

                      <h2 className="text-2xl sm:text-3xl font-extrabold text-white font-display tracking-tight">
                        {service.title || (service as any).name}
                      </h2>

                      <p className="text-sm sm:text-base text-[#94A3B8] leading-relaxed font-sans">
                        {(service as any).description ||
                          (service as any).content ||
                          service.summary ||
                          (service as any).shortDescription}
                      </p>

                      <div className="pt-2">
                        <Link href="/contact">
                          <Button variant="primary" size="md" rightIcon={<ArrowUpRight className="w-4 h-4" />}>
                            Get Started with {service.title || (service as any).name}
                          </Button>
                        </Link>
                      </div>
                    </div>

                    {/* Right Column: Key Capabilities + Technologies Used (7 Cols) */}
                    <div className="lg:col-span-7 space-y-6">
                      {/* 1. Key Capabilities & Deliverables */}
                      <div className="space-y-3">
                        <h3 className="text-xs uppercase tracking-wider text-[#00D2FF] font-semibold flex items-center gap-2">
                          <span className="w-1.5 h-1.5 rounded-full bg-[#00D2FF]" />
                          <span>Key Capabilities &amp; Deliverables</span>
                        </h3>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                          {service.features &&
                            service.features.map((feat: any, fIdx: number) => (
                              <div
                                key={fIdx}
                                className="p-4 rounded-xl bg-[#080D18] border border-white/[0.06] space-y-1.5 hover:border-[#0066FF]/40 transition-colors"
                              >
                                <div className="flex items-center gap-2 text-white text-sm font-semibold">
                                  <CheckCircle2 className="w-4 h-4 text-[#00D2FF] shrink-0" />
                                  <span>{feat.title || feat.name}</span>
                                </div>
                                {feat.description && (
                                  <p className="text-xs text-[#94A3B8] leading-relaxed pl-6 font-sans">
                                    {feat.description}
                                  </p>
                                )}
                              </div>
                            ))}
                        </div>
                      </div>

                      {/* 2. Technologies & Stack Used */}
                      {serviceTechs.length > 0 && (
                        <div className="pt-4 border-t border-white/[0.08] space-y-3">
                          <h4 className="text-xs uppercase tracking-wider text-slate-400 font-semibold flex items-center gap-2">
                            <span className="w-1.5 h-1.5 rounded-full bg-[#0066FF]" />
                            <span>Technologies &amp; Frameworks</span>
                          </h4>

                          <div className="flex flex-wrap gap-2">
                            {serviceTechs.map((tech: any, tIdx: number) => {
                              const name = tech.name || tech.title || String(tech);
                              const category = tech.category || null;
                              return (
                                <span
                                  key={tIdx}
                                  className="px-3 py-1.5 rounded-xl bg-[#080D18] border border-white/10 hover:border-[#00D2FF]/40 text-xs font-mono text-slate-200 flex items-center gap-2 transition-colors shadow-sm"
                                >
                                  <span className="w-1.5 h-1.5 rounded-full bg-[#00D2FF]" />
                                  <span className="font-medium text-white">{name}</span>
                                  {category && (
                                    <span className="text-[10px] text-slate-400 font-sans border-l border-white/15 pl-2">
                                      {category}
                                    </span>
                                  )}
                                </span>
                              );
                            })}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </article>
              );
            })}
          </div>
        )}
      </Container>

      {/* Cross-Cutting Technology Graph */}
      <Container size="wide">
        <SectionHeading
          tag="TECH STACK"
          title="Our Technology Stack"
          subtitle="Battle-tested technologies, modern frameworks, and robust tools we leverage to build scalable, high-performance applications."
        />

        <TechnologyGraph technologies={technologies} />
      </Container>

      {/* Conversion Banner */}
      <Container size="wide">
        <CallToAction
          headline="Have a Project in Mind?"
          subtitle="Talk directly with our engineering team to discuss your technical requirements, architecture, and timeline."
        />
      </Container>
    </div>
  );
}
