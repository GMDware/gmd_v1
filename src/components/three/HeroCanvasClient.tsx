'use client';

import React from 'react';
import dynamic from 'next/dynamic';

export const HeroCanvasClient = dynamic(
  () => import('./HeroCanvas').then((mod) => mod.HeroCanvas),
  {
    ssr: false,
    loading: () => (
      <div className="absolute inset-0 z-0 bg-[#05080F] pointer-events-none" />
    ),
  }
);
