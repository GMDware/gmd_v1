'use client';

import React from 'react';
import Link from 'next/link';
import { GMDwareLogo } from '@/components/ui/GMDwareLogo';
import { SocialIcon } from '@/components/public/SocialIcons';
import { Radio, Orbit, ArrowUp, Mail, Copy, Check } from 'lucide-react';

interface NexusFooterProps {
  settings?: Record<string, string>;
  socialLinks?: any[];
}

export const NexusFooter: React.FC<NexusFooterProps> = ({
  settings = {},
  socialLinks = [],
}) => {
  const [copied, setCopied] = React.useState(false);
  const email = settings.contact_email || 'gmdware@gmail.com';

  const handleCopy = () => {
    navigator.clipboard.writeText(email);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="relative overflow-hidden bg-[#020306] border-t border-cyan-500/20 pt-20 pb-12 px-4 sm:px-8 text-slate-400 font-sans">
      {/* Background ambient aurora */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[300px] bg-cyan-500/5 blur-[140px] rounded-full pointer-events-none" />

      <div className="max-w-6xl mx-auto space-y-16 relative z-10">
        {/* Top Grid */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-12 items-start">
          {/* Col 1: Brand and Ecosystem Telemetry (5 Cols) */}
          <div className="md:col-span-5 space-y-6">
            <Link href="/" className="inline-flex items-center gap-3">
              <div className="relative flex items-center justify-center">
                <span className="w-2.5 h-2.5 rounded-full bg-[#00F2FE] animate-ping opacity-60" />
                <span className="w-2 h-2 rounded-full bg-[#00F2FE]" />
              </div>
              <GMDwareLogo size="md" variant="compact" />
              <span className="text-[10px] font-mono text-[#00F2FE] tracking-widest uppercase px-2 py-0.5 rounded-full bg-cyan-500/10 border border-cyan-500/30">
                NEXUS
              </span>
            </Link>

            <p className="text-sm text-slate-400 max-w-sm leading-relaxed">
              Living digital software ecosystems engineered for high-concurrency enterprise workloads, resilient architecture, and zero-compromise precision.
            </p>

            {/* Email dispatch pill */}
            <div className="inline-flex items-center gap-2 p-1.5 rounded-full bg-[#080D1A] border border-cyan-500/30 text-xs font-mono text-white">
              <a href={`mailto:${email}`} className="px-3 hover:text-[#00F2FE] transition-colors">
                {email}
              </a>
              <button
                type="button"
                onClick={handleCopy}
                className="p-1.5 rounded-full bg-white/5 hover:bg-white/10 text-cyan-400 transition-colors"
                title="Copy email to clipboard"
              >
                {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
              </button>
            </div>
          </div>

          {/* Col 2: Network Topology Navigation (3 Cols) */}
          <div className="md:col-span-3 space-y-3">
            <span className="text-xs font-mono text-[#00F2FE] tracking-wider uppercase block">
              // NETWORK TOPOLOGY
            </span>
            <ul className="space-y-2 text-xs font-mono">
              <li>
                <Link href="/work" className="hover:text-white transition-colors">
                  Constellation Work
                </Link>
              </li>
              <li>
                <Link href="/services" className="hover:text-white transition-colors">
                  Capabilities Core
                </Link>
              </li>
              <li>
                <Link href="/process" className="hover:text-white transition-colors">
                  Fluid Pathway
                </Link>
              </li>
              <li>
                <Link href="/about" className="hover:text-white transition-colors">
                  Specialist Collective
                </Link>
              </li>
              <li>
                <Link href="/insights" className="hover:text-white transition-colors">
                  Technical Insights
                </Link>
              </li>
            </ul>
          </div>

          {/* Col 3: Ecosystem & Docs (4 Cols) */}
          <div className="md:col-span-4 space-y-3">
            <span className="text-xs font-mono text-[#00F2FE] tracking-wider uppercase block">
              // ECOSYSTEM DOCUMENTATION
            </span>
            <ul className="space-y-2 text-xs font-mono">
              <li>
                <Link href="/guide" className="hover:text-white transition-colors">
                  Official User Guide
                </Link>
              </li>
              <li>
                <Link href="/guide/developers" className="hover:text-white transition-colors">
                  Developer Specifications
                </Link>
              </li>
              <li>
                <Link href="/guide/admin" className="hover:text-white transition-colors">
                  Admin Command Portal
                </Link>
              </li>
              <li>
                <Link href="/admin/login" className="hover:text-white transition-colors">
                  Administrative Access
                </Link>
              </li>
            </ul>

            {/* Signal beacon */}
            <div className="pt-2">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#080D1A] border border-emerald-500/30 text-[10px] font-mono text-emerald-400">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                <span>NEXUS FABRIC ONLINE — 99.99% RESILIENT</span>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-white/5 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs font-mono">
          <div className="text-slate-500">
            © {new Date().getFullYear()} GMDware Systems. Multi-Identity Platform.
          </div>

          {/* Social Icons */}
          {socialLinks.length > 0 && (
            <div className="flex items-center gap-2">
              {socialLinks.map((social: any) => (
                <a
                  key={social.platform}
                  href={social.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={social.platform}
                  className="w-8 h-8 rounded-full bg-[#080D1A] border border-white/10 flex items-center justify-center text-slate-400 hover:text-[#00F2FE] hover:border-cyan-500/40 transition-colors"
                >
                  <SocialIcon platform={social.platform} className="w-3.5 h-3.5" />
                </a>
              ))}
            </div>
          )}

          {/* Scroll to Top */}
          <button
            type="button"
            onClick={scrollToTop}
            className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white transition-colors"
          >
            <span>RETURN TO ORBIT</span>
            <ArrowUp className="w-3 h-3 text-[#00F2FE]" />
          </button>
        </div>
      </div>
    </footer>
  );
};
