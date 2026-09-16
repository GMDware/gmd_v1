'use client';

import React, { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { useAdminNotifications, NotificationInquiry } from './AdminNotificationsContext';
import {
  Bell,
  CheckCheck,
  Mail,
  ArrowRight,
  Sparkles,
  ExternalLink,
} from 'lucide-react';

export const AdminHeaderNotifications: React.FC = () => {
  const { unreadCount, recentInquiries, markAllAsRead, markAsRead } = useAdminNotifications();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      document.addEventListener('keydown', handleKeyDown);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen]);

  const formatTimeAgo = (dateString: string) => {
    try {
      const diff = Date.now() - new Date(dateString).getTime();
      const mins = Math.floor(diff / 60000);
      if (mins < 1) return 'Just now';
      if (mins < 60) return `${mins}m ago`;
      const hours = Math.floor(mins / 60);
      if (hours < 24) return `${hours}h ago`;
      const days = Math.floor(hours / 24);
      return `${days}d ago`;
    } catch {
      return '';
    }
  };

  return (
    <div className="relative" ref={dropdownRef}>
      {/* Bell Trigger Button */}
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        aria-label="Notifications Center"
        aria-expanded={isOpen}
        className={`relative p-2 rounded-xl transition-all border ${
          isOpen
            ? 'bg-white/10 text-white border-[#00F2FE]/40 shadow-[0_0_12px_rgba(0,242,254,0.2)]'
            : unreadCount > 0
            ? 'bg-amber-500/10 text-amber-300 border-amber-500/30 hover:bg-amber-500/20 hover:border-amber-500/50'
            : 'bg-white/5 text-slate-400 border-white/10 hover:text-white hover:bg-white/10'
        }`}
      >
        <Bell className="w-4 h-4" />

        {/* Pulsing indicator & count */}
        {unreadCount > 0 && (
          <>
            <span className="absolute -top-1 -right-1 w-2.5 h-2.5 rounded-full bg-amber-400 animate-ping opacity-75" />
            <span className="absolute -top-1 -right-1.5 min-w-[18px] h-[18px] px-1 rounded-full bg-gradient-to-r from-amber-500 to-orange-500 text-[10px] font-mono font-bold text-black flex items-center justify-center border border-black/40 shadow-[0_0_8px_rgba(245,158,11,0.5)]">
              {unreadCount > 99 ? '99+' : unreadCount}
            </span>
          </>
        )}
      </button>

      {/* Notifications Popover */}
      {isOpen && (
        <div className="absolute right-0 mt-3 w-80 sm:w-96 rounded-2xl bg-[#0B101B]/95 backdrop-blur-2xl border border-white/15 shadow-[0_20px_50px_rgba(0,0,0,0.8),0_0_25px_rgba(0,242,254,0.1)] z-50 overflow-hidden animate-in fade-in slide-in-from-top-2 duration-200">
          {/* Header */}
          <div className="p-4 border-b border-white/10 flex items-center justify-between bg-white/[0.02]">
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-white uppercase tracking-wider font-mono">
                Notifications
              </span>
              {unreadCount > 0 ? (
                <span className="px-2 py-0.5 text-[10px] font-mono font-bold rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/30">
                  {unreadCount} New
                </span>
              ) : (
                <span className="px-2 py-0.5 text-[10px] font-mono font-bold rounded-full bg-[#10B981]/20 text-[#10B981] border border-[#10B981]/30">
                  Caught Up
                </span>
              )}
            </div>

            {unreadCount > 0 && (
              <button
                type="button"
                onClick={() => markAllAsRead()}
                className="flex items-center gap-1.5 text-[11px] font-medium text-slate-400 hover:text-[#00F2FE] transition-colors"
              >
                <CheckCheck className="w-3.5 h-3.5" />
                Mark all read
              </button>
            )}
          </div>

          {/* List of Recent Notifications */}
          <div className="max-h-80 overflow-y-auto divide-y divide-white/5">
            {recentInquiries.length === 0 ? (
              <div className="p-8 text-center space-y-2">
                <div className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center mx-auto text-slate-500">
                  <Sparkles className="w-5 h-5 text-[#00F2FE]" />
                </div>
                <p className="text-xs font-medium text-slate-300">No unread inquiries</p>
                <p className="text-[11px] text-slate-500">All inbound messages have been addressed.</p>
              </div>
            ) : (
              recentInquiries.map((inq: NotificationInquiry) => {
                const isNew = inq.status === 'NEW';
                return (
                  <Link
                    key={inq.id}
                    href="/admin/inquiries"
                    onClick={() => {
                      if (isNew) markAsRead(inq.id);
                      setIsOpen(false);
                    }}
                    className={`p-3.5 block transition-colors hover:bg-white/5 ${
                      isNew ? 'bg-amber-500/[0.04]' : ''
                    }`}
                  >
                    <div className="flex items-start gap-3">
                      <div
                        className={`w-7 h-7 rounded-lg flex items-center justify-center shrink-0 mt-0.5 ${
                          isNew
                            ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
                            : 'bg-white/5 text-slate-400 border border-white/10'
                        }`}
                      >
                        <Mail className="w-3.5 h-3.5" />
                      </div>

                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between gap-2">
                          <span className="text-xs font-bold text-white truncate">
                            {inq.fullName}
                          </span>
                          <span className="text-[10px] font-mono text-slate-500 shrink-0">
                            {formatTimeAgo(inq.createdAt)}
                          </span>
                        </div>

                        <div className="text-[11px] text-[#00F2FE] font-mono truncate">
                          {inq.projectType || inq.companyName || inq.email}
                        </div>

                        <p className="text-[11px] text-slate-400 truncate mt-1">
                          {inq.message}
                        </p>
                      </div>

                      {isNew && (
                        <span className="w-2 h-2 rounded-full bg-amber-400 shrink-0 mt-1.5 shadow-[0_0_6px_#F59E0B]" />
                      )}
                    </div>
                  </Link>
                );
              })
            )}
          </div>

          {/* Footer */}
          <div className="p-3 border-t border-white/10 bg-[#06090F]/80 flex items-center justify-between text-xs">
            <span className="text-[11px] font-mono text-slate-500">
              Live Inbound Pipeline
            </span>
            <Link
              href="/admin/inquiries"
              onClick={() => setIsOpen(false)}
              className="flex items-center gap-1.5 text-xs font-medium text-[#00F2FE] hover:text-white transition-colors"
            >
              Open Inquiries
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>
      )}
    </div>
  );
};
