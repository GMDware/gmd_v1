'use client';

import React, { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { ArrowUpRight, Sparkles, Radio, Zap, Globe2, Activity } from 'lucide-react';

interface NexusHeroProps {
  headline?: string;
  subtitle?: string;
  badge?: string;
  primaryCtaLabel?: string;
  primaryCtaUrl?: string;
  secondaryCtaLabel?: string;
  secondaryCtaUrl?: string;
}

export const NexusHero: React.FC<NexusHeroProps> = ({
  headline,
  subtitle,
  badge,
  primaryCtaLabel = 'Explore Constellation',
  primaryCtaUrl = '/work',
  secondaryCtaLabel = 'Initiate Connection',
  secondaryCtaUrl = '/contact',
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [activePulse, setActivePulse] = useState(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let width = (canvas.width = canvas.parentElement?.clientWidth || window.innerWidth);
    let height = (canvas.height = canvas.parentElement?.clientHeight || window.innerHeight);

    // Responsive resize handler
    const handleResize = () => {
      if (!canvas || !canvas.parentElement) return;
      width = canvas.width = canvas.parentElement.clientWidth;
      height = canvas.height = canvas.parentElement.clientHeight;
    };
    window.addEventListener('resize', handleResize);

    // Node graph simulation
    interface Node {
      x: number;
      y: number;
      vx: number;
      vy: number;
      radius: number;
      color: string;
      connections: number[];
    }

    const nodeCount = width < 768 ? 24 : 48;
    const nodes: Node[] = [];
    const colors = ['#00F2FE', '#7F00FF', '#38BDF8', '#818CF8'];

    for (let i = 0; i < nodeCount; i++) {
      nodes.push({
        x: Math.random() * width,
        y: Math.random() * height,
        vx: (Math.random() - 0.5) * 0.4,
        vy: (Math.random() - 0.5) * 0.4,
        radius: Math.random() * 2 + 1.5,
        color: colors[i % colors.length],
        connections: [],
      });
    }

    let mouseX = width / 2;
    let mouseY = height / 2;
    let mouseActive = false;

    const handleMouseMove = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      mouseX = e.clientX - rect.left;
      mouseY = e.clientY - rect.top;
      mouseActive = true;
    };

    const handleMouseLeave = () => {
      mouseActive = false;
    };

    window.addEventListener('mousemove', handleMouseMove);
    canvas.addEventListener('mouseleave', handleMouseLeave);

    const render = () => {
      ctx.clearRect(0, 0, width, height);

      // Radial background nebula
      const grad = ctx.createRadialGradient(
        width / 2,
        height / 2,
        50,
        width / 2,
        height / 2,
        width * 0.6
      );
      grad.addColorStop(0, 'rgba(0, 242, 254, 0.06)');
      grad.addColorStop(0.5, 'rgba(127, 0, 255, 0.04)');
      grad.addColorStop(1, 'rgba(3, 5, 9, 0)');
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, width, height);

      // Update and draw nodes
      for (let i = 0; i < nodes.length; i++) {
        const node = nodes[i];
        node.x += node.vx;
        node.y += node.vy;

        // Bounce boundaries
        if (node.x < 0 || node.x > width) node.vx *= -1;
        if (node.y < 0 || node.y > height) node.vy *= -1;

        // Attract lightly to mouse pointer
        if (mouseActive) {
          const dx = mouseX - node.x;
          const dy = mouseY - node.y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < 200) {
            node.x += (dx / dist) * 0.3;
            node.y += (dy / dist) * 0.3;
          }
        }

        // Draw connections
        for (let j = i + 1; j < nodes.length; j++) {
          const other = nodes[j];
          const dx = other.x - node.x;
          const dy = other.y - node.y;
          const dist = Math.sqrt(dx * dx + dy * dy);

          if (dist < 130) {
            ctx.beginPath();
            ctx.moveTo(node.x, node.y);
            ctx.lineTo(other.x, other.y);
            const alpha = (1 - dist / 130) * 0.25;
            ctx.strokeStyle = `rgba(0, 242, 254, ${alpha})`;
            ctx.lineWidth = 0.75;
            ctx.stroke();
          }
        }

        // Draw node core & halo
        ctx.beginPath();
        ctx.arc(node.x, node.y, node.radius, 0, Math.PI * 2);
        ctx.fillStyle = node.color;
        ctx.shadowColor = node.color;
        ctx.shadowBlur = 8;
        ctx.fill();
        ctx.shadowBlur = 0;
      }

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('mousemove', handleMouseMove);
      canvas.removeEventListener('mouseleave', handleMouseLeave);
    };
  }, []);

  return (
    <section className="relative min-h-[92vh] flex flex-col justify-center items-center pt-28 pb-20 px-4 sm:px-8 overflow-hidden bg-[#030509]">
      {/* Interactive Constellation Canvas */}
      <canvas
        ref={canvasRef}
        className="absolute inset-0 w-full h-full pointer-events-auto"
        aria-hidden="true"
      />

      {/* Orbital Depth Rings */}
      <div className="absolute w-[600px] sm:w-[900px] h-[600px] sm:h-[900px] rounded-full border border-cyan-500/10 pointer-events-none animate-[spin_120s_linear_infinite]" />
      <div className="absolute w-[400px] sm:w-[650px] h-[400px] sm:h-[650px] rounded-full border border-purple-500/10 pointer-events-none animate-[spin_90s_linear_infinite_reverse]" />

      {/* Content Pillar */}
      <div className="relative z-10 max-w-4xl mx-auto text-center space-y-8 pointer-events-none">
        {/* Orbital Beacon Badge */}
        <div className="inline-flex items-center gap-2.5 px-4 py-1.5 rounded-full bg-[#080D1A]/80 border border-cyan-500/30 backdrop-blur-xl shadow-[0_0_20px_rgba(0,242,254,0.15)] pointer-events-auto">
          <span className="w-2 h-2 rounded-full bg-[#00F2FE] animate-pulse" />
          <span className="font-mono text-xs text-cyan-300 tracking-wider uppercase font-medium">
            {badge || '// LIVING DIGITAL ECOSYSTEM // MULTI-NODE FABRIC'}
          </span>
        </div>

        {/* Display Headline */}
        <h1 className="text-4xl sm:text-6xl md:text-7xl lg:text-8xl font-black tracking-tight text-white font-sans leading-[1.05] pointer-events-auto">
          {headline || (
            <>
              BUILD THE <br />
              <span className="bg-gradient-to-r from-[#00F2FE] via-[#38BDF8] to-[#7F00FF] bg-clip-text text-transparent">
                INTERCONNECTED
              </span>{' '}
              FUTURE.
            </>
          )}
        </h1>

        {/* Subtitle */}
        <p className="text-base sm:text-xl text-slate-300 max-w-2xl mx-auto leading-relaxed font-sans pointer-events-auto">
          {subtitle ||
            'GMDware engineers fluid digital architectures, interconnected enterprise platforms, and living software networks that adapt at the speed of scale.'}
        </p>

        {/* Dynamic Orbital CTAs */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4 pointer-events-auto">
          <Link
            href={secondaryCtaUrl}
            className="w-full sm:w-auto px-8 py-3.5 rounded-full bg-gradient-to-r from-[#00F2FE] to-[#38BDF8] text-black font-bold text-sm shadow-[0_0_30px_rgba(0,242,254,0.35)] hover:shadow-[0_0_40px_rgba(0,242,254,0.5)] transition-all flex items-center justify-center gap-2 group"
          >
            <Radio className="w-4 h-4 text-black" />
            <span>{secondaryCtaLabel}</span>
            <ArrowUpRight className="w-4 h-4 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
          </Link>

          <Link
            href={primaryCtaUrl}
            className="w-full sm:w-auto px-8 py-3.5 rounded-full bg-[#080D1A]/80 hover:bg-[#0E172E] border border-cyan-500/25 hover:border-cyan-400 text-white font-medium text-sm backdrop-blur-xl transition-all flex items-center justify-center gap-2"
          >
            <Sparkles className="w-4 h-4 text-[#00F2FE]" />
            <span>{primaryCtaLabel}</span>
          </Link>
        </div>

        {/* Live Network Cluster Metrics */}
        <div className="pt-10 grid grid-cols-2 sm:grid-cols-3 gap-3 max-w-2xl mx-auto pointer-events-auto">
          <div className="p-3.5 rounded-2xl bg-[#080D1A]/60 border border-cyan-500/15 backdrop-blur-md text-center">
            <div className="font-mono text-xl font-bold text-[#00F2FE]">FLUID</div>
            <div className="text-[10px] font-mono text-slate-400 uppercase tracking-widest mt-0.5">
              Node Continuum
            </div>
          </div>

          <div className="p-3.5 rounded-2xl bg-[#080D1A]/60 border border-purple-500/15 backdrop-blur-md text-center">
            <div className="font-mono text-xl font-bold text-purple-400">ZERO</div>
            <div className="text-[10px] font-mono text-slate-400 uppercase tracking-widest mt-0.5">
              Data Partition Drop
            </div>
          </div>

          <div className="col-span-2 sm:col-span-1 p-3.5 rounded-2xl bg-[#080D1A]/60 border border-cyan-500/15 backdrop-blur-md text-center">
            <div className="font-mono text-xl font-bold text-white">REALTIME</div>
            <div className="text-[10px] font-mono text-slate-400 uppercase tracking-widest mt-0.5">
              Event Stream Fabrics
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
