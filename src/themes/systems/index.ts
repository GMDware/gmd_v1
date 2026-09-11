import { ThemeDefinition } from '@/lib/theme/types';
import { THEME_METADATA_REGISTRY } from '@/lib/theme/registry';
import { systemsTokens } from './tokens';

export const systemsTheme: ThemeDefinition = {
  meta: THEME_METADATA_REGISTRY.systems,
  tokens: systemsTokens,
};

export * from './tokens';
export * from './motion';
