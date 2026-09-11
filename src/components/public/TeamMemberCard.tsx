import React from 'react';
import Image from 'next/image';
import { Badge } from '@/components/ui/Badge';
import { User, Shield, Terminal, ArrowUpRight } from 'lucide-react';

export interface MemberData {
  id: string;
  name: string;
  displayName: string;
  isFounder: boolean;
  founderTitle?: string | null;
  roleTitle?: string;
  departmentName?: string;
  shortBio: string;
  skills?: string[];
  avatarUrl?: string;
  socials?: Array<{ platform: string; url: string }>;
}

interface TeamMemberCardProps {
  member: MemberData;
}

export const TeamMemberCard: React.FC<TeamMemberCardProps> = ({ member }) => {
  return (
    <div className="gmd-panel rounded-2xl p-6 sm:p-7 space-y-5 hover:border-[#0066FF]/50 transition-all duration-300 group flex flex-col justify-between">
      <div className="space-y-4">
        {/* Avatar & Header Badges */}
        <div className="flex items-start justify-between">
          <div className="relative w-16 h-16 rounded-xl overflow-hidden border border-white/10 bg-[#080D18] group-hover:border-[#0066FF]/60 transition-colors">
            {member.avatarUrl ? (
              <Image
                src={member.avatarUrl}
                alt={member.displayName || member.name}
                fill
                sizes="64px"
                className="object-cover grayscale contrast-125 group-hover:grayscale-0 transition-all duration-500"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center bg-[#080D18] text-[#0066FF]">
                <User className="w-7 h-7" />
              </div>
            )}
          </div>

          <div className="flex flex-col items-end gap-1.5">
            {member.isFounder && (
              <Badge variant="cobalt" size="sm">
                LEADERSHIP
              </Badge>
            )}
            {member.departmentName && (
              <span className="font-mono text-[10px] text-[#64748B] uppercase tracking-wider">
                {member.departmentName}
              </span>
            )}
          </div>
        </div>

        {/* Identity & Title */}
        <div className="space-y-1">
          <h4 className="text-lg font-bold text-white font-display tracking-tight group-hover:text-[#00D2FF] transition-colors">
            {member.displayName || member.name}
          </h4>
          <p className="font-mono text-xs text-[#0066FF] font-medium">
            {member.founderTitle || member.roleTitle || 'Systems Specialist'}
          </p>
        </div>

        {/* Short Bio */}
        <p className="text-xs text-[#94A3B8] leading-relaxed line-clamp-3 font-sans">
          {member.shortBio}
        </p>
      </div>

      {/* Skills Array & Socials */}
      <div className="pt-4 border-t border-white/[0.06] space-y-3">
        {member.skills && member.skills.length > 0 && (
          <div className="flex flex-wrap gap-1">
            {member.skills.slice(0, 4).map((skill) => (
              <span
                key={skill}
                className="px-2 py-0.5 rounded bg-[#0E1526] border border-white/[0.05] font-mono text-[10px] text-slate-300"
              >
                {skill}
              </span>
            ))}
          </div>
        )}

        {member.socials && member.socials.length > 0 && (
          <div className="flex items-center gap-3 pt-1">
            {member.socials.map((soc) => (
              <a
                key={soc.platform}
                href={soc.url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-[11px] font-mono text-[#64748B] hover:text-[#00D2FF] transition-colors flex items-center gap-0.5"
              >
                <span>{soc.platform}</span>
                <ArrowUpRight className="w-2.5 h-2.5" />
              </a>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
