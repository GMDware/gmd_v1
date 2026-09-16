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
import { ArrowUpRight, CheckCircle2, Code2, Server, Layout, ShieldCheck, Cpu } from 'lucide-react';

import { resolveActiveTheme } from '@/lib/theme/resolver';
import { NexusServices } from '@/themes/nexus/components/NexusServices';
import { AtelierServices } from '@/themes/atelier/components/AtelierServices';

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
            {services.map((service, idx) => (
              <article
                key={service.id || idx}
                id={service.slug}
                className="gmd-panel rounded-2xl p-6 sm:p-10 lg:p-12 border border-white/10 hover:border-[#0066FF]/50 transition-all scroll-mt-28 space-y-8"
              >
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
                  {/* Left Column: Service Profile (5 Cols) */}
                  <div className="lg:col-span-5 space-y-6">
                    <div className="flex items-center justify-between">
                      <div className="w-12 h-12 rounded-xl bg-[#080D18] border border-white/10 flex items-center justify-center text-[#00D2FF]">
                        {idx === 0 ? (
                          <Code2 className="w-6 h-6 text-[#00D2FF]" />
                        ) : idx === 1 ? (
                          <Server className="w-6 h-6 text-[#0066FF]" />
                        ) : (
                          <Layout className="w-6 h-6 text-[#80B3FF]" />
                        )}
                      </div>
                      <span className="font-mono text-xs text-[#64748B]">
                        SERVICE 0{idx + 1}
                      </span>
                    </div>

                    <h2 className="text-2xl sm:text-3xl font-extrabold text-white font-display tracking-tight">
                      {service.title || (service as any).name}
                    </h2>

                    <p className="text-sm sm:text-base text-[#94A3B8] leading-relaxed font-sans">
                      {(service as any).description || (service as any).content || service.summary || (service as any).shortDescription}
                    </p>

                    <div className="pt-2">
                      <Link href="/contact">
                        <Button variant="primary" size="md" rightIcon={<ArrowUpRight className="w-4 h-4" />}>
                          Get Started with {service.title || (service as any).name}
                        </Button>
                      </Link>
                    </div>
                  </div>

                  {/* Right Column: Key Deliverables (7 Cols) */}
                  <div className="lg:col-span-7 space-y-6">
                    <h3 className="text-xs uppercase tracking-wider text-[#00D2FF] font-semibold">
                      Key Capabilities & Deliverables
                    </h3>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      {service.features && service.features.map((feat: any, fIdx: number) => (
                        <div
                          key={fIdx}
                          className="p-5 rounded-xl bg-[#080D18] border border-white/[0.06] space-y-2 hover:border-[#0066FF]/40 transition-colors"
                        >
                          <div className="flex items-center gap-2 text-white text-sm font-semibold">
                            <CheckCircle2 className="w-4 h-4 text-[#0066FF] shrink-0" />
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
                </div>
              </article>
            ))}
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
