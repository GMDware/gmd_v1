'use client';

import React, { useState, useRef, useEffect } from 'react';
import Image from 'next/image';
import {
  ChevronLeft,
  ChevronRight,
  Crown,
  Briefcase,
  User,
  Mail,
  ExternalLink,
  Play,
  Pause,
} from 'lucide-react';
import { SocialIcon } from '@/components/public/SocialIcons';
import { cn } from '@/lib/utils';

export interface UnifiedMember {
  id: string;
  name: string;
  displayName: string;
  isFounder: boolean;
  roleTitle: string;
  founderTitle?: string | null;
  departmentName: string;
  avatarUrl?: string | null;
  shortBio: string;
  skills: string[];
  socials?: Array<{ platform: string; url: string }>;
}

interface UnifiedTeamRailProps {
  members: UnifiedMember[];
  brandName?: string;
}

export const UnifiedTeamRail: React.FC<UnifiedTeamRailProps> = ({
  members,
  brandName = 'GMDware',
}) => {
  const railRef = useRef<HTMLDivElement>(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);
  const [isHovered, setIsHovered] = useState(false);
  const [hasOverflow, setHasOverflow] = useState(false);

  useEffect(() => {
    const el = railRef.current;
    if (!el) return;

    const checkOverflow = () => {
      setHasOverflow(el.scrollWidth > el.clientWidth + 8);
    };

    checkOverflow();

    const ro = new ResizeObserver(checkOverflow);
    ro.observe(el);
    return () => ro.disconnect();
  }, [members]);

  // Auto-scroll when members overflow
  useEffect(() => {
    if (!isAutoPlaying || isHovered) return;
    if (!hasOverflow) return;

    const interval = setInterval(() => {
      const rail = railRef.current;
      if (!rail) return;

      const maxScroll = rail.scrollWidth - rail.clientWidth;
      if (maxScroll <= 0) return;

      if (rail.scrollLeft >= maxScroll - 15) {
        rail.scrollTo({ left: 0, behavior: 'smooth' });
      } else {
        const card = rail.querySelector('[data-team-card]') as HTMLElement | null;
        const step = card ? card.offsetWidth + 20 : 300;
        rail.scrollBy({ left: step, behavior: 'smooth' });
      }
    }, 4000);

    return () => clearInterval(interval);
  }, [isAutoPlaying, isHovered, members.length]);

  const scrollPrev = () => {
    const rail = railRef.current;
    if (!rail) return;
    const card = rail.querySelector('[data-team-card]') as HTMLElement | null;
    const step = card ? card.offsetWidth + 20 : 300;
    if (rail.scrollLeft <= 15) {
      rail.scrollTo({ left: rail.scrollWidth - rail.clientWidth, behavior: 'smooth' });
    } else {
      rail.scrollBy({ left: -step, behavior: 'smooth' });
    }
  };

  const scrollNext = () => {
    const rail = railRef.current;
    if (!rail) return;
    const maxScroll = rail.scrollWidth - rail.clientWidth;
    const card = rail.querySelector('[data-team-card]') as HTMLElement | null;
    const step = card ? card.offsetWidth + 20 : 300;
    if (rail.scrollLeft >= maxScroll - 15) {
      rail.scrollTo({ left: 0, behavior: 'smooth' });
    } else {
      rail.scrollBy({ left: step, behavior: 'smooth' });
    }
  };

  const handleScroll = () => {
    const rail = railRef.current;
    if (!rail) return;
    const card = rail.querySelector('[data-team-card]') as HTMLElement | null;
    const step = card ? card.offsetWidth + 20 : 300;
    if (step > 0) {
      const idx = Math.round(rail.scrollLeft / step);
      setActiveIndex(Math.min(Math.max(0, idx), members.length - 1));
    }
  };

  const scrollToCard = (index: number) => {
    const rail = railRef.current;
    if (!rail) return;
    const card = rail.querySelector('[data-team-card]') as HTMLElement | null;
    const step = card ? card.offsetWidth + 20 : 300;
    rail.scrollTo({ left: index * step, behavior: 'smooth' });
  };

  if (members.length === 0) {
    return null;
  }

  return (
    <div className="space-y-6">
      {/* Header & Controls */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2.5 flex-wrap">
            <span className="text-xs uppercase tracking-wider text-[#00D2FF] font-semibold block">
              Leadership &amp; Team
            </span>
            {members.length > 4 && (
              <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-[#0066FF]/10 border border-[#0066FF]/30 text-[#00D2FF] text-[11px] font-mono">
                <span
                  className={`w-1.5 h-1.5 rounded-full ${
                    isAutoPlaying && !isHovered ? 'bg-[#00D2FF] animate-pulse' : 'bg-slate-400'
                  }`}
                />
                <span>{isAutoPlaying && !isHovered ? 'Auto-Scrolling' : isHovered ? 'Paused on Hover' : 'Paused'}</span>
              </span>
            )}
          </div>
          <h3 className="text-2xl sm:text-3xl font-extrabold text-white font-display tracking-tight">
            The Team Behind {brandName}
          </h3>
          <p className="text-sm text-[#94A3B8] max-w-xl leading-relaxed pt-1">
            Founders, software architects, and engineers dedicated to engineering reliable, scalable, and beautifully crafted software.
          </p>
        </div>

        {/* Scroll Controls (Shown only when overflowing) */}
        {hasOverflow && (
          <div className="flex items-center gap-2 self-start sm:self-end">
            <button
              type="button"
              onClick={() => setIsAutoPlaying((prev) => !prev)}
              aria-label={isAutoPlaying ? 'Pause auto-scroll' : 'Resume auto-scroll'}
              title={isAutoPlaying ? 'Pause auto-scroll' : 'Resume auto-scroll'}
              className="w-10 h-10 rounded-xl bg-[#0A0E1A] border border-white/10 hover:border-white/30 text-white flex items-center justify-center transition-all hover:bg-white/5 active:scale-95 shadow-sm"
            >
              {isAutoPlaying ? <Pause className="w-4 h-4 text-[#00D2FF]" /> : <Play className="w-4 h-4 text-slate-300" />}
            </button>
            <button
              type="button"
              onClick={scrollPrev}
              aria-label="Previous team member"
              className="w-10 h-10 rounded-xl bg-[#0A0E1A] border border-white/10 hover:border-white/30 text-white flex items-center justify-center transition-all hover:bg-white/5 active:scale-95 shadow-sm"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button
              type="button"
              onClick={scrollNext}
              aria-label="Next team member"
              className="w-10 h-10 rounded-xl bg-[#0A0E1A] border border-white/10 hover:border-white/30 text-white flex items-center justify-center transition-all hover:bg-white/5 active:scale-95 shadow-sm"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        )}
      </div>

      {/* 4 Cards Side-by-Side Track with Smooth Horizontal Scroll */}
      <div
        ref={railRef}
        onScroll={handleScroll}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        className={cn(
          'flex items-stretch gap-5 pb-4 pt-1 overflow-x-auto flex-nowrap snap-x snap-mandatory scroll-smooth [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden',
          hasOverflow ? 'justify-start' : 'justify-center'
        )}
      >
        {members.map((member, idx) => (
          <div
            key={member.id || idx}
            data-team-card="true"
            className={`shrink-0 w-[280px] sm:w-[300px] snap-start rounded-3xl bg-[#080D18] border p-5 flex flex-col justify-between space-y-4 relative overflow-hidden group transition-all duration-300 ${
              member.isFounder
                ? 'border-[#0066FF]/40 shadow-lg shadow-[#0066FF]/5 hover:border-[#00F2FE]/70 hover:shadow-[0_0_25px_rgba(0,242,254,0.15)]'
                : 'border-white/10 hover:border-[#0066FF]/60 hover:shadow-[0_0_20px_rgba(0,102,255,0.12)]'
            }`}
          >
            {/* Top Accent Line */}
            <div
              className={`absolute top-0 left-0 right-0 h-1 transition-transform origin-left duration-300 ${
                member.isFounder
                  ? 'bg-gradient-to-r from-[#0066FF] via-[#00D2FF] to-blue-400 scale-x-100'
                  : 'bg-gradient-to-r from-white/20 to-[#00D2FF] scale-x-0 group-hover:scale-x-100'
              }`}
            />

            <div className="space-y-3.5">
              {/* Photo Box */}
              <div className="relative w-full h-52 rounded-2xl overflow-hidden bg-[#0A0F1D] border border-white/10 shrink-0">
                {member.avatarUrl ? (
                  <Image
                    src={member.avatarUrl}
                    alt={member.name}
                    fill
                    sizes="(max-width: 640px) 85vw, (max-width: 1024px) 50vw, 25vw"
                    className="object-cover object-top group-hover:scale-105 transition-transform duration-500 grayscale contrast-125 group-hover:grayscale-0"
                  />
                ) : (
                  <div className="w-full h-full flex flex-col items-center justify-center bg-gradient-to-br from-[#0A0E1A] to-[#05080F] text-white relative">
                    <User className="w-12 h-12 text-[#0066FF]/60 mb-2" />
                    <span className="text-lg font-bold font-display text-white/90">
                      {member.name.charAt(0)}
                    </span>
                    <span className="text-[10px] font-mono uppercase text-[#00D2FF] pt-1">
                      {member.roleTitle}
                    </span>
                  </div>
                )}

                {/* Founder / Team Role Badge */}
                {member.isFounder ? (
                  <div className="absolute top-2.5 left-2.5 px-2.5 py-1 rounded-full bg-black/80 backdrop-blur-md border border-amber-500/40 shadow-sm flex items-center gap-1.5 text-[11px] font-semibold text-amber-300 z-10">
                    <Crown className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                    <span>{member.founderTitle || 'Founder'}</span>
                  </div>
                ) : (
                  <div className="absolute top-2.5 left-2.5 px-2 py-0.5 rounded-full bg-black/80 backdrop-blur-md border border-white/15 shadow-sm flex items-center gap-1 text-[10px] font-medium text-slate-300 z-10">
                    <Briefcase className="w-3 h-3 text-[#00D2FF] shrink-0" />
                    <span>{member.departmentName || 'Engineering'}</span>
                  </div>
                )}
              </div>

              {/* Identity & Department */}
              <div className="space-y-1">
                <div className="flex items-center justify-between text-xs gap-1">
                  <span className="font-semibold text-[#00D2FF] truncate text-xs">
                    {member.founderTitle || member.roleTitle}
                  </span>
                  <span className="px-1.5 py-0.5 rounded bg-white/5 border border-white/10 text-[10px] font-mono text-slate-400 shrink-0">
                    {member.departmentName}
                  </span>
                </div>

                <h4 className="text-base sm:text-lg font-bold text-white group-hover:text-[#00D2FF] transition-colors tracking-tight font-display truncate">
                  {member.displayName || member.name}
                </h4>

                <p className="text-xs text-[#94A3B8] leading-relaxed line-clamp-3 font-sans min-h-[2.8rem]">
                  {member.shortBio || 'Dedicated specialist contributing to modern software architecture and digital craftsmanship.'}
                </p>
              </div>

              {/* Skills Pills */}
              {member.skills && member.skills.length > 0 && (
                <div className="space-y-1 pt-1">
                  <span className="text-[10px] font-mono text-[#64748B] uppercase tracking-wider block font-medium">
                    Skills:
                  </span>
                  <div className="flex flex-wrap gap-1">
                    {member.skills.slice(0, 3).map((skill, sIdx) => (
                      <span
                        key={sIdx}
                        className="px-2 py-0.5 rounded-md bg-[#0D1527] border border-white/[0.08] text-[10px] font-mono text-slate-300"
                      >
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Social Links */}
            {member.socials && member.socials.length > 0 && (
              <div className="pt-3 border-t border-white/[0.06] flex items-center gap-2">
                {member.socials.map((soc, sIdx) => (
                  <a
                    key={sIdx}
                    href={soc.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-1.5 rounded-lg bg-white/5 border border-white/10 text-slate-400 hover:text-white hover:border-white/30 transition-colors text-xs"
                    title={soc.platform}
                    aria-label={`${member.name} on ${soc.platform}`}
                  >
                    <SocialIcon platform={soc.platform} className="w-3.5 h-3.5" />
                  </a>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Pagination Dots (When members > 4) */}
      {members.length > 4 && (
        <div className="flex items-center justify-center gap-1.5 pt-2">
          {members.map((_, dotIdx) => (
            <button
              key={dotIdx}
              type="button"
              onClick={() => scrollToCard(dotIdx)}
              aria-label={`Go to slide ${dotIdx + 1}`}
              className={`h-1.5 rounded-full transition-all duration-300 ${
                activeIndex === dotIdx
                  ? 'w-6 bg-[#00D2FF]'
                  : 'w-1.5 bg-white/20 hover:bg-white/40'
              }`}
            />
          ))}
        </div>
      )}
    </div>
  );
};
