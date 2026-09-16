import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import DataStore from '@/lib/db/data-store';
import { Container } from '@/components/ui/Container';
import { Badge } from '@/components/ui/Badge';
import { CallToAction } from '@/components/public/CallToAction';
import { JsonLd } from '@/components/public/JsonLd';
import { formatDate } from '@/lib/utils';
import { ArrowLeft, Clock, Calendar, User, Tag, BookOpen, Share2 } from 'lucide-react';

import { resolveActiveTheme } from '@/lib/theme/resolver';
import { NexusInsightArticle } from '@/themes/nexus/components/NexusInsightArticle';
import { AtelierInsightArticle } from '@/themes/atelier/components/AtelierInsightArticle';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

interface InsightPageProps {
  params: Promise<{ slug: string }>;
  searchParams?: Promise<Record<string, string | string[] | undefined>>;
}

export async function generateMetadata({ params }: InsightPageProps): Promise<Metadata> {
  const { slug } = await params;
  const article = await DataStore.getInsightBySlug(slug);

  if (!article) {
    return {
      title: 'Technical Essay Not Found | GMDware',
    };
  }

  const title = `${article.title} | GMDware Engineering Insights`;
  const description = article.summary || 'Technical perspectives and architectural essays by GMDware engineering leadership.';
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://gmdware.com';
  const canonical = `${siteUrl}/insights/${slug}`;
  const coverUrl = (article as any).coverImage?.url;

  return {
    title,
    description,
    keywords: article.tags || ['Systems Architecture', 'Distributed Systems', 'Software Engineering'],
    alternates: {
      canonical,
    },
    openGraph: {
      title,
      description,
      url: canonical,
      type: 'article',
      publishedTime: article.publishedAt ? new Date(article.publishedAt).toISOString() : undefined,
      images: coverUrl ? [{ url: coverUrl }] : [{ url: '/og-image.png' }],
      siteName: 'GMDware',
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: coverUrl ? [coverUrl] : undefined,
    },
  };
}

export default async function InsightDetailPage({ params, searchParams }: InsightPageProps) {
  const { slug } = await params;
  const resolvedParams = searchParams ? await searchParams : undefined;
  const { themeId } = await resolveActiveTheme(resolvedParams);
  const article = await DataStore.getInsightBySlug(slug);

  if (!article) {
    notFound();
  }

  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://gmdware.com';
  const coverUrl = (article as any).coverImage?.url;
  const authorName = (article as any).author?.name || 'GMDware Engineering Leadership';

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'TechArticle',
    headline: article.title,
    description: article.summary,
    image: coverUrl ? [coverUrl] : undefined,
    datePublished: article.publishedAt ? new Date(article.publishedAt).toISOString() : undefined,
    dateModified: (article as any).updatedAt ? new Date((article as any).updatedAt).toISOString() : undefined,
    author: {
      '@type': 'Person',
      name: authorName,
    },
    publisher: {
      '@type': 'Organization',
      name: 'GMDware',
      url: siteUrl,
      logo: {
        '@type': 'ImageObject',
        url: `${siteUrl}/og-image.png`,
      },
    },
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': `${siteUrl}/insights/${slug}`,
    },
  };

  if (themeId === 'nexus') {
    return (
      <>
        <JsonLd data={jsonLd} />
        <NexusInsightArticle insight={article} />
      </>
    );
  }

  if (themeId === 'atelier') {
    return (
      <>
        <JsonLd data={jsonLd} />
        <AtelierInsightArticle insight={article} />
      </>
    );
  }

  return (
    <div className="py-16 space-y-20 bg-[#05080F]">
      <JsonLd data={jsonLd} />

      <Container size="narrow">
        {/* Navigation Breadcrumb */}
        <div className="flex items-center justify-between border-b border-white/[0.08] pb-6 mb-12">
          <Link
            href="/insights"
            className="inline-flex items-center gap-2 text-xs font-mono text-[#94A3B8] hover:text-[#00D2FF] transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>RETURN TO INSIGHTS DIRECTORY</span>
          </Link>

          <div className="flex items-center gap-2 font-mono text-xs text-[#64748B]">
            <span>ESSAY_UID:</span>
            <span className="text-[#00D2FF] font-semibold">{slug}</span>
          </div>
        </div>

        {/* Article Header */}
        <article className="space-y-10">
          <div className="space-y-6">
            <div className="flex flex-wrap items-center gap-3">
              <span className="w-2 h-2 rounded-full bg-[#0066FF] animate-pulse" />
              <Badge variant="cobalt">
                {(article as any).category?.name || 'Systems Architecture'}
              </Badge>
              <div className="flex items-center gap-1.5 text-xs font-mono text-[#94A3B8]">
                <Clock className="w-3.5 h-3.5 text-[#00D2FF]" />
                <span>{article.readTimeMin || 5} MIN READ</span>
              </div>
            </div>

            <h1 className="text-3xl sm:text-5xl md:text-6xl font-black text-white font-display tracking-tight leading-[1.08]">
              {article.title}
            </h1>

            {/* Author and Date Meta Rail */}
            <div className="flex flex-wrap items-center justify-between gap-4 py-4 border-y border-white/[0.08] text-xs font-mono text-[#94A3B8]">
              <div className="flex items-center gap-2">
                <User className="w-4 h-4 text-[#0066FF]" />
                <span className="text-white font-semibold">{authorName}</span>
              </div>

              {article.publishedAt && (
                <div className="flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-[#64748B]" />
                  <span>{formatDate(article.publishedAt)}</span>
                </div>
              )}
            </div>
          </div>

          {/* Optional Hero Cover Image */}
          {coverUrl && (
            <div className="relative aspect-[21/9] rounded-2xl overflow-hidden border border-white/10 bg-[#080D18] shadow-2xl">
              <Image
                src={coverUrl}
                alt={article.title}
                fill
                priority
                sizes="(max-width: 1024px) 100vw, 800px"
                className="object-cover"
              />
            </div>
          )}

          {/* Executive Summary Callout */}
          <div className="gmd-panel rounded-xl p-6 sm:p-8 border-l-4 border-l-[#0066FF] bg-[#070D1A] space-y-2">
            <span className="font-mono text-[10px] tracking-[0.2em] uppercase text-[#00D2FF] font-semibold block">
              // ARCHITECTURAL ABSTRACT & THESIS
            </span>
            <p className="text-base sm:text-lg text-white font-sans leading-relaxed italic">
              &ldquo;{article.summary}&rdquo;
            </p>
          </div>

          {/* Main Essay Body */}
          <div className="prose prose-invert max-w-none space-y-6 text-[#CBD5E1] text-base sm:text-lg leading-relaxed font-sans pt-4 whitespace-pre-line">
            {article.content}
          </div>

          {/* Tag Taxonomy */}
          {article.tags && article.tags.length > 0 && (
            <div className="pt-8 border-t border-white/[0.08] space-y-3">
              <div className="flex items-center gap-2 font-mono text-xs text-[#64748B] uppercase tracking-wider">
                <Tag className="w-3.5 h-3.5 text-[#0066FF]" />
                <span>INDEXED TAXONOMIES</span>
              </div>
              <div className="flex flex-wrap gap-2">
                {article.tags.map((tag: string) => (
                  <span
                    key={tag}
                    className="px-3 py-1.5 rounded-lg bg-[#080D18] border border-white/10 font-mono text-xs text-white"
                  >
                    #{tag}
                  </span>
                ))}
              </div>
            </div>
          )}
        </article>
      </Container>

      {/* Conversion Banner */}
      <Container size="wide">
        <CallToAction
          headline="Have an Engineering Challenge in This Domain?"
          subtitle="Directly consult with our systems architects to evaluate technical trade-offs, scalability thresholds, and implementation blueprints."
          buttonLabel="Consult on Systems Architecture"
          buttonUrl="/contact"
        />
      </Container>
    </div>
  );
}
