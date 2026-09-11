'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { SocialIcon } from '@/components/public/SocialIcons';
import { Copy, Check, ArrowUp } from 'lucide-react';

interface AtelierFooterProps {
  settings?: Record<string, string>;
  socialLinks?: any[];
}

export const AtelierFooter: React.FC<AtelierFooterProps> = ({
  settings = {},
  socialLinks = [],
}) => {
  const [copied, setCopied] = useState(false);
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
    <footer className="relative bg-[#0A0A0A] text-[#F5F2EB] pt-24 pb-12 px-6 sm:px-12 border-t border-white/[0.08] font-sans">
      <div className="max-w-6xl mx-auto space-y-20">
        {/* Giant Editorial Wordmark */}
        <div className="space-y-4">
          <div className="text-6xl sm:text-9xl md:text-[140px] font-serif font-light tracking-tighter text-[#F5F2EB] leading-none select-none">
            GMDWARE
          </div>
          <div className="text-xs font-mono tracking-[0.25em] text-stone-500 uppercase">
            SOFTWARE & TECHNOLOGY ATELIER // EST. 2026
          </div>
        </div>

        {/* 3-Column Directory */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-12 pt-12 border-t border-white/[0.08] text-xs font-mono">
          <div className="md:col-span-5 space-y-4">
            <span className="text-stone-500 uppercase block tracking-widest">// COMMISSIONS</span>
            <p className="text-stone-300 leading-relaxed font-sans max-w-sm">
              We partner with ambitious enterprises and technology leaders to build bespoke digital systems.
            </p>
            <div className="inline-flex items-center gap-3 pt-2">
              <a href={`mailto:${email}`} className="text-[#F5F2EB] hover:underline">
                {email}
              </a>
              <button
                type="button"
                onClick={handleCopy}
                className="text-stone-500 hover:text-white transition-colors"
                title="Copy email"
              >
                {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
              </button>
            </div>
          </div>

          <div className="md:col-span-3 space-y-4">
            <span className="text-stone-500 uppercase tracking-widest">// DIRECTORY</span>
            <ul className="space-y-2">
              <li><Link href="/work" className="text-stone-400 hover:text-white transition-colors">Selected Work</Link></li>
              <li><Link href="/services" className="text-stone-400 hover:text-white transition-colors">Capabilities</Link></li>
              <li><Link href="/process" className="text-stone-400 hover:text-white transition-colors">Delivery Sequence</Link></li>
              <li><Link href="/about" className="text-stone-400 hover:text-white transition-colors">Manifesto & Team</Link></li>
              <li><Link href="/insights" className="text-stone-400 hover:text-white transition-colors">Journal</Link></li>
            </ul>
          </div>

          <div className="md:col-span-4 space-y-4">
            <span className="text-stone-500 uppercase tracking-widest">// SPECIFICATIONS</span>
            <ul className="space-y-2">
              <li><Link href="/guide" className="text-stone-400 hover:text-white transition-colors">Platform User Guide</Link></li>
              <li><Link href="/guide/developers" className="text-stone-400 hover:text-white transition-colors">Developer Documentation</Link></li>
              <li><Link href="/guide/admin" className="text-stone-400 hover:text-white transition-colors">Admin Portal Guide</Link></li>
              <li><Link href="/admin/login" className="text-stone-400 hover:text-white transition-colors">Administrative Terminal</Link></li>
            </ul>
          </div>
        </div>

        {/* Bottom Colophon Bar */}
        <div className="pt-8 border-t border-white/[0.08] flex flex-col sm:flex-row items-center justify-between gap-4 text-xs font-mono text-stone-500">
          <div>
            © {new Date().getFullYear()} GMDware Systems. All rights reserved.
          </div>

          {/* Social Links */}
          {socialLinks.length > 0 && (
            <div className="flex items-center gap-4">
              {socialLinks.map((social: any) => (
                <a
                  key={social.platform}
                  href={social.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={social.platform}
                  className="text-stone-400 hover:text-[#F5F2EB] transition-colors"
                >
                  <SocialIcon platform={social.platform} className="w-3.5 h-3.5" />
                </a>
              ))}
            </div>
          )}

          <button
            type="button"
            onClick={scrollToTop}
            className="flex items-center gap-1.5 text-stone-400 hover:text-white transition-colors uppercase tracking-widest"
          >
            <span>Top</span>
            <ArrowUp className="w-3 h-3" />
          </button>
        </div>
      </div>
    </footer>
  );
};
