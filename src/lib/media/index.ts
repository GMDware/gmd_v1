import { StorageProvider } from './types';
import { LocalStorageProvider } from './local-provider';
import { R2StorageProvider } from './r2-provider';
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
  const isVercel = process.env.VERCEL === '1';

  if (provider === 'none' || provider === 'disabled') {
    return false;
  }

  if (provider === 'r2' || provider === 's3') {
    return isR2Configured();
  }

  if (provider === 'local') {
    // Local filesystem upload is permitted in standard local development,
    // but blocked on Vercel to prevent silent writes to ephemeral disk.
    return !isVercel;
  }

  // Default fallback: if R2 is configured, allow it; if local dev and not Vercel, allow local; otherwise false.
  if (isR2Configured()) return true;
  return !isVercel && process.env.NODE_ENV !== 'production';
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
        'Cloudflare R2 is configured as the active provider, but required R2 credentials are not set. Uploads are temporarily disabled.',
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

  if (isVercel) {
    return {
      provider: 'unconfigured',
      uploadsEnabled: false,
      isPersistent: false,
      message:
        'Persistent cloud storage (Cloudflare R2) is not yet configured for this Vercel deployment. Uploads are paused to prevent ephemeral data loss.',
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
      '[Storage] STORAGE_PROVIDER is set to R2/S3, but R2 environment variables are missing. Using DisabledStorageProvider.'
    );
    cachedStorageProvider = new DisabledStorageProvider(
      'Cloudflare R2 credentials (R2_ACCOUNT_ID, R2_ACCESS_KEY_ID, R2_SECRET_ACCESS_KEY, R2_BUCKET_NAME, R2_PUBLIC_URL) are not configured. Uploads are disabled.'
    );
    return cachedStorageProvider;
  }

  // 2. Explicitly disabled
  if (providerType === 'none' || providerType === 'disabled') {
    cachedStorageProvider = new DisabledStorageProvider();
    return cachedStorageProvider;
  }

  // 3. Vercel environment without R2 credentials:
  // MUST NOT use local filesystem on Vercel as persistent storage (Requirement 7 & 15).
  if (isVercel) {
    if (isR2Configured()) {
      cachedStorageProvider = new R2StorageProvider();
      return cachedStorageProvider;
    }

    cachedStorageProvider = new DisabledStorageProvider(
      'Persistent media storage is not yet configured on this Vercel deployment. Cloudflare R2 can be activated later by configuring the R2 environment variables.'
    );
    return cachedStorageProvider;
  }

  // 4. Standard local development machine
  if (providerType === 'local' || process.env.NODE_ENV !== 'production') {
    cachedStorageProvider = new LocalStorageProvider();
    return cachedStorageProvider;
  }

  // 5. Default production fallback when no R2 credentials provided
  cachedStorageProvider = new DisabledStorageProvider(
    'No persistent storage provider configured for production. Configure Cloudflare R2 to enable uploads.'
  );
  return cachedStorageProvider;
}

export * from './types';
export * from './local-provider';
export * from './r2-provider';
export * from './disabled-provider';
