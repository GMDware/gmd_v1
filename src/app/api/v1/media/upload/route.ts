import { NextRequest } from 'next/server';
import { MediaService } from '@/services/media.service';
import { requirePermission } from '@/lib/api/guard';
import { successResponse, errorResponse } from '@/lib/api/response';
import { resolvePublicMediaUrl } from '@/lib/media';

export async function POST(req: NextRequest) {
  try {
    const auth = await requirePermission('media.upload', req);
    if (!auth.authorized || !auth.session) {
      return auth.response!;
    }

    const contentType = req.headers.get('content-type') || '';

    // 1. JSON payload with URL
    if (contentType.includes('application/json')) {
      const jsonBody = await req.json();
      const imageUrl = jsonBody.url || jsonBody.imageUrl;
      if (!imageUrl || typeof imageUrl !== 'string') {
        return errorResponse('VALIDATION_ERROR', 'A valid image URL is required', 400);
      }

      const asset = await MediaService.createFromUrl({
        url: imageUrl,
        altText: jsonBody.altText,
        caption: jsonBody.caption,
        userId: auth.session.userId,
      });

      return successResponse(
        {
          ...asset,
          url: asset.url || resolvePublicMediaUrl(asset),
          size: asset.sizeBytes,
          filename: asset.fileName,
        },
        201
      );
    }

    // 2. FormData (File or URL)
    const formData = await req.formData();
    const file = formData.get('file') as File | null;
    const imageUrl = (formData.get('url') || formData.get('imageUrl')) as string | null;
    const altText = formData.get('altText') as string | null;
    const caption = formData.get('caption') as string | null;
    const folder = formData.get('folder') as string | null;

    if (imageUrl && !file) {
      const asset = await MediaService.createFromUrl({
        url: imageUrl,
        altText: altText || undefined,
        caption: caption || undefined,
        userId: auth.session.userId,
      });

      return successResponse(
        {
          ...asset,
          url: asset.url || resolvePublicMediaUrl(asset),
          size: asset.sizeBytes,
          filename: asset.fileName,
        },
        201
      );
    }

    if (!file) {
      return errorResponse('VALIDATION_ERROR', 'A file upload or image URL is required', 400);
    }

    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    const asset = await MediaService.upload({
      fileName: file.name,
      mimeType: file.type,
      buffer,
      altText: altText || undefined,
      caption: caption || undefined,
      folder: folder || undefined,
      userId: auth.session.userId,
    });

    const mappedAsset = {
      ...asset,
      url: asset.url || resolvePublicMediaUrl(asset),
      size: asset.sizeBytes,
      filename: asset.fileName,
    };

    return successResponse(mappedAsset, 201);
  } catch (err: any) {
    const isUnconfigured =
      err.code === 'STORAGE_NOT_CONFIGURED' ||
      err.message?.includes('Persistent media storage') ||
      err.message?.includes('Cloudflare R2');

    return errorResponse(
      isUnconfigured ? 'STORAGE_NOT_CONFIGURED' : 'UPLOAD_FAILED',
      err.message || 'File upload failed',
      isUnconfigured ? 503 : 400
    );
  }
}
