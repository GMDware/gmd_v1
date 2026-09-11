import React from 'react';
import { cn } from '@/lib/utils';

export interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: 'cyan' | 'cobalt' | 'emerald' | 'amber' | 'rose' | 'violet' | 'neutral';
  size?: 'sm' | 'md';
}

export const Badge: React.FC<BadgeProps> = ({
  className,
  variant = 'cyan',
  size = 'md',
  children,
  ...props
}) => {
  const variants = {
    cyan: 'bg-[#00D2FF]/10 text-[#00D2FF] border-[#00D2FF]/25',
    cobalt: 'bg-[#0066FF]/15 text-[#0066FF] border-[#0066FF]/35 font-medium',
    emerald: 'bg-[#10B981]/10 text-[#10B981] border-[#10B981]/25',
    amber: 'bg-[#F59E0B]/10 text-[#F59E0B] border-[#F59E0B]/25',
    rose: 'bg-[#F43F5E]/10 text-[#F43F5E] border-[#F43F5E]/25',
    violet: 'bg-[#0066FF]/10 text-[#80B3FF] border-[#0066FF]/20', // Deprecated alias mapped to soft cobalt
    neutral: 'bg-white/[0.04] text-[#94A3B8] border-white/10',
  };

  const sizes = {
    sm: 'text-[10px] px-2 py-0.5 tracking-wider uppercase font-mono font-medium',
    md: 'text-xs px-2.5 py-1 font-mono tracking-wide',
  };

  return (
    <span
      className={cn(
        'inline-flex items-center rounded-md border transition-colors select-none',
        variants[variant],
        sizes[size],
        className
      )}
      {...props}
    >
      {children}
    </span>
  );
};
