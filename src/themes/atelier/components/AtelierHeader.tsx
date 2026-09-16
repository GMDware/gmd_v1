'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Menu, X, ArrowUpRight } from 'lucide-react';
import { GMDwareLogo } from '@/components/ui/GMDwareLogo';
import { ThemeSwitcher } from '@/components/public/ThemeSwitcher';

interface AtelierHeaderProps {
  navItems?: Array<{ label: string; path: string }>;
  brandName?: string;
}

export const AtelierHeader: React.FC<AtelierHeaderProps> = ({
  brandName = 'GMDware',
}) => {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Clean, focused agency navigation links as specified
  const links = [
    { label: 'Services', path: '/services' },
    { label: 'Work', path: '/work' },
    { label: 'About', path: '/about' },
    { label: 'Contact', path: '/contact' },
  ];

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-200 ${
        scrolled
          ? 'bg-white/95 backdrop-blur-md border-b border-slate-200/80 shadow-[0_1px_3px_rgba(0,0,0,0.03)] h-16'
          : 'bg-[#FBFBFA]/90 backdrop-blur-sm border-b border-slate-200/50 h-20'
      }`}
    >
      <div className="max-w-6xl mx-auto px-6 h-full flex items-center justify-between">
        {/* Left-Aligned Branding with Official GMDware Emblem */}
        <div className="flex-1 flex justify-start">
          <Link
            href="/"
            className="inline-flex items-center gap-3 group focus:outline-none py-1"
            aria-label={`${brandName} Atelier Home`}
          >
            <GMDwareLogo size="md" variant="full" theme="light" priority />
            <span className="hidden sm:inline-block px-2.5 py-0.5 rounded-full bg-slate-100 text-[10px] font-mono font-medium text-slate-500 uppercase tracking-wider border border-slate-200/80 group-hover:border-slate-300 transition-colors">
              Atelier
            </span>
          </Link>
        </div>

        {/* Centered Navigation Menu Links */}
        <nav aria-label="Main Navigation" className="hidden md:flex items-center justify-center gap-8">
          {links.map((link) => {
            const isActive =
              pathname === link.path ||
              (link.path !== '/' && pathname.startsWith(link.path));
            return (
              <Link
                key={link.path}
                href={link.path}
                className={`text-sm transition-colors relative py-1 font-medium ${
                  isActive
                    ? 'text-slate-900 font-semibold after:absolute after:bottom-0 after:left-0 after:right-0 after:h-0.5 after:bg-blue-600'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                {link.label}
              </Link>
            );
          })}
        </nav>

        {/* Right-Aligned CTA Hierarchy: Solitary Primary Action */}
        <div className="flex-1 flex justify-end items-center gap-3">
          {/* Desktop Theme Switcher */}
          <ThemeSwitcher variant="pill" className="hidden sm:inline-flex" />

          <Link
            href="/contact"
            className="hidden sm:inline-flex items-center gap-2 px-4 py-2 rounded-xl border border-slate-300 hover:border-slate-900 bg-white/50 hover:bg-slate-900 text-slate-800 hover:text-white font-medium text-xs sm:text-sm transition-all duration-200 shadow-sm group active:scale-[0.98]"
          >
            <span>Start a project</span>
            <ArrowUpRight className="w-3.5 h-3.5 text-slate-500 group-hover:text-white group-hover:-translate-y-0.5 group-hover:translate-x-0.5 transition-transform" />
          </Link>

          {/* Mobile Theme Toggle */}
          <ThemeSwitcher variant="compact" className="sm:hidden" />

          {/* Mobile Hamburger Toggle */}
          <button
            type="button"
            onClick={() => setMobileOpen(!mobileOpen)}
            className="md:hidden p-2 rounded-md text-slate-700 hover:text-slate-900 hover:bg-slate-100 transition-colors"
            aria-label="Toggle Navigation Menu"
            aria-expanded={mobileOpen}
          >
            {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileOpen && (
        <div className="md:hidden bg-white border-b border-slate-200 px-6 py-6 space-y-4 shadow-lg animate-in fade-in">
          <div className="space-y-1">
            {links.map((link) => {
              const isActive =
                pathname === link.path ||
                (link.path !== '/' && pathname.startsWith(link.path));
              return (
                <Link
                  key={link.path}
                  href={link.path}
                  onClick={() => setMobileOpen(false)}
                  className={`flex items-center justify-between px-3 py-2.5 rounded-lg text-sm transition-colors ${
                    isActive
                      ? 'bg-slate-100 text-slate-900 font-semibold'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                  }`}
                >
                  <span>{link.label}</span>
                  {isActive && <span className="w-1.5 h-1.5 rounded-full bg-blue-600" />}
                </Link>
              );
            })}
          </div>

          <div className="space-y-3 pt-3 border-t border-slate-100">
            <div className="space-y-1">
              <span className="text-[11px] font-mono uppercase tracking-wider text-slate-500 font-semibold block">
                Studio Experience Theme:
              </span>
              <ThemeSwitcher variant="drawer" />
            </div>

            <Link
              href="/contact"
              onClick={() => setMobileOpen(false)}
              className="w-full py-2.5 rounded-xl border border-slate-300 hover:border-slate-900 bg-white/50 hover:bg-slate-900 text-slate-800 hover:text-white font-medium text-xs sm:text-sm text-center flex items-center justify-center gap-2 transition-all duration-200 shadow-sm group active:scale-[0.98]"
            >
              <span>Start a project</span>
              <ArrowUpRight className="w-3.5 h-3.5 text-slate-500 group-hover:text-white group-hover:-translate-y-0.5 group-hover:translate-x-0.5 transition-transform" />
            </Link>
          </div>
        </div>
      )}
    </header>
  );
};

