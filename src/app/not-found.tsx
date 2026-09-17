import React from 'react';
import Link from 'next/link';
import { Container } from '@/components/ui/Container';
import { Button } from '@/components/ui/Button';
import { GMDwareLogo } from '@/components/ui/GMDwareLogo';
import { Home, Compass, Terminal } from 'lucide-react';

export default function NotFound() {
  return (
    <div className="min-h-screen bg-[#05080F] text-[#E2E8F0] flex flex-col justify-center items-center px-4 relative overflow-hidden">
      {/* Background ambient lighting */}
      <div className="absolute top-1/3 -left-40 w-96 h-96 bg-[#00F2FE]/10 blur-[140px] pointer-events-none rounded-full" />
      <div className="absolute bottom-1/3 -right-40 w-96 h-96 bg-[#4FACFE]/10 blur-[140px] pointer-events-none rounded-full" />
      <div className="absolute inset-0 blueprint-grid opacity-15 pointer-events-none" />

      <Container size="narrow" className="relative z-10 text-center space-y-8">
        {/* Brand Link */}
        <div className="flex justify-center">
          <Link href="/" className="inline-flex items-center gap-2.5 group" aria-label="GMDware Home">
            <GMDwareLogo size="md" variant="full" />
          </Link>
        </div>

        {/* 404 Visual Panel */}
        <div className="glass-panel rounded-3xl p-8 sm:p-12 border border-white/10 shadow-2xl space-y-6">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-cyan-500/10 border border-cyan-500/20 text-[#00F2FE] text-xs font-mono">
            <Terminal className="w-3.5 h-3.5" />
            <span>HTTP_STATUS — 404_NOT_FOUND</span>
          </div>

          <h1 className="text-4xl sm:text-6xl font-black font-mono tracking-tight text-white">
            404
          </h1>

          <div className="space-y-2">
            <h2 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
              Requested Endpoint Not Found
            </h2>
            <p className="text-sm text-slate-400 max-w-md mx-auto leading-relaxed">
              The specified URI does not map to an active service topology, case study, or administrative resource.
            </p>
          </div>

          {/* Navigation Action Buttons */}
          <div className="flex flex-wrap items-center justify-center gap-3 pt-4">
            <Link href="/">
              <Button variant="primary" size="md" leftIcon={<Home className="w-4 h-4" />}>
                Return to Headquarters
              </Button>
            </Link>
            <Link href="/work">
              <Button variant="outline" size="md" leftIcon={<Compass className="w-4 h-4" />}>
                Explore Architecture Portfolio
              </Button>
            </Link>
          </div>
        </div>

        <div className="text-xs font-mono text-slate-500">
          GMDware Core Platform — v1.0 Production
        </div>
      </Container>
    </div>
  );
}
