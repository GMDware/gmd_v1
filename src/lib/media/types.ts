export interface MediaUploadOptions {
  fileName: string;
  mimeType: string;
  buffer: Buffer;
  folder?: string;
  altText?: string;
  caption?: string;
}

export interface MediaAssetResult {
  id?: string;
  fileName: string;
  originalName: string;
  storageKey: string;
  storageUrl: string;
  provider: 'local' | 's3' | 'r2' | 'cloudinary';
  mimeType: string;
  sizeBytes: number;
  width?: number;
  height?: number;
  blurDataUrl?: string;
  altText?: string;
}

export interface StorageProvider {
  upload(options: MediaUploadOptions): Promise<MediaAssetResult>;
  delete(storageKey: string): Promise<void>;
  getUrl(storageKey: string): string;
}
