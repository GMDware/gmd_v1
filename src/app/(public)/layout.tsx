import React from 'react';
import { Header } from '@/components/public/Header';
import { Footer } from '@/components/public/Footer';
import { CursorProvider } from '@/components/motion/CursorProvider';
import { PageTransition } from '@/components/motion/PageTransition';
import { JsonLd } from '@/components/public/JsonLd';
import DataStore from '@/lib/db/data-store';
import { resolveActiveTheme } from '@/lib/theme/resolver';
import { ThemeProvider } from '@/components/theme/ThemeProvider';
import { ThemePreviewBanner } from '@/components/theme/ThemePreviewBanner';
import { NexusHeader } from '@/themes/nexus/components/NexusHeader';
import { NexusFooter } from '@/themes/nexus/components/NexusFooter';
import { AtelierHeader } from '@/themes/atelier/components/AtelierHeader';
import { AtelierFooter } from '@/themes/atelier/components/AtelierFooter';
import { AtelierPageTransition } from '@/themes/atelier/components/AtelierPageTransition';

import { headers } from 'next/headers';
import { MetricsService } from '@/services/metrics.service';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export default async function PublicLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // Concurrency-safe anonymous visitor session tracking
  try {
    const headerStore = await headers();
    if (headerStore.get('x-new-visitor-session') === '1') {
      MetricsService.recordVisitorSession(headerStore.get('user-agent')).catch(() => {});
    }
  } catch {
    // Graceful fallback
  }

  const [navItems, settings, socialLinks, themeState] = await Promise.all([
    DataStore.getNavigation('header'),
    DataStore.getSettings(),
    DataStore.getSocialLinks(),
    resolveActiveTheme(),
  ]);

  const { themeId, isPreview, persistedThemeId } = themeState;
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://gmdware.com';
  const brandName = settings.brand_name || 'GMDware';

  const organizationSchema = {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: brandName,
    url: baseUrl,
    logo: `${baseUrl}/og-image.png`,
    description:
      settings.mission_statement ||
      settings.tagline ||
      'Architecting High-Performance Digital Solutions & Enterprise Software',
    sameAs: socialLinks.map((s: any) => s.url).filter(Boolean),
    contactPoint: {
      '@type': 'ContactPoint',
      email: settings.contact_email || 'inquiries@gmdware.com',
      contactType: 'technical consultations',
    },
  };

  const websiteSchema = {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: brandName,
    url: baseUrl,
    potentialAction: {
      '@type': 'SearchAction',
      target: `${baseUrl}/work?search={search_term_string}`,
      'query-input': 'required name=search_term_string',
    },
  };

  return (
    <ThemeProvider themeId={themeId} isPreview={isPreview}>
      {/* Floating Preview Controller Bar if preview active */}
      {isPreview && (
        <ThemePreviewBanner themeId={themeId} persistedThemeId={persistedThemeId} />
      )}

      {/* Accessible Skip to Main Content Link */}
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-50 focus:px-4 focus:py-2 focus:bg-[#0066FF] focus:text-white focus:rounded-lg focus:shadow-xl focus:font-mono focus:text-xs focus:ring-2 focus:ring-[#00D2FF]"
      >
        Skip to main content
      </a>

      {/* Global Structured Data */}
      <JsonLd data={organizationSchema} />
      <JsonLd data={websiteSchema} />

      {/* Theme-Specific Layout Wrapper */}
      {themeId === 'nexus' ? (
        <div data-theme="nexus" className={`flex min-h-screen flex-col bg-[#030509] text-slate-100 selection:bg-[#00F2FE] selection:text-black overflow-x-hidden ${isPreview ? 'pt-10' : ''}`}>
          <NexusHeader navItems={navItems} brandName={settings.brand_name} />
          <main id="main-content" className="flex-1 focus:outline-none" tabIndex={-1}>
            {children}
          </main>
          <NexusFooter settings={settings} socialLinks={socialLinks} />
        </div>
      ) : themeId === 'atelier' ? (
        <div data-theme="atelier" className={`flex min-h-screen flex-col bg-[#FBFBFA] text-[#0B0F19] selection:bg-[#2563EB] selection:text-white overflow-x-hidden ${isPreview ? 'pt-10' : ''}`}>
          <AtelierHeader navItems={navItems} brandName={settings.brand_name} />
          <main id="main-content" className="flex-1 pt-16 focus:outline-none" tabIndex={-1}>
            <AtelierPageTransition>{children}</AtelierPageTransition>
          </main>
          <AtelierFooter settings={settings} socialLinks={socialLinks} />
        </div>
      ) : (
        /* THEME 01: SYSTEMS (Original Flagship Preserved 100%) */
        <CursorProvider>
          <div data-theme="systems" className={`flex min-h-screen flex-col bg-[#05070B] text-slate-100 selection:bg-[#0066FF] selection:text-white overflow-x-hidden ${isPreview ? 'pt-10' : ''}`}>
            <Header navItems={navItems} brandName={settings.brand_name} />
            <main id="main-content" className="flex-1 pt-20 focus:outline-none" tabIndex={-1}>
              <PageTransition>{children}</PageTransition>
            </main>
            <Footer
              settings={settings}
              socialLinks={socialLinks}
              navItems={navItems}
            />
          </div>
        </CursorProvider>
      )}
    </ThemeProvider>
  );
}
