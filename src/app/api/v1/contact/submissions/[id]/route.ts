import { NextRequest } from 'next/server';
import { ContactService } from '@/services/contact.service';
import { requirePermission } from '@/lib/api/guard';
import { successResponse, errorResponse } from '@/lib/api/response';
import { ContactStatus } from '@prisma/client';
import { z } from 'zod';

const updateInquirySchema = z
  .object({
    status: z.enum(['NEW', 'READ', 'IN_PROGRESS', 'CONTACTED', 'ARCHIVED']).optional(),
    notes: z.string().optional().nullable(),
    adminNotes: z.string().optional().nullable(),
  })
  .transform((data) => ({
    status: data.status,
    notes: data.notes !== undefined ? data.notes : data.adminNotes,
  }));

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const auth = await requirePermission('contact.read', req);
    if (!auth.authorized || !auth.session) {
      return auth.response!;
    }

    const { id } = await params;
    const item = await ContactService.getById(id);
    if (!item) {
      return errorResponse('NOT_FOUND', `Inquiry with ID "${id}" not found`, 404);
    }

    return successResponse(item);
  } catch (err: any) {
    return errorResponse('SERVER_ERROR', err.message || 'Failed to retrieve inquiry', 500);
  }
}

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const auth = await requirePermission('contact.update', req);
    if (!auth.authorized || !auth.session) {
      return auth.response!;
    }

    const { id } = await params;
    const existing = await ContactService.getById(id);
    if (!existing) {
      return errorResponse('NOT_FOUND', `Inquiry with ID "${id}" not found`, 404);
    }

    const body = await req.json();
    const parsed = updateInquirySchema.safeParse(body);
    if (!parsed.success) {
      return errorResponse('VALIDATION_ERROR', 'Invalid status update payload', 400, parsed.error.flatten());
    }

    const newStatus = parsed.data.status || existing.status;
    const newNotes = parsed.data.notes !== undefined ? (parsed.data.notes ?? undefined) : undefined;

    const updated = await ContactService.updateStatus(
      id,
      newStatus as ContactStatus,
      newNotes,
      auth.session.userId
    );

    return successResponse(updated);
  } catch (err: any) {
    return errorResponse('SERVER_ERROR', err.message || 'Failed to update inquiry status', 500);
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const auth = await requirePermission('contact.update', req);
    if (!auth.authorized || !auth.session) {
      return auth.response!;
    }

    const { id } = await params;
    const deleted = await ContactService.delete(id, auth.session.userId);
    return successResponse({ id: deleted.id, message: 'Inquiry deleted successfully' });
  } catch (err: any) {
    return errorResponse('SERVER_ERROR', err.message || 'Failed to delete inquiry', 500);
  }
}
