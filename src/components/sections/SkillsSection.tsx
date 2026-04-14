'use client';

import dynamic from 'next/dynamic';
import { motion } from 'framer-motion';
import type { Skill, SkillCategory } from '@/types';
import { useLang } from '@/lib/lang-context';

const SkillsWebGLCanvas = dynamic(() => import('@/components/ui/SkillsWebGLCanvas'), { ssr: false });

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

function SkillBadge({ name, level, index, label }: { name: string; level: number; index: number; label: string }) {
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
        {label}
      </span>
    </motion.div>
  );
}

// ── HUD badge for the WebGL card ─────────────────────────
function HUDBadge({ name, level, index, label }: { name: string; level: number; index: number; label: string }) {
  const tier = getTier(level);
  const barColor =
    tier === 'Mastery'      ? 'bg-amber-400'  :
    tier === 'Intermediate' ? 'bg-cyan-400'   :
                              'bg-slate-500';
  return (
    <motion.div
      initial={{ opacity: 0, x: -8 }}
      whileInView={{ opacity: 1, x: 0 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.07 }}
      className="group"
    >
      <div className="flex items-center justify-between gap-2 mb-0.5">
        <span className="text-[11px] font-mono text-amber-300/80 uppercase tracking-wider">{name}</span>
        <span className="text-[10px] font-mono text-cyan-400/70">{level}%</span>
      </div>
      <div className="h-[3px] w-full rounded-full bg-white/5 overflow-hidden">
        <motion.div
          className={`h-full rounded-full ${barColor}`}
          initial={{ width: 0 }}
          whileInView={{ width: `${level}%` }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: index * 0.07 + 0.2, ease: 'easeOut' }}
        />
      </div>
    </motion.div>
  );
}

// ── Corner bracket decoration ─────────────────────────────
function Corner({ pos }: { pos: 'tl' | 'tr' | 'bl' | 'br' }) {
  const base = 'absolute w-3 h-3 border-amber-500/60';
  const styles: Record<string, string> = {
    tl: 'top-2 left-2 border-t border-l',
    tr: 'top-2 right-2 border-t border-r',
    bl: 'bottom-2 left-2 border-b border-l',
    br: 'bottom-2 right-2 border-b border-r',
  };
  return <span className={`${base} ${styles[pos]}`} />;
}

function is3DCategory(cat: SkillCategory) {
  return /3d|animation|blender|render/i.test(cat.name);
}

export default function SkillsSection({ categories, skills }: SkillsSectionProps) {
  const { tr } = useLang();
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
            <span className="text-brand-400">// </span>{tr.skills.tag}
          </div>
          <h2 className="text-4xl md:text-5xl font-bold text-white">{tr.skills.title}</h2>
        </motion.div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 items-start">
          {categories.map((cat, gi) => {
            const catSkills = skills.filter(s => s.category_id === cat.id);
            if (catSkills.length === 0) return null;

            // ── WebGL card for 3D category ──────────────
            if (is3DCategory(cat)) {
              return (
                <motion.div
                  key={cat.id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: gi * 0.1 }}
                  className="relative rounded-2xl overflow-hidden border border-amber-500/30 bg-[#0a0a0f] shadow-[0_0_30px_rgba(245,158,11,0.08)] hover:shadow-[0_0_40px_rgba(245,158,11,0.15)] transition-shadow duration-500"
                >
                  {/* Corner brackets */}
                  <Corner pos="tl" /><Corner pos="tr" />
                  <Corner pos="bl" /><Corner pos="br" />

                  {/* Scanline overlay */}
                  <div className="pointer-events-none absolute inset-0 z-10"
                    style={{ background: 'repeating-linear-gradient(0deg,transparent,transparent 3px,rgba(0,0,0,0.08) 3px,rgba(0,0,0,0.08) 4px)' }} />

                  {/* Header HUD bar */}
                  <div className="relative z-20 flex items-center justify-between px-4 py-2 border-b border-amber-500/20 bg-amber-500/5">
                    <div className="flex items-center gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-pulse" />
                      <span className="text-[10px] font-mono text-amber-400/80 uppercase tracking-widest">3D_MODULE</span>
                    </div>
                    <span className="text-[10px] font-mono text-cyan-400/60">SYS:ACTIVE</span>
                  </div>

                  {/* WebGL canvas */}
                  <div className="relative z-0 h-52 w-full">
                    <SkillsWebGLCanvas />
                  </div>

                  {/* Category title */}
                  <div className="relative z-20 px-4 pt-3 pb-1 border-t border-amber-500/15">
                    <div className="flex items-center gap-2 mb-3">
                      <div className={`h-1 w-8 rounded-full bg-gradient-to-r ${cat.color}`} />
                      <h3 className="text-sm font-semibold text-white">{cat.name}</h3>
                    </div>

                    {/* HUD skill bars */}
                    <div className="space-y-2.5 pb-4">
                      {catSkills.map((skill, si) => (
                        <HUDBadge
                          key={skill.id}
                          name={skill.name}
                          level={skill.level}
                          index={si}
                          label={tr.skills.tiers[getTier(skill.level)]}
                        />
                      ))}
                    </div>
                  </div>
                </motion.div>
              );
            }

            // ── Regular card ─────────────────────────────
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
                    <SkillBadge
                      key={skill.id}
                      name={skill.name}
                      level={skill.level}
                      index={si}
                      label={tr.skills.tiers[getTier(skill.level)]}
                    />
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
              {tr.skills.tiers[tier]}
            </span>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
