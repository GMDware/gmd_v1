'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { GMDwareLogo } from '@/components/ui/GMDwareLogo';
import { Menu, X, ArrowUpRight } from 'lucide-react';
import { cn } from '@/lib/utils';

export interface NavItem {
  label: string;
  path: string;
  isExternal?: boolean;
}

export interface HeaderProps {
  navItems?: NavItem[];
  brandName?: string;
}

export const Header: React.FC<HeaderProps> = ({ navItems = [], brandName = 'GMDware' }) => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const pathname = usePathname();

  // Core navigation links: Services, Work, About, Contact
  const defaultNav: NavItem[] = [
    { label: 'Services', path: '/services' },
    { label: 'Work', path: '/work' },
    { label: 'About', path: '/about' },
    { label: 'Contact', path: '/contact' },
  ];

  // Merge database navItems or use standard defaults
  const navigationLinks =
    navItems.length > 0
      ? navItems
          .filter((item) => item.label.toLowerCase() !== 'home')
          .map((item) => ({
            ...item,
            path: item.path === '/projects' ? '/work' : item.path,
          }))
      : defaultNav;

  // Track scroll state for sticky header polish
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Lock body scroll when mobile drawer is open
  useEffect(() => {
    if (mobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [mobileMenuOpen]);

  // Close mobile drawer on route change
  useEffect(() => {
    setMobileMenuOpen(false);
  }, [pathname]);

  // Accessibility: Close on Escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && mobileMenuOpen) {
        setMobileMenuOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [mobileMenuOpen]);

  return (
    <header
      className={cn(
        'fixed top-0 left-0 right-0 z-50 transition-all duration-300',
        isScrolled
          ? 'py-3 bg-[#070b14]/85 backdrop-blur-xl border-b border-white/[0.08] shadow-2xl shadow-black/80'
          : 'py-4.5 bg-[#070b14]/75 backdrop-blur-xl border-b border-white/[0.06]'
      )}
    >
      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8">
        {/* ── 3-Column Flex Grid: [Brand & Telemetry Status] | [Center Nav Links] | [Right CTA Action] ── */}
        <div className="grid grid-cols-2 md:grid-cols-3 items-center">
          {/* ── Left Column: Logo & System Status ── */}
          <div className="flex items-center gap-4">
            <Link
              href="/"
              className="inline-flex items-center group focus:outline-none focus-visible:ring-2 focus-visible:ring-[#00D2FF] rounded-lg"
              aria-label="GMDware Home"
            >
              <GMDwareLogo size="md" variant="full" />
            </Link>

            {/* Faint Divider */}
            <div className="hidden sm:block h-5 w-[1px] bg-white/10" />

            {/* Minimalistic Status Beacon: CORE: ONLINE */}
            <div className="hidden sm:flex items-center gap-2 select-none">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500 shadow-[0_0_8px_#10B981]" />
              </span>
              <span className="text-xs font-mono text-slate-400 tracking-wider font-medium">
                CORE: ONLINE
              </span>
            </div>
          </div>

          {/* ── Center Column: Clean Navigation Links (space-x-8, no border pill container) ── */}
          <nav className="hidden md:flex items-center justify-center space-x-8" aria-label="Main Navigation">
            {navigationLinks.map((item) => {
              const isActive =
                pathname === item.path ||
                (item.path === '/work' && pathname.startsWith('/work')) ||
                (item.path === '/services' && pathname.startsWith('/services')) ||
                (item.path === '/about' && pathname.startsWith('/about')) ||
                (item.path === '/contact' && pathname.startsWith('/contact'));

              return (
                <Link
                  key={item.path}
                  href={item.path}
                  className={cn(
                    'relative py-1 text-sm font-medium transition-colors duration-200 select-none group',
                    isActive
                      ? 'text-cyan-400 font-semibold drop-shadow-[0_0_8px_rgba(6,182,212,0.35)]'
                      : 'text-slate-300 hover:text-white'
                  )}
                >
                  <span>{item.label}</span>
                  {item.isExternal && (
                    <ArrowUpRight className="inline-block w-3 h-3 ml-1 opacity-60" />
                  )}

                  {/* Active glowing cyan/blue underline pill indicator */}
                  {isActive && (
                    <motion.div
                      layoutId="nav-active-pill"
                      className="absolute -bottom-1 left-0 right-0 h-[2px] bg-gradient-to-r from-blue-500 via-cyan-400 to-cyan-300 rounded-full shadow-[0_0_10px_#00D2FF]"
                      transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                    />
                  )}
                </Link>
              );
            })}
          </nav>

          {/* ── Right Column: Call To Action & Mobile Controls ── */}
          <div className="flex items-center justify-end gap-3">
            {/* Desktop Styled Gradient Start a Project Button */}
            <Link
              href="/contact"
              className="hidden md:inline-flex group relative items-center gap-2 bg-gradient-to-r from-blue-600 to-cyan-500 hover:from-blue-500 hover:to-cyan-400 text-white font-medium text-sm px-5 py-2.5 rounded-xl shadow-[0_0_20px_rgba(6,182,212,0.35)] hover:shadow-[0_0_28px_rgba(6,182,212,0.55)] transition-all duration-300 active:scale-95 cursor-pointer"
            >
              <span>Start a Project</span>
              <ArrowUpRight className="w-4 h-4 transition-transform duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
            </Link>

            {/* Mobile Viewport Actions */}
            <div className="flex md:hidden items-center gap-2">
              <Link
                href="/contact"
                className="inline-flex items-center gap-1 bg-gradient-to-r from-blue-600 to-cyan-500 text-white font-medium text-xs px-3.5 py-1.5 rounded-lg shadow-[0_0_12px_rgba(6,182,212,0.35)]"
              >
                <span>Start</span>
                <ArrowUpRight className="w-3 h-3" />
              </Link>

              <button
                id="mobile-menu-toggle"
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="p-2 rounded-xl bg-[#080D18] border border-white/10 text-white hover:bg-white/10 transition-colors focus:outline-none focus:ring-2 focus:ring-cyan-400 cursor-pointer"
                aria-label={mobileMenuOpen ? 'Close Navigation Menu' : 'Open Navigation Menu'}
                aria-expanded={mobileMenuOpen}
                aria-controls="mobile-nav-menu"
              >
                {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* ── Mobile Hamburger Drawer (Sheet / Slide-in Menu) ── */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <div
            id="mobile-navigation-drawer"
            role="dialog"
            aria-modal="true"
            aria-label="Mobile Navigation Drawer"
            className="md:hidden fixed inset-0 z-50 flex justify-end"
          >
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              onClick={() => setMobileMenuOpen(false)}
              className="absolute inset-0 bg-black/70 backdrop-blur-md"
            />

            {/* Drawer Panel */}
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 28, stiffness: 300 }}
              className="relative w-full max-w-sm h-full bg-[#070b14]/95 backdrop-blur-2xl border-l border-white/10 shadow-2xl p-6 sm:p-8 flex flex-col justify-between overflow-y-auto"
            >
              {/* Drawer Header */}
              <div className="flex items-center justify-between pb-6 border-b border-white/[0.08]">
                <div className="flex items-center gap-3">
                  <GMDwareLogo size="sm" variant="compact" />
                  <div className="h-4 w-[1px] bg-white/10" />
                  <div className="flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-emerald-500 shadow-[0_0_6px_#10B981]" />
                    <span className="font-mono text-[10px] text-slate-400">ONLINE</span>
                  </div>
                </div>

                <button
                  onClick={() => setMobileMenuOpen(false)}
                  className="p-2 rounded-lg bg-[#080D18] border border-white/10 text-white hover:bg-white/10 transition-colors cursor-pointer"
                  aria-label="Close Navigation Drawer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Navigation Links */}
              <nav className="my-auto py-8 space-y-4">
                {navigationLinks.map((item, idx) => {
                  const isActive =
                    pathname === item.path ||
                    (item.path === '/work' && pathname.startsWith('/work')) ||
                    (item.path === '/services' && pathname.startsWith('/services')) ||
                    (item.path === '/about' && pathname.startsWith('/about')) ||
                    (item.path === '/contact' && pathname.startsWith('/contact'));

                  return (
                    <div key={item.path} className="border-b border-white/[0.04] pb-3">
                      <Link
                        href={item.path}
                        onClick={() => setMobileMenuOpen(false)}
                        className="flex items-center justify-between group py-1"
                      >
                        <div className="flex items-baseline gap-4">
                          <span className="font-mono text-xs text-blue-500 font-bold">
                            0{idx + 1}
                          </span>
                          <span
                            className={cn(
                              'text-2xl font-bold font-display tracking-tight transition-colors',
                              isActive ? 'text-cyan-400' : 'text-white group-hover:text-cyan-400'
                            )}
                          >
                            {item.label}
                          </span>
                        </div>
                        <ArrowUpRight
                          className={cn(
                            'w-5 h-5 transition-transform duration-200 group-hover:translate-x-1 group-hover:-translate-y-1',
                            isActive ? 'text-cyan-400' : 'text-slate-500'
                          )}
                        />
                      </Link>
                    </div>
                  );
                })}
              </nav>

              {/* Drawer Footer & Actions */}
              <div className="pt-6 border-t border-white/[0.08] space-y-4">
                <Link
                  href="/contact"
                  onClick={() => setMobileMenuOpen(false)}
                  className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-blue-600 to-cyan-500 hover:from-blue-500 hover:to-cyan-400 text-white font-semibold text-sm py-3 px-4 rounded-xl shadow-[0_0_20px_rgba(6,182,212,0.35)]"
                >
                  <span>Start a Project</span>
                  <ArrowUpRight className="w-4 h-4" />
                </Link>

                <div className="flex items-center justify-between text-xs font-mono text-slate-400 pt-2">
                  <Link
                    href="/guide"
                    onClick={() => setMobileMenuOpen(false)}
                    className="hover:text-cyan-400 transition-colors flex items-center gap-1.5"
                  >
                    <span>Documentation &amp; Guides</span>
                    <ArrowUpRight className="w-3 h-3" />
                  </Link>
                  <span className="text-slate-500">v3.0.4</span>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </header>
  );
};
