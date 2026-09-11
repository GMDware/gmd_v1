'use client';

import React, { createContext, useContext, useEffect } from 'react';
import { ThemeId, ThemeMetadata } from '@/lib/theme/types';
import { THEME_METADATA_REGISTRY } from '@/lib/theme/registry';

interface ThemeContextType {
  themeId: ThemeId;
  metadata: ThemeMetadata;
  isPreview: boolean;
}

const ThemeContext = createContext<ThemeContextType>({
  themeId: 'systems',
  metadata: THEME_METADATA_REGISTRY.systems,
  isPreview: false,
});

export const useTheme = () => useContext(ThemeContext);

interface ThemeProviderProps {
  themeId: ThemeId;
  isPreview?: boolean;
  children: React.ReactNode;
}

export const ThemeProvider: React.FC<ThemeProviderProps> = ({
  themeId,
  isPreview = false,
  children,
}) => {
  const metadata = THEME_METADATA_REGISTRY[themeId] || THEME_METADATA_REGISTRY.systems;

  useEffect(() => {
    // Set active theme attribute on document root for high-level CSS scoping if needed
    document.documentElement.setAttribute('data-theme', themeId);
  }, [themeId]);

  return (
    <ThemeContext.Provider value={{ themeId, metadata, isPreview }}>
      {children}
    </ThemeContext.Provider>
  );
};
