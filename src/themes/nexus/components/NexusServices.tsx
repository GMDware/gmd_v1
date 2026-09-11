'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { ArrowUpRight, Cpu, Layers, ShieldCheck, Zap, Server, Code2, Globe2 } from 'lucide-react';

interface NexusServicesProps {
  services: any[];
  technologies?: any[];
  isStandalone?: boolean;
}

export const NexusServices: React.FC<NexusServicesProps> = ({
  services,
  technologies = [],
  isStandalone = false,
}) => {
  const [selectedIdx, setSelectedIdx] = useState(0);
  const activeService = services[selectedIdx] || services[0];

  return (
    <section className={`relative overflow-hidden bg-[#030509] ${isStandalone ? 'pt-32 pb-24' : 'py-24 border-t border-white/5'}`}>
      <div className="max-w-6xl mx-auto px-4 sm:px-8 relative z-10 space-y-12">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto space-y-4">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-purple-500/10 border border-purple-500/30 text-[11px] font-mono text-purple-300">
            <Zap className="w-3 h-3 text-[#00F2FE]" />
            <span>NETWORK CAPABILITIES // DISTRIBUTED ARCHITECTURE</span>
          </div>
          <h2 className="text-3xl sm:text-5xl font-black text-white tracking-tight font-sans">
            Modular Capabilities in the Living Fabric
          </h2>
          <p className="text-sm text-slate-400 leading-relaxed">
            Every software discipline operates as an integrated module within the GMDware network: responsive, isolated, and engineered for high availability.
          </p>
        </div>

        {/* Interactive Radial Capability Selector */}
        {services.length > 0 && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            {/* Left Column: Capability Nodes List (5 Cols) */}
            <div className="lg:col-span-5 space-y-3">
              {services.map((service: any, index: number) => {
                const isSelected = selectedIdx === index;
                return (
                  <button
                    key={service.id || index}
                    type="button"
                    onClick={() => setSelectedIdx(index)}
                    className={`w-full text-left p-5 rounded-2xl border transition-all duration-300 flex items-center justify-between group ${
                      isSelected
                        ? 'bg-gradient-to-r from-[#00F2FE]/15 to-purple-500/10 border-[#00F2FE]/50 shadow-[0_0_25px_rgba(0,242,254,0.15)]'
                        : 'bg-[#080D1A]/60 border-white/5 hover:border-white/15 text-slate-400 hover:text-white'
                    }`}
                  >
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className={`w-1.5 h-1.5 rounded-full ${isSelected ? 'bg-[#00F2FE] animate-pulse' : 'bg-slate-600'}`} />
                        <span className="text-[10px] font-mono tracking-widest text-slate-400 uppercase">
                          CAPABILITY // 0{index + 1}
                        </span>
                      </div>
                      <h3 className={`text-base font-bold font-sans ${isSelected ? 'text-white' : 'text-slate-300'}`}>
                        {service.title || service.name}
                      </h3>
                    </div>

                    <ArrowUpRight
                      className={`w-4 h-4 transition-transform ${
                        isSelected ? 'text-[#00F2FE] translate-x-0.5 -translate-y-0.5' : 'text-slate-600 group-hover:text-slate-400'
                      }`}
                    />
                  </button>
                );
              })}
            </div>

            {/* Right Column: Detailed Node Inspect Matrix (7 Cols) */}
            {activeService && (
              <div className="lg:col-span-7 p-8 rounded-3xl bg-[#080D1A]/85 border border-cyan-500/30 backdrop-blur-2xl shadow-[0_0_40px_rgba(0,0,0,0.6)] space-y-6 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-64 h-64 bg-cyan-500/10 blur-3xl rounded-full pointer-events-none" />

                <div className="space-y-3">
                  <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-[10px] font-mono text-[#00F2FE]">
                    <span>STATUS: HIGH-THROUGHPUT READY</span>
                  </div>
                  <h3 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
                    {activeService.title || activeService.name}
                  </h3>
                  <p className="text-sm text-slate-300 leading-relaxed">
                    {activeService.description || activeService.shortDescription}
                  </p>
                </div>

                {/* Features / Deliverables checklist */}
                {activeService.features && activeService.features.length > 0 && (
                  <div className="space-y-3 pt-4 border-t border-white/10">
                    <span className="text-xs font-mono text-[#00F2FE] uppercase tracking-wider block">
                      // ARCHITECTURAL DELIVERABLES
                    </span>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                      {activeService.features.map((feat: any, idx: number) => (
                        <div
                          key={idx}
                          className="flex items-center gap-2 p-2.5 rounded-xl bg-white/5 border border-white/5 text-xs text-slate-200 font-sans"
                        >
                          <span className="w-1.5 h-1.5 rounded-full bg-[#00F2FE] shrink-0" />
                          <span>{feat.title || feat}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Footer Action */}
                <div className="pt-4 flex items-center justify-between">
                  <Link
                    href="/contact"
                    className="inline-flex items-center gap-2 px-6 py-2.5 rounded-full bg-[#00F2FE] text-black font-bold text-xs shadow-lg shadow-[#00F2FE]/20 hover:bg-cyan-300 transition-colors"
                  >
                    <span>Request Node Deployment</span>
                    <ArrowUpRight className="w-3.5 h-3.5" />
                  </Link>

                  <span className="text-[11px] font-mono text-slate-500">
                    SLA: DETERMINISTIC PRODUCTION
                  </span>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </section>
  );
};
