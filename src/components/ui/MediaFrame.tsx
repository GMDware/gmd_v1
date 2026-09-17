import React from 'react';
import { cn } from '@/lib/utils';
import Image from 'next/image';

interface MediaFrameProps {
  src: string;
  alt: string;
  aspectRatio?: '16/9' | '21/9' | '4/3' | '1/1' | 'auto';
  caption?: string;
  tag?: string;
  priority?: boolean;
  className?: string;
}

export const MediaFrame: React.FC<MediaFrameProps> = ({
  src,
  alt,
  aspectRatio = '16/9',
  caption,
  tag,
  priority = false,
  className,
}) => {
  const aspectClasses = {
    '16/9': 'aspect-video',
    '21/9': 'aspect-[21/9]',
    '4/3': 'aspect-[4/3]',
    '1/1': 'aspect-square',
    'auto': 'aspect-auto',
  };

  return (
    <figure className={cn('relative group overflow-hidden rounded-xl border border-white/10 bg-[#06090F]', className)}>
      {/* Precision Frame Top Bar */}
      <div className="flex items-center justify-between px-3 py-1.5 bg-[#080D18] border-b border-white/[0.06] text-[10px] font-mono text-[#64748B] select-none">
        <div className="flex items-center gap-2">
          <span className="w-1.5 h-1.5 rounded-full bg-[#0066FF]" />
          <span>{tag || 'ASSET — SPECIFICATION'}</span>
        </div>
        <span className="text-slate-500 tracking-wider">[GMD_FRAME_v3]</span>
      </div>

      {/* Image Container */}
      <div className={cn('relative w-full overflow-hidden', aspectClasses[aspectRatio])}>
        <Image
          src={src}
          alt={alt}
          fill
          priority={priority}
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 75vw, 60vw"
          className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
        />

        {/* Ambient Dark Gradient Vignette */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#05080F] via-transparent to-transparent opacity-40 pointer-events-none" />
      </div>

      {/* Caption Bar */}
      {caption && (
        <figcaption className="px-3.5 py-2 text-xs text-[#94A3B8] font-mono bg-[#080D18] border-t border-white/[0.06]">
          {caption}
        </figcaption>
      )}
    </figure>
  );
};
