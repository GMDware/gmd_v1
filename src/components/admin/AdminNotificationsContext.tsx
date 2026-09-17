'use client';

import React, { createContext, useContext, useState, useEffect, useCallback, useRef } from 'react';
import { useAdminToast } from './AdminToast';

export interface NotificationInquiry {
  id: string;
  fullName: string;
  email: string;
  companyName: string | null;
  projectType: string | null;
  message: string;
  status: string;
  createdAt: string;
}

interface NotificationsContextValue {
  unreadCount: number;
  totalInquiries: number;
  recentInquiries: NotificationInquiry[];
  loading: boolean;
  refresh: () => Promise<void>;
  markAllAsRead: () => Promise<void>;
  markAsRead: (id: string) => Promise<void>;
}

const NotificationsContext = createContext<NotificationsContextValue | null>(null);

export const useAdminNotifications = () => {
  const context = useContext(NotificationsContext);
  if (!context) {
    throw new Error('useAdminNotifications must be used within an AdminNotificationsProvider');
  }
  return context;
};

export const AdminNotificationsProvider: React.FC<{
  children: React.ReactNode;
  initialUnreadCount?: number;
}> = ({ children, initialUnreadCount = 0 }) => {
  const { toast } = useAdminToast();
  const [unreadCount, setUnreadCount] = useState<number>(initialUnreadCount);
  const [totalInquiries, setTotalInquiries] = useState<number>(0);
  const [recentInquiries, setRecentInquiries] = useState<NotificationInquiry[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const prevCountRef = useRef<number>(initialUnreadCount);
  const hasNotifiedRef = useRef<boolean>(false);

  const fetchNotifications = useCallback(async (isInitial = false) => {
    try {
      const res = await fetch('/api/v1/notifications');
      if (!res.ok) return;
      const json = await res.json();
      if (json.success && json.data) {
        const count = json.data.unreadCount ?? 0;
        const total = json.data.totalInquiries ?? 0;
        const items = json.data.recentInquiries ?? [];

        setUnreadCount(count);
        setTotalInquiries(total);
        setRecentInquiries(items);

        // Notify on entry if there are unread inquiries
        if (isInitial && count > 0 && !hasNotifiedRef.current) {
          hasNotifiedRef.current = true;
          toast(
            `${count} New Inquir${count === 1 ? 'y' : 'ies'} Awaiting Review`,
            {
              type: 'warning',
              description: `You have ${count} pending client inquiry submission${count === 1 ? '' : 's'} in your triage inbox.`,
              duration: 6000,
            }
          );
        } else if (!isInitial && count > prevCountRef.current) {
          // New inquiry arrived during live session
          const diff = count - prevCountRef.current;
          toast(
            `New Client Inquiry Received!`,
            {
              type: 'info',
              description: `${diff} new lead${diff === 1 ? '' : 's'} just submitted via the website contact form.`,
              duration: 7000,
            }
          );
        }

        prevCountRef.current = count;
      }
    } catch {
      // Silent catch for background polling
    } finally {
      setLoading(false);
    }
  }, [toast]);

  useEffect(() => {
    fetchNotifications(true);

    // Poll every 25 seconds for new inquiries
    const interval = setInterval(() => {
      fetchNotifications(false);
    }, 25000);

    // Also refetch when window gains focus
    const handleFocus = () => {
      fetchNotifications(false);
    };
    window.addEventListener('focus', handleFocus);

    return () => {
      clearInterval(interval);
      window.removeEventListener('focus', handleFocus);
    };
  }, [fetchNotifications]);

  const markAllAsRead = useCallback(async () => {
    try {
      const res = await fetch('/api/v1/notifications', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'MARK_ALL_READ' }),
      });
      if (res.ok) {
        setUnreadCount(0);
        setRecentInquiries((prev) =>
          prev.map((item) => ({ ...item, status: 'READ' }))
        );
        toast('Marked all inquiries as read', { type: 'success' });
      }
    } catch {
      toast('Failed to mark notifications as read', { type: 'error' });
    }
  }, [toast]);

  const markAsRead = useCallback(async (id: string) => {
    try {
      const res = await fetch('/api/v1/notifications', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, status: 'READ' }),
      });
      if (res.ok) {
        setUnreadCount((prev) => Math.max(0, prev - 1));
        setRecentInquiries((prev) =>
          prev.map((item) => (item.id === id ? { ...item, status: 'READ' } : item))
        );
      }
    } catch {
      // Silent error handling
    }
  }, []);

  return (
    <NotificationsContext.Provider
      value={{
        unreadCount,
        totalInquiries,
        recentInquiries,
        loading,
        refresh: () => fetchNotifications(false),
        markAllAsRead,
        markAsRead,
      }}
    >
      {children}
    </NotificationsContext.Provider>
  );
};
