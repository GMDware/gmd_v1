import { NextRequest, NextResponse } from 'next/server';
import { contactSubmissionSchema } from '@/lib/validations/contact';
import { checkRateLimit } from '@/lib/security/rate-limit';
import { ContactService } from '@/services/contact.service';

export async function POST(request: NextRequest) {
  try {
    const clientIp = request.headers.get('x-forwarded-for') || '127.0.0.1';
    const rateLimit = checkRateLimit(`contact:${clientIp}`, 5, 15 * 60 * 1000);

    if (!rateLimit.allowed) {
      return NextResponse.json(
        {
          success: false,
          error: {
            code: 'RATE_LIMIT_EXCEEDED',
            message: 'Too many submissions. Please wait before submitting again.',
          },
        },
        { status: 429 }
      );
    }

    const rawBody = await request.json();
    const validationResult = contactSubmissionSchema.safeParse(rawBody);

    if (!validationResult.success) {
      return NextResponse.json(
        {
          success: false,
          error: {
            code: 'VALIDATION_ERROR',
            message: 'Invalid input parameters',
            details: validationResult.error.flatten(),
          },
        },
        { status: 400 }
      );
    }

    const isDiscoveryRoute =
      validationResult.data.intakeRoute === 'SCOPED_DISCOVERY_CALL' ||
      (validationResult.data.budgetRange &&
        (validationResult.data.budgetRange.includes('< $5,000') ||
          validationResult.data.budgetRange.toLowerCase().includes('flexible')));

    const submission = await ContactService.submit({
      ...validationResult.data,
      ipAddress: clientIp,
      userAgent: request.headers.get('user-agent') || undefined,
    });

    // Server-side n8n webhook dispatch (non-blocking for client success)
    const webhookUrl = process.env.N8N_WEBHOOK_URL?.trim();
    if (webhookUrl) {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 5000);

      try {
        const webhookHeaders: Record<string, string> = {
          'Content-Type': 'application/json',
        };

        const webhookSecret = process.env.N8N_WEBHOOK_SECRET?.trim();
        if (webhookSecret) {
          webhookHeaders['X-GMDware-Webhook-Secret'] = webhookSecret;
        }

        const webhookRes = await fetch(webhookUrl, {
          method: 'POST',
          headers: webhookHeaders,
          body: JSON.stringify({
            fullName: validationResult.data.fullName,
            email: validationResult.data.email,
            phone: validationResult.data.phone,
            companyName: validationResult.data.companyName,
            projectType: validationResult.data.projectType,
            budgetRange: validationResult.data.budgetRange,
            timeline: validationResult.data.timeline,
            message: validationResult.data.message,
            intakeRoute: validationResult.data.intakeRoute,
            routingTag: validationResult.data.routingTag,
          }),
          signal: controller.signal,
        });

        if (!webhookRes.ok) {
          console.error(`[n8n Webhook] Dispatch returned non-2xx status: ${webhookRes.status} ${webhookRes.statusText}`);
        }
      } catch (webhookErr: any) {
        if (webhookErr?.name === 'AbortError') {
          console.error('[n8n Webhook] Dispatch timed out after 5000ms');
        } else {
          console.error('[n8n Webhook] Dispatch error:', webhookErr?.message || 'Unknown network error');
        }
      } finally {
        clearTimeout(timeoutId);
      }
    }

    const responseMessage = isDiscoveryRoute
      ? 'Your inquiry has been received and routed for a scoped architectural discovery call. Our engineering leadership will follow up via email.'
      : 'Your inquiry has been received. Our team will review your specifications and follow up via email.';

    return NextResponse.json({
      success: true,
      data: {
        id: submission.id,
        message: responseMessage,
        intakeRoute: isDiscoveryRoute ? 'SCOPED_DISCOVERY_CALL' : 'STANDARD_ENGAGEMENT',
      },
    });
  } catch (err: any) {
    console.error('[Contact POST Error]:', err);
    const isProd = process.env.NODE_ENV === 'production';
    return NextResponse.json(
      {
        success: false,
        error: {
          code: 'SERVER_ERROR',
          message: isProd
            ? 'An unexpected error occurred while processing your inquiry. Please try again later.'
            : err?.message || 'An unexpected error occurred while processing your inquiry.',
        },
      },
      { status: 500 }
    );
  }
}