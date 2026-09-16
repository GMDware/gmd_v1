'use client';

import React from 'react';
import Image from 'next/image';
import { motion, useReducedMotion } from 'framer-motion';
import { cn } from '@/lib/utils';

export interface GMDwareLogoProps {
  variant?: 'full' | 'monogram' | 'compact';
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  theme?: 'auto' | 'light' | 'dark';
  showSubtitle?: boolean;
  interactive?: boolean;
  className?: string;
  priority?: boolean;
}

/**
 * Official High-Resolution GMDware Brand Identity Logo
 * Implements the official company emblem:
 * - Geometric GMD monogram with signature royal electric blue accent slash on the 'M'
 * - Modern typography: "GMDware Software & Technology"
 * - Adaptive light/dark rendering:
 *    • Light theme: rich dark-slate glyphs with electric blue accent for clean readability on light canvases
 *    • Dark theme: illuminated crisp white glyphs with glowing electric blue accent for dark canvases
 */
export const GMDwareLogo: React.FC<GMDwareLogoProps> = ({
  variant = 'full',
  size = 'md',
  theme = 'auto',
  interactive = true,
  className,
  priority = false,
}) => {
  const shouldReduceMotion = useReducedMotion();

  // Dimensions based on trimmed aspect ratio (Full logo is ~1.86:1, Monogram mark is ~3.14:1)
  const fullSizeStyles = {
    xs: { height: 24, width: 45, className: 'h-6 w-auto' },
    sm: { height: 32, width: 60, className: 'h-8 w-auto' },
    md: { height: 42, width: 78, className: 'h-10 w-auto' },
    lg: { height: 54, width: 100, className: 'h-[52px] w-auto' },
    xl: { height: 72, width: 134, className: 'h-[72px] w-auto' },
  };

  const markSizeStyles = {
    xs: { height: 16, width: 50, className: 'h-4 w-auto' },
    sm: { height: 22, width: 69, className: 'h-[22px] w-auto' },
    md: { height: 28, width: 88, className: 'h-7 w-auto' },
    lg: { height: 36, width: 113, className: 'h-9 w-auto' },
    xl: { height: 48, width: 150, className: 'h-12 w-auto' },
  };

  const isMonogram = variant === 'monogram';
  const current = isMonogram ? markSizeStyles[size] : fullSizeStyles[size];

  const lightSrc = isMonogram
    ? '/brand/logo-mark-dark.png'
    : '/brand/logo-dark.png';

  const darkSrc = isMonogram
    ? '/brand/logo-mark.png'
    : '/brand/logo.png';

  return (
    <motion.div
      className={cn(
        'inline-flex items-center select-none group transition-all duration-300 relative',
        className
      )}
      whileHover={interactive && !shouldReduceMotion ? { scale: 1.03 } : undefined}
      transition={{ duration: 0.2, ease: 'easeOut' }}
    >
      {/* ── 1. Light Theme Logo (Dark-slate glyphs with royal electric blue slash) ── */}
      {(theme === 'auto' || theme === 'light') && (
        <div
          className={cn(
            'transition-opacity duration-200',
            theme === 'auto' ? 'dark:hidden block' : 'block'
          )}
        >
          <Image
            src={lightSrc}
            alt="GMDware Software & Technology"
            width={current.width}
            height={current.height}
            unoptimized
            priority={priority}
            className={cn(
              'object-contain transition-all duration-300 drop-shadow-[0_1px_2px_rgba(0,0,0,0.06)] group-hover:drop-shadow-[0_4px_12px_rgba(37,99,235,0.18)]',
              current.className
            )}
          />
        </div>
      )}

      {/* ── 2. Dark Theme Logo (Illuminated white glyphs with electric blue glow) ── */}
      {(theme === 'auto' || theme === 'dark') && (
        <div
          className={cn(
            'transition-opacity duration-200',
            theme === 'auto' ? 'hidden dark:block' : 'block'
          )}
        >
          <Image
            src={darkSrc}
            alt="GMDware Software & Technology"
            width={current.width}
            height={current.height}
            unoptimized
            priority={priority}
            className={cn(
              'object-contain transition-all duration-300 drop-shadow-[0_0_12px_rgba(37,99,235,0.25)] group-hover:drop-shadow-[0_0_18px_rgba(0,180,255,0.45)]',
              current.className
            )}
          />
        </div>
      )}
    </motion.div>
  );
};
