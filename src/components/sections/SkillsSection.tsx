'use client';

import { motion } from 'framer-motion';
import type { Skill, SkillCategory } from '@/types';

interface SkillsSectionProps {
  categories: SkillCategory[];
  skills: Skill[];
}

function SkillBar({ name, level, color, index }: { name: string; level: number; color: string; index: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, x: -10 }}
      whileInView={{ opacity: 1, x: 0 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.07 }}
      className="group"
    >
      <div className="flex items-center justify-between mb-1.5">
        <span className="text-sm text-dark-300 group-hover:text-white transition-colors">{name}</span>
        <span className="text-xs font-mono text-dark-500 group-hover:text-dark-300 transition-colors">{level}%</span>
      </div>
      <div className="h-1.5 bg-white/5 rounded-full overflow-hidden">
        <motion.div
          className={`h-full rounded-full bg-gradient-to-r ${color}`}
          initial={{ width: 0 }}
          whileInView={{ width: `${level}%` }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: index * 0.07, ease: 'easeOut' }}
        />
      </div>
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
                className="p-6 rounded-2xl bg-white/5 border border-white/10 hover:bg-white/8 hover:border-white/15 transition-all duration-300"
              >
                <div className="flex items-center gap-2 mb-6">
                  <div className={`h-1 w-8 rounded-full bg-gradient-to-r ${cat.color}`} />
                  <h3 className="text-sm font-semibold text-white">{cat.name}</h3>
                </div>
                <div className="space-y-4">
                  {catSkills.map((skill, si) => (
                    <SkillBar key={skill.id} name={skill.name} level={skill.level} color={cat.color} index={si} />
                  ))}
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
