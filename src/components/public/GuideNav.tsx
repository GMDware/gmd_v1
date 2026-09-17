'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Compass, Code2, ShieldAlert, BookOpen } from 'lucide-react';
import { cn } from '@/lib/utils';

interface GuideNavProps {
  currentSection?: string;
}

export const GuideNav: React.FC<GuideNavProps> = () => {
  const pathname = usePathname();

  const tabs = [
    {
      label: 'User Guide',
      href: '/guide',
      icon: Compass,
      description: 'Platform navigation & public sections overview',
      exact: true,
    },
    {
      label: 'Developer Guide',
      href: '/guide/developers',
      icon: Code2,
      description: 'Technical architecture, DataStore & quick reference',
      exact: false,
    },
    {
      label: 'Admin Guide',
      href: '/guide/admin',
      icon: ShieldAlert,
      description: 'Administrative workflows & CMS operations',
      exact: false,
    },
  ];

  return (
    <nav
      aria-label="Platform Documentation Sub-navigation"
      className="border-b border-white/10 bg-[#06090F]/80 backdrop-blur-xl sticky top-[68px] z-30 py-3 mb-12"
    >
      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        {/* Breadcrumb / Title Stamp */}
        <div className="flex items-center gap-2 text-xs font-mono text-slate-400">
          <BookOpen className="w-3.5 h-3.5 text-[#00D2FF]" />
          <span className="text-white font-semibold">GMDware Documentation Hub</span>
          <span className="text-slate-600">—</span>
          <span className="text-[#0066FF] uppercase">
            {pathname === '/guide/developers'
              ? 'Developer Technical Reference'
              : pathname === '/guide/admin'
              ? 'Administrator Workflow Manual'
              : 'Visitor & Client Guide'}
          </span>
        </div>

        {/* Tab Links */}
        <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar py-0.5">
          {tabs.map((tab) => {
            const isActive = tab.exact ? pathname === tab.href : pathname.startsWith(tab.href);
            const Icon = tab.icon;

            return (
              <Link
                key={tab.href}
                href={tab.href}
                className={cn(
                  'flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-mono tracking-wide transition-all whitespace-nowrap focus-visible:ring-2 focus-visible:ring-[#00D2FF] focus-visible:outline-none',
                  isActive
                    ? 'bg-[#0066FF] text-white font-semibold shadow-[0_0_15px_-3px_rgba(0,102,255,0.5)]'
                    : 'bg-[#0A0E17] text-slate-400 hover:text-white hover:bg-white/5 border border-white/5'
                )}
              >
                <Icon className="w-3.5 h-3.5 shrink-0" />
                <span>{tab.label}</span>
              </Link>
            );
          })}
        </div>
      </div>
    </nav>
  );
};
