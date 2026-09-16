'use client';

import React, { useState, useEffect, useRef } from 'react';
import { motion, useInView, useReducedMotion, animate } from 'framer-motion';
import { ResolvedMetric } from '@/types/metrics';
import { Users, FolderKanban, ShieldCheck, ArrowUpRight } from 'lucide-react';
import { editorialEasing } from '../motion';

interface AnimatedNumberProps {
  value: number;
  prefix?: string;
  suffix?: string;
  decimals?: number;
  fallbackRaw?: string;
  isInView: boolean;
}

const AnimatedNumber: React.FC<AnimatedNumberProps> = ({
  value,
  prefix = '',
  suffix = '',
  decimals = 0,
  fallbackRaw,
  isInView,
}) => {
  const nodeRef = useRef<HTMLSpanElement>(null);
  const shouldReduceMotion = useReducedMotion();

  useEffect(() => {
    if (!isInView || shouldReduceMotion) {
      if (nodeRef.current) {
        nodeRef.current.textContent = `${prefix}${value.toLocaleString(undefined, {
          minimumFractionDigits: decimals,
          maximumFractionDigits: decimals,
        })}${suffix}`;
      }
      return;
    }

    const node = nodeRef.current;
    if (!node) return;

    const controls = animate(0, value, {
      duration: 1.4,
      ease: editorialEasing,
      onUpdate: (latest) => {
        node.textContent = `${prefix}${latest.toLocaleString(undefined, {
          minimumFractionDigits: decimals,
          maximumFractionDigits: decimals,
        })}${suffix}`;
      },
    });

    return () => controls.stop();
  }, [value, prefix, suffix, decimals, isInView, shouldReduceMotion]);

  if (shouldReduceMotion) {
    return <span>{fallbackRaw || `${prefix}${value}${suffix}`}</span>;
  }

  return <span ref={nodeRef}>{fallbackRaw || `${prefix}${value}${suffix}`}</span>;
};

interface AtelierStatsProps {
  initialMetrics?: ResolvedMetric[];
}

export const AtelierStats: React.FC<AtelierStatsProps> = ({ initialMetrics }) => {
  const containerRef = useRef<HTMLElement>(null);
  const isInView = useInView(containerRef, { once: true, amount: 0.2 });
  const shouldReduceMotion = useReducedMotion();

  const [metrics, setMetrics] = useState<ResolvedMetric[]>(() => {
    return initialMetrics && initialMetrics.length > 0 ? initialMetrics : [];
  });

  // Synchronize client-side with live metrics endpoint
  useEffect(() => {
    let isMounted = true;

    fetch('/api/metrics', { cache: 'no-store' })
      .then((res) => res.json())
      .then((json) => {
        if (isMounted && json.success && Array.isArray(json.data) && json.data.length > 0) {
          setMetrics(json.data);
        }
      })
      .catch(() => {});

    return () => {
      isMounted = false;
    };
  }, []);

  // Find visitors metric if available from backend
  const visitorMetric = metrics.find((m) => m.key === 'visitors');
  const supportingMetrics = metrics.filter((m) => m.isVisible && m.key !== 'visitors').slice(0, 3);

  // If absolutely no metrics returned from DB/CMS, render neutral studio statement
  if (metrics.length === 0) {
    return null;
  }

  const getSupportingIcon = (key: string) => {
    switch (key) {
      case 'clients':
        return <Users className="w-4 h-4 text-blue-600" />;
      case 'projects':
        return <FolderKanban className="w-4 h-4 text-orange-600" />;
      case 'uptime':
      case 'inquiries':
        return <ShieldCheck className="w-4 h-4 text-emerald-600" />;
      default:
        return <ArrowUpRight className="w-4 h-4 text-blue-600" />;
    }
  };

  return (
    <section
      ref={containerRef}
      className="py-20 px-6 max-w-6xl mx-auto w-full overflow-hidden"
      aria-label="Studio proof and performance metrics"
    >
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
        {/* Featured Big Metric Card (5 Cols on Desktop) */}
        {visitorMetric && (
          <motion.div
            initial={shouldReduceMotion ? false : { opacity: 0, scale: 0.94, y: 30 }}
            whileInView={{ opacity: 1, scale: 1, y: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.7, ease: editorialEasing }}
            className="lg:col-span-5 rounded-2xl bg-gradient-to-br from-blue-50/90 via-indigo-50/30 to-white border border-blue-200/90 shadow-[0_8px_30px_rgb(0,0,0,0.04)] p-8 flex flex-col justify-between space-y-6 relative overflow-hidden group hover:border-blue-300 transition-colors"
          >
            {/* Top Accent Line */}
            <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-blue-600 via-indigo-600 to-transparent" />

            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-bold uppercase tracking-wider text-blue-700">
                  Audience & Verification
                </span>
                <span className="px-2.5 py-0.5 rounded-full bg-blue-100/70 border border-blue-200 text-blue-800 text-[11px] font-medium">
                  Verified Postgres Count
                </span>
              </div>

              <div className="text-4xl sm:text-5xl font-black tracking-tight text-blue-700 font-sans pt-2">
                <AnimatedNumber
                  value={visitorMetric.numericValue}
                  prefix={visitorMetric.prefix}
                  suffix={visitorMetric.suffix}
                  decimals={visitorMetric.decimals}
                  fallbackRaw={visitorMetric.value}
                  isInView={isInView}
                />
              </div>

              <h3 className="text-lg font-bold text-slate-900 tracking-tight">
                {visitorMetric.label || 'Recorded Visitor Sessions (All-Time)'}
              </h3>
            </div>

            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed border-t border-blue-100/80 pt-4">
              {visitorMetric.subtext ||
                'All-time human browser sessions and project inquiries recorded in PostgreSQL.'}
            </p>
          </motion.div>
        )}

        {/* 3 Asymmetric Supporting Cards (7 Cols on Desktop) */}
        <div className={`grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-5 ${visitorMetric ? 'lg:col-span-7' : 'lg:col-span-12'}`}>
          {supportingMetrics.map((metric, idx) => {
            // Directional choreography: card 0 from left, 1 from bottom, 2 from right
            const initialOffset =
              idx === 0
                ? { opacity: 0, x: -35 }
                : idx === 1
                ? { opacity: 0, y: 40 }
                : { opacity: 0, x: 35 };

            return (
              <motion.div
                key={metric.id || idx}
                initial={shouldReduceMotion ? false : initialOffset}
                whileInView={{ opacity: 1, x: 0, y: 0 }}
                viewport={{ once: true, amount: 0.2 }}
                transition={{
                  duration: 0.65,
                  delay: 0.12 * (idx + 1),
                  ease: editorialEasing,
                }}
                className="rounded-2xl bg-white border border-slate-200/90 p-6 flex flex-col justify-between space-y-4 hover:border-slate-300 hover:shadow-md transition-all group relative overflow-hidden"
              >
                {/* Subtle top accent line on hover */}
                <div className="absolute top-0 left-0 right-0 h-0.5 bg-blue-600 scale-x-0 group-hover:scale-x-100 transition-transform origin-left duration-300" />

                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wide">
                    0{idx + 2}
                  </span>
                  <div className="p-2 rounded-lg bg-slate-50 border border-slate-100">
                    {getSupportingIcon(metric.key)}
                  </div>
                </div>

                <div className="space-y-1">
                  <div className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900 font-sans">
                    <AnimatedNumber
                      value={metric.numericValue}
                      prefix={metric.prefix}
                      suffix={metric.suffix}
                      decimals={metric.decimals}
                      fallbackRaw={metric.value}
                      isInView={isInView}
                    />
                  </div>

                  <h4 className="text-xs font-bold text-slate-900 leading-snug">
                    {metric.label}
                  </h4>
                </div>

                <p className="text-xs text-slate-500 leading-snug pt-2 border-t border-slate-100">
                  {metric.subtext}
                </p>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
