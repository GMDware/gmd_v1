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
import { ArrowUpRight, Server } from 'lucide-react';

import { resolveActiveTheme } from '@/lib/theme/resolver';
import { NexusServices } from '@/themes/nexus/components/NexusServices';
import { AtelierServices } from '@/themes/atelier/components/AtelierServices';
import { FeaturedServicesShowcase } from '@/components/public/FeaturedServicesShowcase';

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
          <FeaturedServicesShowcase
            services={services as any}
            defaultTechsMap={DEFAULT_SERVICE_TECHS}
          />
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
