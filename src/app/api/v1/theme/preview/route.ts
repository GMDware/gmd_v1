import { NextRequest, NextResponse } from 'next/server';
import { THEME_PREVIEW_COOKIE } from '@/lib/theme/resolver';
import { isValidTheme } from '@/lib/theme/registry';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const action = body.action || (body.clear ? 'clear' : 'set');
    const themeId = body.themeId;

    const isSetAction = action === 'set' && isValidTheme(themeId);
    const response = NextResponse.json({
      success: true,
      data: {
        action,
        previewTheme: isSetAction ? themeId : null,
      },
    });

    if (isSetAction) {
      response.cookies.set(THEME_PREVIEW_COOKIE, themeId, {
        path: '/',
        maxAge: 60 * 60 * 2, // 2 hours preview expiration
        sameSite: 'lax',
        httpOnly: false, // Accessible to client banner
      });
    } else if (action === 'clear' || body.clear) {
      response.cookies.delete({
        name: THEME_PREVIEW_COOKIE,
        path: '/',
      });
    }

    return response;
  } catch (err: any) {
    return NextResponse.json(
      { success: false, error: err?.message || 'Preview action failed' },
      { status: 500 }
    );
  }
}
