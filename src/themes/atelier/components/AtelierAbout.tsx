'use client';

import React, { useState, useEffect, useRef, useCallback } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import {
  ArrowRight,
  Target,
  Sparkles,
  Users,
  Mail,
  ExternalLink,
  Crown,
  Briefcase,
  ChevronLeft,
  ChevronRight,
  Play,
  Pause,
} from 'lucide-react';
import { motion, useReducedMotion } from 'framer-motion';
import { editorialEasing } from '../motion';

interface TeamMemberItem {
  id: string;
  name: string;
  displayName: string;
  isFounder: boolean;
  roleTitle: string;
  founderTitle?: string | null;
  departmentName: string;
  avatarUrl?: string | null;
  bio: string;
  skills: string[];
  email?: string | null;
  socials: { platform: string; url: string }[];
  displayOrder: number;
}

interface AtelierAboutProps {
  teamMembers?: any[];
  settings?: Record<string, string>;
  isStandalone?: boolean;
}

/**
 * Robust Member Card with exact same dimensions for both Founder and Team members
 * Sized to fit exactly 4 cards side-by-side on desktop (lg)
 */
const MemberCard: React.FC<{
  member: TeamMemberItem;
  index: number;
  shouldReduceMotion: boolean | null;
}> = ({ member, index, shouldReduceMotion }) => {
  const [imgError, setImgError] = useState(false);

  return (
    <motion.div
      data-member-card="true"
      initial={shouldReduceMotion ? false : { opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.15 }}
      transition={{ duration: 0.5, delay: index * 0.06, ease: editorialEasing }}
      whileHover={shouldReduceMotion ? undefined : { y: -6 }}
      className={`shrink-0 w-[85vw] max-w-[320px] sm:w-[calc((100%-1.25rem)/2)] lg:w-[calc((100%-3.75rem)/4)] snap-start rounded-3xl bg-white border p-5 flex flex-col justify-between space-y-4 relative overflow-hidden group transition-all duration-300 ${
        member.isFounder
          ? 'border-blue-200/90 shadow-md shadow-blue-500/5 hover:border-blue-400 hover:shadow-xl'
          : 'border-slate-200/90 shadow-sm hover:border-slate-300 hover:shadow-lg'
      }`}
    >
      {/* Dynamic Accent Top Line */}
      <div
        className={`absolute top-0 left-0 right-0 h-1 transition-transform origin-left duration-300 ${
          member.isFounder
            ? 'bg-gradient-to-r from-blue-600 via-indigo-600 to-blue-400 scale-x-100'
            : 'bg-gradient-to-r from-slate-900 to-blue-600 scale-x-0 group-hover:scale-x-100'
        }`}
      />

      <div className="space-y-3.5">
        {/* Unified Photo / Avatar Box (Identical size for all cards) */}
        <div className="relative w-full h-48 sm:h-52 rounded-2xl overflow-hidden bg-slate-100 border border-slate-200 shrink-0">
          {member.avatarUrl && !imgError ? (
            <Image
              src={member.avatarUrl}
              alt={member.name}
              fill
              unoptimized={member.avatarUrl.startsWith('/uploads/') || member.avatarUrl.startsWith('http')}
              onError={() => setImgError(true)}
              className="object-cover object-top group-hover:scale-105 transition-transform duration-500"
              sizes="(max-width: 640px) 85vw, (max-width: 1024px) 50vw, 25vw"
            />
          ) : (
            <div
              className={`w-full h-full flex flex-col items-center justify-center text-white relative ${
                member.isFounder
                  ? 'bg-gradient-to-br from-slate-950 via-slate-900 to-blue-950'
                  : 'bg-gradient-to-br from-slate-900 via-slate-800 to-slate-950'
              }`}
            >
              <div className="absolute -top-10 -right-10 w-28 h-28 rounded-full bg-blue-500/15 blur-xl pointer-events-none" />
              <span className="text-4xl font-bold font-serif text-white/90 select-none">
                {member.name.charAt(0)}
              </span>
              <span className="text-[10px] font-mono uppercase tracking-widest text-blue-300 pt-2 opacity-80 select-none text-center px-2 truncate w-full">
                {member.roleTitle}
              </span>
            </div>
          )}

          {/* Overlay Status Badge */}
          {member.isFounder ? (
            <div className="absolute top-2.5 left-2.5 px-2.5 py-1 rounded-full bg-white/95 backdrop-blur-sm border border-blue-200/80 shadow-xs flex items-center gap-1.5 text-[10px] sm:text-[11px] font-semibold text-slate-900 z-10">
              <Crown className="w-3.5 h-3.5 text-amber-500 shrink-0" />
              <span className="truncate max-w-[130px]">{member.founderTitle || 'Founder & Architect'}</span>
            </div>
          ) : (
            <div className="absolute top-2.5 left-2.5 px-2 py-0.5 rounded-full bg-white/90 backdrop-blur-sm border border-black/10 shadow-xs flex items-center gap-1 text-[10px] font-semibold text-slate-700 z-10">
              <Briefcase className="w-3 h-3 text-blue-600 shrink-0" />
              <span className="truncate max-w-[120px]">{member.departmentName}</span>
            </div>
          )}
        </div>

        {/* Member Details */}
        <div className="space-y-1">
          <div className="flex items-center justify-between text-xs gap-1">
            <span className="font-semibold text-blue-600 truncate text-[11px] sm:text-xs">
              {member.founderTitle || member.roleTitle}
            </span>
            <span className="px-1.5 py-0.5 rounded bg-slate-100 text-[10px] font-mono text-slate-600 shrink-0">
              {member.departmentName}
            </span>
          </div>

          <h4 className="text-base sm:text-lg font-bold text-slate-900 group-hover:text-blue-600 transition-colors tracking-tight font-sans truncate">
            {member.name}
          </h4>

          <p className="text-xs text-slate-600 leading-relaxed line-clamp-3 min-h-[3rem]">
            {member.bio}
          </p>
        </div>

        {/* Technical Skills Pills */}
        {member.skills.length > 0 && (
          <div className="space-y-1 pt-0.5">
            <span className="text-[10px] font-mono text-slate-400 uppercase tracking-wider block font-semibold">
              Capabilities
            </span>
            <div className="flex flex-wrap gap-1">
              {member.skills.slice(0, 3).map((skill, sIdx) => (
                <span
                  key={sIdx}
                  className="px-2 py-0.5 rounded-md bg-slate-100 text-slate-700 text-[11px] font-mono font-medium truncate max-w-[110px]"
                >
                  {skill}
                </span>
              ))}
              {member.skills.length > 3 && (
                <span className="px-1.5 py-0.5 rounded-md bg-slate-50 text-slate-500 text-[10px] font-mono font-medium">
                  +{member.skills.length - 3}
                </span>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Footer Row (Socials & Email) */}
      <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500 gap-2">
        <div className="flex items-center gap-2.5">
          {member.socials.slice(0, 3).map((social, sIdx) => (
            <a
              key={sIdx}
              href={social.url}
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-blue-600 transition-colors font-medium flex items-center gap-0.5 text-[11px]"
              title={social.platform}
            >
              <span>{social.platform}</span>
              <ExternalLink className="w-2.5 h-2.5 opacity-60" />
            </a>
          ))}
        </div>

        {member.email && (
          <a
            href={`mailto:${member.email}`}
            className="text-slate-500 hover:text-blue-600 font-medium flex items-center gap-1 text-[11px] shrink-0 transition-colors"
            title={member.email}
          >
            <Mail className="w-3 h-3 text-blue-600" />
            <span className="font-mono truncate max-w-[90px]">{member.email.split('@')[0]}</span>
          </a>
        )}
      </div>
    </motion.div>
  );
};

export const AtelierAbout: React.FC<AtelierAboutProps> = ({
  teamMembers = [],
  settings = {},
  isStandalone = false,
}) => {
  const shouldReduceMotion = useReducedMotion();

  const brandName = settings?.brand_name || 'GMDware';

  const companyDescription =
    settings?.company_description ||
    'We are an independent software studio. We design, architect, and engineer dependable web applications, custom platforms, and digital products for teams with high technical expectations.';

  const mission =
    settings?.mission_statement ||
    'To engineer resilient, scalable, and mathematically sound digital infrastructure that accelerates enterprise transformation and eliminates technical friction.';

  const vision =
    settings?.vision_statement ||
    'Setting the global benchmark for modern software craftsmanship, zero-compromise security, and cinematic digital user experiences.';

  // Normalize all dynamic members from dashboard / database
  const normalizedMembers: TeamMemberItem[] = (teamMembers || [])
    .filter((m: any) => m && m.isActive !== false)
    .map((m: any) => {
      const cleanName =
        m.name && !m.name.startsWith('[')
          ? m.name
          : m.displayName && !m.displayName.startsWith('[')
          ? m.displayName
          : 'Senior Architect';

      const cleanDisplayName =
        m.displayName && !m.displayName.startsWith('[') ? m.displayName : cleanName;

      const roleTitle =
        m.role?.title || m.roleTitle || (m.isFounder ? 'Chief Architect' : 'Senior Software Engineer');

      const founderTitle =
        m.founderTitle || (m.isFounder ? 'Founder & Chief Architect' : null);

      const departmentName =
        m.department?.name || m.departmentName || (m.isFounder ? 'Leadership' : 'Engineering');

      const avatarUrl =
        m.image?.url || m.image?.storageUrl || m.avatarUrl || null;

      const bio =
        m.shortBio ||
        m.fullBio ||
        'Passionate software craftsman dedicated to engineering reliable, elegant, and maintainable digital solutions.';

      const skills: string[] = Array.isArray(m.skills) ? m.skills : [];

      const socials: { platform: string; url: string }[] = [];
      if (m.githubUrl) socials.push({ platform: 'GitHub', url: m.githubUrl });
      if (m.linkedinUrl) socials.push({ platform: 'LinkedIn', url: m.linkedinUrl });
      if (m.websiteUrl) socials.push({ platform: 'Website', url: m.websiteUrl });
      if (Array.isArray(m.socialLinks)) {
        m.socialLinks.forEach((s: any) => {
          if (s.url && !socials.some((existing) => existing.url === s.url)) {
            socials.push({ platform: s.platform || 'Link', url: s.url });
          }
        });
      }

      return {
        id: m.id,
        name: cleanName,
        displayName: cleanDisplayName,
        isFounder: Boolean(m.isFounder),
        roleTitle,
        founderTitle,
        departmentName,
        avatarUrl,
        bio,
        skills,
        email: m.showEmail ? m.email : null,
        socials,
        displayOrder: typeof m.displayOrder === 'number' ? m.displayOrder : 99,
      };
    })
    // Sort so Founders appear first side-by-side with team members
    .sort((a, b) => {
      if (a.isFounder && !b.isFounder) return -1;
      if (!a.isFounder && b.isFounder) return 1;
      return a.displayOrder - b.displayOrder;
    });

  // Horizontal scrolling & auto-scroll state
  const railRef = useRef<HTMLDivElement>(null);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);
  const [isHovered, setIsHovered] = useState(false);
  const [currentScrollIdx, setCurrentScrollIdx] = useState(0);

  // Automated continuous horizontal scroll when members count exceeds 4
  useEffect(() => {
    if (!isStandalone) return;
    if (!isAutoPlaying || isHovered || shouldReduceMotion) return;
    if (normalizedMembers.length <= 4) return;

    const interval = setInterval(() => {
      const rail = railRef.current;
      if (!rail) return;

      const maxScroll = rail.scrollWidth - rail.clientWidth;
      if (maxScroll <= 0) return;

      // If at or close to the end, smoothly wrap back to the beginning
      if (rail.scrollLeft >= maxScroll - 15) {
        rail.scrollTo({ left: 0, behavior: 'smooth' });
      } else {
        const card = rail.querySelector('[data-member-card]') as HTMLElement | null;
        const step = card ? card.offsetWidth + 20 : 280; // 20px is gap-5
        rail.scrollBy({ left: step, behavior: 'smooth' });
      }
    }, 3800);

    return () => clearInterval(interval);
  }, [isAutoPlaying, isHovered, shouldReduceMotion, normalizedMembers.length, isStandalone]);

  // Track scroll position to update active index indicator
  const handleScroll = useCallback(() => {
    const rail = railRef.current;
    if (!rail) return;
    const card = rail.querySelector('[data-member-card]') as HTMLElement | null;
    const step = card ? card.offsetWidth + 20 : 280;
    if (step > 0) {
      const idx = Math.round(rail.scrollLeft / step);
      setCurrentScrollIdx(Math.min(Math.max(0, idx), normalizedMembers.length - 1));
    }
  }, [normalizedMembers.length]);

  useEffect(() => {
    if (!isStandalone) return;
    const rail = railRef.current;
    if (!rail) return;
    rail.addEventListener('scroll', handleScroll, { passive: true });
    return () => rail.removeEventListener('scroll', handleScroll);
  }, [handleScroll, isStandalone]);

  // Manual navigation handlers
  const scrollPrev = () => {
    const rail = railRef.current;
    if (!rail) return;
    const card = rail.querySelector('[data-member-card]') as HTMLElement | null;
    const step = card ? card.offsetWidth + 20 : 280;
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
    const card = rail.querySelector('[data-member-card]') as HTMLElement | null;
    const step = card ? card.offsetWidth + 20 : 280;
    if (rail.scrollLeft >= maxScroll - 15) {
      rail.scrollTo({ left: 0, behavior: 'smooth' });
    } else {
      rail.scrollBy({ left: step, behavior: 'smooth' });
    }
  };

  const scrollToCard = (index: number) => {
    const rail = railRef.current;
    if (!rail) return;
    const card = rail.querySelector('[data-member-card]') as HTMLElement | null;
    const step = card ? card.offsetWidth + 20 : 280;
    rail.scrollTo({ left: index * step, behavior: 'smooth' });
  };

  return (
    <section
      className={`px-6 max-w-6xl mx-auto w-full overflow-hidden ${
        isStandalone ? 'pt-8 pb-24' : 'py-24 border-t border-slate-200'
      }`}
      aria-label={isStandalone ? 'About the Studio, Leadership and Team' : 'About the Studio'}
    >
      {/* ── 1. Company Definition & Overview Header ── */}
      <div
        className={`flex flex-col md:flex-row md:items-end justify-between gap-6 ${
          isStandalone ? 'pb-12 border-b border-slate-200' : ''
        }`}
      >
        <div className="space-y-3 max-w-2xl">
          <div className="inline-flex items-center gap-2 text-xs font-semibold text-blue-600 uppercase tracking-wide">
            <span>About {brandName}</span>
          </div>

          <h2 className="text-2xl sm:text-4xl font-bold tracking-tight text-slate-900 font-sans">
            An independent software studio built for craftsmanship.
          </h2>

          <p className="text-base text-slate-600 font-sans leading-relaxed">
            {companyDescription}
          </p>
        </div>

        {!isStandalone && (
          <Link
            href="/about"
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl border border-slate-300 hover:border-slate-900 bg-white/50 hover:bg-slate-900 text-slate-800 hover:text-white font-medium text-xs transition-all duration-200 shadow-sm group active:scale-[0.98] shrink-0"
          >
            <span>Read more about our approach</span>
            <ArrowRight className="w-3.5 h-3.5 text-slate-500 group-hover:text-white group-hover:translate-x-1 transition-transform" />
          </Link>
        )}
      </div>

      {isStandalone && (
        <>
          {/* ── 2. Company Goals & Purpose Cards (Mission & Vision) ── */}
      <div className="py-12 border-b border-slate-200">
        <div className="pb-6">
          <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider block">
            Our Purpose &amp; Direction
          </span>
          <h3 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight pt-1">
            Built with clear intent and long-term vision.
          </h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Mission Card */}
          <motion.div
            initial={shouldReduceMotion ? false : { opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.5, ease: editorialEasing }}
            whileHover={shouldReduceMotion ? undefined : { y: -4 }}
            className="rounded-3xl bg-white border border-slate-200/90 p-8 space-y-4 shadow-sm hover:shadow-md hover:border-slate-300 transition-all relative overflow-hidden group"
          >
            <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-blue-600 to-indigo-600 scale-x-0 group-hover:scale-x-100 transition-transform origin-left duration-300" />
            
            <div className="flex items-center justify-between">
              <span className="px-3 py-1 rounded-full text-xs font-semibold bg-blue-50 text-blue-700 flex items-center gap-1.5">
                <Target className="w-3.5 h-3.5" />
                <span>Our Mission</span>
              </span>
              <span className="text-xs font-mono text-slate-400 font-semibold">01</span>
            </div>

            <h4 className="text-xl font-bold text-slate-900 tracking-tight">
              Why We Build
            </h4>

            <p className="text-sm text-slate-600 leading-relaxed font-sans">
              {mission}
            </p>
          </motion.div>

          {/* Vision Card */}
          <motion.div
            initial={shouldReduceMotion ? false : { opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.5, delay: 0.1, ease: editorialEasing }}
            whileHover={shouldReduceMotion ? undefined : { y: -4 }}
            className="rounded-3xl bg-white border border-slate-200/90 p-8 space-y-4 shadow-sm hover:shadow-md hover:border-slate-300 transition-all relative overflow-hidden group"
          >
            <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-indigo-600 to-blue-500 scale-x-0 group-hover:scale-x-100 transition-transform origin-left duration-300" />
            
            <div className="flex items-center justify-between">
              <span className="px-3 py-1 rounded-full text-xs font-semibold bg-indigo-50 text-indigo-700 flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5" />
                <span>Our Vision</span>
              </span>
              <span className="text-xs font-mono text-slate-400 font-semibold">02</span>
            </div>

            <h4 className="text-xl font-bold text-slate-900 tracking-tight">
              The Standard We Set
            </h4>

            <p className="text-sm text-slate-600 leading-relaxed font-sans">
              {vision}
            </p>
          </motion.div>
        </div>
      </div>

      {/* ── 3. Unified Leadership & Team Section (4 cards side-by-side on desktop, auto-scroll when > 4) ── */}
      {normalizedMembers.length > 0 && (
        <div className="pt-14 space-y-8">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
            <div className="space-y-1 max-w-xl">
              <div className="flex items-center gap-2.5 flex-wrap">
                <span className="text-xs font-semibold text-blue-600 uppercase tracking-wider block">
                  Leadership &amp; Practitioners
                </span>
                {normalizedMembers.length > 4 && (
                  <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-blue-50 border border-blue-200/60 text-blue-700 text-[11px] font-mono font-medium">
                    <span
                      className={`w-1.5 h-1.5 rounded-full ${
                        isAutoPlaying && !isHovered ? 'bg-blue-600 animate-pulse' : 'bg-slate-400'
                      }`}
                    />
                    <span>{isAutoPlaying && !isHovered ? 'Auto-Scrolling' : isHovered ? 'Paused on Hover' : 'Paused'}</span>
                  </span>
                )}
              </div>

              <h3 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">
                The Team Behind {brandName}
              </h3>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed pt-1">
                Founders, software architects, and engineers dedicated to delivering reliable, mathematically sound software.
              </p>
            </div>

            {/* Navigation & Auto-scroll Controls (Shown when > 4 cards) */}
            {normalizedMembers.length > 4 && (
              <div className="flex items-center gap-2 shrink-0 self-start sm:self-end">
                {/* Play/Pause Button */}
                <button
                  type="button"
                  onClick={() => setIsAutoPlaying((prev) => !prev)}
                  className="inline-flex items-center justify-center w-9 h-9 rounded-xl border border-slate-300 hover:border-slate-900 bg-white/50 hover:bg-slate-900 text-slate-800 hover:text-white transition-all duration-200 shadow-sm active:scale-95"
                  title={isAutoPlaying ? 'Pause auto-scroll' : 'Resume auto-scroll'}
                  aria-label={isAutoPlaying ? 'Pause auto-scroll' : 'Resume auto-scroll'}
                >
                  {isAutoPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
                </button>

                {/* Previous Button */}
                <button
                  type="button"
                  onClick={scrollPrev}
                  className="inline-flex items-center justify-center w-9 h-9 rounded-xl border border-slate-300 hover:border-slate-900 bg-white/50 hover:bg-slate-900 text-slate-800 hover:text-white transition-all duration-200 shadow-sm active:scale-95"
                  title="Previous profile"
                  aria-label="Previous profile"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>

                {/* Next Button */}
                <button
                  type="button"
                  onClick={scrollNext}
                  className="inline-flex items-center justify-center w-9 h-9 rounded-xl border border-slate-300 hover:border-slate-900 bg-white/50 hover:bg-slate-900 text-slate-800 hover:text-white transition-all duration-200 shadow-sm active:scale-95"
                  title="Next profile"
                  aria-label="Next profile"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            )}
          </div>

          {/* Cards Track: 4 cards side-by-side on desktop (lg), horizontal scroll with smooth auto-progression when > 4 */}
          <div
            ref={railRef}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
            className={`flex items-stretch gap-5 pb-4 pt-1 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden ${
              normalizedMembers.length > 4
                ? 'overflow-x-auto scroll-smooth snap-x snap-mandatory cursor-grab active:cursor-grabbing'
                : 'overflow-x-auto sm:overflow-x-visible'
            }`}
          >
            {normalizedMembers.map((member, idx) => (
              <MemberCard
                key={member.id || idx}
                member={member}
                index={idx}
                shouldReduceMotion={shouldReduceMotion}
              />
            ))}
          </div>

          {/* Dot Pagination indicators when members exceed 4 */}
          {normalizedMembers.length > 4 && (
            <div className="flex items-center justify-center gap-1.5 pt-1">
              {normalizedMembers.map((_, dotIdx) => (
                <button
                  key={dotIdx}
                  type="button"
                  onClick={() => scrollToCard(dotIdx)}
                  className={`h-1.5 rounded-full transition-all duration-300 ${
                    dotIdx === currentScrollIdx
                      ? 'w-6 bg-blue-600'
                      : 'w-1.5 bg-slate-300 hover:bg-slate-400'
                  }`}
                  aria-label={`Scroll to member ${dotIdx + 1}`}
                />
              ))}
            </div>
          )}
        </div>
      )}

      {/* Fallback empty state if no team members in DB */}
      {normalizedMembers.length === 0 && (
        <div className="pt-14 text-center p-10 rounded-3xl bg-slate-50 border border-dashed border-slate-300 max-w-md mx-auto space-y-3">
          <Users className="w-8 h-8 text-blue-600 mx-auto" />
          <h4 className="text-base font-bold text-slate-900">Team Directory Updating</h4>
          <p className="text-xs text-slate-500 leading-relaxed">
            Team and leadership profiles can be added and managed directly from the Admin Dashboard.
          </p>
          <Link
            href="/admin/team"
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl border border-slate-300 hover:border-slate-900 bg-white hover:bg-slate-900 text-slate-800 hover:text-white font-medium text-xs transition-all duration-200 shadow-sm"
          >
            <span>Manage Team in Dashboard</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      )}
        </>
      )}
    </section>
  );
};
