import React from 'react';
import { cn } from '@/lib/utils';

interface ContainerProps extends React.HTMLAttributes<HTMLDivElement> {
  size?: 'default' | 'narrow' | 'wide' | 'fluid';
  withCrosshairs?: boolean;
}

export const Container: React.FC<ContainerProps> = ({
  size = 'default',
  withCrosshairs = false,
  className,
  children,
  ...props
}) => {
  const maxWidths = {
    narrow: 'max-w-4xl',
    default: 'max-w-7xl',
    wide: 'max-w-[1440px]',
    fluid: 'max-w-full',
  };

  return (
    <div
      className={cn(
        'mx-auto px-4 sm:px-6 lg:px-8 w-full',
        maxWidths[size],
        withCrosshairs && 'crosshair-corner border-x border-white/[0.05]',
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
};
