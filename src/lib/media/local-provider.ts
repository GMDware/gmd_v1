import fs from 'fs/promises';
import path from 'path';
import sharp from 'sharp';
import { MediaUploadOptions, MediaAssetResult, StorageProvider } from './types';

export class LocalStorageProvider implements StorageProvider {
  private baseDir: string;
  private publicUrlPrefix: string;

  constructor() {
    this.baseDir = path.join(process.cwd(), 'public', 'uploads');
    this.publicUrlPrefix = '/uploads';
  }

  private async ensureDirectory(dirPath: string): Promise<void> {
    try {
      await fs.access(dirPath);
    } catch {
      await fs.mkdir(dirPath, { recursive: true });
    }
  }

  async upload(options: MediaUploadOptions): Promise<MediaAssetResult> {
    const folder = options.folder ? options.folder.replace(/^\/+|\/+$/g, '') : '';
    const targetDir = folder ? path.resolve(this.baseDir, folder) : this.baseDir;
    
    // Strict directory containment verification
    if (!targetDir.startsWith(this.baseDir)) {
      throw new Error('Invalid upload folder path: directory traversal attempt blocked');
    }

    await this.ensureDirectory(targetDir);

    const timestamp = Date.now();
    const rawFileName = path.basename(options.fileName);
    const cleanFileName = rawFileName.replace(/[^a-zA-Z0-9.-]/g, '_');
    const storageFileName = `${timestamp}-${cleanFileName}`;
    const filePath = path.resolve(targetDir, storageFileName);

    // Strict file path containment verification
    if (!filePath.startsWith(this.baseDir)) {
      throw new Error('Invalid file path: directory traversal attempt blocked');
    }

    const storageKey = folder ? `${folder}/${storageFileName}` : storageFileName;
    const storageUrl = `${this.publicUrlPrefix}/${storageKey}`;

    let finalBuffer = options.buffer;
    let width: number | undefined;
    let height: number | undefined;
    let blurDataUrl: string | undefined;

    // Process images via Sharp if image mimeType
    if (options.mimeType.startsWith('image/') && !options.mimeType.includes('svg')) {
      try {
        const metadata = await sharp(options.buffer).metadata();
        width = metadata.width;
        height = metadata.height;

        // Generate tiny 10px blur data placeholder for Next.js image loading
        const blurBuffer = await sharp(options.buffer)
          .resize(10, 10, { fit: 'inside' })
          .toBuffer();
        blurDataUrl = `data:${options.mimeType};base64,${blurBuffer.toString('base64')}`;

        finalBuffer = options.buffer;
      } catch (err) {
        console.warn('Image optimization skipped:', err);
      }
    }

    await fs.writeFile(filePath, finalBuffer);

    return {
      fileName: storageFileName,
      originalName: options.fileName,
      storageKey,
      storageUrl,
      provider: 'local',
      mimeType: options.mimeType,
      sizeBytes: finalBuffer.length,
      width,
      height,
      blurDataUrl,
      altText: options.altText,
    };
  }

  async delete(storageKey: string): Promise<void> {
    const filePath = path.resolve(this.baseDir, storageKey);
    if (!filePath.startsWith(this.baseDir)) {
      throw new Error('Invalid storage key: directory traversal attempt blocked');
    }
    try {
      await fs.unlink(filePath);
    } catch {
      // Ignore if already deleted
    }
  }

  getUrl(storageKey: string): string {
    return `${this.publicUrlPrefix}/${storageKey}`;
  }
}
