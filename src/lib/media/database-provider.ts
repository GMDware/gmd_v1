import sharp from 'sharp';
import crypto from 'crypto';
import { MediaUploadOptions, MediaAssetResult, StorageProvider } from './types';

export class DatabaseStorageProvider implements StorageProvider {
  async upload(options: MediaUploadOptions): Promise<MediaAssetResult> {
    let finalBuffer = options.buffer;
    let mimeType = options.mimeType;
    let width: number | undefined;
    let height: number | undefined;
    let blurDataUrl: string | undefined;

    // Process images via Sharp if image mimeType
    if (options.mimeType.startsWith('image/') && !options.mimeType.includes('svg')) {
      try {
        const metadata = await sharp(options.buffer).metadata();
        width = metadata.width;
        height = metadata.height;

        // Resize down if too large for Data-URI to keep database storage optimal
        const processed = sharp(options.buffer);
        if (width && width > 1600) {
          processed.resize(1600, undefined, { withoutEnlargement: true });
        }

        // Convert to WebP for efficient base64 payload size
        if (['image/jpeg', 'image/png'].includes(options.mimeType)) {
          finalBuffer = await processed.webp({ quality: 80 }).toBuffer();
          mimeType = 'image/webp';
        } else {
          finalBuffer = await processed.toBuffer();
        }

        // Generate tiny 10px blur data placeholder
        const blurBuffer = await sharp(finalBuffer)
          .resize(10, 10, { fit: 'inside' })
          .toBuffer();
        blurDataUrl = `data:${mimeType};base64,${blurBuffer.toString('base64')}`;
      } catch (err) {
        console.warn('[DatabaseStorageProvider] Sharp image processing skipped:', err);
      }
    }

    const base64Data = finalBuffer.toString('base64');
    const storageUrl = `data:${mimeType};base64,${base64Data}`;
    const cleanName = options.fileName.replace(/[^a-zA-Z0-9.-]/g, '_');
    const storageKey = `db/${Date.now()}-${crypto.randomUUID().slice(0, 8)}-${cleanName}`;

    return {
      fileName: options.fileName,
      originalName: options.fileName,
      storageKey,
      storageUrl,
      provider: 'database',
      mimeType,
      sizeBytes: finalBuffer.length,
      width,
      height,
      blurDataUrl,
      altText: options.altText,
    };
  }

  async delete(_storageKey: string): Promise<void> {
    // Data URI assets are stored in the database record itself
  }

  getUrl(storageKey: string): string {
    return storageKey;
  }
}
