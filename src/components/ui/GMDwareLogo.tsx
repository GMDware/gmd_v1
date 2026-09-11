'use client';

import React, { useState } from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import { cn } from '@/lib/utils';

export interface GMDwareLogoProps {
  variant?: 'full' | 'monogram' | 'compact';
  size?: 'sm' | 'md' | 'lg' | 'xl';
  showSubtitle?: boolean;
  interactive?: boolean;
  className?: string;
}

/**
 * Official High-Resolution GMDware Brand Identity Logo
 * Features:
 * - GMD monogram with signature electric blue / cyan dynamic accent on the diagonal bar of the 'M'
 * - Clean transparency with crisp white lettering
 * - Refined drop-shadow / ambient blue glow: drop-shadow-[0_0_12px_rgba(59,130,246,0.25)]
 * - Full lockup: GMDware: Software & Technology
 */
export const GMDwareLogo: React.FC<GMDwareLogoProps> = ({
  variant = 'full',
  size = 'md',
  showSubtitle = true,
  interactive = true,
  className,
}) => {
  const [isHovered, setIsHovered] = useState(false);
  const shouldReduceMotion = useReducedMotion();

  const sizeStyles = {
    sm: {
      svgHeight: 24,
      svgWidth: 34,
      titleText: 'text-sm',
      subText: 'text-[8px] tracking-[0.22em]',
      gap: 'gap-2.5',
    },
    md: {
      svgHeight: 30,
      svgWidth: 42,
      titleText: 'text-base',
      subText: 'text-[9px] tracking-[0.24em]',
      gap: 'gap-3',
    },
    lg: {
      svgHeight: 38,
      svgWidth: 52,
      titleText: 'text-xl',
      subText: 'text-[10px] tracking-[0.25em]',
      gap: 'gap-3.5',
    },
    xl: {
      svgHeight: 48,
      svgWidth: 66,
      titleText: 'text-2xl',
      subText: 'text-xs tracking-[0.28em]',
      gap: 'gap-4',
    },
  };

  const current = sizeStyles[size];
  const isKinetic = interactive && !shouldReduceMotion && isHovered;

  return (
    <div
      className={cn(
        'inline-flex items-center select-none group transition-all duration-300',
        current.gap,
        className
      )}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* ── Monogram SVG Mark ── */}
      <svg
        width={current.svgWidth}
        height={current.svgHeight}
        viewBox="0 0 50 36"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="shrink-0 drop-shadow-[0_0_12px_rgba(59,130,246,0.25)] group-hover:drop-shadow-[0_0_18px_rgba(0,210,255,0.45)] transition-all duration-300 overflow-visible"
        aria-hidden="true"
      >
        <defs>
          {/* Signature Electric Blue / Cyan Dynamic Accent */}
          <linearGradient id="gmd-electric-blue" x1="0%" y1="100%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#0066FF" />
            <stop offset="50%" stopColor="#0099FF" />
            <stop offset="100%" stopColor="#00D2FF" />
          </linearGradient>

          {/* Core White Illumination */}
          <linearGradient id="gmd-white-glow" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#FFFFFF" />
            <stop offset="100%" stopColor="#E2E8F0" />
          </linearGradient>

          {/* Dynamic Bloom Filter */}
          <filter id="gmd-accent-bloom" x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation="2.5" result="blur" />
            <feComposite in="SourceGraphic" in2="blur" operator="over" />
          </filter>
        </defs>

        {/* ── [G] Architectural Glyph: Crisp White ── */}
        <motion.path
          d="M 14 8 H 7 C 4.2 8 2.5 10.2 2.5 13.5 V 22.5 C 2.5 25.8 4.2 28 7 28 H 14 C 16.8 28 18.5 25.8 18.5 22.5 V 18 H 10"
          stroke="url(#gmd-white-glow)"
          strokeWidth="3"
          strokeLinecap="round"
          strokeLinejoin="round"
          animate={{
            x: isKinetic ? -0.8 : 0,
          }}
          transition={{ type: 'spring', stiffness: 350, damping: 25 }}
        />

        {/* ── [M] Left Pillar: Crisp White ── */}
        <motion.path
          d="M 20.5 28 V 8"
          stroke="url(#gmd-white-glow)"
          strokeWidth="3"
          strokeLinecap="round"
          animate={{
            y: isKinetic ? -0.5 : 0,
          }}
          transition={{ type: 'spring', stiffness: 350, damping: 25 }}
        />

        {/* ── [M] Left Diagonal Descent: Crisp White ── */}
        <motion.path
          d="M 20.5 8 L 26 20"
          stroke="url(#gmd-white-glow)"
          strokeWidth="3"
          strokeLinecap="round"
          strokeLinejoin="round"
        />

        {/* ── [M] SIGNATURE DYNAMIC BLUE ACCENT (Right Diagonal Ascent) ── */}
        <motion.path
          d="M 26 20 L 31.5 8"
          stroke="url(#gmd-electric-blue)"
          strokeWidth="3.4"
          strokeLinecap="round"
          strokeLinejoin="round"
          filter="url(#gmd-accent-bloom)"
          animate={{
            strokeWidth: isKinetic ? 4 : 3.4,
          }}
          transition={{ type: 'spring', stiffness: 400, damping: 20 }}
        />

        {/* ── [M] Right Pillar: Crisp White ── */}
        <motion.path
          d="M 31.5 8 V 28"
          stroke="url(#gmd-white-glow)"
          strokeWidth="3"
          strokeLinecap="round"
          animate={{
            y: isKinetic ? -0.5 : 0,
          }}
          transition={{ type: 'spring', stiffness: 350, damping: 25 }}
        />

        {/* ── [D] Architectural Glyph: Crisp White ── */}
        <motion.path
          d="M 36 8 V 28 M 36 8 H 40 C 45 8 47.5 12 47.5 18 C 47.5 24 45 28 40 28 H 36"
          stroke="url(#gmd-white-glow)"
          strokeWidth="3"
          strokeLinecap="round"
          strokeLinejoin="round"
          animate={{
            x: isKinetic ? 0.8 : 0,
          }}
          transition={{ type: 'spring', stiffness: 350, damping: 25 }}
        />

        {/* Signature Precision Coordinate Reticle Dot */}
        <motion.circle
          cx="26"
          cy="20"
          r={isKinetic ? 2.2 : 1.4}
          fill="#00D2FF"
          animate={{
            scale: isKinetic ? 1.6 : 1,
            opacity: isKinetic ? 1 : 0.85,
          }}
          transition={{ type: 'spring', stiffness: 400, damping: 20 }}
        />
      </svg>

      {/* ── Typographic Brand Lockup ── */}
      {variant !== 'monogram' && (
        <div className="flex flex-col text-left">
          <div className="flex items-baseline font-display tracking-tight leading-none">
            <span
              className={cn(
                'font-black text-white tracking-tight drop-shadow-[0_0_12px_rgba(255,255,255,0.2)]',
                current.titleText
              )}
            >
              GMD<span className="font-light text-slate-100">ware</span>
            </span>
          </div>

          {variant === 'full' && showSubtitle && (
            <span
              className={cn(
                'font-mono uppercase text-[#94A3B8] group-hover:text-[#00D2FF] transition-colors duration-200 mt-1 font-semibold leading-none',
                current.subText
              )}
            >
              Software &amp; Technology
            </span>
          )}
        </div>
      )}
    </div>
  );
};
