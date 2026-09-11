'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { GMDwareLogo } from '@/components/ui/GMDwareLogo';
import { Menu, X, ArrowUpRight, Sparkles, Orbit, Radio } from 'lucide-react';

interface NexusHeaderProps {
  navItems?: Array<{ label: string; path: string }>;
  brandName?: string;
}

export const NexusHeader: React.FC<NexusHeaderProps> = ({
  navItems = [],
  brandName = 'GMDware',
}) => {
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const defaultLinks = [
    { label: 'Work', path: '/work' },
    { label: 'Capabilities', path: '/services' },
    { label: 'Process', path: '/process' },
    { label: 'Collective', path: '/about' },
    { label: 'Insights', path: '/insights' },
    { label: 'Contact', path: '/contact' },
  ];

  const links = navItems.length > 0 ? navItems : defaultLinks;

  return (
    <header className="fixed top-0 left-0 right-0 z-50 px-4 sm:px-8 pt-4 pb-2 transition-all duration-500 pointer-events-none">
      <div className="max-w-6xl mx-auto flex items-center justify-between">
        {/* Brand Lockup Capsule */}
        <div className="pointer-events-auto">
          <Link
            href="/"
            className="flex items-center gap-3 px-4 py-2 rounded-full bg-[#060A14]/80 border border-cyan-500/20 backdrop-blur-xl shadow-[0_0_20px_rgba(0,242,254,0.08)] hover:border-cyan-400/40 transition-all group"
            aria-label="GMDware Nexus Home"
          >
            <div className="relative flex items-center justify-center">
              <span className="absolute w-2.5 h-2.5 rounded-full bg-[#00F2FE] animate-ping opacity-60" />
              <span className="w-2 h-2 rounded-full bg-[#00F2FE]" />
            </div>
            <GMDwareLogo size="sm" variant="compact" />
            <span className="text-[10px] font-mono text-[#00F2FE] tracking-widest uppercase px-1.5 py-0.5 rounded bg-cyan-500/10 border border-cyan-500/30">
              NEXUS
            </span>
          </Link>
        </div>

        {/* Floating Capsule Navigation (Desktop) */}
        <nav
          aria-label="Nexus Main Navigation"
          className="hidden md:flex pointer-events-auto items-center gap-1 px-3 py-1.5 rounded-full bg-[#080D1A]/85 border border-white/10 backdrop-blur-2xl shadow-[0_4px_30px_rgba(0,0,0,0.5)]"
        >
          {links.map((link) => {
            const isActive = pathname === link.path || (link.path !== '/' && pathname.startsWith(link.path));
            return (
              <Link
                key={link.path}
                href={link.path}
                className={`relative px-4 py-1.5 rounded-full text-xs font-medium transition-all duration-300 ${
                  isActive
                    ? 'text-black font-semibold bg-[#00F2FE] shadow-[0_0_15px_rgba(0,242,254,0.4)]'
                    : 'text-slate-300 hover:text-white hover:bg-white/5'
                }`}
              >
                <span>{link.label}</span>
                {isActive && (
                  <span className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full bg-black" />
                )}
              </Link>
            );
          })}
        </nav>

        {/* Right Action: Connection Signal & Mobile Toggle */}
        <div className="flex items-center gap-3 pointer-events-auto">
          <Link
            href="/contact"
            className="hidden sm:inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-cyan-500/20 to-purple-500/20 border border-cyan-500/30 hover:border-cyan-400 text-xs font-medium text-white backdrop-blur-xl transition-all shadow-[0_0_20px_rgba(0,242,254,0.15)] hover:shadow-[0_0_25px_rgba(0,242,254,0.3)] group"
          >
            <Radio className="w-3.5 h-3.5 text-[#00F2FE] animate-pulse" />
            <span>Connect</span>
            <ArrowUpRight className="w-3.5 h-3.5 text-cyan-400 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
          </Link>

          {/* Mobile Menu Button */}
          <button
            type="button"
            onClick={() => setMobileOpen(!mobileOpen)}
            className="md:hidden p-2 rounded-full bg-[#080D1A]/90 border border-white/10 text-slate-300 hover:text-white"
            aria-label="Toggle navigation menu"
            aria-expanded={mobileOpen}
          >
            {mobileOpen ? <X className="w-5 h-5 text-[#00F2FE]" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileOpen && (
        <div className="md:hidden pointer-events-auto mt-3 p-5 rounded-2xl bg-[#080D1A]/95 border border-cyan-500/30 backdrop-blur-2xl shadow-2xl space-y-3 animate-in fade-in slide-in-from-top-2">
          <div className="flex items-center justify-between pb-3 border-b border-white/10 text-xs font-mono text-[#00F2FE]">
            <span>// NEXUS NETWORK DIRECTORY</span>
            <span className="flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-[#00F2FE] animate-pulse" />
              ONLINE
            </span>
          </div>

          <div className="grid grid-cols-2 gap-2">
            {links.map((link) => (
              <Link
                key={link.path}
                href={link.path}
                onClick={() => setMobileOpen(false)}
                className={`p-3 rounded-xl text-xs font-medium transition-colors ${
                  pathname === link.path
                    ? 'bg-[#00F2FE]/15 border border-[#00F2FE]/40 text-[#00F2FE]'
                    : 'bg-white/5 text-slate-300 hover:bg-white/10 hover:text-white'
                }`}
              >
                {link.label}
              </Link>
            ))}
          </div>

          <Link
            href="/contact"
            onClick={() => setMobileOpen(false)}
            className="w-full py-3 rounded-xl bg-[#00F2FE] text-black font-bold text-xs flex items-center justify-center gap-2 shadow-lg shadow-[#00F2FE]/20"
          >
            <span>Initiate Direct Connection</span>
            <ArrowUpRight className="w-4 h-4" />
          </Link>
        </div>
      )}
    </header>
  );
};
