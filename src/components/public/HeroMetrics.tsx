'use client';

import React, { useRef, useState, useEffect } from 'react';
import { motion, useInView, useReducedMotion, animate, type Variants } from 'framer-motion';
import { ResolvedMetric } from '@/types/metrics';

export const FALLBACK_METRICS: ResolvedMetric[] = [
  {
    id: 'delivered-solutions',
    key: 'projects',
    value: '+20',
    numericValue: 20,
    prefix: '+',
    decimals: 0,
    label: 'DELIVERED SOLUTIONS',
    subtext: 'Production Systems Launched',
    order: 1,
    isVisible: true,
  },
  {
    id: 'on-time-deployment',
    key: 'inquiries',
    value: '100%',
    numericValue: 100,
    suffix: '%',
    decimals: 0,
    label: 'ON-TIME DEPLOYMENT',
    subtext: 'Milestone Delivery Rate',
    order: 2,
    isVisible: true,
  },
  {
    id: 'client-partners',
    key: 'clients',
    value: '+15',
    numericValue: 15,
    prefix: '+',
    decimals: 0,
    label: 'CLIENT PARTNERS',
    subtext: 'Startups & Enterprises Scaled',
    order: 3,
    isVisible: true,
  },
  {
    id: 'platform-reliability',
    key: 'uptime',
    value: '99.9%',
    numericValue: 99.9,
    suffix: '%',
    decimals: 1,
    label: 'PLATFORM RELIABILITY',
    subtext: 'Production Uptime Standard',
    order: 4,
    isVisible: true,
  },
];

interface CounterProps {
  value: number;
  prefix?: string;
  suffix?: string;
  decimals?: number;
  fallbackRaw?: string;
  isInView: boolean;
}

const AnimatedCounter: React.FC<CounterProps> = ({
  value,
  prefix = '',
  suffix = '',
  decimals = 0,
  fallbackRaw,
  isInView,
}) => {
  const shouldReduceMotion = useReducedMotion();
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    if (shouldReduceMotion) {
      setCurrent(value);
      return;
    }

    if (!isInView) return;

    const controls = animate(0, value, {
      duration: 1.8,
      ease: [0.16, 1, 0.3, 1],
      onUpdate: (latest) => {
        setCurrent(latest);
      },
    });

    return () => controls.stop();
  }, [isInView, value, shouldReduceMotion]);

  // If there's no numeric value to animate (e.g. non-numeric format), display raw
  if (value === 0 && fallbackRaw && !fallbackRaw.includes('0')) {
    return <span className="tabular-nums font-mono text-white">{fallbackRaw}</span>;
  }

  const formattedNumber =
    decimals > 0 ? current.toFixed(decimals) : Math.round(current).toString();

  return (
    <span className="inline-flex items-baseline font-mono tabular-nums">
      {prefix && (
        <span className="text-[#00D2FF] font-semibold mr-0.5 drop-shadow-[0_0_8px_rgba(0,210,255,0.4)]">
          {prefix}
        </span>
      )}
      <span className="text-white">{formattedNumber}</span>
      {suffix && (
        <span className="text-[#00D2FF] font-semibold ml-0.5 drop-shadow-[0_0_8px_rgba(0,210,255,0.4)]">
          {suffix}
        </span>
      )}
    </span>
  );
};

const containerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
};

const cardVariants: Variants = {
  hidden: { opacity: 0, y: 16 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.5,
      ease: [0.16, 1, 0.3, 1] as const,
    },
  },
};

export interface HeroMetricsProps {
  initialMetrics?: ResolvedMetric[];
}

export const HeroMetrics: React.FC<HeroMetricsProps> = ({ initialMetrics }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(containerRef, { once: true, margin: '-40px 0px' });
  const [metrics, setMetrics] = useState<ResolvedMetric[]>(
    initialMetrics && initialMetrics.length > 0 ? initialMetrics : FALLBACK_METRICS
  );

  useEffect(() => {
    // Dynamic client-side refresh to ensure real-time accuracy
    let isMounted = true;
    fetch('/api/metrics')
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

  const visibleMetrics = metrics.filter((m) => m.isVisible);

  if (visibleMetrics.length === 0) {
    return null;
  }

  return (
    <motion.div
      ref={containerRef}
      initial="hidden"
      animate={isInView ? 'visible' : 'hidden'}
      variants={containerVariants}
      className="pt-12 max-w-4xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-4 border-t border-white/[0.08]"
    >
      {visibleMetrics.map((metric) => (
        <motion.div
          key={metric.id}
          variants={cardVariants}
          className="relative group p-4 sm:p-5 rounded-xl backdrop-blur-md bg-[#080c14]/60 border border-white/[0.08] hover:border-cyan-500/40 transition-colors text-center overflow-hidden flex flex-col justify-center"
        >
          {/* Subtle Ambient Top Accent */}
          <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/10 to-transparent group-hover:via-cyan-500/30 transition-colors pointer-events-none" />

          {/* Glowing Metric Value */}
          <div className="text-3xl font-bold font-mono tracking-tight text-white drop-shadow-[0_0_12px_rgba(0,210,255,0.35)] flex items-center justify-center">
            <AnimatedCounter
              value={metric.numericValue}
              prefix={metric.prefix}
              suffix={metric.suffix}
              decimals={metric.decimals}
              fallbackRaw={metric.value}
              isInView={isInView}
            />
          </div>

          {/* Metric Label */}
          <div className="text-[11px] font-mono font-semibold tracking-wider text-cyan-400/90 uppercase mt-2">
            {metric.label}
          </div>

          {/* Metric Subtext */}
          <div className="text-xs font-sans text-slate-300 leading-snug mt-1">
            {metric.subtext}
          </div>
        </motion.div>
      ))}
    </motion.div>
  );
};
