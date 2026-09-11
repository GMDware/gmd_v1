'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { GMDwareLogo } from '@/components/ui/GMDwareLogo';
import { ArrowUpRight, Terminal, Mail, Copy, Check } from 'lucide-react';
import { SocialIcon } from '@/components/public/SocialIcons';

interface FooterProps {
  settings: Record<string, string>;
  socialLinks: Array<{ platform: string; url: string }>;
  navItems: Array<{ label: string; path: string }>;
}

export const Footer: React.FC<FooterProps> = ({ settings, socialLinks, navItems }) => {
  const currentYear = new Date().getFullYear();
  const tagline = settings.tagline || 'From Idea to Digital Product.';
  const contactEmail = settings.contact_email || 'gmdware@gmail.com';

  const [timeUtc3, setTimeUtc3] = useState('');
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setTimeUtc3(
        now.toLocaleTimeString('en-GB', {
          timeZone: 'Asia/Riyadh',
          hour: '2-digit',
          minute: '2-digit',
          second: '2-digit',
        }) + ' UTC+3'
      );
    };
    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  const scrollToTop = () => {
    if (typeof window !== 'undefined') {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handleCopyEmail = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (typeof navigator !== 'undefined' && navigator.clipboard) {
      navigator.clipboard.writeText(contactEmail);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  // Architecture directory navigation items
  const architectureLinks = [
    { label: 'Services', path: '/services' },
    { label: 'Work', path: '/work' },
    { label: 'Process', path: '/process' },
    { label: 'About', path: '/about' },
    { label: 'Insights', path: '/insights' },
    { label: 'Contact', path: '/contact' },
  ];

  // Platform & ecosystem items (retains /guide, /guide/developers, /guide/admin for full documentation coverage)
  const platformLinks = [
    { label: 'User Guide', path: '/guide' },
    { label: 'Developer Docs', path: '/guide/developers' },
    { label: 'Admin Guide', path: '/guide/admin' },
    { label: 'Admin Portal', path: '/admin/login' },
    { label: 'Changelog', path: '/guide/developers#changelog' },
  ];

  // Consolidate social links ensuring GitHub, LinkedIn, X/Twitter, Discord, Instagram, Facebook, TikTok are present
  const platformsInProps = new Set(socialLinks.map((s) => s.platform.toLowerCase()));

  const allSocials = [
    ...socialLinks,
    ...(!platformsInProps.has('x') && !platformsInProps.has('twitter')
      ? [{ platform: 'X', url: 'https://x.com/gmdware' }]
      : []),
    ...(!platformsInProps.has('discord')
      ? [{ platform: 'Discord', url: 'https://discord.gg/gmdware' }]
      : []),
  ];

  const priorityOrder: Record<string, number> = {
    github: 1,
    linkedin: 2,
    x: 3,
    twitter: 3,
    discord: 4,
    instagram: 5,
    facebook: 6,
    tiktok: 7,
  };

  const sortedSocials = [...allSocials].sort((a, b) => {
    const pA = priorityOrder[a.platform.toLowerCase()] || 99;
    const pB = priorityOrder[b.platform.toLowerCase()] || 99;
    return pA - pB;
  });

  return (
    <footer className="border-t border-white/[0.08] bg-[#050811] relative overflow-hidden pt-16 pb-12 text-slate-400 select-none">
      {/* Background Radial Gradient Glow */}
      <div
        className="absolute inset-0 pointer-events-none bg-[radial-gradient(ellipse_80%_80%_at_50%_-20%,rgba(56,189,248,0.06),rgba(255,255,255,0))]"
        aria-hidden="true"
      />

      {/* Subtle Monolithic Background Watermark */}
      <div
        className="absolute -bottom-16 -right-12 text-[16vw] font-display font-black text-white/[0.015] tracking-tighter leading-none pointer-events-none select-none"
        aria-hidden="true"
      >
        GMD
      </div>

      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* 4-Column Grid Distribution */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
          {/* Column 1: Brand & Philosophy */}
          <div className="space-y-4">
            <Link href="/" className="inline-block group" aria-label="GMDware Home">
              <GMDwareLogo size="md" variant="full" />
            </Link>

            <p className="text-xs font-mono tracking-wider uppercase text-slate-500">
              {tagline}
            </p>

            <p className="text-sm text-slate-400 leading-relaxed font-sans">
              Architecting high-performance digital infrastructure, scalable systems, and bespoke software platforms for ambitious enterprises.
            </p>

            {/* [GMD // SPECIFICATION] Compact Monospace Telemetry Widget */}
            <div className="p-3.5 rounded-lg bg-[#080D18] border border-white/[0.06] font-mono text-xs space-y-1.5">
              <div className="text-white font-semibold flex items-center justify-between text-[11px]">
                <span className="text-cyan-400">[GMD // SPECIFICATION]</span>
                <span className="text-slate-500">v3.0.4</span>
              </div>
              <p className="text-slate-400 text-[11px] leading-relaxed">
                G: Genesis (Architecture) ── M: Mechanics (Engineering) ── D: Dynamics (Scale)
              </p>
            </div>
          </div>

          {/* Column 2: Architecture / Navigation */}
          <div className="space-y-4">
            <h3 className="text-xs font-mono uppercase tracking-[0.2em] text-white font-semibold flex items-center gap-2">
              <span className="text-cyan-400 font-bold">//</span> ARCHITECTURE
            </h3>
            <ul className="space-y-2.5 text-sm font-mono">
              {architectureLinks.map((item) => (
                <li key={item.path}>
                  <Link
                    href={item.path}
                    className="text-slate-400 hover:text-cyan-400 focus-visible:ring-1 focus-visible:ring-cyan-400 focus-visible:outline-none rounded transition-colors inline-flex items-center gap-2 group"
                  >
                    <span className="text-cyan-400/60 opacity-0 -translate-x-1 group-hover:opacity-100 group-hover:translate-x-0 transition-all text-xs">
                      ›
                    </span>
                    <span>{item.label}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 3: Platform & Ecosystem */}
          <div className="space-y-4">
            <h3 className="text-xs font-mono uppercase tracking-[0.2em] text-white font-semibold flex items-center gap-2">
              <span className="text-cyan-400 font-bold">//</span> PLATFORM
            </h3>
            <ul className="space-y-2.5 text-sm font-mono">
              {platformLinks.map((item) => (
                <li key={item.path}>
                  <Link
                    href={item.path}
                    className="text-slate-400 hover:text-cyan-400 focus-visible:ring-1 focus-visible:ring-cyan-400 focus-visible:outline-none rounded transition-colors inline-flex items-center gap-2 group"
                  >
                    <span className="text-cyan-400/60 opacity-0 -translate-x-1 group-hover:opacity-100 group-hover:translate-x-0 transition-all text-xs">
                      ›
                    </span>
                    <span>{item.label}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 4: Direct Dispatch & Contact */}
          <div className="space-y-4">
            <h3 className="text-xs font-mono uppercase tracking-[0.2em] text-white font-semibold flex items-center gap-2">
              <span className="text-cyan-400 font-bold">//</span> ENGAGEMENT
            </h3>

            <p className="text-xs text-slate-400 leading-relaxed font-sans">
              Direct architectural inquiries, RFP specifications, and technical triage:
            </p>

            {/* Email Contact Pill/Card with Copy-to-Clipboard & Direct Action */}
            <div className="p-3 rounded-lg bg-[#080D18] border border-white/[0.08] hover:border-cyan-500/40 transition-all group">
              <div className="flex items-center justify-between gap-2">
                <a
                  href={`mailto:${contactEmail}`}
                  aria-label={`Send direct email to ${contactEmail}`}
                  className="flex items-center gap-2 font-mono text-xs text-cyan-400 hover:text-cyan-300 transition-colors truncate focus-visible:outline-none focus-visible:underline"
                >
                  <Mail className="w-3.5 h-3.5 shrink-0 text-slate-400 group-hover:text-cyan-400 transition-colors" />
                  <span className="font-semibold truncate">{contactEmail}</span>
                </a>
                <div className="flex items-center gap-1 shrink-0">
                  <button
                    type="button"
                    onClick={handleCopyEmail}
                    className="p-1.5 rounded hover:bg-white/[0.06] text-slate-400 hover:text-white transition-colors focus-visible:ring-1 focus-visible:ring-cyan-400 focus-visible:outline-none cursor-pointer"
                    title={copied ? 'Copied to clipboard' : 'Copy email to clipboard'}
                    aria-label={copied ? 'Email copied to clipboard' : 'Copy email to clipboard'}
                  >
                    {copied ? (
                      <Check className="w-3.5 h-3.5 text-emerald-400" />
                    ) : (
                      <Copy className="w-3.5 h-3.5" />
                    )}
                  </button>
                  <a
                    href={`mailto:${contactEmail}`}
                    aria-label={`Open mail client for ${contactEmail}`}
                    className="p-1.5 rounded hover:bg-white/[0.06] text-slate-400 hover:text-cyan-400 transition-colors focus-visible:ring-1 focus-visible:ring-cyan-400 focus-visible:outline-none"
                  >
                    <ArrowUpRight className="w-3.5 h-3.5 opacity-60 group-hover:opacity-100 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                  </a>
                </div>
              </div>
              {copied && (
                <div className="mt-1.5 text-[10px] font-mono text-emerald-400 flex items-center gap-1">
                  <Check className="w-3 h-3" />
                  <span>Email copied to clipboard</span>
                </div>
              )}
            </div>

            {/* Monospace Live Telemetry Widget displaying Active Dispatch Time */}
            <div className="flex items-center justify-between p-3 rounded-lg bg-[#080D18] border border-white/[0.06] font-mono text-xs text-slate-400">
              <span className="flex items-center gap-2">
                <Terminal className="w-3.5 h-3.5 text-cyan-400" />
                <span className="text-slate-300 font-medium">DISPATCH TIME</span>
              </span>
              <span className="text-cyan-400 font-mono font-medium">{timeUtc3 || '05:40:00 UTC+3'}</span>
            </div>

            {/* System Status Line */}
            <div className="flex items-center justify-between text-[11px] font-mono text-slate-500 pt-0.5 px-0.5">
              <span className="flex items-center gap-1.5 text-emerald-400">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                SYSTEMS ONLINE
              </span>
              <span className="text-slate-500">ACID DETERMINISTIC</span>
            </div>
          </div>
        </div>

        {/* Bottom Bar: Legal, Socials & Back to Top */}
        <div className="border-t border-white/[0.06] mt-16 pt-8 flex flex-col md:flex-row items-center justify-between gap-6 text-xs font-mono">
          {/* Left: Copyright */}
          <div className="text-slate-500 text-center md:text-left">
            © {currentYear} GMDware Systems. All architectural rights reserved.
          </div>

          {/* Center: Refined Social Icons Row */}
          <div className="flex items-center gap-1.5" role="list" aria-label="Official company social links">
            {sortedSocials.map((link) => {
              const isGithub = link.platform.toLowerCase() === 'github';
              const label = isGithub ? 'GMDware GitHub' : link.platform;
              return (
                <a
                  key={link.platform}
                  href={link.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  role="listitem"
                  aria-label={`Official ${label} (opens in a new window)`}
                  className="w-8 h-8 rounded-md flex items-center justify-center text-slate-400 hover:text-cyan-400 hover:bg-white/[0.05] focus-visible:ring-1 focus-visible:ring-cyan-400 focus-visible:outline-none transition-all group"
                >
                  <SocialIcon
                    platform={link.platform}
                    className="w-4 h-4 text-slate-400 group-hover:text-cyan-400 transition-colors"
                  />
                </a>
              );
            })}
          </div>

          {/* Right: Interactive Back to Top Trigger */}
          <button
            type="button"
            onClick={scrollToTop}
            className="inline-flex items-center gap-1.5 text-xs font-mono uppercase tracking-wider text-slate-400 hover:text-cyan-400 transition-colors group cursor-pointer focus-visible:ring-1 focus-visible:ring-cyan-400 focus-visible:outline-none rounded px-2.5 py-1.5 hover:bg-white/[0.04]"
            aria-label="Back to top"
          >
            <span>TOP</span>
            <span className="text-cyan-400 transition-transform duration-200 group-hover:-translate-y-0.5">↑</span>
          </button>
        </div>
      </div>
    </footer>
  );
};
