'use client';

import React, { useEffect } from 'react';

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Log exception safely without exposing internal sensitive values
    console.error('CRITICAL // [GMD GLOBAL FAULT BOUNDARY INTERCEPT]:', error.digest || error.message);
  }, [error]);

  return (
    <html lang="en" className="dark">
      <body className="bg-[#05080F] text-[#E2E8F0] min-h-screen flex items-center justify-center p-4 antialiased font-sans">
        <div className="max-w-md w-full p-8 rounded-2xl bg-[#080D18] border border-red-500/20 shadow-2xl text-center space-y-6">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-red-500/10 border border-red-500/20 text-red-400 text-xs font-mono">
            <span>SYSTEM_FAILURE // ISOLATED</span>
          </div>

          <div className="space-y-2">
            <h1 className="text-2xl font-bold text-white tracking-tight">
              Application Critical Exception
            </h1>
            <p className="text-xs text-slate-400 leading-relaxed">
              A root application boundary caught an unrecoverable rendering exception. State isolation was maintained.
            </p>
          </div>

          <div className="p-3 rounded-lg bg-[#03060C] border border-white/5 font-mono text-[11px] text-slate-500">
            DIGEST: {error.digest || 'ERR_GLOBAL_BOUNDARY'}
          </div>

          <div className="pt-2 flex justify-center gap-3">
            <button
              onClick={() => reset()}
              className="px-4 py-2 rounded-lg bg-[#0066FF] hover:bg-[#0052CC] text-white text-xs font-medium transition-colors"
            >
              Re-initialize Platform
            </button>
            <button
              onClick={() => { window.location.href = '/'; }}
              className="px-4 py-2 rounded-lg bg-white/5 hover:bg-white/10 text-slate-300 text-xs font-medium border border-white/10 transition-colors"
            >
              Return to Home
            </button>
          </div>
        </div>
      </body>
    </html>
  );
}
