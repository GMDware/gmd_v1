import { NextRequest } from 'next/server';
import { ContactService } from '@/services/contact.service';
import { checkRateLimit } from '@/lib/security/rate-limit';
import { successResponse, errorResponse } from '@/lib/api/response';
import { z } from 'zod';

const contactInputSchema = z.object({
  fullName: z.string().min(2, { message: 'Name must be at least 2 characters' }).max(100),
  email: z.string().email({ message: 'A valid email address is required' }),
  phone: z
    .string()
    .max(30, { message: 'Phone number cannot exceed 30 characters' })
    .regex(/^[+]?[\d\s\-().]{6,30}$/, { message: 'Please enter a valid phone number' })
    .optional()
    .nullable()
    .or(z.literal(''))
    .transform((val) => (val === '' ? null : val)),
  companyName: z.string().max(100).optional(),
  projectType: z.string().max(100).optional(),
  budgetRange: z.string().max(100).optional(),
  timeline: z.string().max(100).optional(),
  message: z.string().min(10, { message: 'Message must be at least 10 characters' }).max(5000),
  intakeRoute: z.string().max(100).optional(),
  routingTag: z.string().max(100).optional(),
});

export async function POST(req: NextRequest) {
  try {
    const clientIp = req.headers.get('x-forwarded-for') || '127.0.0.1';
    const rateLimit = checkRateLimit(`contact_v1:${clientIp}`, 5, 15 * 60 * 1000); // 5 submissions per 15 min

    if (!rateLimit.allowed) {
      return errorResponse('RATE_LIMIT_EXCEEDED', 'Too many contact requests. Please wait 15 minutes.', 429);
    }

    const body = await req.json();
    const parsed = contactInputSchema.safeParse(body);
    if (!parsed.success) {
      return errorResponse('VALIDATION_ERROR', 'Invalid contact submission data', 400, parsed.error.flatten());
    }

    const submission = await ContactService.submit({
      ...parsed.data,
      ipAddress: clientIp,
      userAgent: req.headers.get('user-agent') || undefined,
    });

    return successResponse(
      {
        id: submission.id,
        message: 'Your inquiry has been received. The team will review your specifications and follow up via email.',
      },
      201
    );
  } catch (err: any) {
    return errorResponse('SERVER_ERROR', err.message || 'Failed to process inquiry', 500);
  }
}
