'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { SocialIcon } from '@/components/public/SocialIcons';
import { Copy, Check, ArrowUp, Mail } from 'lucide-react';
import { GMDwareLogo } from '@/components/ui/GMDwareLogo';

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
  const brandName = settings.brand_name || 'GMDware';

  const handleCopy = () => {
    navigator.clipboard.writeText(email);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="bg-white text-slate-900 pt-16 pb-12 border-t border-slate-200">
      <div className="max-w-6xl mx-auto px-6 space-y-12">
        {/* Main Footer Grid */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-10">
          {/* Brand & Studio Mission (5 Cols) */}
          <div className="md:col-span-5 space-y-4">
            <div className="flex items-center gap-3">
              <GMDwareLogo size="lg" variant="full" theme="light" />
              <span className="px-2.5 py-0.5 rounded-full bg-slate-100 text-[10px] font-mono font-medium text-slate-500 uppercase tracking-wider border border-slate-200">
                Atelier Edition
              </span>
            </div>

            <p className="text-sm text-slate-600 leading-relaxed max-w-sm">
              An independent software studio. We design, build, and maintain digital products and web platforms for ambitious teams.
            </p>

            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-slate-50 border border-slate-200 text-xs">
              <Mail className="w-3.5 h-3.5 text-blue-600" />
              <span className="font-medium text-slate-800">{email}</span>
              <button
                type="button"
                onClick={handleCopy}
                className="ml-1 p-1 hover:bg-slate-200 rounded text-slate-500 hover:text-slate-900 transition-colors"
                title="Copy email address"
                aria-label="Copy contact email"
              >
                {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
              </button>
            </div>
          </div>

          {/* Navigation Links (4 Cols) */}
          <div className="md:col-span-4 grid grid-cols-2 gap-6 text-sm">
            <div className="space-y-3">
              <span className="text-xs font-semibold text-slate-400 uppercase tracking-wide block">
                Studio
              </span>
              <ul className="space-y-2 text-slate-600">
                <li>
                  <Link href="/work" className="hover:text-blue-600 transition-colors">
                    Selected Work
                  </Link>
                </li>
                <li>
                  <Link href="/services" className="hover:text-blue-600 transition-colors">
                    Services
                  </Link>
                </li>
                <li>
                  <Link href="/process" className="hover:text-blue-600 transition-colors">
                    Our Approach
                  </Link>
                </li>
                <li>
                  <Link href="/about" className="hover:text-blue-600 transition-colors">
                    About Us
                  </Link>
                </li>
              </ul>
            </div>

            <div className="space-y-3">
              <span className="text-xs font-semibold text-slate-400 uppercase tracking-wide block">
                Connect
              </span>
              <ul className="space-y-2 text-slate-600">
                <li>
                  <Link href="/contact" className="hover:text-blue-600 transition-colors">
                    Start a Project
                  </Link>
                </li>
                <li>
                  <Link href="/insights" className="hover:text-blue-600 transition-colors">
                    Perspectives
                  </Link>
                </li>
                <li>
                  <Link href="/admin/login" className="hover:text-blue-600 transition-colors">
                    Admin Portal
                  </Link>
                </li>
              </ul>
            </div>
          </div>

          {/* Social Links (3 Cols) */}
          <div className="md:col-span-3 space-y-3 text-sm">
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wide block">
              Follow
            </span>
            <div className="flex flex-wrap items-center gap-2">
              {socialLinks.map((social: any) => (
                <a
                  key={social.platform}
                  href={social.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={social.platform}
                  className="p-2 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 transition-colors"
                  title={social.platform}
                >
                  <SocialIcon platform={social.platform} className="w-4 h-4" />
                </a>
              ))}
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <div>
            © {new Date().getFullYear()} {brandName}. All rights reserved.
          </div>

          <button
            type="button"
            onClick={scrollToTop}
            className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-xl border border-slate-300 hover:border-slate-900 bg-white/50 hover:bg-slate-900 text-slate-700 hover:text-white transition-all duration-200 text-xs font-medium cursor-pointer shadow-sm group active:scale-[0.98]"
          >
            <span>Back to top</span>
            <ArrowUp className="w-3.5 h-3.5 text-slate-500 group-hover:text-white group-hover:-translate-y-0.5 transition-transform" />
          </button>
        </div>
      </div>
    </footer>
  );
};
