import { ThemeId, ThemeMetadata, ThemeVisualIdentity } from './types';

export const DEFAULT_THEME_ID: ThemeId = 'systems';

export const THEME_METADATA_REGISTRY: Record<ThemeId, ThemeMetadata> = {
  systems: {
    id: 'systems',
    name: 'GMDware SYSTEMS',
    version: '1.0.0',
    tagline: 'Architectural / Technical / Cinematic',
    concept: 'Architectural precision, telemetry grids, and distributed engineering rigor.',
    studioPhilosophy:
      'Engineered as a high-density telemetry terminal for enterprises requiring deterministic computation, structural resilience, and architectural proof.',
    paletteDescription: 'Black Void (#05080F), Cobalt Blue (#0066FF), Restrained Cyan (#00D2FF), Monospace Rails',
    previewBg: '#05080F',
    previewAccent: '#0066FF',
    tags: ['Architectural', 'Cinematic', 'Telemetry', 'Distributed Systems'],
  },
  nexus: {
    id: 'nexus',
    name: 'GMDware NEXUS',
    version: '1.0.0',
    tagline: 'Futuristic / Immersive / Networked',
    concept: 'The interconnected digital future: living nodes, orbital energy pathways, and generative spatial continuity.',
    studioPhilosophy:
      'Designed as a living digital ecosystem where every product, service, and data pipeline acts as an interconnected node inside a fluid generative continuum.',
    paletteDescription: 'Cosmic Obsidian (#030509), Electric Cyan (#00F2FE), Violet Nebula (#7F00FF), Luminous Nodes',
    previewBg: '#030509',
    previewAccent: '#00F2FE',
    tags: ['Orbital', 'Fluid Network', 'Spatial Ecosystem', 'Generative'],
  },
  atelier: {
    id: 'atelier',
    name: 'GMDware ATELIER',
    version: '2.0.0',
    tagline: 'Modern / Editorial / Thoughtful',
    concept: 'Modern creative software studio: light-forward editorial design, clear typography, and thoughtful digital products.',
    studioPhilosophy:
      'Designed as a modern creative software studio combining clean typography, generous whitespace, and focused presentation of digital products.',
    paletteDescription: 'Clean Paper (#FFFFFF / #FBFBFA), Slate Ink (#0F172A), Restrained Cobalt (#2563EB)',
    previewBg: '#FBFBFA',
    previewAccent: '#2563EB',
    tags: ['Editorial', 'Software Studio', 'Digital Products', 'Modern'],
  },
};

export const THEME_LIST: ThemeMetadata[] = [
  THEME_METADATA_REGISTRY.systems,
  THEME_METADATA_REGISTRY.nexus,
  THEME_METADATA_REGISTRY.atelier,
];

export function isValidTheme(theme: unknown): theme is ThemeId {
  return typeof theme === 'string' && (theme === 'systems' || theme === 'nexus' || theme === 'atelier');
}

export function sanitizeThemeId(theme: unknown): ThemeId {
  if (isValidTheme(theme)) {
    return theme;
  }
  return DEFAULT_THEME_ID;
}
