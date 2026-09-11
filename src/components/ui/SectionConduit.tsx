import React from 'react';
import { cn } from '@/lib/utils';

interface SectionConduitProps {
  label?: string;
  height?: 'sm' | 'md' | 'lg';
  className?: string;
}

/**
 * SectionConduit
 * A precision structural connector that visually binds adjacent sections together,
 * eliminating disjointed blocks and establishing continuous narrative flow.
 */
export const SectionConduit: React.FC<SectionConduitProps> = ({
  label,
  height = 'md',
  className,
}) => {
  const heights = {
    sm: 'h-12',
    md: 'h-20',
    lg: 'h-28',
  };

  return (
    <div className={cn('relative flex flex-col items-center justify-center my-4 select-none', className)}>
      {/* Central Hairline Conduit */}
      <div className={cn('w-[1px] bg-gradient-to-b from-[#0066FF] via-white/20 to-transparent relative', heights[height])}>
        {/* Animated Flow Pulse */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-1.5 h-1.5 rounded-full bg-[#00D2FF] animate-ping opacity-75" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-1 h-3 rounded-full bg-[#0066FF]" />
      </div>

      {label && (
        <span className="font-mono text-[9px] uppercase tracking-[0.25em] text-[#64748B] mt-2">
          {label}
        </span>
      )}
    </div>
  );
};
