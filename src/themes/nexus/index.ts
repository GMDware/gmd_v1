import { ThemeDefinition } from '@/lib/theme/types';
import { THEME_METADATA_REGISTRY } from '@/lib/theme/registry';
import { nexusTokens } from './tokens';

export const nexusTheme: ThemeDefinition = {
  meta: THEME_METADATA_REGISTRY.nexus,
  tokens: nexusTokens,
};

export * from './tokens';
export * from './motion';
export * from './components/NexusHeader';
export * from './components/NexusHero';
export * from './components/NexusHome';
export * from './components/NexusWork';
export * from './components/NexusCaseStudy';
export * from './components/NexusServices';
export * from './components/NexusProcess';
export * from './components/NexusAbout';
export * from './components/NexusInsights';
export * from './components/NexusInsightArticle';
export * from './components/NexusContact';
export * from './components/NexusFooter';
