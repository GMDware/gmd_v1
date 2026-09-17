'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { BrandMark } from '@/components/ui/BrandMark';
import { Terminal, Cpu, Layers, Sparkles, Code2, Globe, Shield, Activity, RefreshCw } from 'lucide-react';
import { cn } from '@/lib/utils';

interface Step {
  id: number;
  label: string;
  tag: string;
  description: string;
}

const STEPS: Step[] = [
  { id: 1, label: 'Minimal GMD', tag: 'STAGE 01 — ORIGIN', description: 'Discrete coordinate input & origin vectors' },
  { id: 2, label: 'Grid Matrix', tag: 'STAGE 02 — COORDINATES', description: 'Orthogonal architectural grid generation' },
  { id: 3, label: 'Structural Lines', tag: 'STAGE 03 — VECTOR BUS', description: 'Hairline communication and data conduits' },
  { id: 4, label: 'Coordinate Nodes', tag: 'STAGE 04 — CROSSHAIRS', description: 'Precision topological intersection points' },
  { id: 5, label: 'Interface Fragments', tag: 'STAGE 05 — SCHEMATICS', description: 'Modular UI components & telemetry panels' },
  { id: 6, label: 'Typography', tag: 'STAGE 06 — HIERARCHY', description: 'Monospaced telemetry & bold display hierarchy' },
  { id: 7, label: 'Digital Product', tag: 'STAGE 07 — ASSEMBLY', description: 'Cohesive high-concurrency software platform' },
  { id: 8, label: 'GMDware Identity', tag: 'STAGE 08 — CONVERGENCE', description: 'Mission-critical digital flagship locked in production' },
];

export const HeroAssemblySystem: React.FC = () => {
  const [activeStep, setActiveStep] = useState(1);
  const [isAutoPlay, setIsAutoPlay] = useState(true);

  useEffect(() => {
    if (!isAutoPlay) return;
    const interval = setInterval(() => {
      setActiveStep((prev) => (prev >= 8 ? 1 : prev + 1));
    }, 2800);
    return () => clearInterval(interval);
  }, [isAutoPlay]);

  return (
    <div className="relative w-full max-w-4xl mx-auto gmd-panel rounded-2xl border border-white/10 bg-[#06090F]/90 overflow-hidden shadow-2xl shadow-black/80">
      {/* Precision Header Bar */}
      <div className="flex items-center justify-between px-4 py-2.5 bg-[#080D18] border-b border-white/[0.08] text-[11px] font-mono select-none">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-[#00D2FF] animate-pulse" />
          <span className="text-white font-semibold tracking-wider">
            SYSTEM ASSEMBLY — [COMPLEXITY → STRUCTURE → PRODUCT]
          </span>
        </div>

        <div className="flex items-center gap-3">
          <span className="text-[#64748B] hidden sm:inline">[CYCLE: 8 STAGES]</span>
          <button
            onClick={() => setIsAutoPlay(!isAutoPlay)}
            className="px-2 py-0.5 rounded bg-[#0E1526] border border-white/10 text-slate-300 hover:text-[#00D2FF] flex items-center gap-1 transition-colors cursor-pointer"
          >
            <RefreshCw className={cn('w-3 h-3', isAutoPlay && 'animate-spin')} />
            <span>{isAutoPlay ? 'AUTO' : 'PAUSED'}</span>
          </button>
        </div>
      </div>

      {/* Assembly Canvas Viewport */}
      <div className="relative h-72 sm:h-88 md:h-96 flex items-center justify-center p-6 overflow-hidden blueprint-grid">
        {/* Stage 1: Minimal GMD Origin Vectors */}
        <AnimatePresence>
          {activeStep >= 1 && (
            <motion.div
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.5 }}
              className="absolute flex items-center justify-center pointer-events-none"
            >
              <div className="w-16 h-16 rounded-full border border-[#0066FF]/40 flex items-center justify-center animate-ping opacity-30" />
            </motion.div>
          )}
        </AnimatePresence>

        {/* Stage 2 & 3: Grid Matrix & Structural Lines */}
        {activeStep >= 2 && (
          <svg className="absolute inset-0 w-full h-full pointer-events-none opacity-40" xmlns="http://www.w3.org/2000/svg">
            <line x1="0" y1="50%" x2="100%" y2="50%" stroke="#0066FF" strokeWidth="1" strokeDasharray="4 4" />
            <line x1="50%" y1="0" x2="50%" y2="100%" stroke="#0066FF" strokeWidth="1" strokeDasharray="4 4" />
            <circle cx="50%" cy="50%" r="90" stroke="rgba(0, 210, 255, 0.3)" strokeWidth="1" fill="none" />
            <circle cx="50%" cy="50%" r="160" stroke="rgba(255, 255, 255, 0.08)" strokeWidth="1" fill="none" />
          </svg>
        )}

        {/* Stage 4: Coordinate Nodes */}
        {activeStep >= 4 && (
          <div className="absolute inset-0 pointer-events-none flex items-center justify-center">
            <span className="absolute top-8 left-8 font-mono text-[10px] text-[#00D2FF]">[NODE_NW: 0.12]</span>
            <span className="absolute top-8 right-8 font-mono text-[10px] text-[#00D2FF]">[NODE_NE: 0.88]</span>
            <span className="absolute bottom-8 left-8 font-mono text-[10px] text-[#00D2FF]">[NODE_SW: 1.04]</span>
            <span className="absolute bottom-8 right-8 font-mono text-[10px] text-[#00D2FF]">[NODE_SE: 0.99]</span>
          </div>
        )}

        {/* Stage 5: Interface Fragments */}
        {activeStep >= 5 && (
          <div className="absolute inset-x-8 sm:inset-x-16 flex items-center justify-between pointer-events-none gap-4">
            <div className="hidden sm:block p-3 rounded-xl bg-[#080D18]/90 border border-white/10 shadow-lg font-mono text-[10px] text-[#64748B] space-y-1.5 animate-in slide-in-from-left duration-300">
              <div className="flex items-center gap-1.5 text-white font-semibold">
                <Terminal className="w-3 h-3 text-[#0066FF]" />
                <span>DAEMON — PID_801</span>
              </div>
              <p className="text-[#00D2FF]">status: listening_active</p>
              <p className="text-slate-400">concurrency: 50,000 req/s</p>
            </div>

            <div className="hidden sm:block p-3 rounded-xl bg-[#080D18]/90 border border-white/10 shadow-lg font-mono text-[10px] text-[#64748B] space-y-1.5 animate-in slide-in-from-right duration-300">
              <div className="flex items-center gap-1.5 text-white font-semibold">
                <Shield className="w-3 h-3 text-[#10B981]" />
                <span>MUTUAL_TLS</span>
              </div>
              <p className="text-[#10B981]">encryption: sha256_aes</p>
              <p className="text-slate-400">latency: 0.84ms</p>
            </div>
          </div>
        )}

        {/* Stage 6 & 7: Typography & Digital Product Cockpit */}
        <div className="relative z-10 text-center space-y-4 max-w-md mx-auto">
          {activeStep >= 6 && (
            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.4 }}
              className="space-y-1"
            >
              <span className="font-mono text-xs uppercase tracking-[0.25em] text-[#00D2FF]">
                // HIGH-CONCURRENCY DIGITAL FLAGSHIP
              </span>
              <h3 className="text-2xl sm:text-3xl font-extrabold text-white font-display tracking-tight leading-tight">
                Architectural Execution
              </h3>
            </motion.div>
          )}

          {/* Stage 8: GMDware Monolithic Brand Mark Convergence */}
          <div className="flex justify-center pt-2">
            <motion.div
              key={activeStep === 8 ? 'converged' : 'building'}
              initial={{ scale: 0.8 }}
              animate={{ scale: activeStep === 8 ? 1.15 : 1 }}
              transition={{ type: 'spring', stiffness: 200, damping: 15 }}
              className={cn(
                'p-4 rounded-2xl transition-all duration-500',
                activeStep === 8
                  ? 'bg-[#080D18] border-2 border-[#0066FF] shadow-[0_0_40px_rgba(0,102,255,0.4)]'
                  : 'bg-[#080D18]/80 border border-white/10'
              )}
            >
              <BrandMark size="lg" showLabel={activeStep >= 7} />
            </motion.div>
          </div>
        </div>
      </div>

      {/* Interactive Step Scrubber Footer */}
      <div className="p-4 bg-[#080D18] border-t border-white/[0.08] flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="space-y-0.5 text-center sm:text-left">
          <div className="font-mono text-xs text-[#00D2FF] font-semibold">
            {STEPS[activeStep - 1].tag}: {STEPS[activeStep - 1].label}
          </div>
          <p className="text-xs text-[#94A3B8] font-sans">
            {STEPS[activeStep - 1].description}
          </p>
        </div>

        {/* Step Navigation Dots */}
        <div className="flex items-center gap-1.5">
          {STEPS.map((step) => (
            <button
              key={step.id}
              onClick={() => {
                setActiveStep(step.id);
                setIsAutoPlay(false);
              }}
              className={cn(
                'w-6 h-6 rounded-md font-mono text-[10px] font-semibold transition-all duration-200 cursor-pointer flex items-center justify-center',
                activeStep === step.id
                  ? 'bg-[#0066FF] text-white shadow-[0_0_10px_rgba(0,102,255,0.5)]'
                  : 'bg-[#0E1526] text-[#64748B] hover:text-white border border-white/[0.05]'
              )}
              aria-label={`Jump to ${step.label}`}
            >
              {step.id}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};
