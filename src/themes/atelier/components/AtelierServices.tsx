'use client';

import React from 'react';
import Link from 'next/link';
import { ArrowRight, Sparkles } from 'lucide-react';
import { motion, useReducedMotion } from 'framer-motion';

interface AtelierServicesProps {
  services: any[];
  technologies?: any[];
  isStandalone?: boolean;
}

export const AtelierServices: React.FC<AtelierServicesProps> = ({
  services = [],
  isStandalone = false,
}) => {
  const shouldReduceMotion = useReducedMotion();

  // Curated human-centric studio service disciplines
  const defaultServices = [
    {
      id: 'web-experiences',
      num: '01',
      title: 'Websites & Digital Experiences',
      category: 'Digital Craft',
      summary:
        'Bespoke websites and brand digital flagships engineered for speed, clear narrative, and measurable audience engagement.',
      accent: 'blue',
      features: [
        'Custom Next.js & React engineering',
        'Responsive mobile-first layouts',
        'Search engine & speed optimization',
      ],
      technologies: ['Next.js', 'React', 'TypeScript', 'Tailwind CSS'],
    },
    {
      id: 'web-platforms',
      num: '02',
      title: 'Web Applications & Platforms',
      category: 'Full-Stack Software',
      summary:
        'Resilient software products, customer portals, and internal operations tools built with type-safe APIs and clean data architectures.',
      accent: 'orange',
      features: [
        'Customer portals & client dashboards',
        'Secure authentication & role control',
        'Custom third-party API integrations',
      ],
      technologies: ['React', 'Node.js', 'PostgreSQL', 'TypeScript'],
    },
    {
      id: 'product-design',
      num: '03',
      title: 'Product Design & Prototyping',
      category: 'Experience Strategy',
      summary:
        'Thoughtful interface design and interactive prototypes. We turn complex workflows into intuitive software experiences.',
      accent: 'indigo',
      features: [
        'User research & workflow mapping',
        'Interactive clickable prototypes',
        'Scalable component design systems',
      ],
      technologies: ['Design Systems', 'Interactive Prototypes', 'Workflow Mapping'],
    },
    {
      id: 'technical-direction',
      num: '04',
      title: 'Technical Direction & Architecture',
      category: 'Advisory & Scale',
      summary:
        'Senior engineering stewardship, performance audits, database schema design, and cloud deployments that keep platforms dependable.',
      accent: 'emerald',
      features: [
        'Database & schema modeling',
        'Codebase audits & speed tuning',
        'Cloud infrastructure & deployment',
      ],
      technologies: ['Docker', 'PostgreSQL', 'Cloud Infrastructure', 'CI/CD'],
    },
  ];

  const items = (services && services.length > 0)
    ? services.map((s, idx) => {
        const defaultAccents = ['blue', 'indigo', 'orange', 'emerald', 'blue', 'indigo'];
        const feats = Array.isArray(s.features)
          ? s.features.map((f: any) => (typeof f === 'string' ? f : f.title || f.name))
          : [
              'Domain-Driven Architecture',
              'End-to-End Type Safety',
              'Automated Testing & Delivery',
            ];

        const techs = Array.isArray(s.technologies)
          ? s.technologies.map((t: any) => t.technology?.name || t.name || String(t)).filter(Boolean)
          : [];

        return {
          id: s.id || s.slug || idx,
          num: String(idx + 1).padStart(2, '0'),
          title: s.title || (s as any).name,
          category: s.category || (idx % 2 === 0 ? 'Full-Stack Software' : 'Digital Architecture'),
          summary: s.summary || (s as any).description || (s as any).content || '',
          accent: defaultAccents[idx % defaultAccents.length],
          features: feats,
          technologies: techs,
        };
      })
    : defaultServices;

  const getAccentColor = (accent: string) => {
    switch (accent) {
      case 'orange':
        return 'text-orange-700 group-hover:border-orange-400';
      case 'indigo':
        return 'text-indigo-700 group-hover:border-indigo-400';
      case 'emerald':
        return 'text-emerald-700 group-hover:border-emerald-400';
      default:
        return 'text-blue-700 group-hover:border-blue-400';
    }
  };

  return (
    <section
      className={`px-6 max-w-6xl mx-auto w-full ${
        isStandalone ? 'pt-8 pb-24' : 'py-24 border-t border-slate-200'
      }`}
      aria-label="Studio Services and Capabilities"
    >
      {/* Section Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-14 border-b border-slate-200">
        <div className="space-y-3 max-w-2xl">
          <div className="text-xs font-semibold text-blue-600 uppercase tracking-wide">
            Services &amp; Disciplines
          </div>

          <h2 className="text-2xl sm:text-4xl font-bold tracking-tight text-slate-900 font-sans">
            How we partner with software leaders.
          </h2>

          <p className="text-base text-slate-600 font-sans leading-relaxed">
            We provide end-to-end digital product design and software engineering. Here is how we turn requirements into dependable products.
          </p>
        </div>

        {!isStandalone && (
          <Link
            href="/services"
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl border border-slate-300 hover:border-slate-900 bg-white/50 hover:bg-slate-900 text-slate-800 hover:text-white font-medium text-xs transition-all duration-200 shadow-sm group active:scale-[0.98] shrink-0"
          >
            <span>Learn more about services</span>
            <ArrowRight className="w-3.5 h-3.5 text-slate-500 group-hover:text-white group-hover:translate-x-1 transition-transform" />
          </Link>
        )}
      </div>

      {/* 2x2 Interactive Services Grid with Alternating Directional Reveal */}
      <div className="pt-12 grid grid-cols-1 md:grid-cols-2 gap-8 overflow-hidden">
        {items.map((service, idx) => {
          const isLeft = idx % 2 === 0;
          const initialOffset = isLeft ? { opacity: 0, x: -35 } : { opacity: 0, x: 35 };

          return (
            <motion.div
              key={service.id || idx}
              initial={shouldReduceMotion ? false : initialOffset}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, amount: 0.15 }}
              transition={{
                duration: 0.65,
                delay: 0.1 * idx,
                ease: [0.16, 1, 0.3, 1],
              }}
              whileHover={shouldReduceMotion ? undefined : { y: -6 }}
              className="rounded-3xl bg-white border border-slate-200/90 p-8 flex flex-col justify-between space-y-6 transition-all hover:border-slate-300 hover:shadow-xl group relative overflow-hidden"
            >
              {/* Animated Top Accent Line */}
              <div
                className={`absolute top-0 left-0 right-0 h-1 scale-x-0 group-hover:scale-x-100 transition-transform origin-left duration-300 ${
                  service.accent === 'orange'
                    ? 'bg-orange-500'
                    : service.accent === 'indigo'
                    ? 'bg-indigo-500'
                    : service.accent === 'emerald'
                    ? 'bg-emerald-500'
                    : 'bg-blue-600'
                }`}
              />

              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
                    {service.num}
                  </span>
                  <span className="text-xs font-semibold text-slate-700 px-3 py-1 rounded-full bg-slate-100 group-hover:bg-blue-50 group-hover:text-blue-700 transition-colors">
                    {service.category}
                  </span>
                </div>

                <h3 className="text-xl sm:text-2xl font-bold text-slate-900 font-sans tracking-tight group-hover:text-blue-600 transition-colors">
                  {service.title}
                </h3>

                <p className="text-sm text-slate-600 leading-relaxed">
                  {service.summary}
                </p>
              </div>

              <div className="pt-4 border-t border-slate-100 space-y-4">
                <div className="space-y-2">
                  <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wide block">
                    Core Disciplines
                  </span>
                  <ul className="space-y-2 text-xs text-slate-700">
                    {service.features.map((feat: string, fIdx: number) => (
                      <li key={fIdx} className="flex items-center gap-2 group-hover:translate-x-1 transition-transform">
                        <span className="w-1.5 h-1.5 rounded-full bg-blue-600 shrink-0" />
                        <span>{feat}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {service.technologies && service.technologies.length > 0 && (
                  <div className="pt-3 border-t border-slate-100 space-y-2">
                    <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-wide block font-mono">
                      Tech Stack
                    </span>
                    <div className="flex flex-wrap gap-1.5">
                      {service.technologies.map((tName: string, tIdx: number) => (
                        <span
                          key={tIdx}
                          className="px-2 py-0.5 rounded-md bg-slate-100 text-slate-700 text-[11px] font-mono font-medium"
                        >
                          {tName}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </motion.div>
          );
        })}
      </div>
    </section>
  );
};
