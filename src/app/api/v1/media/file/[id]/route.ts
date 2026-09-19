import prisma from '@/lib/db/prisma';
import fs from 'fs/promises';
import path from 'path';

export async function GET(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    if (!id) {
      return new Response('Asset ID required', { status: 400 });
    }

    const asset = await prisma.mediaAsset.findFirst({
      where: {
        OR: [{ id }, { fileName: id }, { storageKey: id }],
        deletedAt: null,
      },
    });

    if (!asset) {
      return new Response('Media asset not found', { status: 404 });
    }

    const etag = `"${asset.id}"`;
    const ifNoneMatch = req.headers.get('if-none-match');

    if (ifNoneMatch && ifNoneMatch === etag) {
      return new Response(null, {
        status: 304,
        headers: {
          ETag: etag,
          'Cache-Control': 'public, max-age=31536000, immutable',
        },
      });
    }

    // 1. Data-URI stored directly in database
    if (asset.storageUrl.startsWith('data:')) {
      const commaIndex = asset.storageUrl.indexOf(',');
      const metaPart = commaIndex !== -1 ? asset.storageUrl.slice(0, commaIndex) : '';
      const base64Data = commaIndex !== -1 ? asset.storageUrl.slice(commaIndex + 1) : '';
      const mimeMatch = metaPart.match(/^data:([^;]+);base64/);
      const mimeType = mimeMatch ? mimeMatch[1] : asset.mimeType || 'application/octet-stream';
      const buffer = Buffer.from(base64Data, 'base64');

      return new Response(buffer, {
        status: 200,
        headers: {
          'Content-Type': mimeType,
          'Content-Length': String(buffer.length),
          'Cache-Control': 'public, max-age=31536000, immutable',
          ETag: etag,
        },
      });
    }

    // 2. Cloudflare R2 / Remote CDN public URL
    if (asset.storageUrl.startsWith('http://') || asset.storageUrl.startsWith('https://')) {
      return Response.redirect(asset.storageUrl, 307);
    }

    // 3. Local filesystem upload
    if (asset.storageUrl.startsWith('/uploads/') || asset.storageUrl.startsWith('uploads/')) {
      const relativePath = asset.storageUrl.startsWith('/')
        ? asset.storageUrl.slice(1)
        : asset.storageUrl;
      const diskPath = path.join(process.cwd(), 'public', relativePath);

      try {
        const fileBuffer = await fs.readFile(diskPath);
        return new Response(fileBuffer, {
          status: 200,
          headers: {
            'Content-Type': asset.mimeType || 'application/octet-stream',
            'Content-Length': String(fileBuffer.length),
            'Cache-Control': 'public, max-age=31536000, immutable',
            ETag: etag,
          },
        });
      } catch {
        // Fallback: redirect to public static URL
        return Response.redirect(new URL(asset.storageUrl, req.url).toString(), 307);
      }
    }

    // Fallback: Redirect to whatever storage URL is registered
    return Response.redirect(new URL(asset.storageUrl, req.url).toString(), 307);
  } catch (err: any) {
    return new Response(err.message || 'Failed to serve media asset', { status: 500 });
  }
}
