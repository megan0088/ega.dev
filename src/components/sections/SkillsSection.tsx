'use client';

import { motion } from 'framer-motion';

const skillGroups = [
  {
    category: 'Languages',
    color: 'from-brand-500 to-brand-400',
    glow: 'shadow-glow-sm',
    skills: [
      { name: 'TypeScript / JavaScript', level: 85 },
      { name: 'Dart (Flutter)', level: 85 },
      { name: 'C# (.NET / SAP SDK)', level: 70 },
      { name: 'C / C++', level: 60 },
      { name: 'Swift (iOS)', level: 40 },
    ],
  },
  {
    category: 'Frontend & Mobile',
    color: 'from-accent-purple to-purple-400',
    glow: '',
    skills: [
      { name: 'Next.js / React', level: 85 },
      { name: 'Flutter', level: 85 },
      { name: 'Tailwind CSS', level: 90 },
      { name: 'Framer Motion', level: 75 },
      { name: 'React Native', level: 55 },
    ],
  },
  {
    category: 'Backend & Database',
    color: 'from-accent-emerald to-emerald-400',
    glow: '',
    skills: [
      { name: 'Supabase / PostgreSQL', level: 80 },
      { name: 'Firebase', level: 75 },
      { name: 'MySQL', level: 75 },
      { name: 'SAP HANA', level: 65 },
      { name: 'REST APIs', level: 85 },
    ],
  },
  {
    category: 'Tools & Others',
    color: 'from-accent-cyan to-cyan-400',
    glow: '',
    skills: [
      { name: 'Git & GitHub', level: 85 },
      { name: 'Figma', level: 70 },
      { name: 'Postman', level: 80 },
      { name: 'IoT (MQTT / ESP8266)', level: 70 },
      { name: 'SAP Business One', level: 75 },
    ],
  },
];

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

export default function SkillsSection() {
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
          <h2 className="text-4xl md:text-5xl font-bold text-white">
            What I Work With
          </h2>
        </motion.div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {skillGroups.map((group, gi) => (
            <motion.div
              key={group.category}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: gi * 0.1 }}
              className="p-6 rounded-2xl bg-white/5 border border-white/10 hover:bg-white/8 hover:border-white/15 transition-all duration-300"
            >
              <div className="flex items-center gap-2 mb-6">
                <div className={`h-1 w-8 rounded-full bg-gradient-to-r ${group.color}`} />
                <h3 className="text-sm font-semibold text-white">{group.category}</h3>
              </div>
              <div className="space-y-4">
                {group.skills.map((skill, si) => (
                  <SkillBar
                    key={skill.name}
                    name={skill.name}
                    level={skill.level}
                    color={group.color}
                    index={si}
                  />
                ))}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
