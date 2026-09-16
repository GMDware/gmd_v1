import crypto from 'crypto';
import prisma from '@/lib/db/prisma';
import { getStorageProvider } from '@/lib/media';
import { AuthService } from './auth.service';

const ALLOWED_MIME_TYPES = [
  'image/jpeg',
  'image/png',
  'image/webp',
  'image/svg+xml',
  'image/avif',
  'application/pdf',
];

const ALLOWED_EXTENSIONS = ['.jpg', '.jpeg', '.png', '.webp', '.svg', '.avif', '.pdf'];
const MAX_FILE_SIZE_BYTES = 10 * 1024 * 1024; // 10 MB

export class MediaService {
  /**
   * Sniffs magic bytes to verify genuine file type rather than trusting headers
   */
  private static verifyMagicBytes(buffer: Buffer, declaredMime: string): boolean {
    if (buffer.length < 4) return false;

    // JPEG: FF D8 FF
    if (buffer[0] === 0xff && buffer[1] === 0xd8 && buffer[2] === 0xff) {
      return declaredMime === 'image/jpeg';
    }

    // PNG: 89 50 4E 47
    if (buffer[0] === 0x89 && buffer[1] === 0x50 && buffer[2] === 0x4e && buffer[3] === 0x47) {
      return declaredMime === 'image/png';
    }

    // WebP: 52 49 46 46 (RIFF) ... 57 45 42 50 (WEBP)
    if (
      buffer[0] === 0x52 &&
      buffer[1] === 0x49 &&
      buffer[2] === 0x46 &&
      buffer[3] === 0x46 &&
      buffer.length > 12 &&
      buffer.toString('utf8', 8, 12) === 'WEBP'
    ) {
      return declaredMime === 'image/webp';
    }

    // PDF: 25 50 44 46 (%PDF)
    if (buffer[0] === 0x25 && buffer[1] === 0x50 && buffer[2] === 0x44 && buffer[3] === 0x46) {
      return declaredMime === 'application/pdf';
    }

    // SVG: inspect text starting with <svg or <?xml
    if (declaredMime === 'image/svg+xml') {
      const textHeader = buffer.slice(0, 100).toString('utf8').trim().toLowerCase();
      return textHeader.includes('<svg') || textHeader.includes('<?xml');
    }

    // AVIF: check ftypavif box
    if (declaredMime === 'image/avif' && buffer.length > 12) {
      const box = buffer.toString('utf8', 4, 12);
      return box.includes('ftyp') || box.includes('avif');
    }

    return false;
  }

  /**
   * Uploads and validates a media asset
   */
  static async upload(params: {
    fileName: string;
    mimeType: string;
    buffer: Buffer;
    altText?: string;
    caption?: string;
    folder?: string;
    userId?: string;
  }) {
    // 1. File Size Validation
    if (params.buffer.length > MAX_FILE_SIZE_BYTES) {
      throw new Error(`File size exceeds maximum limit of 10MB (${params.buffer.length} bytes)`);
    }

    // 2. MIME Type Validation
    const cleanMime = params.mimeType.toLowerCase();
    if (!ALLOWED_MIME_TYPES.includes(cleanMime)) {
      throw new Error(`Disallowed MIME type: ${cleanMime}`);
    }

    // 3. Extension Validation
    const extMatch = params.fileName.match(/\.[a-zA-Z0-9]+$/);
    const ext = extMatch ? extMatch[0].toLowerCase() : '';
    if (!ALLOWED_EXTENSIONS.includes(ext)) {
      throw new Error(`Disallowed file extension: ${ext}`);
    }

    // 4. Magic Bytes & Header Inspection
    const isValidBytes = this.verifyMagicBytes(params.buffer, cleanMime);
    if (!isValidBytes) {
      throw new Error('File header signatures do not match declared MIME type');
    }

    // 4.1 Strict SVG Content Hardening (Prevent Stored XSS)
    if (cleanMime === 'image/svg+xml') {
      const svgContent = params.buffer.toString('utf8');
      const lowerSvg = svgContent.toLowerCase();

      // Prohibit scripts, embedded HTML, foreignObject, and XML entity attacks
      const dangerousPatterns = [
        /<script\b/i,
        /<\/script>/i,
        /<foreignobject\b/i,
        /\son[a-z]+\s*=/i, // onload, onerror, onclick, onmouseover, etc.
        /javascript\s*:/i,
        /data\s*:\s*text\/html/i,
        /<!entity\b/i,
      ];

      for (const pattern of dangerousPatterns) {
        if (pattern.test(lowerSvg)) {
          throw new Error('Malicious or unsafe SVG content detected. Scripts and event handlers are strictly prohibited.');
        }
      }
    }

    // 5. Store File via StorageProvider
    const storage = getStorageProvider();
    const result = await storage.upload({
      fileName: params.fileName,
      mimeType: cleanMime,
      buffer: params.buffer,
      folder: params.folder,
      altText: params.altText,
      caption: params.caption,
    });

    // 6. Persist Media Asset in Database
    const asset = await prisma.mediaAsset.create({
      data: {
        fileName: result.fileName,
        originalName: result.originalName,
        mimeType: result.mimeType,
        sizeBytes: result.sizeBytes,
        width: result.width,
        height: result.height,
        storageKey: result.storageKey,
        storageUrl: result.storageUrl,
        provider: result.provider,
        altText: params.altText,
        caption: params.caption,
        blurDataUrl: result.blurDataUrl,
      },
    });

    if (params.userId) {
      await AuthService.logAudit({
        userId: params.userId,
        action: 'UPLOAD_MEDIA',
        entity: 'MediaAsset',
        entityId: asset.id,
        metadata: { fileName: asset.fileName, size: asset.sizeBytes },
      });
    }

    return asset;
  }

  /**
   * List media assets
   */
  static async list(options: { page?: number; limit?: number } = {}) {
    const page = Math.max(1, options.page || 1);
    const limit = Math.min(100, Math.max(1, options.limit || 50));
    const skip = (page - 1) * limit;

    const [total, items] = await Promise.all([
      prisma.mediaAsset.count({ where: { deletedAt: null } }),
      prisma.mediaAsset.findMany({
        where: { deletedAt: null },
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
      }),
    ]);

    return {
      items,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  /**
   * Delete or archive a media asset
   */
  static async delete(id: string, userId?: string) {
    const asset = await prisma.mediaAsset.findUnique({ where: { id } });
    if (!asset) {
      throw new Error(`Media asset with ID "${id}" not found`);
    }

    // Remove from storage provider
    const storage = getStorageProvider();
    await storage.delete(asset.storageKey);

    // Soft delete in database
    const updated = await prisma.mediaAsset.update({
      where: { id },
      data: { deletedAt: new Date() },
    });

    if (userId) {
      await AuthService.logAudit({
        userId,
        action: 'DELETE_MEDIA',
        entity: 'MediaAsset',
        entityId: id,
        metadata: { storageKey: asset.storageKey },
      });
    }

    return updated;
  }

  /**
   * Create media asset from direct image URL (download & persist or direct link)
   */
  static async createFromUrl(params: {
    url: string;
    altText?: string;
    caption?: string;
    userId?: string;
  }) {
    const cleanUrl = params.url.trim();
    if (!cleanUrl) {
      throw new Error('Image URL is required');
    }

    // Try downloading and optimizing into active storage provider
    try {
      const res = await fetch(cleanUrl, {
        headers: { 'User-Agent': 'Mozilla/5.0 GMDware-Bot/1.0' },
        signal: AbortSignal.timeout(6000),
      });

      if (res.ok) {
        const arrayBuf = await res.arrayBuffer();
        const buffer = Buffer.from(arrayBuf);
        const contentType = (res.headers.get('content-type') || 'image/jpeg').split(';')[0].trim().toLowerCase();
        const pathname = new URL(cleanUrl).pathname;
        const rawFileName = pathname.split('/').pop() || 'image.jpg';
        const ext = rawFileName.includes('.') ? '' : (contentType === 'image/png' ? '.png' : contentType === 'image/webp' ? '.webp' : '.jpg');
        const fileName = `${rawFileName}${ext}`;

        return await this.upload({
          fileName,
          mimeType: contentType.startsWith('image/') ? contentType : 'image/jpeg',
          buffer,
          altText: params.altText,
          caption: params.caption,
          userId: params.userId,
        });
      }
    } catch (fetchErr) {
      console.warn('[MediaService] Could not fetch remote image buffer, saving direct link:', fetchErr);
    }

    // Fallback: save direct reference in database
    const urlObj = new URL(cleanUrl);
    const rawFileName = urlObj.pathname.split('/').pop() || 'linked-image.jpg';
    const asset = await prisma.mediaAsset.create({
      data: {
        fileName: rawFileName,
        originalName: rawFileName,
        mimeType: 'image/jpeg',
        sizeBytes: 0,
        storageKey: `url/${crypto.randomUUID()}`,
        storageUrl: cleanUrl,
        provider: 'external',
        altText: params.altText,
        caption: params.caption,
      },
    });

    if (params.userId) {
      await AuthService.logAudit({
        userId: params.userId,
        action: 'UPLOAD_MEDIA',
        entity: 'MediaAsset',
        entityId: asset.id,
        metadata: { url: cleanUrl },
      });
    }

    return asset;
  }
}

