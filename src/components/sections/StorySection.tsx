'use client';

import { useState } from 'react';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import { Cpu, Building2, Apple, Rocket } from 'lucide-react';
import { useLang } from '@/lib/lang-context';

// Icons line up with tr.story.chapters by index. The copy itself lives in
// src/lib/translations.ts (story.chapters) — edit it there.
const chapterIcons = [Cpu, Building2, Apple, Rocket];

export default function StorySection() {
  const { tr } = useLang();
  const [active, setActive] = useState(0);
  const chapters = tr.story.chapters;
  const progress = (active + 1) / chapters.length;

  return (
    <section id="story" className="relative py-32 px-6">
      <div className="max-w-6xl mx-auto relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-16"
        >
          <span className="section-label mb-5">02 // {tr.story.tag}</span>
          <h2 className="font-display text-4xl md:text-5xl font-bold text-white tracking-tight">{tr.story.title}</h2>
          <p className="text-dark-400 text-lg mt-4 max-w-2xl leading-relaxed">{tr.story.intro}</p>
        </motion.div>

        <div className="grid md:grid-cols-[minmax(0,340px)_1fr] gap-10 lg:gap-20 items-start">
          {/* Portrait — stays in view while the chapters scroll past */}
          <div className="md:sticky md:top-28">
            <div className="relative mx-auto max-w-[300px] md:max-w-none pt-10">
              {/* Backdrop card; the cut-out portrait overlaps its top edge */}
              <div className="absolute inset-x-0 bottom-0 top-[26%] rounded-3xl bg-[#12305f] border border-white/10" />
              <Image
                src="/ega-portrait.png"
                alt="Muhamad Ega Nugraha"
                width={789}
                height={930}
                sizes="(max-width: 768px) 300px, 340px"
                className="relative w-full h-auto rounded-b-3xl"
              />
              <div className="absolute inset-x-3 bottom-3 rounded-2xl bg-dark-950/80 backdrop-blur-md border border-white/10 px-4 py-3">
                <div className="flex items-center justify-between text-[11px] font-mono text-dark-400 mb-1.5">
                  <span>{tr.story.chapterLabel} {String(active + 1).padStart(2, '0')} / {String(chapters.length).padStart(2, '0')}</span>
                  <span className="text-brand-300">{chapters[active].period}</span>
                </div>
                <AnimatePresence mode="wait">
                  <motion.p
                    key={active}
                    initial={{ opacity: 0, y: 6 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -6 }}
                    transition={{ duration: 0.2 }}
                    className="text-sm font-semibold text-white"
                  >
                    {chapters[active].title}
                  </motion.p>
                </AnimatePresence>
                <div className="mt-2.5 h-[3px] rounded-full bg-white/10 overflow-hidden">
                  <motion.div
                    className="h-full origin-left rounded-full bg-gradient-to-r from-brand-500 to-accent-cyan"
                    animate={{ scaleX: progress }}
                    initial={false}
                    transition={{ type: 'spring', stiffness: 200, damping: 30 }}
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Chapters */}
          <ol className="relative">
            <div className="absolute left-5 top-2 bottom-2 w-px bg-white/10" aria-hidden="true" />
            {chapters.map((chapter, i) => {
              const Icon = chapterIcons[i % chapterIcons.length];
              const isActive = i === active;
              return (
                <motion.li
                  key={chapter.title}
                  // A chapter becomes active when it crosses the middle band of the viewport.
                  onViewportEnter={() => setActive(i)}
                  viewport={{ margin: '-45% 0px -45% 0px' }}
                  animate={{ opacity: isActive ? 1 : 0.4 }}
                  transition={{ duration: 0.3 }}
                  className="relative flex gap-6 pb-14 last:pb-0 md:min-h-[42vh] last:md:min-h-0"
                >
                  <button
                    type="button"
                    onClick={() => setActive(i)}
                    aria-label={chapter.title}
                    aria-current={isActive ? 'step' : undefined}
                    className={`relative z-10 flex h-10 w-10 shrink-0 items-center justify-center rounded-full border transition-colors duration-300
                      ${isActive ? 'bg-brand-600 border-brand-500 text-white' : 'bg-dark-900 border-white/10 text-dark-400 hover:text-white'}`}
                  >
                    <Icon size={16} />
                  </button>
                  <div className="pt-1">
                    <p className="text-xs font-mono uppercase tracking-widest text-brand-400 mb-2">{chapter.period}</p>
                    <h3 className="font-display text-2xl font-bold text-white mb-3 tracking-tight">{chapter.title}</h3>
                    <p className="text-dark-400 text-base leading-relaxed max-w-xl">{chapter.body}</p>
                    <p className="mt-4 inline-block rounded-xl border border-white/10 bg-white/5 px-4 py-2.5 text-sm text-dark-300">
                      <span className="text-brand-400 font-medium">{tr.story.lessonLabel}</span> {chapter.lesson}
                    </p>
                  </div>
                </motion.li>
              );
            })}
          </ol>
        </div>
      </div>
    </section>
  );
}
