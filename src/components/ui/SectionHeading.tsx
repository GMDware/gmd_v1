import React from 'react';
import { cn } from '@/lib/utils';

interface SectionHeadingProps {
  tag?: string;
  title: string | React.ReactNode;
  subtitle?: string;
  align?: 'left' | 'center';
  action?: React.ReactNode;
  className?: string;
}

export const SectionHeading: React.FC<SectionHeadingProps> = ({
  tag,
  title,
  subtitle,
  align = 'left',
  action,
  className,
}) => {
  return (
    <div
      className={cn(
        'mb-12 md:mb-16',
        align === 'center' ? 'text-center mx-auto max-w-3xl' : 'flex flex-col md:flex-row md:items-end md:justify-between gap-6',
        className
      )}
    >
      <div className={cn('space-y-3', align === 'center' ? 'mx-auto' : 'max-w-2xl')}>
        {tag && (
          <div className={cn('flex items-center gap-2', align === 'center' && 'justify-center')}>
            <span className="inline-block w-2 h-2 rounded-full bg-[#0066FF] animate-pulse" />
            <span className="font-mono text-xs tracking-[0.25em] uppercase text-[#00D2FF]">
              {tag}
            </span>
          </div>
        )}

        <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-white tracking-tight font-display leading-[1.1]">
          {title}
        </h2>

        {subtitle && (
          <p className="text-base sm:text-lg text-[#94A3B8] leading-relaxed pt-1 font-sans">
            {subtitle}
          </p>
        )}
      </div>

      {action && (
        <div className={cn('shrink-0', align === 'center' && 'mt-6 flex justify-center')}>
          {action}
        </div>
      )}
    </div>
  );
};
