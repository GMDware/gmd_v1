'use client';

import React from 'react';
import { cn } from '@/lib/utils';
import { Loader2 } from 'lucide-react';
import { useCursor } from '@/components/motion/CursorProvider';

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger';
  size?: 'sm' | 'md' | 'lg';
  isLoading?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  cursorExpand?: boolean;
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      className,
      variant = 'primary',
      size = 'md',
      isLoading = false,
      leftIcon,
      rightIcon,
      children,
      disabled,
      cursorExpand = true,
      onMouseEnter,
      onMouseLeave,
      ...props
    },
    ref
  ) => {
    const { setCursorState } = useCursor();

    const baseStyles =
      'group inline-flex items-center justify-center font-medium tracking-tight transition-all duration-300 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed rounded-lg focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-[#05080F] select-none active:scale-[0.98] relative overflow-hidden';

    const variants = {
      primary:
        'bg-[#0066FF] text-white font-semibold hover:bg-[#0052CC] shadow-[0_0_25px_-5px_rgba(0,102,255,0.4)] hover:shadow-[0_0_35px_-3px_rgba(0,102,255,0.7)] focus:ring-[#0066FF]',
      secondary:
        'bg-[#080D18] text-[#E2E8F0] hover:text-[#00D2FF] hover:bg-[#0E1526] border border-white/10 hover:border-[#0066FF]/50 focus:ring-white/20',
      outline:
        'bg-transparent text-white border border-white/20 hover:border-[#00D2FF] hover:text-[#00D2FF] hover:shadow-[0_0_20px_-5px_rgba(0,210,255,0.3)] focus:ring-[#00D2FF]',
      ghost:
        'bg-transparent text-[#94A3B8] hover:text-white hover:bg-white/[0.05] focus:ring-white/10',
      danger:
        'bg-[#F43F5E] text-white hover:bg-[#E11D48] shadow-lg shadow-[#F43F5E]/20 focus:ring-[#F43F5E]',
    };

    const sizes = {
      sm: 'text-xs px-3.5 py-1.5 gap-1.5 font-mono tracking-wider',
      md: 'text-sm px-5 py-2.5 gap-2 font-medium',
      lg: 'text-base px-7 py-3.5 gap-2.5 font-semibold',
    };

    const handleMouseEnter = (e: React.MouseEvent<HTMLButtonElement>) => {
      if (cursorExpand) setCursorState('hover');
      onMouseEnter?.(e);
    };

    const handleMouseLeave = (e: React.MouseEvent<HTMLButtonElement>) => {
      if (cursorExpand) setCursorState('default');
      onMouseLeave?.(e);
    };

    return (
      <button
        ref={ref}
        disabled={disabled || isLoading}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        className={cn(baseStyles, variants[variant], sizes[size], className)}
        {...props}
      >
        {isLoading ? (
          <Loader2 className="w-4 h-4 animate-spin text-current" />
        ) : (
          leftIcon && <span className="shrink-0 transition-transform duration-200 group-hover:scale-110">{leftIcon}</span>
        )}
        <span className="transition-transform duration-200 group-hover:translate-x-0.5">{children}</span>
        {!isLoading && rightIcon && (
          <span className="shrink-0 transition-transform duration-200 group-hover:translate-x-1 group-hover:-translate-y-0.5">
            {rightIcon}
          </span>
        )}
      </button>
    );
  }
);

Button.displayName = 'Button';
