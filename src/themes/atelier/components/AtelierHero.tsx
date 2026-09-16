'use client';

import React, { useRef, useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import {
  ArrowRight,
  CheckCircle2,
  Sparkles,
  Compass,
  Palette,
  Code2,
  Rocket,
  Check,
  Play,
  Pause,
  Layers,
  Terminal,
} from 'lucide-react';
import { motion, useScroll, useTransform, useSpring, useReducedMotion, AnimatePresence } from 'framer-motion';
import { editorialEasing } from '../motion';

interface AtelierHeroProps {
  headline?: string;
  subtitle?: string;
  badge?: string;
  primaryCtaLabel?: string;
  primaryCtaUrl?: string;
  secondaryCtaLabel?: string;
  secondaryCtaUrl?: string;
}

type ProductStage = 'discover' | 'design' | 'build' | 'launch';

// All 4 stages in strict sequential cycle
const ALL_STAGES: readonly ProductStage[] = ['discover', 'design', 'build', 'launch'];

export const AtelierHero: React.FC<AtelierHeroProps> = ({
  headline,
  subtitle,
  primaryCtaLabel = 'View our work',
  primaryCtaUrl = '/work',
}) => {
  const heroRef = useRef<HTMLElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const shouldReduceMotion = useReducedMotion();

  // Active simulator stage - cycles through all 4 stages: discover -> design -> build -> launch
  const [activeStage, setActiveStage] = useState<ProductStage>('discover');
  // Auto-play game engine state
  const [isAutoPlaying, setIsAutoPlaying] = useState<boolean>(true);
  const [stageProgress, setStageProgress] = useState<number>(0);

  // 1. Discover stage dynamic progression state
  const [discoverStep, setDiscoverStep] = useState<number>(1);

  // 2. Design stage dynamic progression state
  const [activeColorIdx, setActiveColorIdx] = useState<number>(0);
  const [interactiveToggle, setInteractiveToggle] = useState<boolean>(true);
  const [copiedColor, setCopiedColor] = useState<string | null>(null);

  // 3. Build stage dynamic typing state
  const [typedLineCount, setTypedLineCount] = useState<number>(0);
  const [liveButtonCount, setLiveButtonCount] = useState<number>(18);
  const [liveVariant, setLiveVariant] = useState<'primary' | 'secondary'>('primary');
  const [isCompiling, setIsCompiling] = useState<boolean>(false);

  // 4. Launch stage dynamic progression state
  const [launchProgress, setLaunchProgress] = useState<number>(0);
  const [activeMetricTab, setActiveMetricTab] = useState<'inquiries' | 'latency' | 'uptime'>('inquiries');

  // Mouse tilt physics for 3D depth on desktop
  const springConfig = { damping: 25, stiffness: 180 };
  const rotateX = useSpring(0, springConfig);
  const rotateY = useSpring(0, springConfig);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (shouldReduceMotion || typeof window === 'undefined' || window.innerWidth < 1024) return;
    if (!containerRef.current) return;

    const rect = containerRef.current.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;

    // Subtle 3D tilt
    rotateX.set(-y * 7);
    rotateY.set(x * 9);
  };

  const handleMouseLeave = () => {
    rotateX.set(0);
    rotateY.set(0);
  };

  // Scroll-linked parallax transforms
  const { scrollYProgress } = useScroll({
    target: heroRef,
    offset: ['start start', 'end start'],
  });

  const parallaxDesktop = useTransform(scrollYProgress, [0, 1], [0, -30]);
  const parallaxRotate = useTransform(scrollYProgress, [0, 1], [-1, 1]);

  const displayHeadline =
    headline && !headline.includes('Audit Test') && !headline.includes('Cinematic') && !headline.includes('Resilient Enterprise')
      ? headline
      : 'Digital products for teams with something worth building.';

  const displaySubtitle =
    subtitle && !subtitle.includes('Audit Test') && !subtitle.includes('fault-tolerant') && !subtitle.includes('distributed infrastructure')
      ? subtitle
      : 'We design and build websites, platforms, and software products for companies that need clear thinking and reliable execution.';

  const displayCta =
    primaryCtaLabel && !primaryCtaLabel.includes('Systems') && !primaryCtaLabel.includes('Audit')
      ? primaryCtaLabel
      : 'View our work';

  // Design Stage Color Tokens
  const colorTokens = [
    { name: 'Cobalt', hex: '#2563EB', role: 'Primary Brand', bg: 'bg-[#2563EB]', ring: 'ring-blue-500' },
    { name: 'Coral', hex: '#EA580C', role: 'Action Accent', bg: 'bg-[#EA580C]', ring: 'ring-orange-500' },
    { name: 'Emerald', hex: '#10B981', role: 'System State', bg: 'bg-[#10B981]', ring: 'ring-emerald-500' },
    { name: 'Slate', hex: '#0F172A', role: 'Ink Canvas', bg: 'bg-[#0F172A]', ring: 'ring-slate-700' },
  ];

  const handleCopyHex = (hex: string) => {
    if (typeof navigator !== 'undefined' && navigator.clipboard) {
      navigator.clipboard.writeText(hex);
      setCopiedColor(hex);
      setTimeout(() => setCopiedColor(null), 1800);
    }
  };

  // Code editor lines for Stage 3 (Build)
  const codeLines = [
    { num: '01', code: 'export function MetricCard() {' },
    { num: '02', code: '  const [leads, setLeads] = useState(24);' },
    { num: '03', code: '  return (' },
    { num: '04', code: `    <Button variant="${liveVariant === 'primary' ? 'cobalt' : 'dark'}">` },
    { num: '05', code: '      Inquiries: {leads}' },
    { num: '06', code: '    </Button>' },
    { num: '07', code: '  );' },
    { num: '08', code: '}' },
  ];

  // Launch Stage Chart Data
  const chartData = {
    inquiries: {
      stat: '+38.4%',
      label: 'Qualified Inquiries',
      subtext: 'vs. previous cycle',
      bars: [35, 48, 42, 60, 55, 78, 92],
    },
    latency: {
      stat: '16ms',
      label: 'Edge Response',
      subtext: 'Global p95 latency',
      bars: [45, 30, 25, 22, 20, 18, 16],
    },
    uptime: {
      stat: '99.99%',
      label: 'System Reliability',
      subtext: '30-day verified window',
      bars: [99, 99, 100, 100, 99, 100, 100],
    },
  };

  // Manual stage selection by user
  const handleSelectStage = useCallback((stage: ProductStage) => {
    setActiveStage(stage);
    setStageProgress(0);
  }, []);

  // -------------------------------------------------------------
  // GUARANTEED 4-STAGE AUTOMATED SIMULATION ENGINE
  // Sequential progression: Discover -> Design -> Build -> Launch -> Discover
  // -------------------------------------------------------------
  useEffect(() => {
    if (!isAutoPlaying || shouldReduceMotion) return;

    const stageDurationMs = 4500; // 4.5 seconds per stage
    const tickMs = 50;
    const increment = (tickMs / stageDurationMs) * 100;

    // Smooth progress indicator
    const progressInterval = setInterval(() => {
      setStageProgress((prev) => (prev >= 100 ? 0 : prev + increment));
    }, tickMs);

    // Guaranteed cycle through all 4 stages
    const stageInterval = setInterval(() => {
      setActiveStage((prevStage) => {
        const currentIdx = ALL_STAGES.indexOf(prevStage);
        const nextIdx = (currentIdx + 1) % ALL_STAGES.length;
        return ALL_STAGES[nextIdx];
      });
      setStageProgress(0);
    }, stageDurationMs);

    return () => {
      clearInterval(progressInterval);
      clearInterval(stageInterval);
    };
  }, [isAutoPlaying, shouldReduceMotion]);

  // Stage-specific dynamic construction triggers on each stage change
  useEffect(() => {
    // 1. Stage: Discover (Building the Idea)
    if (activeStage === 'discover') {
      setDiscoverStep(1);
      const t1 = setTimeout(() => setDiscoverStep(2), 1200);
      const t2 = setTimeout(() => setDiscoverStep(3), 2600);
      return () => {
        clearTimeout(t1);
        clearTimeout(t2);
      };
    }

    // 2. Stage: Design (Building the Design System Tokens)
    if (activeStage === 'design') {
      setActiveColorIdx(0);
      setInteractiveToggle(true);
      const t1 = setTimeout(() => {
        setActiveColorIdx(1);
        setInteractiveToggle(false);
      }, 1400);
      const t2 = setTimeout(() => {
        setActiveColorIdx(2);
        setInteractiveToggle(true);
      }, 2800);
      return () => {
        clearTimeout(t1);
        clearTimeout(t2);
      };
    }

    // 3. Stage: Build (Typing the Code & Hot-Reloading Component)
    if (activeStage === 'build') {
      setTypedLineCount(0);
      setIsCompiling(true);

      const typeInterval = setInterval(() => {
        setTypedLineCount((count) => {
          if (count < codeLines.length) {
            return count + 1;
          }
          clearInterval(typeInterval);
          setIsCompiling(false);
          return count;
        });
      }, 280);

      const tReact = setTimeout(() => {
        setLiveButtonCount((c) => c + 4);
        setLiveVariant('primary');
      }, 2500);

      return () => {
        clearInterval(typeInterval);
        clearTimeout(tReact);
      };
    }

    // 4. Stage: Launch (Verifying Build & Switching Live Metrics)
    if (activeStage === 'launch') {
      setLaunchProgress(0);
      setActiveMetricTab('inquiries');

      const progressTimer = setInterval(() => {
        setLaunchProgress((p) => {
          if (p >= 100) {
            clearInterval(progressTimer);
            return 100;
          }
          return p + 10;
        });
      }, 80);

      const t1 = setTimeout(() => setActiveMetricTab('latency'), 1500);
      const t2 = setTimeout(() => setActiveMetricTab('uptime'), 3000);

      return () => {
        clearInterval(progressTimer);
        clearTimeout(t1);
        clearTimeout(t2);
      };
    }
  }, [activeStage, codeLines.length]);

  const currentStageIndex = ALL_STAGES.indexOf(activeStage) + 1;

  return (
    <section
      ref={heroRef}
      className="relative pt-4 pb-16 md:pt-8 md:pb-24 px-6 max-w-6xl mx-auto w-full overflow-hidden"
    >
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-center">
        {/* Left Column: Confident Editorial Statement & Clean CTA Hierarchy */}
        <div className="lg:col-span-6 space-y-6">
          {/* Main Headline */}
          <h1 className="text-3xl sm:text-5xl lg:text-[3.25rem] font-bold tracking-tight text-slate-900 font-sans leading-[1.12]">
            {displayHeadline}
          </h1>

          {/* Grounded Human Subtitle */}
          <p className="text-base sm:text-lg text-slate-600 font-sans font-normal leading-relaxed max-w-lg">
            {displaySubtitle}
          </p>

          {/* Hero Action: Single Outlined Ghost Button */}
          <div className="pt-1">
            <Link
              href={primaryCtaUrl}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl border border-slate-300 hover:border-slate-900 bg-white/50 hover:bg-slate-900 text-slate-800 hover:text-white font-medium text-sm transition-all duration-200 shadow-sm group active:scale-[0.98]"
            >
              <span>{displayCta}</span>
              <ArrowRight className="w-4 h-4 text-slate-500 group-hover:text-white group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>
        </div>

        {/* Right Column: Interactive Gamified "Idea-to-Product Simulator" Card */}
        <div
          ref={containerRef}
          onMouseMove={handleMouseMove}
          onMouseLeave={handleMouseLeave}
          className="lg:col-span-6 relative py-4 lg:py-0"
          style={{ perspective: '1200px' }}
        >
          <motion.div
            style={
              shouldReduceMotion
                ? undefined
                : {
                    rotateX,
                    rotateY,
                    transformStyle: 'preserve-3d',
                  }
            }
            className="relative"
          >
            {/* Main macOS App Window Container */}
            <motion.div
              style={
                shouldReduceMotion
                  ? undefined
                  : {
                      y: parallaxDesktop,
                      rotateX: parallaxRotate,
                    }
              }
              className="rounded-2xl bg-white border border-black/5 shadow-[0_25px_50px_-12px_rgba(0,0,0,0.08)] p-5 sm:p-6 space-y-4 relative z-10 overflow-hidden"
            >
              {/* Top Countdown Bar indicating auto-simulation cycle */}
              {isAutoPlaying && (
                <div className="absolute top-0 left-0 right-0 h-1 bg-slate-100">
                  <motion.div
                    className="h-full bg-blue-600"
                    style={{ width: `${stageProgress}%` }}
                    transition={{ ease: 'linear' }}
                  />
                </div>
              )}

              {/* macOS Window Chrome Header */}
              <div className="flex items-center justify-between pb-3.5 border-b border-slate-100">
                {/* 3-Dot Controls */}
                <div className="flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-[#FF5F56] shadow-inner" />
                  <span className="w-2.5 h-2.5 rounded-full bg-[#FFBD2E] shadow-inner" />
                  <span className="w-2.5 h-2.5 rounded-full bg-[#27C93F] shadow-inner" />
                </div>

                {/* Studio Path Indicator */}
                <div className="hidden sm:flex px-3 py-1 rounded-md bg-slate-100/90 text-[11px] font-mono text-slate-600 items-center gap-1.5 shrink-0">
                  <span className="text-blue-600 font-semibold">atelier.studio</span>
                  <span className="text-slate-400">/</span>
                  <span>product-lab</span>
                </div>

                {/* Auto-Simulate Toggle & Interactive Badge */}
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setIsAutoPlaying(!isAutoPlaying)}
                    className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-slate-100 hover:bg-slate-200/90 text-slate-700 text-[10px] font-medium transition-all"
                    title={isAutoPlaying ? 'Pause simulator' : 'Run simulator automatically'}
                  >
                    {isAutoPlaying ? (
                      <>
                        <Pause className="w-2.5 h-2.5 text-blue-600 fill-blue-600" />
                        <span className="font-semibold text-blue-700">Simulating</span>
                      </>
                    ) : (
                      <>
                        <Play className="w-2.5 h-2.5 text-slate-700 fill-slate-700" />
                        <span>Auto-Play</span>
                      </>
                    )}
                  </button>

                  <div className="flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-blue-50 border border-blue-200/60 text-blue-700 text-[10px] font-semibold tracking-tight">
                    <span className="relative flex h-2 w-2">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75" />
                      <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-600" />
                    </span>
                    <span className="hidden min-[420px]:inline">Live Demo</span>
                  </div>
                </div>
              </div>

              {/* Dynamic Stage Canvas with AnimatePresence */}
              <div className="min-h-[268px] flex flex-col justify-between">
                <AnimatePresence mode="wait" initial={false}>
                  {/* STEP 1: DISCOVER (Building the Idea) */}
                  {activeStage === 'discover' && (
                    <motion.div
                      key="stage-discover"
                      initial={{ opacity: 0, scale: 0.98 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.98 }}
                      transition={{ duration: 0.25, ease: editorialEasing }}
                      className="space-y-3.5"
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <Compass className="w-4 h-4 text-amber-600" />
                          <h3 className="text-sm font-bold text-slate-900 tracking-tight">
                            User Journey &amp; Wireframe Map
                          </h3>
                        </div>
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-mono font-semibold bg-amber-50 text-amber-700 border border-amber-200/80 uppercase">
                          STAGE 1/4: DISCOVERY
                        </span>
                      </div>

                      {/* Low-Fidelity Wireframe Sketch Flow (Building Live) */}
                      <div className="p-3 rounded-xl bg-slate-50 border border-dashed border-slate-300">
                        <div className="text-[10px] font-mono text-slate-500 uppercase tracking-wider mb-2 flex items-center justify-between">
                          <span className="flex items-center gap-1.5">
                            <Layers className="w-3 h-3 text-slate-400" />
                            <span>Low-Fi Architecture Flow</span>
                          </span>
                          <span className="text-blue-600 font-semibold text-[10px]">
                            {discoverStep === 1 && '1/3 Mapping Friction...'}
                            {discoverStep === 2 && '2/3 Modeling Domain...'}
                            {discoverStep === 3 && '3/3 Validated Architecture ✓'}
                          </span>
                        </div>

                        <div className="grid grid-cols-3 gap-2 text-center">
                          <motion.div
                            animate={{
                              scale: discoverStep >= 1 ? 1 : 0.96,
                              borderColor: discoverStep === 1 ? '#2563EB' : '#E2E8F0',
                            }}
                            className={`p-2 rounded bg-white border transition-all ${
                              discoverStep === 1 ? 'ring-2 ring-blue-500/20 shadow-xs' : 'border-slate-200'
                            }`}
                          >
                            <span className="text-[10px] font-mono text-slate-400 block">Step 01</span>
                            <span className="text-[11px] font-semibold text-slate-800">Friction Audit</span>
                          </motion.div>

                          <motion.div
                            animate={{
                              scale: discoverStep >= 2 ? 1 : 0.96,
                              borderColor: discoverStep === 2 ? '#2563EB' : '#E2E8F0',
                            }}
                            className={`p-2 rounded bg-white border transition-all ${
                              discoverStep === 2 ? 'ring-2 ring-blue-500/20 shadow-xs' : 'border-slate-200'
                            }`}
                          >
                            <span className="text-[10px] font-mono text-slate-400 block">Step 02</span>
                            <span className="text-[11px] font-semibold text-slate-800">Domain Models</span>
                          </motion.div>

                          <motion.div
                            animate={{
                              scale: discoverStep === 3 ? 1.02 : 0.96,
                              borderColor: discoverStep === 3 ? '#2563EB' : '#E2E8F0',
                            }}
                            className={`p-2 rounded transition-all ${
                              discoverStep === 3 ? 'bg-blue-50/80 border-blue-400 ring-2 ring-blue-500/30 shadow-xs' : 'bg-white border-slate-200'
                            }`}
                          >
                            <span className="text-[10px] font-mono text-blue-500 block">Step 03</span>
                            <span className="text-[11px] font-semibold text-blue-900">Validated Flow</span>
                          </motion.div>
                        </div>
                      </div>

                      {/* Sticky-Note UI Elements */}
                      <div className="grid grid-cols-2 gap-2.5">
                        <motion.div
                          animate={{ y: discoverStep >= 1 ? 0 : 5, opacity: discoverStep >= 1 ? 1 : 0.4 }}
                          className="p-2.5 rounded-lg bg-amber-50/90 border border-amber-200/80 shadow-xs -rotate-1 transition-all hover:rotate-0"
                        >
                          <div className="text-[10px] font-bold text-amber-800 uppercase tracking-tight flex items-center gap-1 mb-1">
                            <span>📌 User Research</span>
                          </div>
                          <p className="text-[11px] text-amber-900 leading-snug">
                            &ldquo;84% of surveyed leads prefer visual workflow builders over raw forms.&rdquo;
                          </p>
                        </motion.div>

                        <motion.div
                          animate={{ y: discoverStep >= 2 ? 0 : 5, opacity: discoverStep >= 2 ? 1 : 0.4 }}
                          className="p-2.5 rounded-lg bg-blue-50/90 border border-blue-200/80 shadow-xs rotate-1 transition-all hover:rotate-0"
                        >
                          <div className="text-[10px] font-bold text-blue-800 uppercase tracking-tight flex items-center gap-1 mb-1">
                            <span>⚡ Core Requirement</span>
                          </div>
                          <p className="text-[11px] text-blue-900 leading-snug">
                            Sub-second catalog search with edge caching across multilingual sessions.
                          </p>
                        </motion.div>
                      </div>

                      {/* Rapid Bullet Points */}
                      <div className="flex items-center justify-between text-[11px] text-slate-600 pt-1">
                        <span className="flex items-center gap-1.5">
                          <CheckCircle2 className={`w-3.5 h-3.5 transition-colors ${discoverStep >= 2 ? 'text-emerald-600' : 'text-slate-300'}`} />
                          3 High-friction drop-offs mapped
                        </span>
                        <span className="flex items-center gap-1.5">
                          <CheckCircle2 className={`w-3.5 h-3.5 transition-colors ${discoverStep === 3 ? 'text-emerald-600' : 'text-slate-300'}`} />
                          Validated scope approved
                        </span>
                      </div>
                    </motion.div>
                  )}

                  {/* STEP 2: DESIGN (Building the Design System) */}
                  {activeStage === 'design' && (
                    <motion.div
                      key="stage-design"
                      initial={{ opacity: 0, scale: 0.98 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.98 }}
                      transition={{ duration: 0.25, ease: editorialEasing }}
                      className="space-y-3.5"
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <Palette className="w-4 h-4 text-blue-600" />
                          <h3 className="text-sm font-bold text-slate-900 tracking-tight">
                            Design Tokens &amp; Component System
                          </h3>
                        </div>
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-mono font-semibold bg-blue-50 text-blue-700 border border-blue-200/80 uppercase">
                          STAGE 2/4: DESIGN SYSTEM
                        </span>
                      </div>

                      {/* Color Tokens Palette Badges */}
                      <div className="space-y-1.5">
                        <div className="flex items-center justify-between text-[11px]">
                          <span className="font-semibold text-slate-700">Color Tokens</span>
                          <span className="text-[10px] font-mono text-slate-400">
                            {copiedColor ? 'Copied to clipboard!' : `Active Token: ${colorTokens[activeColorIdx].name}`}
                          </span>
                        </div>

                        <div className="grid grid-cols-4 gap-2">
                          {colorTokens.map((token, idx) => (
                            <button
                              key={token.name}
                              type="button"
                              onClick={() => {
                                setActiveColorIdx(idx);
                                handleCopyHex(token.hex);
                              }}
                              className={`p-2 rounded-lg text-left transition-all border ${
                                activeColorIdx === idx
                                  ? 'bg-slate-50 border-blue-500 shadow-xs ring-2 ring-blue-500/20 scale-[1.02]'
                                  : 'bg-white border-slate-200 hover:border-slate-300'
                              }`}
                            >
                              <div className="flex items-center gap-1.5 mb-1">
                                <span className={`w-3 h-3 rounded-full ${token.bg} border border-black/10 shrink-0`} />
                                <span className="text-[11px] font-semibold text-slate-900 truncate">
                                  {token.name}
                                </span>
                              </div>
                              <span className="text-[10px] font-mono text-slate-500 block truncate">
                                {token.hex}
                              </span>
                            </button>
                          ))}
                        </div>
                      </div>

                      {/* Typography Scale & Interactive Component Preview */}
                      <div className="grid grid-cols-2 gap-2.5 pt-1">
                        {/* Typography Specimen */}
                        <div className="p-2.5 rounded-lg bg-slate-50 border border-slate-200 space-y-1">
                          <span className="text-[10px] font-mono text-slate-400 uppercase tracking-wider block">
                            Typography Scale
                          </span>
                          <p className="text-sm font-serif font-bold text-slate-900 truncate">
                            Editorial Headline
                          </p>
                          <p className="text-[11px] font-sans text-slate-600 truncate">
                            Plus Jakarta Sans 14px
                          </p>
                        </div>

                        {/* Interactive Reusable Component Preview (Synced to active token) */}
                        <div className="p-2.5 rounded-lg bg-slate-50 border border-slate-200 flex flex-col justify-between">
                          <span className="text-[10px] font-mono text-slate-400 uppercase tracking-wider block">
                            Live Component Token
                          </span>
                          <div className="flex items-center justify-between pt-1">
                            <button
                              type="button"
                              onClick={() => setInteractiveToggle(!interactiveToggle)}
                              className="px-2.5 py-1 rounded-md text-[11px] font-medium text-white transition-all shadow-xs active:scale-95"
                              style={{
                                backgroundColor: interactiveToggle ? colorTokens[activeColorIdx].hex : '#64748B',
                              }}
                            >
                              {interactiveToggle ? `${colorTokens[activeColorIdx].name} State` : 'Inactive'}
                            </button>
                            <span className="text-[10px] font-mono text-slate-500">
                              hover/click
                            </span>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  )}

                  {/* STEP 3: BUILD (Live Typewriter Code & Real-Time Render) */}
                  {activeStage === 'build' && (
                    <motion.div
                      key="stage-build"
                      initial={{ opacity: 0, scale: 0.98 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.98 }}
                      transition={{ duration: 0.25, ease: editorialEasing }}
                      className="space-y-3"
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <Code2 className="w-4 h-4 text-indigo-600" />
                          <h3 className="text-sm font-bold text-slate-900 tracking-tight">
                            Split View: Editor &amp; Live Component
                          </h3>
                        </div>
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-mono font-semibold bg-indigo-50 text-indigo-700 border border-indigo-200/80 uppercase">
                          STAGE 3/4: DEVELOPMENT
                        </span>
                      </div>

                      {/* Split View Container */}
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                        {/* Left Side: Live Typewriter Code Editor */}
                        <div className="p-2.5 rounded-lg bg-[#0F172A] text-slate-200 font-mono text-[10px] leading-relaxed shadow-inner overflow-hidden border border-slate-800">
                          <div className="flex items-center justify-between text-slate-400 pb-1.5 mb-1.5 border-b border-slate-800 text-[9px]">
                            <span className="flex items-center gap-1 text-slate-300">
                              <Terminal className="w-3 h-3 text-blue-400" />
                              ProductCard.tsx
                            </span>
                            <span className="text-emerald-400 flex items-center gap-1">
                              {isCompiling ? (
                                <>
                                  <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-pulse" />
                                  Typing...
                                </>
                              ) : (
                                <>
                                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                                  Compiled
                                </>
                              )}
                            </span>
                          </div>

                          <div className="space-y-0.5 h-[120px] overflow-hidden">
                            {codeLines.map((line, idx) => {
                              const isVisible = idx <= typedLineCount;
                              if (!isVisible) return null;
                              return (
                                <motion.div
                                  key={line.num}
                                  initial={{ opacity: 0, x: -4 }}
                                  animate={{ opacity: 1, x: 0 }}
                                  className="flex items-baseline gap-2"
                                >
                                  <span className="text-slate-600 select-none text-[9px] w-4">{line.num}</span>
                                  <span className="text-slate-300 font-mono text-[10px]">{line.code}</span>
                                </motion.div>
                              );
                            })}
                            {typedLineCount < codeLines.length && (
                              <span className="inline-block w-1.5 h-3 bg-blue-400 animate-pulse ml-6" />
                            )}
                          </div>
                        </div>

                        {/* Right Side: Visual Live-Rendered Component */}
                        <div className="p-3 rounded-lg bg-slate-50 border border-slate-200 flex flex-col justify-between">
                          <div>
                            <div className="flex items-center justify-between text-[10px] font-mono text-slate-400 mb-2">
                              <span className="flex items-center gap-1 text-emerald-600 font-semibold">
                                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                                Live Component
                              </span>
                              <span className="text-blue-600 font-medium">Hot Reload Active</span>
                            </div>

                            <div className="p-3 rounded-md bg-white border border-slate-200 shadow-2xs space-y-2">
                              <div className="flex items-center justify-between">
                                <span className="text-xs font-semibold text-slate-800">Direct Inquiries</span>
                                <span className="text-xs font-mono font-bold text-blue-600">{liveButtonCount}</span>
                              </div>

                              <button
                                type="button"
                                onClick={() => setLiveButtonCount((c) => c + 1)}
                                className={`w-full py-1.5 px-3 rounded-md text-xs font-medium transition-all shadow-xs active:scale-[0.98] ${
                                  liveVariant === 'primary'
                                    ? 'bg-blue-600 hover:bg-blue-700 text-white'
                                    : 'bg-slate-900 hover:bg-black text-white'
                                }`}
                              >
                                Increment Value +1
                              </button>
                            </div>
                          </div>

                          <div className="flex items-center justify-between pt-2 border-t border-slate-200/60 text-[10px]">
                            <span className="text-slate-500 font-sans">Variant:</span>
                            <div className="flex gap-1">
                              <button
                                type="button"
                                onClick={() => setLiveVariant('primary')}
                                className={`px-1.5 py-0.5 rounded text-[10px] ${
                                  liveVariant === 'primary' ? 'bg-blue-600 text-white font-bold' : 'bg-slate-200 text-slate-600'
                                }`}
                              >
                                Cobalt
                              </button>
                              <button
                                type="button"
                                onClick={() => setLiveVariant('secondary')}
                                className={`px-1.5 py-0.5 rounded text-[10px] ${
                                  liveVariant === 'secondary' ? 'bg-slate-900 text-white font-bold' : 'bg-slate-200 text-slate-600'
                                }`}
                              >
                                Dark
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  )}

                  {/* STEP 4: LAUNCH (Live SaaS Dashboard Widget) */}
                  {activeStage === 'launch' && (
                    <motion.div
                      key="stage-launch"
                      initial={{ opacity: 0, scale: 0.98 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.98 }}
                      transition={{ duration: 0.25, ease: editorialEasing }}
                      className="space-y-3.5"
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <Rocket className="w-4 h-4 text-emerald-600" />
                          <h3 className="text-sm font-bold text-slate-900 tracking-tight">
                            Live SaaS Dashboard Widget
                          </h3>
                        </div>
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-mono font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200/80 uppercase">
                          STAGE 4/4: DEPLOYED &amp; LIVE
                        </span>
                      </div>

                      {/* Animated "Build Successful (100%)" completion bar */}
                      <div className="p-3 rounded-xl bg-emerald-50/80 border border-emerald-200/90 space-y-1.5">
                        <div className="flex items-center justify-between text-xs">
                          <span className="font-semibold text-emerald-900 flex items-center gap-1.5">
                            <Check className="w-3.5 h-3.5 text-emerald-600 stroke-[3]" />
                            Build Successful
                          </span>
                          <span className="font-mono font-bold text-emerald-700 text-xs">
                            {launchProgress}% Verified
                          </span>
                        </div>
                        <div className="w-full h-2 rounded-full bg-emerald-200/70 overflow-hidden">
                          <motion.div
                            style={{ width: `${launchProgress}%` }}
                            className="h-full rounded-full bg-emerald-600"
                            transition={{ duration: 0.1 }}
                          />
                        </div>
                        <span className="text-[10px] text-emerald-800 block">
                          {launchProgress < 100
                            ? 'Distributing edge bundles to global CDN nodes...'
                            : '54/54 static & dynamic routes distributed to global edge network.'}
                        </span>
                      </div>

                      {/* Interactive Toggle Charts */}
                      <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 space-y-2.5">
                        {/* Radio Metric Tabs */}
                        <div className="flex items-center justify-between">
                          <div className="flex gap-1">
                            {(['inquiries', 'latency', 'uptime'] as const).map((tab) => (
                              <button
                                key={tab}
                                type="button"
                                onClick={() => setActiveMetricTab(tab)}
                                className={`px-2 py-0.5 rounded text-[10px] font-mono capitalize transition-all ${
                                  activeMetricTab === tab
                                    ? 'bg-slate-900 text-white font-bold'
                                    : 'bg-white text-slate-600 hover:bg-slate-200 border border-slate-200'
                                }`}
                              >
                                {tab}
                              </button>
                            ))}
                          </div>
                          <span className="text-[11px] font-bold text-slate-900 font-mono">
                            {chartData[activeMetricTab].stat}
                          </span>
                        </div>

                        {/* Interactive Sparkline Bar Chart */}
                        <div className="flex items-end gap-1.5 h-12 pt-2 px-1">
                          {chartData[activeMetricTab].bars.map((bar, bIdx) => (
                            <div key={bIdx} className="flex-1 flex flex-col justify-end items-center h-full">
                              <motion.div
                                initial={{ height: 0 }}
                                animate={{ height: `${bar}%` }}
                                transition={{ duration: 0.35, delay: bIdx * 0.03 }}
                                className={`w-full rounded-t-sm ${
                                  bIdx === chartData[activeMetricTab].bars.length - 1
                                    ? 'bg-blue-600'
                                    : 'bg-slate-300'
                                }`}
                              />
                            </div>
                          ))}
                        </div>

                        <div className="flex items-center justify-between text-[10px] text-slate-500 pt-1 border-t border-slate-200/80">
                          <span>{chartData[activeMetricTab].label}</span>
                          <span className="font-mono">{chartData[activeMetricTab].subtext}</span>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* Bottom 4 Step-Tabs: Discover, Design, Build, Launch (Radio Triggers with Framer Motion Spring Indicator) */}
              <div className="pt-2 border-t border-slate-100 space-y-2">
                <div className="flex items-center justify-between text-[11px]">
                  <span className="font-medium text-slate-500 font-sans flex items-center gap-1">
                    <Sparkles className="w-3 h-3 text-blue-600" />
                    <span>Idea-to-Product Simulator</span>
                  </span>
                  <span className="font-mono text-[10px] text-blue-600 font-semibold uppercase">
                    Stage {currentStageIndex}/4: {activeStage}
                  </span>
                </div>

                {/* 4 Bottom Step Pill Tabs */}
                <div className="grid grid-cols-4 gap-1.5 bg-slate-100/90 p-1 rounded-xl">
                  {(
                    [
                      { id: 'discover', label: 'Discover', step: '01' },
                      { id: 'design', label: 'Design', step: '02' },
                      { id: 'build', label: 'Build', step: '03' },
                      { id: 'launch', label: 'Launch', step: '04' },
                    ] as const
                  ).map((tab) => {
                    const isActive = activeStage === tab.id;
                    return (
                      <button
                        key={tab.id}
                        type="button"
                        onClick={() => handleSelectStage(tab.id)}
                        className={`relative py-1.5 px-2 rounded-lg text-center text-xs transition-colors z-10 ${
                          isActive ? 'text-white font-semibold' : 'text-slate-600 hover:text-slate-900'
                        }`}
                      >
                        {isActive && (
                          <motion.div
                            layoutId="activeSimulatorTab"
                            className="absolute inset-0 rounded-lg bg-blue-600 shadow-sm"
                            transition={{ type: 'spring', stiffness: 400, damping: 30 }}
                          />
                        )}
                        <span className="relative z-10 flex items-center justify-center gap-1">
                          <span className="text-[10px] opacity-75 font-mono hidden sm:inline">{tab.step}.</span>
                          <span>{tab.label}</span>
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};
