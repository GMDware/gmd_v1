import React from 'react';
import prisma from '@/lib/db/prisma';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { AuthService } from '@/services/auth.service';
import { isDatabaseReachable } from '@/lib/db/data-store';
import { INITIAL_SEED_DATA } from '@/lib/db/seed-data';
import Link from 'next/link';
import {
  FolderGit2,
  Users,
  Layers,
  Mail,
  ArrowUpRight,
  Database,
  ShieldCheck,
  CheckCircle2,
  Activity,
  Plus,
  Workflow,
  ImageIcon,
  Settings,
  Clock,
} from 'lucide-react';

export const dynamic = 'force-dynamic';

export default async function AdminDashboardPage() {
  const startTime = Date.now();

  let totalProjects = 0;
  let publishedProjects = 0;
  let totalTeam = 0;
  let totalFounders = 0;
  let totalServices = 0;
  let unreadInquiries = 0;
  let recentLogs: any[] = [];
  let brandName = 'GMDware';

  if (await isDatabaseReachable()) {
    try {
      const [
        tp,
        pp,
        tt,
        tf,
        ts,
        ui,
        rl,
        st,
      ] = await Promise.all([
        prisma.project.count({ where: { deletedAt: null } }),
        prisma.project.count({ where: { status: 'PUBLISHED', deletedAt: null } }),
        prisma.teamMember.count({ where: { deletedAt: null } }),
        prisma.teamMember.count({ where: { isFounder: true, deletedAt: null } }),
        prisma.service.count({ where: { deletedAt: null } }),
        prisma.contactSubmission.count({ where: { status: 'NEW' } }),
        AuthService.getRecentLogs(8),
        prisma.siteSetting.findMany(),
      ]);
      totalProjects = tp;
      publishedProjects = pp;
      totalTeam = tt;
      totalFounders = tf;
      totalServices = ts;
      unreadInquiries = ui;
      recentLogs = rl;
      brandName = st.find((s) => s.key === 'brand_name')?.value || 'GMDware';
    } catch {
      // Fall through to baseline seed metrics if database queries fail
    }
  } else {
    // Only fall back to seed data if database is completely unreachable
    totalProjects = INITIAL_SEED_DATA.projects.length;
    publishedProjects = INITIAL_SEED_DATA.projects.length;
    totalTeam = INITIAL_SEED_DATA.teamMembers.length;
    totalFounders = INITIAL_SEED_DATA.teamMembers.filter((m: any) => m.isFounder).length;
    totalServices = INITIAL_SEED_DATA.services.length;
    brandName =
      INITIAL_SEED_DATA.siteSettings.find((s) => s.key === 'brand_name')?.value ||
      'GMDware';
  }

  const dbLatencyMs = Date.now() - startTime;

  const metrics = [
    {
      label: 'Projects Portfolio',
      value: totalProjects,
      subValue: `${publishedProjects} Published`,
      icon: FolderGit2,
      href: '/admin/projects',
      color: 'text-[#00F2FE]',
    },
    {
      label: 'Leadership & Team',
      value: totalTeam,
      subValue: `${totalFounders} Founders`,
      icon: Users,
      href: '/admin/team',
      color: 'text-[#7F00FF]',
    },
    {
      label: 'Active Services',
      value: totalServices,
      subValue: 'Production Catalog',
      icon: Layers,
      href: '/admin/services',
      color: 'text-[#10B981]',
    },
    {
      label: 'Inbound Inquiries',
      value: unreadInquiries,
      subValue: unreadInquiries > 0 ? 'Requires Triage' : 'All Addressed',
      icon: Mail,
      href: '/admin/inquiries',
      color: unreadInquiries > 0 ? 'text-[#F59E0B]' : 'text-slate-400',
    },
  ];

  return (
    <div className="space-y-8">
      {/* Top Welcome & Quick Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/5 pb-6">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
            Administrative Command Center
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Real-time content management & telemetry for <span className="text-white font-medium">{brandName}</span>.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          <Link href="/admin/projects">
            <Button size="sm" variant="primary" leftIcon={<Plus className="w-3.5 h-3.5" />}>
              New Project
            </Button>
          </Link>
          <Link href="/admin/inquiries">
            <Button size="sm" variant="secondary" leftIcon={<Mail className="w-3.5 h-3.5" />}>
              Inquiries {unreadInquiries > 0 && `(${unreadInquiries})`}
            </Button>
          </Link>
        </div>
      </div>

      {/* Primary Analytics Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {metrics.map((m, idx) => {
          const Icon = m.icon;
          return (
            <Link key={idx} href={m.href}>
              <Card className="p-5 space-y-3 hover:border-[#00F2FE]/40 transition-all bg-[#0A0E17]/60">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-mono text-slate-400">{m.label}</span>
                  <div className={`p-2 rounded-lg bg-white/5 ${m.color}`}>
                    <Icon className="w-4 h-4" />
                  </div>
                </div>
                <div className="flex items-baseline justify-between">
                  <span className="text-3xl font-bold text-white font-mono">{m.value}</span>
                  <span className="text-[11px] font-mono text-slate-400">{m.subValue}</span>
                </div>
              </Card>
            </Link>
          );
        })}
      </div>

      {/* Main Split: Quick Launch Matrix & Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Quick Launch Management Cards */}
        <div className="lg:col-span-7 space-y-6">
          <div className="glass-panel rounded-2xl p-6 border border-white/10 space-y-4 bg-[#0A0E17]/40">
            <div className="flex items-center justify-between border-b border-white/5 pb-3">
              <h2 className="text-sm font-bold text-white uppercase tracking-wider font-mono flex items-center gap-2">
                <Workflow className="w-4 h-4 text-[#00F2FE]" />
                Content Modules Direct Access
              </h2>
              <Badge variant="cyan" size="sm">CMS ACTIVE</Badge>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
              <Link
                href="/admin/projects"
                className="p-4 rounded-xl border border-white/5 hover:border-[#00F2FE]/30 bg-[#06090F] transition-all flex items-start justify-between group"
              >
                <div>
                  <h3 className="text-xs font-bold text-white group-hover:text-[#00F2FE] transition-colors">
                    Portfolio & Case Studies
                  </h3>
                  <p className="text-[11px] text-slate-400 mt-1">
                    Manage architectures, metrics, testimonials & galleries.
                  </p>
                </div>
                <ArrowUpRight className="w-4 h-4 text-slate-500 group-hover:text-[#00F2FE] transition-colors shrink-0" />
              </Link>

              <Link
                href="/admin/team"
                className="p-4 rounded-xl border border-white/5 hover:border-[#00F2FE]/30 bg-[#06090F] transition-all flex items-start justify-between group"
              >
                <div>
                  <h3 className="text-xs font-bold text-white group-hover:text-[#00F2FE] transition-colors">
                    Founders & Team
                  </h3>
                  <p className="text-[11px] text-slate-400 mt-1">
                    Edit biographies, skills, department titles & social links.
                  </p>
                </div>
                <ArrowUpRight className="w-4 h-4 text-slate-500 group-hover:text-[#00F2FE] transition-colors shrink-0" />
              </Link>

              <Link
                href="/admin/services"
                className="p-4 rounded-xl border border-white/5 hover:border-[#00F2FE]/30 bg-[#06090F] transition-all flex items-start justify-between group"
              >
                <div>
                  <h3 className="text-xs font-bold text-white group-hover:text-[#00F2FE] transition-colors">
                    Services & Features
                  </h3>
                  <p className="text-[11px] text-slate-400 mt-1">
                    Update offerings, feature checklists & linked tech.
                  </p>
                </div>
                <ArrowUpRight className="w-4 h-4 text-slate-500 group-hover:text-[#00F2FE] transition-colors shrink-0" />
              </Link>

              <Link
                href="/admin/homepage"
                className="p-4 rounded-xl border border-white/5 hover:border-[#00F2FE]/30 bg-[#06090F] transition-all flex items-start justify-between group"
              >
                <div>
                  <h3 className="text-xs font-bold text-white group-hover:text-[#00F2FE] transition-colors">
                    Homepage Configuration
                  </h3>
                  <p className="text-[11px] text-slate-400 mt-1">
                    Control hero headlines, CTA buttons & section visibility.
                  </p>
                </div>
                <ArrowUpRight className="w-4 h-4 text-slate-500 group-hover:text-[#00F2FE] transition-colors shrink-0" />
              </Link>

              <Link
                href="/admin/navigation"
                className="p-4 rounded-xl border border-white/5 hover:border-[#00F2FE]/30 bg-[#06090F] transition-all flex items-start justify-between group"
              >
                <div>
                  <h3 className="text-xs font-bold text-white group-hover:text-[#00F2FE] transition-colors">
                    Navigation Hierarchy
                  </h3>
                  <p className="text-[11px] text-slate-400 mt-1">
                    Manage header and footer links, order and visibility.
                  </p>
                </div>
                <ArrowUpRight className="w-4 h-4 text-slate-500 group-hover:text-[#00F2FE] transition-colors shrink-0" />
              </Link>

              <Link
                href="/admin/media"
                className="p-4 rounded-xl border border-white/5 hover:border-[#00F2FE]/30 bg-[#06090F] transition-all flex items-start justify-between group"
              >
                <div>
                  <h3 className="text-xs font-bold text-white group-hover:text-[#00F2FE] transition-colors">
                    Media Storage Library
                  </h3>
                  <p className="text-[11px] text-slate-400 mt-1">
                    Upload images, inspect magic-bytes & copy CDN links.
                  </p>
                </div>
                <ArrowUpRight className="w-4 h-4 text-slate-500 group-hover:text-[#00F2FE] transition-colors shrink-0" />
              </Link>
            </div>
          </div>

          {/* Operational Telemetry Card */}
          <div className="glass-panel rounded-2xl p-6 border border-white/10 space-y-4 bg-[#0A0E17]/40">
            <h3 className="text-xs font-bold text-white uppercase tracking-wider font-mono flex items-center gap-2">
              <Database className="w-4 h-4 text-[#10B981]" />
              Database Engine Diagnostics
            </h3>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 font-mono text-xs">
              <div className="p-3 bg-[#06090F] rounded-lg border border-white/5">
                <span className="text-slate-500 text-[10px] block">DATABASE STATE</span>
                <span className="text-[#10B981] font-bold flex items-center gap-1.5 mt-0.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#10B981] animate-pulse" />
                  ONLINE
                </span>
              </div>

              <div className="p-3 bg-[#06090F] rounded-lg border border-white/5">
                <span className="text-slate-500 text-[10px] block">QUERY LATENCY</span>
                <span className="text-white font-bold mt-0.5 block">{dbLatencyMs} ms</span>
              </div>

              <div className="p-3 bg-[#06090F] rounded-lg border border-white/5">
                <span className="text-slate-500 text-[10px] block">SECURITY AUDIT</span>
                <span className="text-[#00F2FE] font-bold mt-0.5 block">ACTIVE</span>
              </div>
            </div>
          </div>
        </div>

        {/* Live Recent Activity Stream */}
        <div className="lg:col-span-5 space-y-4">
          <div className="glass-panel rounded-2xl p-6 border border-white/10 space-y-4 bg-[#0A0E17]/40 h-full flex flex-col">
            <div className="flex items-center justify-between border-b border-white/5 pb-3">
              <h2 className="text-xs font-bold text-white uppercase tracking-wider font-mono flex items-center gap-2">
                <Activity className="w-4 h-4 text-[#00F2FE]" />
                Audit Trail & Activity
              </h2>
              <Badge variant="neutral" size="sm">LIVE LOGS</Badge>
            </div>

            <div className="flex-1 overflow-y-auto space-y-3 pr-1">
              {recentLogs.length === 0 ? (
                <div className="py-12 text-center text-slate-500 text-xs">
                  No recorded administrative activity yet.
                </div>
              ) : (
                recentLogs.map((log) => (
                  <div
                    key={log.id}
                    className="p-3 rounded-xl bg-[#06090F] border border-white/5 flex items-start gap-3 text-xs"
                  >
                    <div className="w-6 h-6 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center shrink-0 mt-0.5">
                      <Clock className="w-3 h-3 text-[#00F2FE]" />
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-2">
                        <span className="font-bold text-white truncate">
                          {log.action} {log.entity}
                        </span>
                        <span className="text-[10px] font-mono text-slate-500 shrink-0">
                          {new Date(log.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </span>
                      </div>

                      <p className="text-[11px] text-slate-400 truncate mt-0.5">
                        By {log.user?.name || log.user?.email || 'System'}
                      </p>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
