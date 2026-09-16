import React from 'react';
import Link from 'next/link';
import type { Metadata } from 'next';
import DataStore from '@/lib/db/data-store';
import { Container } from '@/components/ui/Container';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { CallToAction } from '@/components/public/CallToAction';
import { ArrowUpRight, Layers } from 'lucide-react';
import { FeaturedProjectsShowcase } from '@/components/public/FeaturedProjectsShowcase';

import { resolveActiveTheme } from '@/lib/theme/resolver';
import { NexusWork } from '@/themes/nexus/components/NexusWork';
import { AtelierWork } from '@/themes/atelier/components/AtelierWork';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export async function generateMetadata(): Promise<Metadata> {
  return DataStore.getSEO('/work');
}

export default async function WorkPage({
  searchParams,
}: {
  searchParams: Promise<{ category?: string; themePreview?: string }>;
}) {
  const resolvedParams = await searchParams;
  const activeCategorySlug = resolvedParams?.category;
  const { themeId } = await resolveActiveTheme(resolvedParams as any);

  const [projects, categories] = await Promise.all([
    DataStore.getProjects(),
    DataStore.getProjectCategories(),
  ]);

  const filteredProjects = activeCategorySlug
    ? projects.filter(
        (p: any) =>
          p.category?.slug?.toLowerCase() === activeCategorySlug.toLowerCase() ||
          p.categorySlug?.toLowerCase() === activeCategorySlug.toLowerCase()
      )
    : projects;

  if (themeId === 'nexus') {
    return (
      <NexusWork
        projects={filteredProjects}
        categories={categories}
        activeCategory={activeCategorySlug}
        isStandalone={true}
      />
    );
  }

  if (themeId === 'atelier') {
    return (
      <AtelierWork
        projects={filteredProjects}
        categories={categories}
        activeCategory={activeCategorySlug}
        isStandalone={true}
      />
    );
  }

  const formattedFilteredProjects = filteredProjects.map((p: any) => ({
    id: p.id,
    title: p.title,
    slug: p.slug,
    shortDescription: p.shortDescription || p.fullDescription || '',
    fullDescription: p.fullDescription,
    clientName: p.clientName,
    projectType: p.projectType || 'Software System',
    heroImageUrl: p.heroImage?.url || p.heroImageUrl,
    challenge: p.challenge,
    strategy: p.strategy,
    architecture: p.architecture,
    results: p.results,
    technologies: (p.technologies || []).map((t: any) => ({
      name: typeof t === 'string' ? t : t.technology?.name || t.name,
    })),
    isFeatured: p.isFeatured,
  }));

  return (
    <div className="py-20 space-y-24 bg-[#05080F]">
      <Container size="wide">
        {/* Editorial Work Header */}
        <div className="max-w-4xl space-y-4 mb-14">
          <h1 className="text-4xl sm:text-6xl md:text-7xl font-extrabold text-white font-display tracking-tight leading-[1.08]">
            Our Work & Case Studies
          </h1>

          <p className="text-base sm:text-xl text-[#94A3B8] leading-relaxed font-sans max-w-3xl">
            Explore our portfolio of high-performance web applications, digital platforms, and custom software solutions built for ambitious organizations.
          </p>
        </div>

        {/* Category Filter Pills */}
        <div className="flex flex-wrap items-center gap-2 border-b border-white/[0.08] pb-6 mb-14">
          <Link href="/work">
            <Badge
              variant={!activeCategorySlug ? 'cobalt' : 'neutral'}
              className="cursor-pointer transition-all hover:border-[#0066FF]/50 px-3.5 py-1 text-xs"
            >
              All Projects ({projects.length})
            </Badge>
          </Link>
          {categories.map((cat: any) => {
            const isSelected = activeCategorySlug === cat.slug;
            return (
              <Link key={cat.id} href={`/work?category=${cat.slug}`}>
                <Badge
                  variant={isSelected ? 'cobalt' : 'neutral'}
                  className="cursor-pointer transition-all hover:border-[#0066FF]/50 px-3.5 py-1 text-xs"
                >
                  {cat.name}
                </Badge>
              </Link>
            );
          })}
        </div>

        {/* Projects Showcase Grid or Empty State */}
        {filteredProjects.length === 0 ? (
          <div className="gmd-panel rounded-2xl p-12 sm:p-16 border border-white/10 text-center space-y-6 max-w-2xl mx-auto">
            <div className="w-16 h-16 rounded-2xl bg-[#080D18] border border-white/10 mx-auto flex items-center justify-center text-[#0066FF]">
              <Layers className="w-8 h-8 text-[#00D2FF]" />
            </div>
            <div className="space-y-2">
              <h3 className="text-2xl font-bold text-white font-display">
                {activeCategorySlug
                  ? `No Projects Found in "${activeCategorySlug}"`
                  : 'No Public Projects Currently Listed'}
              </h3>
              <p className="text-sm text-[#94A3B8] leading-relaxed max-w-md mx-auto font-sans">
                Case studies are actively being published. Contact our team directly to explore relevant project examples and demos.
              </p>
            </div>
            <div className="pt-2">
              <Link href="/contact">
                <Button variant="primary" size="md" rightIcon={<ArrowUpRight className="w-4 h-4" />}>
                  Contact Our Team
                </Button>
              </Link>
            </div>
          </div>
        ) : (
          <FeaturedProjectsShowcase projects={formattedFilteredProjects} />
        )}
      </Container>

      {/* Conversion Terminal */}
      <Container size="wide">
        <CallToAction
          headline="Have an Ambitious Engineering Requirement?"
          subtitle="Our engineering leadership is prepared to evaluate your architectural constraints and produce an execution blueprint."
          buttonLabel="Schedule Technical Discovery"
          buttonUrl="/contact"
        />
      </Container>
    </div>
  );
}
