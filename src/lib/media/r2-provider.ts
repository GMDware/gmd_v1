import { S3Client, PutObjectCommand, DeleteObjectCommand } from '@aws-sdk/client-s3';
import sharp from 'sharp';
import path from 'path';
import { MediaUploadOptions, MediaAssetResult, StorageProvider } from './types';

export class R2StorageProvider implements StorageProvider {
  private client: S3Client;
  private bucketName: string;
  private publicUrl: string;

  constructor() {
    const accountId = process.env.R2_ACCOUNT_ID;
    const accessKeyId = process.env.R2_ACCESS_KEY_ID;
    const secretAccessKey = process.env.R2_SECRET_ACCESS_KEY;
    const bucketName = process.env.R2_BUCKET_NAME;
    const publicUrl = process.env.R2_PUBLIC_URL;

    if (!accountId || !accessKeyId || !secretAccessKey || !bucketName || !publicUrl) {
      throw new Error(
        'Missing Cloudflare R2 environment variables. Ensure R2_ACCOUNT_ID, R2_ACCESS_KEY_ID, R2_SECRET_ACCESS_KEY, R2_BUCKET_NAME, and R2_PUBLIC_URL are configured.'
      );
    }

    this.bucketName = bucketName;
    this.publicUrl = publicUrl.replace(/\/+$/, '');

    this.client = new S3Client({
      region: 'auto',
      endpoint: `https://${accountId}.r2.cloudflarestorage.com`,
      credentials: {
        accessKeyId,
        secretAccessKey,
      },
    });
  }

  async upload(options: MediaUploadOptions): Promise<MediaAssetResult> {
    const folder = options.folder ? options.folder.replace(/^\/+|\/+$/g, '') : '';
    const timestamp = Date.now();
    const rawFileName = path.basename(options.fileName);
    const cleanFileName = rawFileName.replace(/[^a-zA-Z0-9.-]/g, '_');
    const storageFileName = `${timestamp}-${cleanFileName}`;
    const storageKey = folder ? `${folder}/${storageFileName}` : storageFileName;

    let finalBuffer = options.buffer;
    let width: number | undefined;
    let height: number | undefined;
    let blurDataUrl: string | undefined;

    // Process raster images via Sharp for dimensions and blur placeholder
    if (options.mimeType.startsWith('image/') && !options.mimeType.includes('svg')) {
      try {
        const metadata = await sharp(options.buffer).metadata();
        width = metadata.width;
        height = metadata.height;

        const blurBuffer = await sharp(options.buffer)
          .resize(10, 10, { fit: 'inside' })
          .toBuffer();
        blurDataUrl = `data:${options.mimeType};base64,${blurBuffer.toString('base64')}`;

        finalBuffer = options.buffer;
      } catch (err) {
        console.warn('Image optimization skipped for R2 upload:', err);
      }
    }

    const command = new PutObjectCommand({
      Bucket: this.bucketName,
      Key: storageKey,
      Body: finalBuffer,
      ContentType: options.mimeType,
      ContentLength: finalBuffer.length,
    });

    await this.client.send(command);

    const storageUrl = `${this.publicUrl}/${storageKey}`;

    return {
      fileName: storageFileName,
      originalName: options.fileName,
      storageKey,
      storageUrl,
      provider: 'r2',
      mimeType: options.mimeType,
      sizeBytes: finalBuffer.length,
      width,
      height,
      blurDataUrl,
      altText: options.altText,
    };
  }

  async delete(storageKey: string): Promise<void> {
    const command = new DeleteObjectCommand({
      Bucket: this.bucketName,
      Key: storageKey,
    });
    try {
      await this.client.send(command);
    } catch (err) {
      console.warn('Failed to delete object from R2:', err);
    }
  }

  getUrl(storageKey: string): string {
    return `${this.publicUrl}/${storageKey}`;
  }
}
