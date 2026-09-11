import { MediaUploadOptions, MediaAssetResult, StorageProvider } from './types';

/**
 * DisabledStorageProvider
 * 
 * Safely handles environments where no persistent cloud object store
 * (e.g. Cloudflare R2) is configured yet (such as initial Vercel deployment).
 * Allows existing media queries and admin operations to continue functioning
 * while gracefully rejecting upload attempts with a clear, user-friendly error.
 */
export class DisabledStorageProvider implements StorageProvider {
  private reason: string;

  constructor(reason?: string) {
    this.reason =
      reason ||
      'Persistent media storage is temporarily unconfigured for this deployment. Configure Cloudflare R2 in your Vercel project environment variables to enable uploads. Existing media assets remain accessible.';
  }

  async upload(_options: MediaUploadOptions): Promise<MediaAssetResult> {
    const error: any = new Error(this.reason);
    error.code = 'STORAGE_NOT_CONFIGURED';
    throw error;
  }

  async delete(storageKey: string): Promise<void> {
    console.warn(`[Storage] Deletion skipped for '${storageKey}': persistent storage provider is unconfigured.`);
  }

  getUrl(storageKey: string): string {
    if (storageKey.startsWith('http://') || storageKey.startsWith('https://') || storageKey.startsWith('/')) {
      return storageKey;
    }
    return `/uploads/${storageKey}`;
  }
}
