'use client';

import React from 'react';
import Link from 'next/link';
import { ArrowUpRight } from 'lucide-react';

interface AtelierInsightsProps {
  insights: any[];
  isStandalone?: boolean;
}

export const AtelierInsights: React.FC<AtelierInsightsProps> = ({
  insights = [],
  isStandalone = false,
}) => {
  return (
    <section className={`relative bg-[#0A0A0A] text-[#F5F2EB] ${isStandalone ? 'pt-32 pb-24' : 'py-24 border-b border-white/[0.08]'}`}>
      <div className="max-w-6xl mx-auto px-6 sm:px-12 space-y-16">
        <div className="max-w-2xl space-y-3">
          <span className="text-xs font-mono uppercase tracking-[0.2em] text-stone-400 block">
            THE JOURNAL // 2026
          </span>
          <h2 className="text-3xl sm:text-5xl font-normal font-serif text-[#F5F2EB]">
            Architectural Essays & Critical Writing
          </h2>
          <p className="text-sm text-stone-400 leading-relaxed font-sans font-light">
            In-depth writings on software craftsmanship, systems permanence, and the philosophy of digital architecture.
          </p>
        </div>

        {/* Journal Entries List */}
        <div className="divide-y divide-white/[0.08] border-t border-b border-white/[0.08]">
          {insights.map((item: any, idx: number) => (
            <article key={item.id || idx} className="py-12 group">
              <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-baseline">
                <div className="md:col-span-2 text-xs font-mono text-stone-500">
                  {new Date(item.publishedAt || item.createdAt).toLocaleDateString()}
                </div>

                <div className="md:col-span-7 space-y-3">
                  <h3 className="text-2xl sm:text-3xl font-serif text-[#F5F2EB] group-hover:text-stone-300 transition-colors">
                    <Link href={`/insights/${item.slug}`}>
                      {item.title}
                    </Link>
                  </h3>
                  <p className="text-sm text-stone-400 font-sans font-light leading-relaxed">
                    {item.summary || item.content?.slice(0, 160)}
                  </p>
                </div>

                <div className="md:col-span-3 text-right">
                  <Link
                    href={`/insights/${item.slug}`}
                    className="inline-flex items-center gap-1.5 text-xs font-mono uppercase tracking-widest text-stone-400 group-hover:text-[#F5F2EB] transition-colors"
                  >
                    <span>Read Essay</span>
                    <span className="group-hover:translate-x-1 transition-transform">→</span>
                  </Link>
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
};
