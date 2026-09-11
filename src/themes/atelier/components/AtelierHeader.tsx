'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Menu, X, ArrowUpRight } from 'lucide-react';

interface AtelierHeaderProps {
  navItems?: Array<{ label: string; path: string }>;
  brandName?: string;
}

export const AtelierHeader: React.FC<AtelierHeaderProps> = ({
  navItems = [],
  brandName = 'GMDware',
}) => {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);

  const defaultLinks = [
    { label: 'Work', path: '/work' },
    { label: 'Capabilities', path: '/services' },
    { label: 'Sequence', path: '/process' },
    { label: 'Atelier', path: '/about' },
    { label: 'Journal', path: '/insights' },
    { label: 'Inquire', path: '/contact' },
  ];

  const links = navItems.length > 0 ? navItems : defaultLinks;

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-[#0A0A0A]/90 backdrop-blur-md border-b border-white/[0.08] transition-all duration-300">
      <div className="max-w-7xl mx-auto px-6 sm:px-12 h-20 flex items-center justify-between">
        {/* Editorial Wordmark */}
        <Link
          href="/"
          className="flex items-baseline gap-2.5 group tracking-tight"
          aria-label="GMDware Atelier Home"
        >
          <span className="text-xl sm:text-2xl font-bold tracking-tighter text-[#F5F2EB] font-serif">
            GMDWARE
          </span>
          <span className="text-[10px] font-mono tracking-[0.25em] text-stone-400 uppercase">
            ATELIER
          </span>
        </Link>

        {/* Desktop Editorial Directory */}
        <nav aria-label="Atelier Main Navigation" className="hidden md:flex items-center gap-8">
          {links.map((link) => {
            const isActive = pathname === link.path || (link.path !== '/' && pathname.startsWith(link.path));
            return (
              <Link
                key={link.path}
                href={link.path}
                className={`text-xs uppercase tracking-widest font-sans transition-colors relative py-1 ${
                  isActive
                    ? 'text-[#F5F2EB] font-semibold'
                    : 'text-stone-400 hover:text-[#F5F2EB]'
                }`}
              >
                <span>{link.label}</span>
                {isActive && (
                  <span className="absolute bottom-0 left-0 right-0 h-[1px] bg-[#F5F2EB]" />
                )}
              </Link>
            );
          })}
        </nav>

        {/* Action Trigger */}
        <div className="flex items-center gap-4">
          <Link
            href="/contact"
            className="hidden sm:inline-flex items-center gap-2 px-5 py-2 rounded-full border border-white/20 hover:border-white/60 text-xs uppercase tracking-wider text-[#F5F2EB] transition-all"
          >
            <span>Commission</span>
            <span className="text-stone-400">→</span>
          </Link>

          {/* Mobile Menu Button */}
          <button
            type="button"
            onClick={() => setMobileOpen(!mobileOpen)}
            className="md:hidden p-2 text-stone-300 hover:text-white"
            aria-label="Toggle navigation menu"
            aria-expanded={mobileOpen}
          >
            {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Editorial Overlay */}
      {mobileOpen && (
        <div className="md:hidden bg-[#0A0A0A] border-b border-white/10 px-6 py-8 space-y-6 animate-in fade-in slide-in-from-top-4">
          <div className="text-[11px] font-mono text-stone-400 tracking-widest uppercase pb-3 border-b border-white/10">
            // ATELIER INDEX
          </div>

          <div className="space-y-4">
            {links.map((link, idx) => (
              <Link
                key={link.path}
                href={link.path}
                onClick={() => setMobileOpen(false)}
                className="flex items-center justify-between py-2 text-base font-serif text-[#F5F2EB] hover:text-white border-b border-white/5"
              >
                <span>{link.label}</span>
                <span className="text-xs font-mono text-stone-500">0{idx + 1}</span>
              </Link>
            ))}
          </div>

          <Link
            href="/contact"
            onClick={() => setMobileOpen(false)}
            className="w-full py-3 rounded-full bg-[#F5F2EB] text-black font-medium text-xs uppercase tracking-wider text-center block mt-4"
          >
            Commission a System
          </Link>
        </div>
      )}
    </header>
  );
};
