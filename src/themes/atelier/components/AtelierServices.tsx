'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { ArrowUpRight } from 'lucide-react';

interface AtelierServicesProps {
  services: any[];
  technologies?: any[];
  isStandalone?: boolean;
}

export const AtelierServices: React.FC<AtelierServicesProps> = ({
  services,
  isStandalone = false,
}) => {
  const [hoveredIdx, setHoveredIdx] = useState<number | null>(null);

  return (
    <section className={`relative bg-[#0A0A0A] text-[#F5F2EB] ${isStandalone ? 'pt-32 pb-24' : 'py-24 border-b border-white/[0.08]'}`}>
      <div className="max-w-6xl mx-auto px-6 sm:px-12 space-y-16">
        {/* Section Header */}
        <div className="max-w-2xl space-y-3">
          <span className="text-xs font-mono uppercase tracking-[0.2em] text-stone-400 block">
            CAPABILITIES DIRECTORY // 2026
          </span>
          <h2 className="text-3xl sm:text-5xl font-normal font-serif text-[#F5F2EB]">
            Disciplined Software Practices
          </h2>
          <p className="text-sm text-stone-400 leading-relaxed font-sans">
            We focus on a tightly curated spectrum of engineering disciplines where our principal practitioners hold deep mastery.
          </p>
        </div>

        {/* Numbered Editorial Services List */}
        <div className="divide-y divide-white/[0.08] border-t border-b border-white/[0.08]">
          {services.map((service: any, index: number) => {
            const isHovered = hoveredIdx === index;
            return (
              <div
                key={service.id || index}
                onMouseEnter={() => setHoveredIdx(index)}
                onMouseLeave={() => setHoveredIdx(null)}
                className="py-10 transition-colors duration-300 group"
              >
                <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-start">
                  <div className="md:col-span-1 text-xs font-mono text-stone-500 pt-1">
                    0{index + 1}
                  </div>

                  <div className="md:col-span-5 space-y-2">
                    <h3 className="text-2xl sm:text-3xl font-serif text-[#F5F2EB] group-hover:text-white transition-colors">
                      {service.title || service.name}
                    </h3>
                  </div>

                  <div className="md:col-span-6 space-y-4">
                    <p className="text-sm text-stone-400 leading-relaxed font-sans font-light">
                      {service.description || service.shortDescription}
                    </p>

                    {service.features && service.features.length > 0 && (
                      <div className="flex flex-wrap gap-2 pt-2">
                        {service.features.map((feat: any, fIdx: number) => (
                          <span
                            key={fIdx}
                            className="px-2.5 py-0.5 rounded border border-white/10 text-[11px] font-mono text-stone-400"
                          >
                            {feat.title || feat}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Footer Note */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-4 text-xs font-mono text-stone-500">
          <span>ALL COMMISSIONS ARE LED DIRECTLY BY PRINCIPAL ARCHITECTS.</span>
          <Link
            href="/contact"
            className="text-xs uppercase tracking-widest text-[#F5F2EB] hover:underline"
          >
            Request Engagement Specifications →
          </Link>
        </div>
      </div>
    </section>
  );
};
