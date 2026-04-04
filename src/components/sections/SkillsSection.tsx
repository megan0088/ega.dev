'use client';

import { motion } from 'framer-motion';
import type { Skill, SkillCategory } from '@/types';

interface SkillsSectionProps {
  categories: SkillCategory[];
  skills: Skill[];
}

type Tier = 'Beginner' | 'Intermediate' | 'Mastery';

function getTier(level: number): Tier {
  if (level >= 80) return 'Mastery';
  if (level >= 41) return 'Intermediate';
  return 'Beginner';
}

const tierStyle: Record<Tier, string> = {
  Beginner:     'bg-white/5 border-white/10 text-dark-400',
  Intermediate: 'bg-brand-500/10 border-brand-500/30 text-brand-300',
  Mastery:      'bg-accent-emerald/10 border-accent-emerald/30 text-emerald-300',
};

const tierDot: Record<Tier, string> = {
  Beginner:     'bg-dark-500',
  Intermediate: 'bg-brand-400',
  Mastery:      'bg-accent-emerald',
};

function SkillBadge({ name, level, index }: { name: string; level: number; index: number }) {
  const tier = getTier(level);
  return (
    <motion.div
      initial={{ opacity: 0, y: 6 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.06 }}
      className="flex items-center justify-between gap-3 py-2 border-b border-white/5 last:border-0"
    >
      <span className="text-sm text-dark-300">{name}</span>
      <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium border shrink-0 ${tierStyle[tier]}`}>
        <span className={`w-1.5 h-1.5 rounded-full ${tierDot[tier]}`} />
        {tier}
      </span>
    </motion.div>
  );
}

export default function SkillsSection({ categories, skills }: SkillsSectionProps) {
  if (categories.length === 0) return null;

  return (
    <section id="skills" className="relative py-32 px-6 overflow-hidden">
      <div className="glow-orb w-[400px] h-[400px] bg-brand-600/10 top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" />

      <div className="max-w-6xl mx-auto relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-16"
        >
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/5 border border-white/10 text-dark-400 text-sm font-mono mb-6">
            <span className="text-brand-400">// </span>skills
          </div>
          <h2 className="text-4xl md:text-5xl font-bold text-white">What I Work With</h2>
        </motion.div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {categories.map((cat, gi) => {
            const catSkills = skills.filter(s => s.category_id === cat.id);
            if (catSkills.length === 0) return null;
            return (
              <motion.div
                key={cat.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: gi * 0.1 }}
                className="p-6 rounded-2xl bg-white/5 border border-white/10 hover:bg-white/[0.07] hover:border-white/15 transition-all duration-300"
              >
                <div className="flex items-center gap-2 mb-5">
                  <div className={`h-1 w-8 rounded-full bg-gradient-to-r ${cat.color}`} />
                  <h3 className="text-sm font-semibold text-white">{cat.name}</h3>
                </div>
                <div>
                  {catSkills.map((skill, si) => (
                    <SkillBadge key={skill.id} name={skill.name} level={skill.level} index={si} />
                  ))}
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* Legend */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.4 }}
          className="mt-8 flex items-center justify-center gap-6"
        >
          {(['Beginner', 'Intermediate', 'Mastery'] as Tier[]).map(tier => (
            <span key={tier} className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium border ${tierStyle[tier]}`}>
              <span className={`w-1.5 h-1.5 rounded-full ${tierDot[tier]}`} />
              {tier}
            </span>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
