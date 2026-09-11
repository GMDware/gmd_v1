import React from 'react';
import { cn } from '@/lib/utils';
import { CheckCircle2, Terminal, Shield, Cpu, GitBranch, Rocket } from 'lucide-react';

export interface ProcessStepItem {
  id?: string;
  stepNumber: number;
  title: string;
  phase: string;
  description: string;
  deliverables?: string[];
  iconName?: string | null;
}

interface ProcessTimelineProps {
  steps: ProcessStepItem[];
}

export const ProcessTimeline: React.FC<ProcessTimelineProps> = ({ steps }) => {
  const getPhaseIcon = (index: number) => {
    switch (index % 5) {
      case 0:
        return <Terminal className="w-4 h-4 text-[#00D2FF]" />;
      case 1:
        return <Cpu className="w-4 h-4 text-[#0066FF]" />;
      case 2:
        return <GitBranch className="w-4 h-4 text-[#80B3FF]" />;
      case 3:
        return <Shield className="w-4 h-4 text-[#00D2FF]" />;
      case 4:
        return <Rocket className="w-4 h-4 text-[#10B981]" />;
      default:
        return <CheckCircle2 className="w-4 h-4 text-white" />;
    }
  };

  return (
    <div className="relative space-y-8 before:absolute before:inset-0 before:left-6 md:before:left-1/2 md:before:-ml-[1px] before:w-[2px] before:bg-gradient-to-b before:from-[#0066FF] before:via-white/10 before:to-transparent">
      {steps.map((step, idx) => {
        const isEven = idx % 2 === 0;
        return (
          <div
            key={step.id || idx}
            className={cn(
              'relative flex flex-col md:flex-row items-start md:items-center gap-8 group',
              isEven ? 'md:flex-row-reverse' : ''
            )}
          >
            {/* Center Protocol Beacon Node */}
            <div className="absolute left-6 md:left-1/2 -translate-x-1/2 flex items-center justify-center w-12 h-12 rounded-full bg-[#05080F] border-2 border-[#0066FF] shadow-[0_0_20px_rgba(0,102,255,0.4)] z-10 shrink-0">
              {getPhaseIcon(idx)}
            </div>

            {/* Content Card (Half Width) */}
            <div
              className={cn(
                'w-full md:w-[calc(50%-3rem)] pl-16 md:pl-0',
                isEven ? 'md:text-left' : 'md:text-left'
              )}
            >
              <div className="gmd-panel rounded-2xl p-6 sm:p-8 space-y-4 hover:border-[#0066FF]/50 transition-colors">
                {/* Phase Badge & Step Number */}
                <div className="flex items-center justify-between">
                  <span className="font-mono text-xs text-[#00D2FF] uppercase tracking-widest font-semibold">
                    // PHASE 0{step.stepNumber || idx + 1}: {step.phase}
                  </span>
                  <span className="font-mono text-xs text-white/30">
                    M{idx + 1}
                  </span>
                </div>

                {/* Title */}
                <h3 className="text-xl sm:text-2xl font-bold text-white font-display tracking-tight">
                  {step.title}
                </h3>

                {/* Description */}
                <p className="text-sm text-[#94A3B8] leading-relaxed font-sans">
                  {step.description}
                </p>

                {/* Deliverables Array */}
                {step.deliverables && step.deliverables.length > 0 && (
                  <div className="pt-2 border-t border-white/[0.06] space-y-2">
                    <span className="font-mono text-[10px] text-[#64748B] uppercase tracking-widest block">
                      KEY DELIVERABLES:
                    </span>
                    <div className="flex flex-wrap gap-1.5">
                      {step.deliverables.map((item, dIdx) => (
                        <span
                          key={dIdx}
                          className="px-2 py-1 rounded bg-[#080D18] border border-white/[0.06] font-mono text-[11px] text-slate-300"
                        >
                          {item}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Empty Spacer Column for Desktop Alternate */}
            <div className="hidden md:block w-[calc(50%-3rem)]" />
          </div>
        );
      })}
    </div>
  );
};
