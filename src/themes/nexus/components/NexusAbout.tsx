'use client';

import React from 'react';
import Image from 'next/image';
import { Orbit, Sparkles, Shield, Cpu, Zap, Users, ArrowUpRight } from 'lucide-react';

interface NexusAboutProps {
  teamMembers: any[];
  values?: any[];
  isStandalone?: boolean;
}

export const NexusAbout: React.FC<NexusAboutProps> = ({
  teamMembers,
  values = [],
  isStandalone = false,
}) => {
  return (
    <section className={`relative overflow-hidden bg-[#030509] ${isStandalone ? 'pt-32 pb-24' : 'py-24 border-t border-white/5'}`}>
      <div className="max-w-6xl mx-auto px-4 sm:px-8 relative z-10 space-y-16">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto space-y-4">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-purple-500/10 border border-purple-500/30 text-[11px] font-mono text-purple-300">
            <Users className="w-3 h-3 text-[#00F2FE]" />
            <span>INTERCONNECTED SPECIALIST COLLECTIVE</span>
          </div>
          <h2 className="text-3xl sm:text-5xl font-black text-white tracking-tight font-sans">
            Architected by Veteran Practitioners
          </h2>
          <p className="text-sm text-slate-400 leading-relaxed">
            We are not a bloated agency hierarchy. GMDware operates as an agile network of principal software architects and systems specialists who code alongside founders.
          </p>
        </div>

        {/* Team Nodes Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {teamMembers.map((member: any) => {
            const avatar = member.avatarUrl || member.image?.url || member.image?.storageUrl || '/uploads/default-avatar.png';
            return (
              <div
                key={member.id}
                className="group relative rounded-3xl bg-[#080D1A]/70 border border-cyan-500/20 hover:border-cyan-400/50 p-6 backdrop-blur-xl transition-all duration-300 flex flex-col justify-between space-y-4 shadow-[0_0_25px_rgba(0,0,0,0.4)]"
              >
                <div className="space-y-4">
                  {/* Photo Node */}
                  <div className="relative w-24 h-24 rounded-2xl overflow-hidden bg-black/50 border border-cyan-500/30 group-hover:border-cyan-400 transition-colors">
                    <Image
                      src={avatar}
                      alt={member.displayName || member.name}
                      fill
                      className="object-cover"
                      sizes="96px"
                    />
                  </div>

                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#00F2FE]" />
                      <span className="text-[10px] font-mono text-cyan-400 uppercase tracking-wider">
                        {member.isFounder ? 'FOUNDING ARCHITECT' : member.departmentName || 'SYSTEMS CORE'}
                      </span>
                    </div>
                    <h3 className="text-xl font-bold text-white group-hover:text-[#00F2FE] transition-colors">
                      {member.displayName || member.name}
                    </h3>
                    <div className="text-xs font-mono text-slate-400">
                      {member.founderTitle || member.roleTitle || 'Principal Systems Engineer'}
                    </div>
                  </div>

                  <p className="text-xs text-slate-300 line-clamp-3 leading-relaxed">
                    {member.shortBio || member.bio}
                  </p>
                </div>

                {/* Skills vectors */}
                {member.skills && member.skills.length > 0 && (
                  <div className="pt-3 border-t border-white/5 flex flex-wrap gap-1.5">
                    {member.skills.slice(0, 3).map((skill: string, sIdx: number) => (
                      <span
                        key={sIdx}
                        className="px-2 py-0.5 rounded-full bg-white/5 text-[9px] font-mono text-cyan-200 border border-white/5"
                      >
                        {skill}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
