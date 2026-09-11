import React from 'react';
import { cn } from '@/lib/utils';

interface StatusBeaconProps {
  status?: 'operational' | 'standby' | 'alert';
  label?: string;
  className?: string;
  size?: 'sm' | 'md';
}

export const StatusBeacon: React.FC<StatusBeaconProps> = ({
  status = 'operational',
  label = 'SYSTEM OPERATIONAL',
  size = 'sm',
  className,
}) => {
  const colors = {
    operational: {
      dot: 'bg-[#10B981]',
      ping: 'bg-[#10B981]',
      text: 'text-[#10B981]',
      border: 'border-[#10B981]/25',
    },
    standby: {
      dot: 'bg-[#F59E0B]',
      ping: 'bg-[#F59E0B]',
      text: 'text-[#F59E0B]',
      border: 'border-[#F59E0B]/25',
    },
    alert: {
      dot: 'bg-[#F43F5E]',
      ping: 'bg-[#F43F5E]',
      text: 'text-[#F43F5E]',
      border: 'border-[#F43F5E]/25',
    },
  };

  const current = colors[status];

  return (
    <div
      className={cn(
        'inline-flex items-center gap-2 px-2.5 py-1 rounded-full border bg-[#06090F]/90 backdrop-blur-sm select-none',
        current.border,
        className
      )}
    >
      <span className="relative flex h-2 w-2">
        <span
          className={cn(
            'animate-ping absolute inline-flex h-full w-full rounded-full opacity-75',
            current.ping
          )}
        />
        <span className={cn('relative inline-flex rounded-full h-2 w-2', current.dot)} />
      </span>

      {label && (
        <span
          className={cn(
            'font-mono tracking-[0.2em] uppercase font-semibold leading-none',
            size === 'sm' ? 'text-[10px]' : 'text-xs',
            current.text
          )}
        >
          {label}
        </span>
      )}
    </div>
  );
};
