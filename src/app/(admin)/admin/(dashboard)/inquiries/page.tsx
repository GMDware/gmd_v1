'use client';

import React, { useState, useEffect } from 'react';
import { AdminBreadcrumb } from '@/components/admin/AdminBreadcrumb';
import { useAdminToast } from '@/components/admin/AdminToast';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import {
  Mail,
  Search,
  CheckCircle2,
  Clock,
  Archive,
  Phone,
  Building,
  DollarSign,
  Save,
  X,
  ExternalLink,
  MessageSquare,
  AlertCircle,
  Filter,
  Copy,
  Check,
  Zap,
} from 'lucide-react';

interface ContactSubmission {
  id: string;
  name: string;
  fullName?: string;
  email: string;
  phone?: string | null;
  company?: string | null;
  companyName?: string | null;
  projectType?: string | null;
  budgetRange?: string | null;
  timeline?: string | null;
  message: string;
  status: 'NEW' | 'READ' | 'IN_PROGRESS' | 'CONTACTED' | 'ARCHIVED';
  adminNotes?: string | null;
  notes?: string | null;
  createdAt: string;
  updatedAt?: string;
}

const STATUS_FILTERS = ['ALL', 'NEW', 'READ', 'IN_PROGRESS', 'CONTACTED', 'ARCHIVED'];

export default function AdminInquiriesPage() {
  const { success, error } = useAdminToast();
  const [submissions, setSubmissions] = useState<ContactSubmission[]>([]);
  const [loading, setLoading] = useState(true);

  // Filters
  const [search, setSearch] = useState('');
  const [activeStatus, setActiveStatus] = useState('ALL');

  // Detail Modal
  const [selectedInquiry, setSelectedInquiry] = useState<ContactSubmission | null>(null);
  const [adminNotes, setAdminNotes] = useState('');
  const [updating, setUpdating] = useState(false);
  const [copiedId, setCopiedId] = useState(false);

  useEffect(() => {
    loadSubmissions();
  }, []);

  const loadSubmissions = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/v1/contact/submissions');
      const json = await res.json();
      if (json.success && json.data) {
        const rawItems = Array.isArray(json.data)
          ? json.data
          : (json.data.submissions || json.data.items || []);
        const mapped: ContactSubmission[] = rawItems.map((s: any) => ({
          id: s.id,
          name: s.fullName || s.name || 'Anonymous',
          fullName: s.fullName || s.name || 'Anonymous',
          email: s.email || '',
          phone: s.phone || null,
          company: s.companyName || s.company || null,
          companyName: s.companyName || s.company || null,
          projectType: s.projectType || null,
          budgetRange: s.budgetRange || null,
          timeline: s.timeline || null,
          message: s.message || '',
          status: s.status || 'NEW',
          adminNotes: s.notes || s.adminNotes || null,
          notes: s.notes || s.adminNotes || null,
          createdAt: s.createdAt,
          updatedAt: s.updatedAt,
        }));
        setSubmissions(mapped);
      }
    } catch {
      error('Failed to load contact inquiries');
    } finally {
      setLoading(false);
    }
  };

  const handleOpenDetail = async (inquiry: ContactSubmission) => {
    setSelectedInquiry(inquiry);
    setAdminNotes(inquiry.adminNotes || inquiry.notes || '');

    // If status is NEW, automatically transition to READ
    if (inquiry.status === 'NEW') {
      try {
        await fetch(`/api/v1/contact/submissions/${inquiry.id}`, {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ status: 'READ' }),
        });
        setSubmissions((prev) =>
          prev.map((s) => (s.id === inquiry.id ? { ...s, status: 'READ' } : s))
        );
        setSelectedInquiry((prev) => (prev ? { ...prev, status: 'READ' } : null));
      } catch {
        // Silent failure for read marker
      }
    }
  };

  const handleUpdateStatus = async (newStatus: ContactSubmission['status']) => {
    if (!selectedInquiry) return;
    setUpdating(true);
    try {
      const res = await fetch(`/api/v1/contact/submissions/${selectedInquiry.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus, notes: adminNotes, adminNotes }),
      });

      const json = await res.json();
      if (json.success) {
        success(`Inquiry marked as ${newStatus}`);
        setSubmissions((prev) =>
          prev.map((s) =>
            s.id === selectedInquiry.id ? { ...s, status: newStatus, adminNotes, notes: adminNotes } : s
          )
        );
        setSelectedInquiry((prev) => (prev ? { ...prev, status: newStatus, adminNotes, notes: adminNotes } : null));
      } else {
        error(json.error?.message || json.error || 'Failed to update status');
      }
    } catch {
      error('Network error updating status');
    } finally {
      setUpdating(false);
    }
  };

  const handleSaveNotes = async () => {
    if (!selectedInquiry) return;
    setUpdating(true);
    try {
      const res = await fetch(`/api/v1/contact/submissions/${selectedInquiry.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ notes: adminNotes, adminNotes }),
      });

      const json = await res.json();
      if (json.success) {
        success('Internal notes saved');
        setSubmissions((prev) =>
          prev.map((s) => (s.id === selectedInquiry.id ? { ...s, adminNotes, notes: adminNotes } : s))
        );
      } else {
        error(json.error?.message || json.error || 'Failed to save notes');
      }
    } catch {
      error('Failed to save notes');
    } finally {
      setUpdating(false);
    }
  };

  const filteredSubmissions = submissions.filter((s) => {
    const matchesStatus = activeStatus === 'ALL' || s.status === activeStatus;
    const nameStr = s.fullName || s.name || '';
    const emailStr = s.email || '';
    const companyStr = s.companyName || s.company || '';
    const phoneStr = s.phone || '';
    const msgStr = s.message || '';
    const searchLower = search.toLowerCase();

    const matchesSearch =
      nameStr.toLowerCase().includes(searchLower) ||
      emailStr.toLowerCase().includes(searchLower) ||
      companyStr.toLowerCase().includes(searchLower) ||
      phoneStr.includes(search) ||
      msgStr.toLowerCase().includes(searchLower);

    return matchesStatus && matchesSearch;
  });

  return (
    <div className="space-y-6">
      <AdminBreadcrumb items={[{ label: 'Inbound Inquiries' }]} />

      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/5 pb-4">
        <div>
          <h1 className="text-2xl font-bold text-white tracking-tight">
            Inbound Client Submissions & Triage Queue
          </h1>
          <p className="text-xs text-slate-400">
            Confidential partner engagement requests, architectural consultations, and RFPs.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Badge variant="cyan" size="sm">
            {submissions.filter((s) => s.status === 'NEW').length} NEW INQUIRIES
          </Badge>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
        <div className="flex items-center gap-1 overflow-x-auto no-scrollbar">
          {STATUS_FILTERS.map((st) => (
            <button
              key={st}
              type="button"
              onClick={() => setActiveStatus(st)}
              className={`px-3 py-1.5 rounded-lg text-xs font-mono transition-colors shrink-0 ${
                activeStatus === st
                  ? 'bg-[#00F2FE]/15 text-[#00F2FE] border border-[#00F2FE]/30 font-bold'
                  : 'bg-[#0A0E17] text-slate-400 border border-white/5 hover:text-white'
              }`}
            >
              {st} {st !== 'ALL' && `(${submissions.filter((s) => s.status === st).length})`}
            </button>
          ))}
        </div>

        <div className="relative">
          <Search className="w-3.5 h-3.5 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search inquiries by name, company, email, phone..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full sm:w-72 pl-8 pr-3 py-1.5 bg-[#0A0E17] border border-white/10 rounded-lg text-xs text-white focus:outline-none focus:border-[#00F2FE]"
          />
        </div>
      </div>

      {/* Inquiries Table */}
      {loading ? (
        <div className="py-20 text-center text-slate-500 font-mono text-xs">
          Loading client submissions from database...
        </div>
      ) : filteredSubmissions.length === 0 ? (
        <div className="py-20 text-center border border-dashed border-white/10 rounded-2xl space-y-3 bg-[#0A0E17]/20">
          <Mail className="w-10 h-10 text-slate-600 mx-auto" />
          <h3 className="text-sm font-bold text-white">No inquiries found</h3>
          <p className="text-xs text-slate-400">
            {search || activeStatus !== 'ALL'
              ? 'Try changing your status filter or search term.'
              : 'Incoming submissions from the public /contact form will appear here.'}
          </p>
        </div>
      ) : (
        <div className="glass-panel rounded-xl border border-white/10 overflow-hidden bg-[#0A0E17]/40">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-white/5 text-slate-400 font-mono bg-[#06090F]">
                  <th className="p-4 font-semibold">Sender / Client</th>
                  <th className="p-4 font-semibold">Project & Scope</th>
                  <th className="p-4 font-semibold">Submitted</th>
                  <th className="p-4 font-semibold">Triage Status</th>
                  <th className="p-4 font-semibold text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5 text-slate-300">
                {filteredSubmissions.map((inq) => {
                  const isNew = inq.status === 'NEW';

                  return (
                    <tr
                      key={inq.id}
                      onClick={() => handleOpenDetail(inq)}
                      className="hover:bg-white/5 cursor-pointer transition-colors"
                    >
                      <td className="p-4">
                        <div className="flex items-center gap-2">
                          {isNew && <span className="w-2 h-2 rounded-full bg-[#00F2FE] shrink-0" />}
                          <div>
                            <strong className="text-white block font-medium">{inq.fullName || inq.name}</strong>
                            <span className="text-[11px] text-slate-400 font-mono block">{inq.email}</span>
                            {inq.phone && (
                              <span className="text-[10px] text-[#00F2FE] font-mono flex items-center gap-1 mt-0.5">
                                <Phone className="w-2.5 h-2.5" />
                                {inq.phone}
                              </span>
                            )}
                          </div>
                        </div>
                      </td>

                      <td className="p-4">
                        <div className="space-y-0.5">
                          <div className="flex items-center gap-1.5 flex-wrap">
                            <span className="text-white block font-mono text-[11px]">
                              {inq.projectType || 'General Engagement'}
                            </span>
                            {(inq.budgetRange?.includes('< $5,000') ||
                              inq.budgetRange?.toLowerCase().includes('flexible') ||
                              inq.adminNotes?.includes('Scoped Discovery')) && (
                              <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded bg-[#00F2FE]/10 border border-[#00F2FE]/30 text-[#00F2FE] text-[9px] font-mono uppercase">
                                <Zap className="w-2.5 h-2.5" />
                                Discovery Route
                              </span>
                            )}
                          </div>
                          <span className="text-[11px] text-slate-500 block">
                            {inq.companyName || inq.company || 'Private Partner'} {inq.budgetRange && `• ${inq.budgetRange}`}
                          </span>
                          {inq.timeline && (
                            <span className="text-[10px] text-slate-500 font-mono block">
                              Timeline: {inq.timeline}
                            </span>
                          )}
                        </div>
                      </td>

                      <td className="p-4 font-mono text-[11px] text-slate-400">
                        {new Date(inq.createdAt).toLocaleDateString()}
                      </td>

                      <td className="p-4">
                        {inq.status === 'NEW' && <Badge variant="cyan" size="sm">NEW</Badge>}
                        {inq.status === 'READ' && <Badge variant="neutral" size="sm">READ</Badge>}
                        {inq.status === 'IN_PROGRESS' && <Badge variant="amber" size="sm">IN PROGRESS</Badge>}
                        {inq.status === 'CONTACTED' && <Badge variant="emerald" size="sm">CONTACTED</Badge>}
                        {inq.status === 'ARCHIVED' && <Badge variant="rose" size="sm">ARCHIVED</Badge>}
                      </td>

                      <td className="p-4 text-right">
                        <Button size="sm" variant="ghost">
                          View
                        </Button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Inquiry Detail Drawer / Modal */}
      {selectedInquiry && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-sm animate-in fade-in"
        >
          <div className="relative w-full max-w-2xl bg-[#0A0E17] border border-white/10 rounded-2xl shadow-2xl flex flex-col max-h-[90vh] overflow-hidden">
            {/* Header */}
            <div className="p-6 border-b border-white/5 flex items-center justify-between shrink-0 bg-[#06090F]">
              <div>
                <h2 className="text-base font-bold text-white tracking-tight flex items-center gap-2">
                  <Mail className="w-5 h-5 text-[#00F2FE]" />
                  <span>Inbound Technical Inquiry</span>
                </h2>
                <span className="text-[11px] font-mono text-slate-500">
                  Received: {new Date(selectedInquiry.createdAt).toLocaleString()}
                </span>
              </div>

              <button
                type="button"
                onClick={() => setSelectedInquiry(null)}
                className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-white/5"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="flex-1 overflow-y-auto p-6 space-y-6">
              {/* SYSTEM METADATA STRIP */}
              <div className="flex flex-wrap items-center justify-between gap-3 p-3 rounded-xl bg-[#05070B] border border-white/5 text-xs font-mono">
                <div className="flex items-center gap-2">
                  <span className="text-slate-500">INQUIRY ID:</span>
                  <span className="text-slate-300 font-bold text-[11px]">{selectedInquiry.id}</span>
                  <button
                    type="button"
                    onClick={() => {
                      navigator.clipboard.writeText(selectedInquiry.id);
                      setCopiedId(true);
                      setTimeout(() => setCopiedId(false), 2000);
                    }}
                    className="p-1 rounded hover:bg-white/5 text-slate-400 hover:text-white transition-colors"
                    title="Copy Inquiry ID"
                  >
                    {copiedId ? <Check className="w-3.5 h-3.5 text-[#10B981]" /> : <Copy className="w-3.5 h-3.5" />}
                  </button>
                </div>

                <div className="flex items-center gap-2">
                  <span className="text-slate-500">STATUS:</span>
                  {selectedInquiry.status === 'NEW' && <Badge variant="cyan" size="sm">NEW</Badge>}
                  {selectedInquiry.status === 'READ' && <Badge variant="neutral" size="sm">READ</Badge>}
                  {selectedInquiry.status === 'IN_PROGRESS' && <Badge variant="amber" size="sm">IN PROGRESS</Badge>}
                  {selectedInquiry.status === 'CONTACTED' && <Badge variant="emerald" size="sm">CONTACTED</Badge>}
                  {selectedInquiry.status === 'ARCHIVED' && <Badge variant="rose" size="sm">ARCHIVED</Badge>}
                </div>
              </div>

              {/* CLIENT INFORMATION SECTION */}
              <div className="space-y-2">
                <span className="font-mono text-xs text-[#00F2FE] uppercase tracking-wider block font-bold">
                  // CLIENT CONTACT PARAMETERS
                </span>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 p-4 rounded-xl bg-[#05070B] border border-white/5 text-xs">
                  <div>
                    <span className="font-mono text-[10px] text-slate-500 uppercase block mb-0.5">FULL NAME</span>
                    <strong className="text-white block truncate">{selectedInquiry.fullName || selectedInquiry.name}</strong>
                  </div>

                  <div>
                    <span className="font-mono text-[10px] text-slate-500 uppercase block mb-0.5">EMAIL ADDRESS</span>
                    <a href={`mailto:${selectedInquiry.email}`} className="text-[#00F2FE] hover:underline truncate block font-mono">
                      {selectedInquiry.email}
                    </a>
                  </div>

                  <div>
                    <span className="font-mono text-[10px] text-slate-500 uppercase block mb-0.5">PHONE NUMBER</span>
                    {selectedInquiry.phone ? (
                      <a href={`tel:${selectedInquiry.phone}`} className="text-slate-200 hover:text-[#00F2FE] truncate block font-mono">
                        {selectedInquiry.phone}
                      </a>
                    ) : (
                      <span className="text-slate-500 font-mono">Not provided</span>
                    )}
                  </div>

                  <div>
                    <span className="font-mono text-[10px] text-slate-500 uppercase block mb-0.5">COMPANY / ORG</span>
                    <span className="text-slate-300 block truncate">{selectedInquiry.companyName || selectedInquiry.company || 'Unspecified'}</span>
                  </div>
                </div>
              </div>

              {/* PROJECT SCOPE & TIMELINE */}
              <div className="space-y-2">
                <span className="font-mono text-xs text-[#00F2FE] uppercase tracking-wider block font-bold">
                  // PROJECT SPECIFICATIONS
                </span>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 p-4 rounded-xl bg-[#05070B] border border-white/5 text-xs font-mono">
                  <div>
                    <span className="text-[10px] text-slate-500 uppercase block mb-0.5">PROJECT TYPE</span>
                    <span className="text-white font-medium">{selectedInquiry.projectType || 'General Engagement'}</span>
                  </div>

                  <div>
                    <span className="text-[10px] text-slate-500 uppercase block mb-0.5">EST. BUDGET</span>
                    <span className="text-[#10B981] font-bold">{selectedInquiry.budgetRange || 'Flexible'}</span>
                  </div>

                  <div>
                    <span className="text-[10px] text-slate-500 uppercase block mb-0.5">TARGET TIMELINE</span>
                    <span className="text-slate-300">{selectedInquiry.timeline || 'Unspecified'}</span>
                  </div>
                </div>

                {/* Scoped Discovery Pipeline Routing Indicator */}
                {(selectedInquiry.budgetRange?.includes('< $5,000') ||
                  selectedInquiry.budgetRange?.toLowerCase().includes('flexible') ||
                  selectedInquiry.adminNotes?.includes('Scoped Discovery')) && (
                  <div className="p-3 rounded-xl bg-[#00F2FE]/10 border border-[#00F2FE]/25 flex items-start gap-2.5 text-xs text-[#00F2FE]">
                    <Zap className="w-4 h-4 shrink-0 mt-0.5 text-[#00F2FE]" />
                    <div className="space-y-0.5">
                      <span className="font-mono font-bold block uppercase tracking-wide">
                        [PIPELINE ROUTE: SCOPED DISCOVERY CALL]
                      </span>
                      <p className="text-slate-300 font-sans">
                        Client selected an entry tier or flexible consultation budget ({selectedInquiry.budgetRange || 'Flexible'}). Routed directly for a scoped discovery call rather than filtered out.
                      </p>
                    </div>
                  </div>
                )}
              </div>

              {/* Message Payload */}
              <div className="space-y-2">
                <span className="font-mono text-xs text-slate-400 uppercase tracking-wider block">
                  Project Description & Specifications
                </span>
                <div className="p-4 rounded-xl bg-[#05070B] border border-white/5 text-xs text-slate-200 whitespace-pre-wrap leading-relaxed">
                  {selectedInquiry.message}
                </div>
              </div>

              {/* Triage Status Transitions */}
              <div className="space-y-2 pt-2 border-t border-white/5">
                <span className="font-mono text-xs text-slate-400 uppercase tracking-wider block">
                  Workflow Triage State
                </span>
                <div className="flex flex-wrap gap-2">
                  {(['READ', 'IN_PROGRESS', 'CONTACTED', 'ARCHIVED'] as const).map((st) => (
                    <button
                      key={st}
                      type="button"
                      disabled={updating || selectedInquiry.status === st}
                      onClick={() => handleUpdateStatus(st)}
                      className={`px-3 py-1.5 rounded-lg text-xs font-mono font-bold transition-all disabled:opacity-50 ${
                        selectedInquiry.status === st
                          ? 'bg-[#00F2FE] text-[#05070B]'
                          : 'bg-white/5 text-slate-300 hover:bg-white/10'
                      }`}
                    >
                      Mark {st}
                    </button>
                  ))}
                </div>
              </div>

              {/* Internal Admin Notes */}
              <div className="space-y-2 pt-2 border-t border-white/5">
                <div className="flex items-center justify-between">
                  <span className="font-mono text-xs text-slate-400 uppercase tracking-wider">
                    Internal Engineering & Response Notes
                  </span>
                  <button
                    type="button"
                    onClick={handleSaveNotes}
                    disabled={updating}
                    className="text-[11px] text-[#00F2FE] hover:underline font-mono"
                  >
                    Save Notes
                  </button>
                </div>

                <textarea
                  rows={3}
                  value={adminNotes}
                  onChange={(e) => setAdminNotes(e.target.value)}
                  placeholder="Record internal notes, assigned architect, or meeting takeaways..."
                  className="w-full px-3.5 py-2 bg-[#05070B] border border-white/10 rounded-lg text-xs text-white focus:outline-none focus:border-[#00F2FE]"
                />
              </div>
            </div>

            {/* Footer */}
            <div className="p-4 border-t border-white/5 flex items-center justify-between bg-[#06090F] shrink-0">
              <a
                href={`mailto:${selectedInquiry.email}?subject=GMDware Architectural Consultation — ${selectedInquiry.fullName || selectedInquiry.name}`}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-[#00F2FE] text-[#05070B] font-bold text-xs hover:bg-[#00D2DD] transition-colors"
              >
                <Mail className="w-4 h-4" />
                <span>Reply via Email Client</span>
              </a>

              <Button type="button" variant="ghost" size="sm" onClick={() => setSelectedInquiry(null)}>
                Close
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
