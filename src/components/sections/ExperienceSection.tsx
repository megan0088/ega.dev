'use client';

import { motion } from 'framer-motion';
import { Briefcase, GraduationCap, Trophy, Calendar } from 'lucide-react';
import type { Experience } from '@/types';
import { formatDateRange } from '@/lib/utils';
import { useLang } from '@/lib/lang-context';

interface ExperienceSectionProps {
  experiences: Experience[];
}

const typeConfig = {
  work:        { icon: Briefcase,      color: 'text-brand-400',   bg: 'bg-brand-500/10',   border: 'border-brand-500/30' },
  education:   { icon: GraduationCap, color: 'text-accent-emerald', bg: 'bg-emerald-500/10', border: 'border-emerald-500/30' },
  competition: { icon: Trophy,         color: 'text-accent-purple', bg: 'bg-purple-500/10',  border: 'border-purple-500/30' },
};

export default function ExperienceSection({ experiences }: ExperienceSectionProps) {
  const { tr } = useLang();

  const groups = [
    { key: 'work'        as const, label: tr.experience.groups.work,        items: experiences.filter(e => e.type === 'work') },
    { key: 'education'   as const, label: tr.experience.groups.education,   items: experiences.filter(e => e.type === 'education') },
    { key: 'competition' as const, label: tr.experience.groups.competition, items: experiences.filter(e => e.type === 'competition') },
  ].filter(g => g.items.length > 0);

  return (
    <section id="experience" className="relative py-32 px-6 overflow-hidden">
      <div className="glow-orb w-[400px] h-[400px] bg-brand-600/10 bottom-0 left-0" />

      <div className="max-w-4xl mx-auto relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-16"
        >
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/5 border border-white/10 text-dark-400 text-sm font-mono mb-6">
            <span className="text-brand-400">// </span>{tr.experience.tag}
          </div>
          <h2 className="text-4xl md:text-5xl font-bold text-white">{tr.experience.title}</h2>
        </motion.div>

        {experiences.length === 0 ? (
          <div className="text-center py-20 text-dark-500">{tr.experience.empty}</div>
        ) : (
          <div className="space-y-16">
            {groups.map((group) => (
              <div key={group.key}>
                <h3 className="text-sm font-semibold text-dark-400 uppercase tracking-widest mb-6 flex items-center gap-3">
                  <span className="flex-1 h-px bg-white/10" />
                  {group.label}
                  <span className="flex-1 h-px bg-white/10" />
                </h3>
                <div className="relative">
                  <div className="absolute left-5 top-0 bottom-0 w-px bg-gradient-to-b from-white/10 via-white/5 to-transparent" />
                  <div className="space-y-6">
                    {group.items.map((exp, idx) => {
                      const config = typeConfig[exp.type];
                      return (
                        <motion.div
                          key={exp.id}
                          initial={{ opacity: 0, x: -20 }}
                          whileInView={{ opacity: 1, x: 0 }}
                          viewport={{ once: true }}
                          transition={{ delay: idx * 0.1 }}
                          className="flex gap-6"
                        >
                          <div className={`flex-shrink-0 w-10 h-10 rounded-full ${config.bg} border ${config.border} flex items-center justify-center z-10`}>
                            <config.icon size={16} className={config.color} />
                          </div>
                          <div className="flex-1 pb-2">
                            <div className="p-5 rounded-2xl bg-white/5 border border-white/10 hover:bg-white/8 hover:border-white/15 transition-all duration-300">
                              <div className="flex flex-wrap items-start justify-between gap-2 mb-2">
                                <div>
                                  <h4 className="font-semibold text-white text-base">{exp.title}</h4>
                                  <p className="text-brand-400 text-sm font-medium">{exp.company}</p>
                                </div>
                                <div className="flex items-center gap-1.5 text-dark-500 text-xs font-mono shrink-0">
                                  <Calendar size={12} />
                                  {formatDateRange(exp.start_date, exp.end_date, exp.is_current)}
                                  {exp.is_current && (
                                    <span className="ml-1 px-2 py-0.5 rounded-full bg-emerald-500/15 text-emerald-400 border border-emerald-500/30 text-xs">
                                      {tr.experience.current}
                                    </span>
                                  )}
                                </div>
                              </div>
                              {exp.description.length > 0 && (
                                <ul className="space-y-1.5 mt-3">
                                  {exp.description.map((bullet, i) => (
                                    <li key={i} className="flex gap-2 text-sm text-dark-400">
                                      <span className={`${config.color} mt-0.5 shrink-0`}>▸</span>
                                      {bullet}
                                    </li>
                                  ))}
                                </ul>
                              )}
                            </div>
                          </div>
                        </motion.div>
                      );
                    })}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
