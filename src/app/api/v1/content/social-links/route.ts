import { NextRequest } from 'next/server';
import { ContentService } from '@/services/content.service';
import { requirePermission } from '@/lib/api/guard';
import { successResponse, errorResponse } from '@/lib/api/response';
import { z } from 'zod';

const socialLinkSchema = z.object({
  platform: z.string().min(1).max(50),
  url: z
    .string()
    .url('Must be a valid URL')
    .refine(
      (val) => /^https?:\/\//i.test(val.trim()),
      { message: 'Only secure HTTP/HTTPS protocols are permitted.' }
    )
    .refine(
      (val) => !/^(javascript|data|vbscript):/i.test(val.trim()),
      { message: 'Unsafe URI scheme detected.' }
    ),
  displayOrder: z.number().int().default(0),
  isEnabled: z.boolean().default(true),
});

const updateSocialLinkSchema = z.object({
  id: z.string().uuid(),
  platform: z.string().min(1).max(50).optional(),
  url: z
    .string()
    .url('Must be a valid URL')
    .refine(
      (val) => /^https?:\/\//i.test(val.trim()),
      { message: 'Only secure HTTP/HTTPS protocols are permitted.' }
    )
    .refine(
      (val) => !/^(javascript|data|vbscript):/i.test(val.trim()),
      { message: 'Unsafe URI scheme detected.' }
    )
    .optional(),
  displayOrder: z.number().int().optional(),
  isEnabled: z.boolean().optional(),
});

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = req.nextUrl;
    const includeDisabled = searchParams.get('all') === 'true';
    const links = await ContentService.listSocialLinks(!includeDisabled);
    return successResponse(links);
  } catch (err: any) {
    return errorResponse('SERVER_ERROR', err.message || 'Failed to retrieve social links', 500);
  }
}

export async function POST(req: NextRequest) {
  try {
    const auth = await requirePermission('settings.update', req);
    if (!auth.authorized || !auth.session) {
      return auth.response!;
    }

    const body = await req.json();
    const parsed = socialLinkSchema.safeParse(body);
    if (!parsed.success) {
      return errorResponse('VALIDATION_ERROR', 'Invalid social link payload', 400, parsed.error.flatten());
    }

    const link = await ContentService.createSocialLink(parsed.data);
    return successResponse(link, 201);
  } catch (err: any) {
    return errorResponse('SERVER_ERROR', err.message || 'Failed to create social link', 500);
  }
}

export async function PUT(req: NextRequest) {
  try {
    const auth = await requirePermission('settings.update', req);
    if (!auth.authorized || !auth.session) {
      return auth.response!;
    }

    const body = await req.json();
    const parsed = updateSocialLinkSchema.safeParse(body);
    if (!parsed.success) {
      return errorResponse('VALIDATION_ERROR', 'Invalid update payload', 400, parsed.error.flatten());
    }

    const { id, ...data } = parsed.data;
    const updated = await ContentService.updateSocialLink(id, data);
    return successResponse(updated);
  } catch (err: any) {
    return errorResponse('SERVER_ERROR', err.message || 'Failed to update social link', 500);
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const auth = await requirePermission('settings.update', req);
    if (!auth.authorized || !auth.session) {
      return auth.response!;
    }

    const { searchParams } = req.nextUrl;
    const id = searchParams.get('id');
    if (!id) {
      return errorResponse('VALIDATION_ERROR', 'Social link ID is required', 400);
    }

    await ContentService.deleteSocialLink(id);
    return successResponse({ deleted: true });
  } catch (err: any) {
    return errorResponse('SERVER_ERROR', err.message || 'Failed to delete social link', 500);
  }
}
