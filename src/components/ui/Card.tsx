import React from 'react';
import { cn } from '@/lib/utils';

export interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  glow?: boolean;
}

export const Card: React.FC<CardProps> = ({ className, glow = false, children, ...props }) => {
  return (
    <div
      className={cn(
        'glass-card rounded-xl p-6 relative overflow-hidden',
        glow && 'hover:border-[#00F2FE]/40 hover:shadow-[0_0_30px_rgba(0,242,254,0.15)]',
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
};
