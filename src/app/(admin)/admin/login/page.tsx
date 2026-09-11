'use client';

import React, { useState, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Lock, Mail, AlertCircle, ArrowRight } from 'lucide-react';
import Link from 'next/link';
import { GMDwareLogo } from '@/components/ui/GMDwareLogo';

function AdminLoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectTarget = searchParams.get('redirect') || '/admin';

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      const json = await res.json();

      if (!res.ok || !json.success) {
        throw new Error(json.error?.message || 'Authentication failed');
      }

      router.push(redirectTarget);
      router.refresh();
    } catch (err: any) {
      setError(err.message || 'Unable to authenticate');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="glass-panel rounded-2xl p-8 border border-white/10 shadow-2xl space-y-6">
      {error && (
        <div className="p-3.5 rounded-lg bg-[#F43F5E]/10 border border-[#F43F5E]/20 flex items-center gap-2.5 text-xs text-[#F43F5E]">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      <form onSubmit={handleLogin} className="space-y-4">
        <Input
          label="Administrative Email"
          type="email"
          required
          autoComplete="email"
          placeholder="name@gmdware.com"
          leftElement={<Mail className="w-4 h-4" />}
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <Input
          label="Password / Secret Key"
          type="password"
          required
          autoComplete="current-password"
          placeholder="••••••••••••"
          leftElement={<Lock className="w-4 h-4" />}
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        <div className="pt-2">
          <Button
            type="submit"
            variant="primary"
            size="md"
            className="w-full"
            isLoading={isLoading}
            rightIcon={<ArrowRight className="w-4 h-4" />}
          >
            Authenticate & Access CMS
          </Button>
        </div>
      </form>
    </div>
  );
}

export default function AdminLoginPage() {
  return (
    <div className="min-h-screen bg-[#05070B] flex flex-col justify-center items-center px-4 sm:px-6 relative">
      {/* Background radial aura */}
      <div className="absolute w-[500px] h-[500px] bg-gradient-to-tr from-[#00F2FE]/10 via-[#4FACFE]/5 to-transparent blur-[120px] pointer-events-none" />

      <div className="w-full max-w-md relative z-10 space-y-8">
        {/* Brand Header */}
        <div className="text-center space-y-3">
          <Link href="/" className="inline-flex items-center gap-2.5 group" aria-label="GMDware Home">
            <GMDwareLogo size="lg" variant="full" />
          </Link>
          <h1 className="text-2xl font-bold text-white tracking-tight">
            Administrative Control Center
          </h1>
          <p className="text-xs text-slate-400">
            Authorized personnel only. Sessions are cryptographically signed.
          </p>
        </div>

        <Suspense fallback={<div className="glass-panel rounded-2xl p-8 text-center text-xs text-slate-400">Loading authentication portal...</div>}>
          <AdminLoginForm />
        </Suspense>

        <div className="text-center">
          <Link href="/" className="text-xs text-slate-500 hover:text-slate-300 font-mono transition-colors">
            ← Return to Public Experience
          </Link>
        </div>
      </div>
    </div>
  );
}
