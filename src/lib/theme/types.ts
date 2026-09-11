import React from 'react';

export type ThemeId = 'systems' | 'nexus' | 'atelier';

export interface ThemeVisualIdentity {
  primaryFont: string;
  displayFont: string;
  monoFont: string;
  colorScheme: 'dark' | 'hybrid';
  baseBg: string;
  baseText: string;
  accentColor: string;
  secondaryAccent: string;
  borderColor: string;
  cardBg: string;
}

export interface ThemeMetadata {
  id: ThemeId;
  name: string;
  version: string;
  tagline: string;
  concept: string;
  studioPhilosophy: string;
  paletteDescription: string;
  previewBg: string;
  previewAccent: string;
  tags: string[];
}

export interface ThemeDefinition {
  meta: ThemeMetadata;
  tokens: ThemeVisualIdentity;
}
