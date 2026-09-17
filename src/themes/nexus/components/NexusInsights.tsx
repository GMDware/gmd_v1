'use client';

import React from 'react';
import Link from 'next/link';
import { Orbit, ArrowUpRight, Sparkles, Clock } from 'lucide-react';

interface NexusInsightsProps {
  insights: any[];
  isStandalone?: boolean;
}

export const NexusInsights: React.FC<NexusInsightsProps> = ({
  insights = [],
  isStandalone = false,
}) => {
  return (
    <section className={`relative overflow-hidden bg-[#030509] ${isStandalone ? 'pt-32 pb-24' : 'py-24 border-t border-white/5'}`}>
      <div className="max-w-6xl mx-auto px-4 sm:px-8 relative z-10 space-y-12">
        <div className="space-y-3 max-w-3xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/25 text-[11px] font-mono text-[#00F2FE]">
            <Orbit className="w-3 h-3" />
            <span>DISPATCH ARCHIVE — SYSTEMS RESEARCH</span>
          </div>
          <h2 className="text-3xl sm:text-5xl font-black text-white tracking-tight font-sans">
            Technical Essays & Node Dispatches
          </h2>
          <p className="text-sm text-slate-400 leading-relaxed">
            First-principles engineering essays on distributed computing, memory topologies, deterministic concurrency, and fluid digital design.
          </p>
        </div>

        {insights.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {insights.map((item: any, idx: number) => (
              <Link
                key={item.id || idx}
                href={`/insights/${item.slug}`}
                className="group p-8 rounded-3xl bg-[#080D1A]/70 border border-cyan-500/20 hover:border-cyan-400/50 backdrop-blur-xl transition-all duration-300 flex flex-col justify-between space-y-6"
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between text-xs font-mono text-cyan-400">
                    <span>DISPATCH — 0{idx + 1}</span>
                    <span className="text-slate-500 flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      {item.readingTimeMinutes ? `${item.readingTimeMinutes} min read` : '5 min read'}
                    </span>
                  </div>

                  <h3 className="text-xl sm:text-2xl font-bold text-white group-hover:text-[#00F2FE] transition-colors leading-snug">
                    {item.title}
                  </h3>

                  <p className="text-xs sm:text-sm text-slate-400 line-clamp-3 leading-relaxed">
                    {item.summary || item.content?.slice(0, 160)}
                  </p>
                </div>

                <div className="pt-4 border-t border-white/5 flex items-center justify-between text-xs font-mono">
                  <span className="text-slate-400">
                    By {item.author?.name || 'Principal Architect'}
                  </span>
                  <span className="text-[#00F2FE] flex items-center gap-1 group-hover:translate-x-1 transition-transform">
                    <span>Read Essay</span>
                    <ArrowUpRight className="w-3 h-3" />
                  </span>
                </div>
              </Link>
            ))}
          </div>
        ) : (
          <div className="p-10 rounded-2xl bg-[#080D1A]/50 border border-white/5 text-center text-slate-400 text-xs font-mono">
            // DISPATCH ARCHIVE IS CURRENTLY CALIBRATING.
          </div>
        )}
      </div>
    </section>
  );
};
