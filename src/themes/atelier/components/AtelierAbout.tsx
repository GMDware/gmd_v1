'use client';

import React from 'react';
import Image from 'next/image';

interface AtelierAboutProps {
  teamMembers: any[];
  values?: any[];
  isStandalone?: boolean;
}

export const AtelierAbout: React.FC<AtelierAboutProps> = ({
  teamMembers,
  values = [],
  isStandalone = false,
}) => {
  return (
    <section className={`relative bg-[#0A0A0A] text-[#F5F2EB] ${isStandalone ? 'pt-32 pb-24' : 'py-24 border-b border-white/[0.08]'}`}>
      <div className="max-w-6xl mx-auto px-6 sm:px-12 space-y-20">
        {/* Editorial Manifesto */}
        <div className="max-w-4xl space-y-6">
          <span className="text-xs font-mono uppercase tracking-[0.2em] text-stone-400 block">
            ATELIER MANIFESTO // 2026
          </span>
          <h2 className="text-3xl sm:text-6xl font-normal font-serif text-[#F5F2EB] leading-tight">
            Software built with the permanence of architecture.
          </h2>
          <p className="text-base sm:text-xl text-stone-300 font-sans font-light leading-relaxed max-w-2xl">
            We believe the modern web suffers from disposable software and superficial aesthetics. GMDware was founded to restore rigor, mathematical determinism, and enduring craftsmanship to digital engineering.
          </p>
        </div>

        {/* Leadership Monograph */}
        <div className="space-y-12">
          <div className="pb-4 border-b border-white/[0.08] flex items-center justify-between text-xs font-mono text-stone-400">
            <span className="uppercase tracking-widest">PRACTITIONERS & LEADERSHIP</span>
            <span>{teamMembers.length} MEMBERS</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-12">
            {teamMembers.map((member: any) => {
              const avatar = member.avatarUrl || member.image?.url || member.image?.storageUrl || '/uploads/default-avatar.png';
              return (
                <div key={member.id} className="space-y-4 group">
                  {/* Portrait */}
                  <div className="relative h-80 sm:h-96 w-full rounded-lg overflow-hidden bg-black/50 border border-white/10 filter grayscale group-hover:grayscale-0 transition-all duration-700">
                    <Image
                      src={avatar}
                      alt={member.displayName || member.name}
                      fill
                      className="object-cover object-top"
                      sizes="(max-width: 640px) 100vw, 33vw"
                    />
                  </div>

                  <div className="space-y-1">
                    <div className="flex items-center justify-between text-xs font-mono text-stone-500">
                      <span>{member.isFounder ? 'FOUNDER' : member.departmentName || 'ENGINEERING'}</span>
                      {member.skills && member.skills[0] && <span>{member.skills[0]}</span>}
                    </div>
                    <h3 className="text-xl font-serif text-[#F5F2EB]">
                      {member.displayName || member.name}
                    </h3>
                    <div className="text-xs text-stone-400 font-sans font-light">
                      {member.founderTitle || member.roleTitle || 'Principal Systems Engineer'}
                    </div>
                  </div>

                  <p className="text-xs text-stone-400 font-sans leading-relaxed line-clamp-3 font-light">
                    {member.shortBio || member.bio}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
};
