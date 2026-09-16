import { StorageProvider } from './types';
import { LocalStorageProvider } from './local-provider';
import { R2StorageProvider } from './r2-provider';
import { DatabaseStorageProvider } from './database-provider';
import { DisabledStorageProvider } from './disabled-provider';

let cachedStorageProvider: StorageProvider | null = null;

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

  if (provider === 'r2' || provider === 's3') {
    return isR2Configured();
  }

  return true;
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

  if (r2Ready) {
    return {
      provider: 'r2',
      uploadsEnabled: true,
      isPersistent: true,
    };
  }

  if (providerType === 'r2' || providerType === 's3') {
    return {
      provider: 'r2',
      uploadsEnabled: false,
      isPersistent: false,
      message:
        'Cloudflare R2 is configured as the active provider, but required R2 credentials are not set.',
    };
  }

  if (providerType === 'none' || providerType === 'disabled') {
    return {
      provider: 'disabled',
      uploadsEnabled: false,
      isPersistent: false,
      message: 'Media uploads are explicitly disabled.',
    };
  }

  if (isVercel || providerType === 'database') {
    return {
      provider: 'database',
      uploadsEnabled: true,
      isPersistent: true,
      message:
        'Using database media storage. Connect Cloudflare R2 credentials anytime for S3-compatible cloud storage.',
    };
  }

  return {
    provider: 'local',
    uploadsEnabled: true,
    isPersistent: true,
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
    cachedStorageProvider = new DisabledStorageProvider();
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
