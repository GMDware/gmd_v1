import { ThemeDefinition } from '@/lib/theme/types';
import { THEME_METADATA_REGISTRY } from '@/lib/theme/registry';
import { atelierTokens } from './tokens';

export const atelierTheme: ThemeDefinition = {
  meta: THEME_METADATA_REGISTRY.atelier,
  tokens: atelierTokens,
};

export * from './tokens';
export * from './motion';
export * from './components/AtelierHeader';
export * from './components/AtelierHero';
export * from './components/AtelierStats';
export * from './components/AtelierHome';
export * from './components/AtelierWork';
export * from './components/AtelierCaseStudy';
export * from './components/AtelierServices';
export * from './components/AtelierProcess';
export * from './components/AtelierAbout';
export * from './components/AtelierInsights';
export * from './components/AtelierInsightArticle';
export * from './components/AtelierContact';
export * from './components/AtelierFooter';
