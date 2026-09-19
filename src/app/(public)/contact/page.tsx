import React from 'react';
import DataStore from '@/lib/db/data-store';
import { Container } from '@/components/ui/Container';
import { Badge } from '@/components/ui/Badge';
import { ContactForm } from '@/components/public/ContactForm';
import { Mail, MapPin, ShieldCheck, Terminal, Clock, Lock, ArrowUpRight } from 'lucide-react';
import { SocialIcon } from '@/components/public/SocialIcons';

import type { Metadata } from 'next';

import { resolveActiveTheme } from '@/lib/theme/resolver';
import { NexusContact } from '@/themes/nexus/components/NexusContact';
import { AtelierContact } from '@/themes/atelier/components/AtelierContact';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export async function generateMetadata(): Promise<Metadata> {
  return DataStore.getSEO('/contact');
}

export default async function ContactPage({
  searchParams,
}: {
  searchParams?: Promise<Record<string, string | string[] | undefined>>;
}) {
  const resolvedParams = searchParams ? await searchParams : undefined;
  const { themeId } = await resolveActiveTheme(resolvedParams);

  if (themeId === 'nexus') {
    return <NexusContact isStandalone={true} />;
  }

  if (themeId === 'atelier') {
    return <AtelierContact isStandalone={true} />;
  }

  const [settings, socialLinks] = await Promise.all([
    DataStore.getSettings(),
    DataStore.getSocialLinks(),
  ]);

  const contactEmail = settings.contact_email || 'gmdware@gmail.com';
  const location = settings.office_location || 'Distributed Engineering Team';

  return (
    <div className="py-16 space-y-20 bg-[#05080F]">
      <Container size="wide">
        {/* Header */}
        <div className="max-w-3xl space-y-4 mb-14">
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-white font-display tracking-tight leading-[1.1]">
            Let&apos;s Build Something Great Together
          </h1>

          <p className="text-base sm:text-lg text-[#94A3B8] leading-relaxed font-sans max-w-2xl">
            Have a project in mind, need software engineering expertise, or want to discuss a new product? Send us a message and our team will get back to you promptly.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
          {/* Contact Form Column (7 Cols) */}
          <div className="lg:col-span-7 gmd-panel rounded-2xl p-6 sm:p-10 border border-white/10">
            <ContactForm />
          </div>

          {/* Contact Metadata & Info (5 Cols) */}
          <div className="lg:col-span-5 space-y-6">
            <div className="gmd-panel rounded-xl p-6 space-y-5">
              <h3 className="text-sm uppercase tracking-wider text-white font-semibold flex items-center gap-2">
                <Mail className="w-4 h-4 text-[#0066FF]" />
                <span>Direct Contact</span>
              </h3>

              <div className="space-y-4 text-sm">
                <div className="flex items-start gap-3">
                  <Mail className="w-4 h-4 text-[#00D2FF] shrink-0 mt-1" />
                  <div>
                    <div className="text-[11px] text-[#64748B] uppercase font-medium">Email Address</div>
                    <a
                      href={`mailto:${contactEmail}`}
                      className="text-white hover:text-[#00D2FF] text-sm transition-colors font-medium"
                    >
                      {contactEmail}
                    </a>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <MapPin className="w-4 h-4 text-[#80B3FF] shrink-0 mt-1" />
                  <div>
                    <div className="text-[11px] text-[#64748B] uppercase font-medium">Location</div>
                    <div className="text-slate-300 text-sm font-sans">{location}</div>
                  </div>
                </div>

                {/* Official Social Media Channels */}
                <div className="pt-3 border-t border-white/5 space-y-2">
                  <div className="text-[11px] text-[#64748B] uppercase font-medium">Social Channels</div>
                  <div className="flex flex-wrap items-center gap-2">
                    {socialLinks.map((link) => (
                      <a
                        key={link.platform}
                        href={link.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        aria-label={`Official ${link.platform}`}
                        className="p-2 rounded-lg bg-[#080D18] border border-white/10 text-slate-400 hover:text-[#00D2FF] hover:border-[#0066FF]/40 transition-colors"
                        title={link.platform}
                      >
                        <SocialIcon platform={link.platform} className="w-4 h-4" />
                      </a>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            <div className="gmd-panel rounded-xl p-6 space-y-3 border-l-2 border-l-[#0066FF]">
              <div className="flex items-center gap-2 text-white text-sm font-semibold">
                <ShieldCheck className="w-4 h-4 text-[#10B981]" />
                <span>Strict Confidentiality & NDA</span>
              </div>
              <p className="text-xs text-[#94A3B8] leading-relaxed font-sans">
                Every project inquiry is treated with complete confidentiality. Non-disclosure agreements (NDAs) are available upon request before reviewing any sensitive details.
              </p>
            </div>

            <div className="p-6 rounded-xl bg-[#080D18] border border-white/[0.06] space-y-2">
              <div className="flex items-center justify-between text-xs text-[#64748B]">
                <span className="flex items-center gap-1.5 text-slate-400 font-medium">
                  <Clock className="w-3.5 h-3.5 text-[#00D2FF]" />
                  <span>Response Time</span>
                </span>
                <span className="text-[#10B981] font-medium font-mono">Within 24 Hours</span>
              </div>
              <div className="text-base font-bold text-white tracking-tight font-display">
                Fast & Direct Response
              </div>
              <p className="text-xs text-[#94A3B8] font-sans leading-relaxed">
                Inquiries are reviewed directly by our engineering leadership team.
              </p>
            </div>
          </div>
        </div>
      </Container>
    </div>
  );
}
