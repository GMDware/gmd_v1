import React from 'react';
import Link from 'next/link';
import { redirect } from 'next/navigation';
import prisma from '@/lib/db/prisma';
import { getAdminSession } from '@/lib/auth/session';
import { Badge } from '@/components/ui/Badge';
import { GMDwareLogo } from '@/components/ui/GMDwareLogo';
import { AdminLogoutButton } from '@/components/admin/AdminLogoutButton';
import { AdminToastProvider } from '@/components/admin/AdminToast';
import { AdminNotificationsProvider } from '@/components/admin/AdminNotificationsContext';
import { AdminSidebarNav } from '@/components/admin/AdminSidebarNav';
import { AdminHeaderNotifications } from '@/components/admin/AdminHeaderNotifications';
import { ShieldCheck, ExternalLink } from 'lucide-react';

export default async function AdminDashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getAdminSession();

  if (!session) {
    redirect('/admin/login');
  }

  let initialUnreadCount = 0;
  try {
    initialUnreadCount = await prisma.contactSubmission.count({
      where: { status: 'NEW' },
    });
  } catch {
    initialUnreadCount = 0;
  }

  return (
    <AdminToastProvider>
      <AdminNotificationsProvider initialUnreadCount={initialUnreadCount}>
        <div className="min-h-screen bg-[#06090F] text-slate-100 flex flex-col md:flex-row">
          {/* Admin Sidebar */}
          <aside className="w-full md:w-64 bg-[#0A0E17] border-r border-white/10 flex flex-col justify-between shrink-0 h-auto md:h-screen md:sticky md:top-0">
            <div className="flex flex-col min-h-0 flex-1">
              {/* Brand header */}
              <div className="p-5 border-b border-white/5 flex items-center justify-between shrink-0">
                <Link href="/admin" className="flex items-center gap-2.5 group" aria-label="GMDware Admin Dashboard">
                  <GMDwareLogo size="sm" variant="compact" />
                  <span className="text-[9px] font-mono text-[#00D2FF] bg-[#0066FF]/10 px-1.5 py-0.5 rounded border border-[#0066FF]/20">
                    CMS
                  </span>
                </Link>
              </div>

              {/* Dynamic Active Navigation with Inquiries Badge */}
              <AdminSidebarNav />
            </div>

            {/* Sidebar Footer */}
            <div className="p-3 border-t border-white/5 space-y-2 shrink-0 bg-[#080C14]">
              <Link
                href="/"
                target="_blank"
                className="flex items-center justify-between px-3 py-1.5 rounded-lg bg-white/5 text-[11px] text-slate-400 hover:text-white transition-colors"
              >
                <span className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#10B981]" />
                  Live Website
                </span>
                <ExternalLink className="w-3 h-3 text-slate-500" />
              </Link>

              <div className="px-3 py-2 flex items-center justify-between bg-black/30 rounded-lg border border-white/5">
                <div className="flex flex-col min-w-0 pr-2">
                  <span className="text-xs font-bold text-white truncate">
                    {session.name}
                  </span>
                  <span className="text-[9px] font-mono text-[#00F2FE]">
                    {session.roles[0] || 'ADMIN'}
                  </span>
                </div>
                <AdminLogoutButton />
              </div>
            </div>
          </aside>

          {/* Main Administrative Work Area */}
          <div className="flex-1 flex flex-col min-w-0">
            <header className="h-14 border-b border-white/10 px-6 sm:px-8 flex items-center justify-between bg-[#0A0E17]/60 backdrop-blur-md sticky top-0 z-30">
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-[#10B981]" />
                <span className="font-mono text-xs text-slate-400 hidden sm:inline">AUTHENTICATED ADMIN SESSION</span>
                <span className="font-mono text-xs text-slate-400 sm:hidden">ADMIN SESSION</span>
              </div>
              <div className="flex items-center gap-3">
                <AdminHeaderNotifications />
                <Badge variant="cyan" size="sm">
                  ROLE: {session.roles[0] || 'ADMINISTRATOR'}
                </Badge>
              </div>
            </header>

            <main className="flex-1 p-5 sm:p-7 lg:p-9 max-w-7xl w-full mx-auto">
              {children}
            </main>
          </div>
        </div>
      </AdminNotificationsProvider>
    </AdminToastProvider>
  );
}

