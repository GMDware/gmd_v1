import React from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/Button';
import { StatusBeacon } from '@/components/ui/StatusBeacon';
import { ArrowUpRight, ShieldCheck, Terminal, Sparkles } from 'lucide-react';

interface CallToActionProps {
  headline?: string;
  subtitle?: string;
  buttonLabel?: string;
  buttonUrl?: string;
}

export const CallToAction: React.FC<CallToActionProps> = ({
  headline = 'Ready to Build Your Next Digital Product?',
  subtitle = "Let's discuss how our engineering team can help bring your vision to life with craftsmanship, performance, and scale.",
  buttonLabel = 'Start a Project',
  buttonUrl = '/contact',
}) => {
  return (
    <section className="relative gmd-panel rounded-3xl p-8 sm:p-12 lg:p-16 overflow-hidden border border-white/10 bg-gradient-to-b from-[#080D18] via-[#05080F] to-[#020408]">
      {/* Precision Blueprint Coordinate Grid Overlay */}
      <div className="absolute inset-0 blueprint-grid-dense opacity-30 pointer-events-none" />

      {/* Subtle Ambient Glow Behind Action Area */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-[#0066FF]/10 rounded-full blur-3xl pointer-events-none" />

      <div className="relative z-10 max-w-4xl mx-auto text-center space-y-8">
        {/* Display Headline */}
        <h2 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold text-white font-display tracking-tight leading-[1.1]">
          {headline}
        </h2>

        {/* Subtitle */}
        <p className="text-base sm:text-lg text-[#94A3B8] max-w-2xl mx-auto leading-relaxed font-sans">
          {subtitle}
        </p>

        {/* Action Triggers */}
        <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-4">
          <Link href={buttonUrl || '/contact'} className="w-full sm:w-auto">
            <Button
              variant="primary"
              size="lg"
              className="w-full sm:w-auto justify-center"
              rightIcon={<ArrowUpRight className="w-4 h-4" />}
            >
              {buttonLabel}
            </Button>
          </Link>

          <Link href="/work" className="w-full sm:w-auto">
            <Button
              variant="secondary"
              size="lg"
              className="w-full sm:w-auto justify-center"
            >
              View Our Work
            </Button>
          </Link>
        </div>

        {/* Technical Guarantee Rail */}
        <div className="pt-8 border-t border-white/[0.06] flex flex-wrap items-center justify-center gap-6 sm:gap-10 text-xs text-[#94A3B8]">
          <span className="flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-[#0066FF]" />
            <span>Strict Confidentiality</span>
          </span>
          <span className="hidden sm:inline text-white/20">•</span>
          <span className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-[#00D2FF]" />
            <span>Response within 24h</span>
          </span>
          <span className="hidden sm:inline text-white/20">•</span>
          <span>Direct Engineering Collaboration</span>
        </div>
      </div>
    </section>
  );
};
