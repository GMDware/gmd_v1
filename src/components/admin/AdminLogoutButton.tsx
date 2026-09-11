'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { LogOut } from 'lucide-react';

export const AdminLogoutButton: React.FC = () => {
  const router = useRouter();

  const handleLogout = async () => {
    try {
      await fetch('/api/auth/logout', { method: 'POST' });
      router.push('/admin/login');
      router.refresh();
    } catch {
      router.push('/admin/login');
    }
  };

  return (
    <button
      onClick={handleLogout}
      className="p-1.5 rounded-lg text-slate-400 hover:text-[#F43F5E] hover:bg-white/5 transition-colors cursor-pointer"
      title="Terminate Session"
    >
      <LogOut className="w-4 h-4" />
    </button>
  );
};
