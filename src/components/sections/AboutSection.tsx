'use client';

import { useState } from 'react';
import dynamic from 'next/dynamic';
import { motion, AnimatePresence } from 'framer-motion';
import { Code2, Cpu, Database, Smartphone, Box, GitBranch, ExternalLink, ChevronRight } from 'lucide-react';
import Image from 'next/image';
import type { Profile, Project } from '@/types';
import { useLang } from '@/lib/lang-context';

const SkillsWebGLCanvas = dynamic(() => import('@/components/ui/SkillsWebGLCanvas'), { ssr: false });

interface AboutSectionProps {
  profile: Profile | null;
  projects: Project[];
}

const stacks = [
  {
    id: 'web' as const,
    icon: Code2,
    keywords: ['next', 'react', 'typescript', 'javascript', 'tailwind', 'html', 'css', 'vue', 'nuxt', 'gatsby', 'web'],
    items: ['Next.js', 'TypeScript', 'React', 'Tailwind CSS', 'HTML/CSS'],
    glowColor: 'bg-brand-600/20',
    tabInactive: 'border-white/10 text-dark-400 hover:border-brand-500/50 hover:bg-brand-500/5 hover:text-brand-300',
    tabActive: 'border-brand-500 bg-brand-500/15 text-brand-300 shadow-[0_0_20px_rgba(99,102,241,0.15)]',
    iconBg: 'bg-brand-500/15', iconColor: 'text-brand-400', accent: 'text-brand-300', dot: 'bg-brand-500',
    cardBorder: 'border-brand-500/20', cardBg: 'bg-brand-500/5', projectBadge: 'bg-brand-500/10 border-brand-500/20 text-brand-300', itemColor: 'text-brand-400',
  },
  {
    id: 'mobile' as const,
    icon: Smartphone,
    keywords: ['flutter', 'dart', 'react native', 'swift', 'kotlin', 'ios', 'android', 'mobile', 'swiftui'],
    items: ['Flutter / Dart', 'Provider / GetX', 'React Native', 'Swift (iOS)', 'Firebase SDK'],
    glowColor: 'bg-sky-500/20',
    tabInactive: 'border-white/10 text-dark-400 hover:border-sky-400/50 hover:bg-sky-500/5 hover:text-sky-300',
    tabActive: 'border-sky-400 bg-sky-500/15 text-sky-300 shadow-[0_0_20px_rgba(56,189,248,0.15)]',
    iconBg: 'bg-sky-500/15', iconColor: 'text-sky-400', accent: 'text-sky-300', dot: 'bg-sky-400',
    cardBorder: 'border-sky-500/20', cardBg: 'bg-sky-500/5', projectBadge: 'bg-sky-500/10 border-sky-500/20 text-sky-300', itemColor: 'text-sky-400',
  },
  {
    id: 'backend' as const,
    icon: Database,
    keywords: ['supabase', 'firebase', 'mysql', 'postgresql', 'mongodb', 'node', 'express', 'rest', 'api', 'hana', 'sap', 'python', 'laravel', 'backend', 'database', 'server'],
    items: ['Supabase / PostgreSQL', 'Firebase', 'MySQL / SAP HANA', 'REST APIs', 'SAP B1 SDK'],
    glowColor: 'bg-emerald-600/20',
    tabInactive: 'border-white/10 text-dark-400 hover:border-emerald-500/50 hover:bg-emerald-500/5 hover:text-emerald-300',
    tabActive: 'border-emerald-500 bg-emerald-500/15 text-emerald-300 shadow-[0_0_20px_rgba(16,185,129,0.15)]',
    iconBg: 'bg-emerald-500/15', iconColor: 'text-emerald-400', accent: 'text-emerald-300', dot: 'bg-emerald-500',
    cardBorder: 'border-emerald-500/20', cardBg: 'bg-emerald-500/5', projectBadge: 'bg-emerald-500/10 border-emerald-500/20 text-emerald-300', itemColor: 'text-emerald-400',
  },
  {
    id: 'iot' as const,
    icon: Cpu,
    keywords: ['mqtt', 'blynk', 'esp8266', 'esp32', 'raspberry', 'iot', 'aws', 'gcp', 'azure', 'docker', 'c#', '.net', 'embedded', 'hardware', 'arduino'],
    items: ['MQTT / Blynk', 'ESP8266 / ESP32', 'Raspberry Pi', 'C# / .NET', 'SAP B1 Integration'],
    glowColor: 'bg-cyan-600/20',
    tabInactive: 'border-white/10 text-dark-400 hover:border-cyan-400/50 hover:bg-cyan-500/5 hover:text-cyan-300',
    tabActive: 'border-cyan-400 bg-cyan-500/15 text-cyan-300 shadow-[0_0_20px_rgba(34,211,238,0.15)]',
    iconBg: 'bg-cyan-500/15', iconColor: 'text-cyan-400', accent: 'text-cyan-300', dot: 'bg-cyan-400',
    cardBorder: 'border-cyan-500/20', cardBg: 'bg-cyan-500/5', projectBadge: 'bg-cyan-500/10 border-cyan-500/20 text-cyan-300', itemColor: 'text-cyan-400',
  },
  {
    id: '3d' as const,
    icon: Box,
    keywords: ['blender', '3d', 'rigging', 'sculpt', 'animation', 'modeling', 'render', 'vfx', 'motion'],
    items: ['3D Sculpting', 'Character Rigging', 'Keyframe Animation', 'UV Mapping & Texturing', 'Rendering & Lighting'],
    glowColor: 'bg-orange-500/20',
    tabInactive: 'border-white/10 text-dark-400 hover:border-orange-400/50 hover:bg-orange-500/5 hover:text-orange-300',
    tabActive: 'border-orange-400 bg-orange-500/15 text-orange-300 shadow-[0_0_20px_rgba(251,146,60,0.15)]',
    iconBg: 'bg-orange-500/15', iconColor: 'text-orange-400', accent: 'text-orange-300', dot: 'bg-orange-400',
    cardBorder: 'border-orange-500/20', cardBg: 'bg-orange-500/5', projectBadge: 'bg-orange-500/10 border-orange-500/20 text-orange-300', itemColor: 'text-orange-400',
  },
] as const;

type StackId = typeof stacks[number]['id'];

function getRelatedProjects(projects: Project[], keywords: readonly string[]): Project[] {
  return projects.filter(p =>
    p.tech_stack.some(tech =>
      keywords.some(kw => tech.toLowerCase().includes(kw.toLowerCase()))
    )
  );
}

function MiniProjectCard({ project, stack, index, isId }: { project: Project; stack: typeof stacks[number]; index: number; isId: boolean }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -8 }}
      transition={{ delay: index * 0.07, duration: 0.3 }}
      className={`flex gap-4 p-4 rounded-xl border ${stack.cardBorder} ${stack.cardBg} transition-all`}
    >
      {project.image_url && (
        <div className="relative w-16 h-16 rounded-lg overflow-hidden shrink-0 bg-dark-800">
          <Image src={project.image_url} alt={project.title} fill className="object-cover" />
        </div>
      )}
      <div className="flex-1 min-w-0">
        <div className="flex items-start justify-between gap-2 mb-1">
          <h4 className="text-sm font-semibold text-white truncate">{(isId && project.title_id) || project.title}</h4>
          <div className="flex items-center gap-2 shrink-0">
            {project.github_url && (
              <a href={project.github_url} target="_blank" rel="noopener noreferrer"
                className="text-dark-500 hover:text-white transition-colors"><GitBranch size={13} /></a>
            )}
            {project.live_url && (
              <a href={project.live_url} target="_blank" rel="noopener noreferrer"
                className={`transition-colors hover:opacity-80 ${stack.itemColor}`}><ExternalLink size={13} /></a>
            )}
          </div>
        </div>
        <p className="text-dark-500 text-xs leading-relaxed line-clamp-2 mb-2">{(isId && project.description_id) || project.description}</p>
        <div className="flex flex-wrap gap-1">
          {project.tech_stack.slice(0, 4).map(tech => (
            <span key={tech} className={`text-[10px] px-2 py-0.5 rounded-full border font-mono ${stack.projectBadge}`}>{tech}</span>
          ))}
        </div>
      </div>
    </motion.div>
  );
}

export default function AboutSection({ profile, projects }: AboutSectionProps) {
  const { tr, lang } = useLang();
  const [activeId, setActiveId] = useState<StackId>('web');
  const isId = lang === 'id';

  const bio = (isId && profile?.bio_id) || profile?.bio || 'A passionate software engineer with a Diploma in Computer Engineering from IPB University. I specialize in building full-stack web apps, cross-platform mobile apps, and enterprise SAP B1 integrations.';
  const bio2 = (isId && profile?.bio2_id) || profile?.bio2 || 'Currently working as a SAP B1 Technical Consultant at Soltius Indonesia — developing custom Add-ons, optimizing stored procedures, and integrating SAP with AI systems.';
  const currentlyLearning = profile?.currently_learning ?? null;

  const activeStack = stacks.find(s => s.id === activeId)!;
  const relatedProjects = getRelatedProjects(projects, activeStack.keywords);
  const stackLabel = tr.about.stacks[activeId];

  return (
    <section id="about" className="relative py-32 px-6 overflow-hidden">
      {/* Dynamic glow orb */}
      <AnimatePresence mode="wait">
        <motion.div
          key={activeId}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.5 }}
          className={`glow-orb w-[600px] h-[600px] ${activeStack.glowColor} top-0 right-0`}
        />
      </AnimatePresence>

      <div className="max-w-6xl mx-auto relative z-10">
        {/* Bio */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="mb-16"
        >
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/5 border border-white/10 text-dark-400 text-sm font-mono mb-6">
            <span className="text-brand-400">// </span>{tr.about.tag}
          </div>
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">{tr.about.title}</h2>
          <div className="grid md:grid-cols-2 gap-8">
            <p className="text-dark-400 text-lg leading-relaxed">{bio}</p>
            <div className="flex flex-col gap-3">
              <p className="text-dark-400 text-lg leading-relaxed">{bio2}</p>
              {currentlyLearning && (
                <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-brand-500/10 border border-brand-500/30 text-brand-300 text-sm font-medium w-fit">
                  <span className="relative flex h-2 w-2">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-brand-400 opacity-75" />
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-brand-500" />
                  </span>
                  {tr.hero.currentlyLearning} — {currentlyLearning}
                </div>
              )}
            </div>
          </div>
        </motion.div>

        {/* Stack Tabs */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-4"
        >
          <p className="text-dark-500 text-xs font-mono mb-4 uppercase tracking-widest">{tr.about.selectStack}</p>
          <div className="grid sm:grid-cols-2 lg:grid-cols-5 gap-3">
            {stacks.map((stack) => {
              const isActive = activeId === stack.id;
              const label = tr.about.stacks[stack.id];
              const related = getRelatedProjects(projects, stack.keywords);
              return (
                <button
                  key={stack.id}
                  onClick={() => setActiveId(stack.id)}
                  className={`relative text-left p-5 rounded-2xl border transition-all duration-300 ${isActive ? stack.tabActive : stack.tabInactive}`}
                >
                  {isActive && (
                    <motion.div layoutId="active-tab-indicator"
                      className={`absolute top-3 right-3 w-2 h-2 rounded-full ${stack.dot}`} />
                  )}
                  <div className={`w-10 h-10 rounded-xl ${stack.iconBg} flex items-center justify-center mb-3`}>
                    <stack.icon size={18} className={stack.iconColor} />
                  </div>
                  <h3 className="font-semibold text-white text-sm mb-1 leading-tight">{label.title}</h3>
                  <p className="text-dark-600 text-xs mb-3 leading-relaxed">{label.subtitle}</p>
                  <div className="flex items-center justify-between">
                    <span className={`text-xs font-mono ${isActive ? stack.accent : 'text-dark-600'} transition-colors`}>
                      {tr.about.projectCount(related.length)}
                    </span>
                    <ChevronRight size={13} className={`transition-all duration-300 ${isActive ? `${stack.accent} translate-x-0.5` : 'text-dark-700'}`} />
                  </div>
                </button>
              );
            })}
          </div>
        </motion.div>

        {/* Active detail panel */}
        <AnimatePresence mode="wait">
          <motion.div
            key={activeId}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.3 }}
            className={`rounded-2xl border ${activeStack.cardBorder} overflow-hidden`}
          >
            <div className="grid md:grid-cols-[280px_1fr] divide-y md:divide-y-0 md:divide-x divide-white/5">

              {/* Left panel — WebGL for 3D, normal list otherwise */}
              {activeId === '3d' ? (
                <div className="relative bg-[#0a0a0f] overflow-hidden">
                  {/* Corner brackets */}
                  {(['tl','tr','bl','br'] as const).map(pos => {
                    const base = 'absolute w-3 h-3 border-amber-500/50 z-20';
                    const s: Record<string,string> = { tl:'top-2 left-2 border-t border-l', tr:'top-2 right-2 border-t border-r', bl:'bottom-2 left-2 border-b border-l', br:'bottom-2 right-2 border-b border-r' };
                    return <span key={pos} className={`${base} ${s[pos]}`} />;
                  })}

                  {/* Scanline overlay */}
                  <div className="pointer-events-none absolute inset-0 z-10"
                    style={{ background: 'repeating-linear-gradient(0deg,transparent,transparent 3px,rgba(0,0,0,0.07) 3px,rgba(0,0,0,0.07) 4px)' }} />

                  {/* HUD header */}
                  <div className="relative z-20 flex items-center justify-between px-4 py-2 border-b border-amber-500/20 bg-amber-500/5">
                    <div className="flex items-center gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-pulse" />
                      <span className="text-[10px] font-mono text-amber-400/80 uppercase tracking-widest">3D_MODULE</span>
                    </div>
                    <span className="text-[10px] font-mono text-cyan-400/60">SYS:ACTIVE</span>
                  </div>

                  {/* WebGL canvas */}
                  <div className="relative z-0 h-48 w-full">
                    <SkillsWebGLCanvas />
                  </div>

                  {/* HUD skill bars */}
                  <div className="relative z-20 px-4 py-4 border-t border-amber-500/15 space-y-2.5">
                    {activeStack.items.map((item, i) => (
                      <motion.div
                        key={item}
                        initial={{ opacity: 0, x: -8 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: i * 0.07 }}
                      >
                        <div className="flex items-center justify-between mb-0.5">
                          <span className="text-[11px] font-mono text-amber-300/80 uppercase tracking-wider">{item}</span>
                          <span className="text-[10px] font-mono text-cyan-400/60">100%</span>
                        </div>
                        <div className="h-[3px] w-full rounded-full bg-white/5 overflow-hidden">
                          <motion.div
                            className="h-full rounded-full bg-amber-400"
                            initial={{ width: 0 }}
                            animate={{ width: '100%' }}
                            transition={{ duration: 0.8, delay: i * 0.07 + 0.2, ease: 'easeOut' }}
                          />
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </div>
              ) : (
                <div className={`p-6 ${activeStack.cardBg}`}>
                  <div className="flex items-center gap-2 mb-5">
                    <div className={`w-8 h-8 rounded-lg ${activeStack.iconBg} flex items-center justify-center`}>
                      <activeStack.icon size={15} className={activeStack.iconColor} />
                    </div>
                    <h3 className={`text-sm font-semibold ${activeStack.accent}`}>{stackLabel.title}</h3>
                  </div>
                  <ul className="space-y-3">
                    {activeStack.items.map((item, i) => (
                      <motion.li
                        key={item}
                        initial={{ opacity: 0, x: -8 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: i * 0.06 }}
                        className="flex items-center gap-2.5"
                      >
                        <span className={`w-1.5 h-1.5 rounded-full shrink-0 ${activeStack.dot}`} />
                        <span className="text-sm text-dark-300 font-mono">{item}</span>
                      </motion.li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Related projects */}
              <div className="p-6">
                <p className="text-xs font-mono text-dark-600 uppercase tracking-widest mb-4">
                  {tr.about.relatedProjects}
                </p>
                {relatedProjects.length === 0 ? (
                  <div className="flex flex-col items-center justify-center py-10 text-dark-600 text-sm">
                    <span className="text-2xl mb-2">🔨</span>
                    {tr.about.buildingHere}
                  </div>
                ) : (
                  <div className="grid sm:grid-cols-2 gap-3">
                    <AnimatePresence>
                      {relatedProjects.map((project, i) => (
                        <MiniProjectCard key={project.id} project={project} stack={activeStack} index={i} isId={isId} />
                      ))}
                    </AnimatePresence>
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>
    </section>
  );
}
