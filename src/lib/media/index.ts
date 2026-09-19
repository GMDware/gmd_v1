import { StorageProvider } from './types';
import { LocalStorageProvider } from './local-provider';
import { R2StorageProvider } from './r2-provider';
import { DatabaseStorageProvider } from './database-provider';
import { DisabledStorageProvider } from './disabled-provider';

let cachedStorageProvider: StorageProvider | null = null;

/**
 * Resets the cached storage provider instance (useful for runtime config changes and testing).
 */
export function resetStorageProvider(): void {
  cachedStorageProvider = null;
}

/**
 * Checks whether all required Cloudflare R2 environment variables are present.
 */
export function isR2Configured(): boolean {
  return Boolean(
    process.env.R2_ACCOUNT_ID &&
    process.env.R2_ACCESS_KEY_ID &&
    process.env.R2_SECRET_ACCESS_KEY &&
    process.env.R2_BUCKET_NAME &&
    process.env.R2_PUBLIC_URL
  );
}

/**
 * Checks whether media uploading is permitted in the current environment.
 */
export function isStorageUploadEnabled(): boolean {
  const provider = (process.env.STORAGE_PROVIDER || '').toLowerCase();

  if (provider === 'none' || provider === 'disabled') {
    return false;
  }

// If R2 is explicitly configured, check credentials or allow fallback
  return true;
}

/**
 * Resolves a client-safe public URL for a media asset.
 * If stored in database as a Data-URI, resolves to the streaming endpoint /api/v1/media/file/[id].
 */
export function resolvePublicMediaUrl(
  asset: { id?: string; storageUrl?: string | null; url?: string | null } | null | undefined
): string {
  if (!asset) return '';
  const directUrl = asset.url || asset.storageUrl || '';
  if (directUrl.startsWith('data:') && asset.id) {
    return `/api/v1/media/file/${asset.id}`;
  }
  return directUrl;
}

/**
 * Returns diagnostic details about the current storage configuration.
 */
export function getStorageStatus(): {
  provider: string;
  uploadsEnabled: boolean;
  isPersistent: boolean;
  message?: string;
} {
  const providerType = (process.env.STORAGE_PROVIDER || 'auto').toLowerCase();
  const isVercel = process.env.VERCEL === '1';
  const r2Ready = isR2Configured();

  // 1. R2 is fully configured and ready
  if (r2Ready) {
    return {
      provider: 'r2',
      uploadsEnabled: true,
      isPersistent: true,
      message: 'Cloudflare R2 cloud object storage active.',
    };
  }

  // 2. Explicitly disabled
  if (providerType === 'none' || providerType === 'disabled') {
    return {
      provider: 'disabled',
      uploadsEnabled: false,
      isPersistent: false,
      message:
        'Media uploads are explicitly disabled (STORAGE_PROVIDER=' +
        providerType +
        '). Set STORAGE_PROVIDER=database or configure Cloudflare R2 to enable persistent uploads.',
    };
  }

  // 3. R2 requested but credentials missing -> resilient fallback to Database
  if (providerType === 'r2' || providerType === 's3') {
    return {
      provider: 'database',
      uploadsEnabled: true,
      isPersistent: true,
      message:
        'Cloudflare R2 credentials are not set. Operating on persistent PostgreSQL database storage until R2 variables are configured.',
    };
  }

  // 4. Vercel deployment or explicit database storage
  if (isVercel || providerType === 'database' || providerType === 'auto') {
    return {
      provider: 'database',
      uploadsEnabled: true,
      isPersistent: true,
      message:
        'Using persistent PostgreSQL database media storage. Connect Cloudflare R2 credentials anytime for S3-compatible cloud storage.',
    };
  }

  // 5. Local storage (standard dev environment)
  return {
    provider: 'local',
    uploadsEnabled: true,
    isPersistent: true,
    message: 'Using local filesystem storage (./public/uploads).',
  };
}

/**
 * Returns the configured storage provider instance.
 */
export function getStorageProvider(): StorageProvider {
  if (cachedStorageProvider) {
    return cachedStorageProvider;
  }

  const providerType = (process.env.STORAGE_PROVIDER || '').toLowerCase();
  const isVercel = process.env.VERCEL === '1';

  // 1. Explicit R2 or S3 request
  if (providerType === 'r2' || providerType === 's3') {
    if (isR2Configured()) {
      cachedStorageProvider = new R2StorageProvider();
      return cachedStorageProvider;
    }

    console.warn(
      '[Storage] STORAGE_PROVIDER is set to R2/S3, but R2 environment variables are missing. Using DatabaseStorageProvider as resilient fallback.'
    );
    cachedStorageProvider = new DatabaseStorageProvider();
    return cachedStorageProvider;
  }

  // 2. Explicitly disabled
  if (providerType === 'none' || providerType === 'disabled') {
    cachedStorageProvider = new DisabledStorageProvider(
      'Media uploads are disabled by STORAGE_PROVIDER=' +
        providerType +
        '. Configure STORAGE_PROVIDER=database or Cloudflare R2 to enable uploads.'
    );
    return cachedStorageProvider;
  }

  // 3. Database explicitly requested
  if (providerType === 'database') {
    cachedStorageProvider = new DatabaseStorageProvider();
    return cachedStorageProvider;
  }

  // 4. Vercel environment:
  // If R2 credentials are provided, use R2.
  // Otherwise, use DatabaseStorageProvider (zero-config, Data-URI persisted directly in PostgreSQL).
  if (isVercel) {
    if (isR2Configured()) {
      cachedStorageProvider = new R2StorageProvider();
      return cachedStorageProvider;
    }

    cachedStorageProvider = new DatabaseStorageProvider();
    return cachedStorageProvider;
  }

  // 5. Standard local development machine
  if (providerType === 'local' || process.env.NODE_ENV !== 'production') {
    cachedStorageProvider = new LocalStorageProvider();
    return cachedStorageProvider;
  }

  // 6. Default production fallback
  cachedStorageProvider = new DatabaseStorageProvider();
  return cachedStorageProvider;
}

export * from './types';
export * from './local-provider';
export * from './r2-provider';
export * from './database-provider';
export * from './disabled-provider';
