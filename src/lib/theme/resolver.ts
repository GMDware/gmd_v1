import { cookies, headers } from 'next/headers';
import DataStore from '@/lib/db/data-store';
import { ThemeId } from './types';
import { DEFAULT_THEME_ID, isValidTheme, sanitizeThemeId } from './registry';

export const THEME_PREVIEW_COOKIE = 'gmdware_theme_preview';

export interface ResolvedThemeState {
  themeId: ThemeId;
  isPreview: boolean;
  persistedThemeId: ThemeId;
}

/**
 * Server-side theme resolution with safe preview support and automatic fallback
 */
export async function resolveActiveTheme(
  searchParams?: Record<string, string | string[] | undefined>
): Promise<ResolvedThemeState> {
  // 1. Fetch persisted production theme from PostgreSQL
  let persistedThemeId: ThemeId = DEFAULT_THEME_ID;
  try {
    const settings = await DataStore.getSettings();
    if (settings && settings.active_theme) {
      persistedThemeId = sanitizeThemeId(settings.active_theme);
    }
  } catch (err) {
    console.error('[ThemeResolver] Failed to read active_theme from settings, using default:', err);
    persistedThemeId = DEFAULT_THEME_ID;
  }

  // 2. Check for explicit search param preview (e.g. ?themePreview=nexus or ?theme=atelier)
  let paramPreview = searchParams?.themePreview || searchParams?.theme;
  if (!paramPreview) {
    try {
      const headerStore = await headers();
      paramPreview = headerStore.get('x-theme-preview') || undefined;
    } catch {
      // headers() might fail in certain static or non-request contexts
    }
  }
  const paramVal = Array.isArray(paramPreview) ? paramPreview[0] : paramPreview;
  if (paramVal && isValidTheme(paramVal)) {
    return {
      themeId: paramVal,
      isPreview: paramVal !== persistedThemeId,
      persistedThemeId,
    };
  }

  // 3. Check for preview cookie
  try {
    const cookieStore = await cookies();
    const cookieVal = cookieStore.get(THEME_PREVIEW_COOKIE)?.value;
    if (cookieVal && isValidTheme(cookieVal)) {
      return {
        themeId: cookieVal,
        isPreview: cookieVal !== persistedThemeId,
        persistedThemeId,
      };
    }
  } catch {
    // cookies() might fail in certain static or non-request contexts; ignore safely
  }

  // 4. Default to persisted production theme
  return {
    themeId: persistedThemeId,
    isPreview: false,
    persistedThemeId,
  };
}
