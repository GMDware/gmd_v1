'use client';

import React from 'react';
import Link from 'next/link';
import { ArrowLeft, ArrowRight } from 'lucide-react';

interface AtelierInsightArticleProps {
  insight: any;
}

export const AtelierInsightArticle: React.FC<AtelierInsightArticleProps> = ({ insight }) => {
  const authorName = insight.author?.name || 'GMDware Engineering';
  const pubDate = new Date(insight.publishedAt || insight.createdAt).toLocaleDateString(
    'en-US',
    { month: 'long', day: 'numeric', year: 'numeric' }
  );

  return (
    <article className="min-h-screen pt-12 pb-24 px-6 max-w-3xl mx-auto w-full space-y-12">
      {/* Return Link */}
      <div>
        <Link
          href="/insights"
          className="inline-flex items-center gap-2 px-4 py-2 rounded-xl border border-slate-300 hover:border-slate-900 bg-white/50 hover:bg-slate-900 text-slate-800 hover:text-white font-medium text-xs transition-all duration-200 shadow-sm group active:scale-[0.98]"
        >
          <ArrowLeft className="w-3.5 h-3.5 text-slate-500 group-hover:text-white group-hover:-translate-x-0.5 transition-transform" />
          <span>Back to perspectives</span>
        </Link>
      </div>

      {/* Header */}
      <header className="space-y-4">
        <div className="text-xs font-semibold text-blue-600 uppercase tracking-wide">
          {insight.category?.name || 'Perspective'}
        </div>

        <h1 className="text-3xl sm:text-5xl font-bold tracking-tight text-slate-900 font-sans leading-tight">
          {insight.title}
        </h1>

        <div className="flex flex-wrap items-center gap-3 text-xs text-slate-500 pt-2 border-t border-slate-100">
          <span className="text-slate-900 font-medium">By {authorName}</span>
          <span>•</span>
          <span>Published on {pubDate}</span>
          <span>•</span>
          <span>{insight.readTimeMin || 5} min read</span>
        </div>
      </header>

      {/* Summary Box */}
      {insight.summary && (
        <div className="p-6 rounded-xl bg-slate-50 border border-slate-200 text-slate-700 text-base leading-relaxed italic">
          &ldquo;{insight.summary}&rdquo;
        </div>
      )}

      {/* Article Body */}
      <div className="prose prose-slate max-w-none text-slate-800 font-sans leading-relaxed space-y-6 text-base">
        {insight.content ? (
          <div className="whitespace-pre-wrap leading-relaxed">
            {insight.content}
          </div>
        ) : (
          <p className="italic text-slate-400">Content loaded from GMDware CMS repository.</p>
        )}
      </div>

      {/* Footer CTA */}
      <div className="pt-12 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-4">
        <Link
          href="/insights"
          className="inline-flex items-center gap-2 px-4 py-2 rounded-xl border border-slate-300 hover:border-slate-900 bg-white/50 hover:bg-slate-900 text-slate-800 hover:text-white font-medium text-xs transition-all duration-200 shadow-sm group active:scale-[0.98]"
        >
          <ArrowLeft className="w-3.5 h-3.5 text-slate-500 group-hover:text-white group-hover:-translate-x-0.5 transition-transform" />
          <span>All articles</span>
        </Link>

        <Link
          href="/contact"
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl border border-slate-300 hover:border-slate-900 bg-white/50 hover:bg-slate-900 text-slate-800 hover:text-white font-medium text-xs transition-all duration-200 shadow-sm group active:scale-[0.98]"
        >
          <span>Start a conversation</span>
          <ArrowRight className="w-3.5 h-3.5 text-slate-500 group-hover:text-white group-hover:translate-x-1 transition-transform" />
        </Link>
      </div>
    </article>
  );
};
