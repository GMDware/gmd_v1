'use client';

import React from 'react';
import { GMDwareLogo } from '@/components/ui/GMDwareLogo';

export default function GlobalLoading() {
  return (
    <div
      role="status"
      aria-label="Loading platform resources"
      className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-[#05080F] text-white"
    >
      {/* Background ambient electric blue glow */}
      <div className="absolute w-96 h-96 bg-[#0066FF]/15 blur-[120px] pointer-events-none rounded-full" />
      <div className="absolute inset-0 blueprint-grid opacity-20 pointer-events-none" />

      <div className="relative z-10 flex flex-col items-center space-y-6 text-center">
        {/* Official GMDware Brand Logo */}
        <div className="p-4 rounded-2xl bg-[#070B14]/80 border border-white/10 backdrop-blur-xl shadow-2xl shadow-black/80">
          <GMDwareLogo size="lg" variant="full" interactive={false} />
        </div>

        {/* Telemetry Loading Bar & Status */}
        <div className="space-y-3 max-w-xs w-full">
          <div className="h-1 w-full bg-white/10 rounded-full overflow-hidden relative">
            <div className="h-full bg-gradient-to-r from-[#0066FF] to-[#00D2FF] w-1/2 rounded-full animate-[pulse_1.5s_ease-in-out_infinite]" />
          </div>

          <div className="flex items-center justify-between font-mono text-[10px] text-[#64748B] tracking-wider uppercase">
            <span className="flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-[#00D2FF] animate-ping" />
              <span>CORE: INITIALIZING</span>
            </span>
            <span>SYSTEM // READY</span>
          </div>
        </div>
      </div>
    </div>
  );
}
