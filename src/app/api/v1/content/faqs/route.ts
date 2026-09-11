import { NextRequest } from 'next/server';
import { ContentService } from '@/services/content.service';
import { requirePermission } from '@/lib/api/guard';
import { successResponse, errorResponse } from '@/lib/api/response';
import { z } from 'zod';

const faqSchema = z.object({
  question: z.string().min(5).max(300),
  answer: z.string().min(10).max(2000),
  category: z.string().min(2).max(50),
  displayOrder: z.number().int().default(0),
  isPublished: z.boolean().default(true),
});

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = req.nextUrl;
    const category = searchParams.get('category') || undefined;
    const isPublished = searchParams.has('published') ? searchParams.get('published') === 'true' : undefined;

    const faqs = await ContentService.listFAQs({ category, isPublished });
    return successResponse(faqs);
  } catch (err: any) {
    return errorResponse('SERVER_ERROR', err.message || 'Failed to retrieve FAQs', 500);
  }
}

export async function POST(req: NextRequest) {
  try {
    const auth = await requirePermission('content.update', req);
    if (!auth.authorized || !auth.session) {
      return auth.response!;
    }

    const body = await req.json();
    const parsed = faqSchema.safeParse(body);
    if (!parsed.success) {
      return errorResponse('VALIDATION_ERROR', 'Invalid FAQ payload', 400, parsed.error.flatten());
    }

    const faq = await ContentService.createFAQ(parsed.data);
    return successResponse(faq, 201);
  } catch (err: any) {
    return errorResponse('SERVER_ERROR', err.message || 'Failed to create FAQ', 500);
  }
}
