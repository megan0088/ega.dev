'use client';

import { motion } from 'framer-motion';
import { Code2, Cpu, Database, Smartphone } from 'lucide-react';

const skills = [
  {
    icon: Code2,
    title: 'Web Development',
    color: 'text-brand-400',
    bg: 'bg-brand-500/10',
    border: 'border-brand-500/20',
    items: ['Next.js', 'TypeScript', 'React', 'Tailwind CSS', 'HTML/CSS'],
  },
  {
    icon: Smartphone,
    title: 'Mobile Development',
    color: 'text-accent-purple',
    bg: 'bg-purple-500/10',
    border: 'border-purple-500/20',
    items: ['Flutter', 'Dart', 'Provider', 'GetX', 'React Native'],
  },
  {
    icon: Database,
    title: 'Backend & Database',
    color: 'text-accent-emerald',
    bg: 'bg-emerald-500/10',
    border: 'border-emerald-500/20',
    items: ['Supabase', 'Firebase', 'MySQL', 'SAP HANA', 'REST APIs'],
  },
  {
    icon: Cpu,
    title: 'Cloud & IoT',
    color: 'text-accent-cyan',
    bg: 'bg-cyan-500/10',
    border: 'border-cyan-500/20',
    items: ['MQTT', 'Blynk', 'ESP8266', 'Raspberry Pi', 'SAP B1 SDK'],
  },
];

const containerVariants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.1 } },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
};

export default function AboutSection() {
  return (
    <section id="about" className="relative py-32 px-6 overflow-hidden">
      <div className="glow-orb w-[500px] h-[500px] bg-accent-purple/10 top-0 right-0" />

      <div className="max-w-6xl mx-auto relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="mb-16"
        >
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/5 border border-white/10 text-dark-400 text-sm font-mono mb-6">
            <span className="text-brand-400">// </span>about_me
          </div>
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
            Who I Am
          </h2>
          <div className="grid md:grid-cols-2 gap-8">
            <p className="text-dark-400 text-lg leading-relaxed">
              A passionate software engineer with a Diploma in Computer Engineering from IPB University.
              I specialize in building full-stack web apps, cross-platform mobile apps, and enterprise
              SAP B1 integrations.
            </p>
            <div className="flex flex-col gap-3">
              <p className="text-dark-400 text-lg leading-relaxed">
                Currently working as a SAP B1 Technical Consultant at Soltius Indonesia — developing
                custom Add-ons, optimizing stored procedures, and integrating SAP with AI systems.
              </p>
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-brand-500/10 border border-brand-500/30 text-brand-300 text-sm font-medium w-fit">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-brand-400 opacity-75" />
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-brand-500" />
                </span>
                Currently Learning at Apple Developer Academy Binus — Cohort 9
              </div>
            </div>
          </div>
        </motion.div>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4"
        >
          {skills.map((skill) => (
            <motion.div
              key={skill.title}
              variants={itemVariants}
              className={`p-6 rounded-2xl bg-white/5 border ${skill.border} hover:bg-white/8 transition-all duration-300 group`}
            >
              <div className={`w-10 h-10 rounded-xl ${skill.bg} flex items-center justify-center mb-4`}>
                <skill.icon size={20} className={skill.color} />
              </div>
              <h3 className="font-semibold text-white mb-3 text-sm">{skill.title}</h3>
              <ul className="space-y-1">
                {skill.items.map((item) => (
                  <li key={item} className="text-dark-400 text-xs font-mono">
                    {item}
                  </li>
                ))}
              </ul>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
