import { NextResponse } from 'next/server';
import { MetricsService } from '@/services/metrics.service';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export async function GET() {
  try {
    const data = await MetricsService.getResolvedPublicMetrics();
    return NextResponse.json({ success: true, data });
  } catch (err: any) {
    return NextResponse.json(
      {
        success: false,
        error: {
          code: 'INTERNAL_ERROR',
          message: err?.message || 'Failed to retrieve proof metrics',
        },
      },
      { status: 500 }
    );
  }
}
