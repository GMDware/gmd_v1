'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAdminNotifications } from './AdminNotificationsContext';
import {
  LayoutDashboard,
  FolderGit2,
  Users,
  Layers,
  Cpu,
  Workflow,
  Building2,
  Layout,
  Navigation,
  Globe,
  Mail,
  ImageIcon,
  Settings,
  Share2,
  Palette,
} from 'lucide-react';

interface NavItem {
  label: string;
  href: string;
  icon: React.ComponentType<{ className?: string }>;
  badgeKey?: 'inquiries';
}

const NAV_ITEMS: NavItem[] = [
  { label: 'Overview Metrics', href: '/admin', icon: LayoutDashboard },
  { label: 'Theme Engine', href: '/admin/theme', icon: Palette },
  { label: 'Projects & Work', href: '/admin/projects', icon: FolderGit2 },
  { label: 'Founders & Team', href: '/admin/team', icon: Users },
  { label: 'Services & Features', href: '/admin/services', icon: Layers },
  { label: 'Technologies', href: '/admin/technologies', icon: Cpu },
  { label: 'Delivery Process', href: '/admin/process', icon: Workflow },
  { label: 'Company & Values', href: '/admin/company', icon: Building2 },
  { label: 'Homepage Content', href: '/admin/homepage', icon: Layout },
  { label: 'Navigation Menus', href: '/admin/navigation', icon: Navigation },
  { label: 'Social Links', href: '/admin/social', icon: Share2 },
  { label: 'SEO & Metadata', href: '/admin/seo', icon: Globe },
  { label: 'Inbound Inquiries', href: '/admin/inquiries', icon: Mail, badgeKey: 'inquiries' },
  { label: 'Media Library', href: '/admin/media', icon: ImageIcon },
  { label: 'Site Settings', href: '/admin/settings', icon: Settings },
];

export const AdminSidebarNav: React.FC = () => {
  const pathname = usePathname();
  const { unreadCount } = useAdminNotifications();

  return (
    <nav className="p-3 space-y-1.5 overflow-y-auto flex-1 text-xs select-none">
      {NAV_ITEMS.map((item) => {
        const Icon = item.icon;
        const isActive =
          item.href === '/admin'
            ? pathname === '/admin'
            : pathname === item.href || (pathname?.startsWith(item.href + '/') ?? false);

        const hasInquiriesBadge = item.badgeKey === 'inquiries' && unreadCount > 0;

        return (
          <Link
            key={item.href}
            href={item.href}
            className={`relative flex items-center gap-3 px-3 py-2.5 rounded-xl font-medium transition-all duration-200 group ${
              isActive
                ? 'bg-gradient-to-r from-[#0066FF]/25 via-[#00D2FF]/15 to-transparent border border-[#00F2FE]/40 text-white font-semibold shadow-[inset_0_0_12px_rgba(0,242,254,0.12),0_0_15px_rgba(0,242,254,0.08)]'
                : 'text-slate-400 hover:text-white hover:bg-white/[0.06] border border-transparent'
            }`}
          >
            {/* Active Left Glowing Pill Indicator */}
            {isActive && (
              <span
                className="absolute left-0 top-1/2 -translate-y-1/2 w-1.5 h-5 rounded-r-full bg-gradient-to-b from-[#00F2FE] to-[#0066FF] shadow-[0_0_10px_#00F2FE]"
                aria-hidden="true"
              />
            )}

            <Icon
              className={`w-4 h-4 shrink-0 transition-all duration-200 ${
                isActive
                  ? 'text-[#00F2FE] drop-shadow-[0_0_8px_rgba(0,242,254,0.7)] scale-105'
                  : 'text-slate-500 group-hover:text-slate-200 group-hover:scale-105'
              }`}
            />

            <span className={`truncate flex-1 ${isActive ? 'text-white font-semibold tracking-tight' : ''}`}>
              {item.label}
            </span>

            {/* Inquiries Notification Badge */}
            {hasInquiriesBadge && (
              <span
                title={`${unreadCount} new inquiries`}
                className="ml-auto flex items-center gap-1.5 px-2 py-0.5 text-[10px] font-mono font-bold rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/40 shadow-[0_0_10px_rgba(245,158,11,0.2)] shrink-0"
              >
                <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-ping" />
                {unreadCount}
              </span>
            )}
          </Link>
        );
      })}
    </nav>
  );
};
