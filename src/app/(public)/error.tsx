'use client';

import React, { useEffect } from 'react';
import { Container } from '@/components/ui/Container';
import { Button } from '@/components/ui/Button';
import { Terminal, RefreshCw, AlertTriangle, Home } from 'lucide-react';
import Link from 'next/link';

export default function PublicErrorBoundary({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Log exception telemetry
    console.error('⚠️ [GMD // TELEMETRY EXCEPTION CAUGHT BY BOUNDARY]:', error);
  }, [error]);

  return (
    <div className="min-h-[70vh] flex items-center justify-center py-20 bg-[#05080F]">
      <Container size="narrow">
        <div className="gmd-panel rounded-3xl p-8 sm:p-12 border border-red-500/20 bg-[#080D18] shadow-2xl relative overflow-hidden space-y-8">
          {/* Ambient Alert Glow */}
          <div className="absolute top-0 right-0 w-80 h-80 bg-red-500/10 blur-[100px] pointer-events-none rounded-full" />
          <div className="absolute inset-0 blueprint-grid opacity-15 pointer-events-none" />

          {/* Header Console */}
          <div className="flex items-center justify-between border-b border-white/[0.08] pb-4 relative z-10 font-mono text-xs">
            <div className="flex items-center gap-2 text-red-400">
              <AlertTriangle className="w-4 h-4" />
              <span>SYSTEM_FAULT_TRAP // STATUS: ISOLATED</span>
            </div>
            <span className="text-[#64748B]">CORE_RUN_ID: {error.digest || 'ERR_RECOVERABLE'}</span>
          </div>

          {/* Diagnostic Message */}
          <div className="space-y-3 relative z-10">
            <h2 className="text-2xl sm:text-3xl font-black text-white font-display tracking-tight">
              Data Stream Interrupted
            </h2>
            <p className="text-sm text-[#94A3B8] leading-relaxed font-sans">
              An unexpected runtime exception was intercepted by the GMDware fault boundary. The core platform remains operational, and no persistent state was corrupted.
            </p>
          </div>

          {/* Architectural Telemetry Box */}
          <div className="p-4 rounded-xl bg-[#03060C] border border-white/[0.06] font-mono text-xs text-slate-400 space-y-2 relative z-10 overflow-x-auto">
            <div className="flex items-center gap-2 text-[#00D2FF]">
              <Terminal className="w-3.5 h-3.5" />
              <span>DIAGNOSTIC_TRACE</span>
            </div>
            <div className="text-red-300 text-[11px] break-all">
              {error.message || 'An unknown network or rendering fault occurred.'}
            </div>
            <div className="text-[#64748B] text-[10px]">
              TIMESTAMP: {new Date().toISOString()} // THREAD: CLIENT_ISOLATED
            </div>
          </div>

          {/* Recovery Actions */}
          <div className="flex flex-wrap items-center gap-4 relative z-10 pt-2">
            <Button
              variant="primary"
              size="md"
              leftIcon={<RefreshCw className="w-4 h-4" />}
              onClick={() => reset()}
            >
              Reset Systems Session
            </Button>
            <Link href="/">
              <Button variant="outline" size="md" leftIcon={<Home className="w-4 h-4" />}>
                Return to Command Center
              </Button>
            </Link>
          </div>
        </div>
      </Container>
    </div>
  );
}
