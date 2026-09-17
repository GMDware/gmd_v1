'use client';

import React, { useState, useTransition } from 'react';
import { useRouter } from 'next/navigation';
import { Terminal, Palette, Loader2 } from 'lucide-react';
import { useTheme } from '@/components/theme/ThemeProvider';
import { cn } from '@/lib/utils';

interface ThemeSwitcherProps {
  variant?: 'pill' | 'compact' | 'drawer';
  className?: string;
}

export const ThemeSwitcher: React.FC<ThemeSwitcherProps> = ({
  variant = 'pill',
  className = '',
}) => {
  const router = useRouter();
  const { themeId } = useTheme();
  const [isPending, startTransition] = useTransition();
  const [switchingTo, setSwitchingTo] = useState<string | null>(null);

  // Active theme is either 'atelier' or defaults to 'systems'
  const activeTheme = themeId === 'atelier' ? 'atelier' : 'systems';
  const isDark = activeTheme === 'systems';

  const switchTheme = async (targetTheme: 'systems' | 'atelier') => {
    if (targetTheme === activeTheme || isPending) return;

    setSwitchingTo(targetTheme);

    try {
      // Set via API route
      await fetch('/api/v1/theme/preview', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'set', themeId: targetTheme }),
      });

      // Also set directly in cookie for immediate client-side and subsequent SSR pickup
      document.cookie = `gmdware_theme_preview=${targetTheme}; path=/; max-age=2592000; SameSite=Lax`;
      document.documentElement.setAttribute('data-theme', targetTheme);

      startTransition(() => {
        router.refresh();
        // Fallback reload if router.refresh doesn't rehydrate server layout
        setTimeout(() => {
          window.location.reload();
        }, 150);
      });
    } catch (err) {
      console.error('Failed to switch theme:', err);
      setSwitchingTo(null);
    }
  };

  // Compact Single Toggle (for mobile header bar)
  if (variant === 'compact') {
    const nextTheme = activeTheme === 'systems' ? 'atelier' : 'systems';
    return (
      <button
        type="button"
        onClick={() => switchTheme(nextTheme)}
        disabled={isPending}
        className={cn(
          'inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-mono font-medium transition-all duration-200 border active:scale-95 shadow-xs',
          isDark
            ? 'bg-[#0A0F1D] border-white/15 text-slate-200 hover:text-white hover:border-[#00D2FF]/50'
            : 'bg-white border-slate-200 text-slate-700 hover:text-slate-900 hover:border-blue-400',
          className
        )}
        title={`Switch to GMDware ${nextTheme.toUpperCase()}`}
        aria-label={`Switch theme to ${nextTheme}`}
      >
        {isPending ? (
          <Loader2 className="w-3.5 h-3.5 animate-spin text-[#00D2FF]" />
        ) : isDark ? (
          <>
            <Terminal className="w-3.5 h-3.5 text-[#00D2FF]" />
            <span className="text-[11px] font-semibold">SYS</span>
          </>
        ) : (
          <>
            <Palette className="w-3.5 h-3.5 text-blue-600" />
            <span className="text-[11px] font-semibold">ATL</span>
          </>
        )}
      </button>
    );
  }

  // Full-width segmented controller (for mobile slide-out drawer)
  if (variant === 'drawer') {
    return (
      <div className={cn('p-1 rounded-xl border flex items-center gap-1 w-full', isDark ? 'bg-[#080D18] border-white/10' : 'bg-slate-100 border-slate-200', className)}>
        <button
          type="button"
          onClick={() => switchTheme('systems')}
          disabled={isPending}
          className={cn(
            'flex-1 py-2 px-3 rounded-lg text-xs font-semibold flex items-center justify-center gap-2 transition-all duration-200',
            activeTheme === 'systems'
              ? 'bg-[#0066FF] text-white shadow-md shadow-[#0066FF]/30 font-bold'
              : isDark
              ? 'text-slate-400 hover:text-white'
              : 'text-slate-600 hover:text-slate-900'
          )}
        >
          {switchingTo === 'systems' ? (
            <Loader2 className="w-3.5 h-3.5 animate-spin" />
          ) : (
            <Terminal className="w-3.5 h-3.5" />
          )}
          <span>GMDware Systems</span>
        </button>

        <button
          type="button"
          onClick={() => switchTheme('atelier')}
          disabled={isPending}
          className={cn(
            'flex-1 py-2 px-3 rounded-lg text-xs font-semibold flex items-center justify-center gap-2 transition-all duration-200',
            activeTheme === 'atelier'
              ? 'bg-blue-600 text-white shadow-md shadow-blue-500/30 font-bold'
              : isDark
              ? 'text-slate-400 hover:text-white'
              : 'text-slate-600 hover:text-slate-900'
          )}
        >
          {switchingTo === 'atelier' ? (
            <Loader2 className="w-3.5 h-3.5 animate-spin" />
          ) : (
            <Palette className="w-3.5 h-3.5" />
          )}
          <span>GMDware Atelier</span>
        </button>
      </div>
    );
  }

  // Segmented Pill (Default for desktop navigation bar)
  return (
    <div
      className={cn(
        'inline-flex items-center p-1 rounded-xl border transition-colors select-none',
        isDark
          ? 'bg-[#080D18]/90 border-white/10 shadow-inner'
          : 'bg-slate-100/90 border-slate-200 shadow-xs',
        className
      )}
      role="group"
      aria-label="Theme Controller"
    >
      {/* SYSTEMS Theme Tab */}
      <button
        type="button"
        onClick={() => switchTheme('systems')}
        disabled={isPending}
        className={cn(
          'relative px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all duration-200 active:scale-95',
          activeTheme === 'systems'
            ? 'bg-gradient-to-r from-[#0066FF] to-cyan-500 text-white shadow-[0_0_12px_rgba(6,182,212,0.4)]'
            : isDark
            ? 'text-slate-400 hover:text-slate-200 hover:bg-white/5'
            : 'text-slate-600 hover:text-slate-900 hover:bg-white/60'
        )}
        title="Switch to GMDware SYSTEMS (Dark Architectural)"
        aria-pressed={activeTheme === 'systems'}
      >
        {switchingTo === 'systems' ? (
          <Loader2 className="w-3.5 h-3.5 animate-spin text-white" />
        ) : (
          <Terminal className={cn('w-3.5 h-3.5', activeTheme === 'systems' ? 'text-white' : isDark ? 'text-[#00D2FF]' : 'text-slate-500')} />
        )}
        <span className="font-mono text-[11px] tracking-wide">SYSTEMS</span>
      </button>

      {/* ATELIER Theme Tab */}
      <button
        type="button"
        onClick={() => switchTheme('atelier')}
        disabled={isPending}
        className={cn(
          'relative px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all duration-200 active:scale-95',
          activeTheme === 'atelier'
            ? 'bg-blue-600 text-white shadow-[0_0_12px_rgba(37,99,235,0.35)] font-bold'
            : isDark
            ? 'text-slate-400 hover:text-slate-200 hover:bg-white/5'
            : 'text-slate-600 hover:text-slate-900 hover:bg-white/60'
        )}
        title="Switch to GMDware ATELIER (Modern Editorial)"
        aria-pressed={activeTheme === 'atelier'}
      >
        {switchingTo === 'atelier' ? (
          <Loader2 className="w-3.5 h-3.5 animate-spin text-white" />
        ) : (
          <Palette className={cn('w-3.5 h-3.5', activeTheme === 'atelier' ? 'text-white' : isDark ? 'text-slate-400' : 'text-blue-600')} />
        )}
        <span className="font-mono text-[11px] tracking-wide">ATELIER</span>
      </button>
    </div>
  );
};
