'use client';

import React from 'react';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';

interface AtelierInsightArticleProps {
  insight: any;
}

export const AtelierInsightArticle: React.FC<AtelierInsightArticleProps> = ({ insight }) => {
  return (
    <article className="min-h-screen pt-32 pb-24 px-6 sm:px-12 bg-[#0A0A0A] text-[#F5F2EB]">
      <div className="max-w-3xl mx-auto space-y-16">
        <Link
          href="/insights"
          className="inline-flex items-center gap-2 text-xs font-mono uppercase tracking-widest text-stone-500 hover:text-white transition-colors"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>RETURN TO JOURNAL</span>
        </Link>

        <header className="space-y-6 pb-8 border-b border-white/[0.08]">
          <div className="text-xs font-mono uppercase tracking-widest text-stone-500">
            ESSAY // {new Date(insight.publishedAt || insight.createdAt).toLocaleDateString()}
          </div>

          <h1 className="text-4xl sm:text-6xl font-normal font-serif text-[#F5F2EB] leading-tight">
            {insight.title}
          </h1>

          <div className="flex items-center gap-4 text-xs font-mono text-stone-400">
            <span>By <strong className="text-[#F5F2EB]">{insight.author?.name || 'GMDware Principal'}</strong></span>
            <span>•</span>
            <span>{insight.readingTimeMinutes || 5} MINUTE READ</span>
          </div>
        </header>

        {/* Essay Body */}
        <div className="prose prose-invert max-w-none text-stone-300 font-sans font-light leading-relaxed space-y-6 text-base sm:text-lg">
          {insight.content ? (
            <div className="whitespace-pre-wrap leading-relaxed">
              {insight.content}
            </div>
          ) : (
            <p className="italic text-stone-500">Essay content synchronized from CMS.</p>
          )}
        </div>

        {/* Footer */}
        <div className="pt-16 border-t border-white/[0.08] flex items-center justify-between text-xs font-mono">
          <Link href="/insights" className="text-stone-500 hover:text-white uppercase tracking-widest">
            ← All Journal Essays
          </Link>
          <Link href="/contact" className="text-[#F5F2EB] hover:underline uppercase tracking-widest">
            Commission a System →
          </Link>
        </div>
      </div>
    </article>
  );
};
