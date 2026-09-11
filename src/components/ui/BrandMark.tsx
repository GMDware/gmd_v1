'use client';

import React from 'react';
import { GMDwareLogo, GMDwareLogoProps } from './GMDwareLogo';

export interface BrandMarkProps extends Omit<GMDwareLogoProps, 'showSubtitle'> {
  showLabel?: boolean;
}

/**
 * Standardized GMDware BrandMark component
 * Integrates the official high-resolution vector brand mark and typographic lockup.
 */
export const BrandMark: React.FC<BrandMarkProps> = ({
  showLabel = false,
  variant,
  ...props
}) => {
  return (
    <GMDwareLogo
      variant={variant || (showLabel ? 'full' : 'monogram')}
      showSubtitle={showLabel}
      {...props}
    />
  );
};
