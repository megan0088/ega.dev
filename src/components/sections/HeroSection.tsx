'use client';

import { motion } from 'framer-motion';
import { ArrowDown, GitBranch, Globe, Mail, ExternalLink, Download, BookOpen } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import type { Profile } from '@/types';
import { useLang } from '@/lib/lang-context';

interface HeroSectionProps {
  profile: Profile | null;
}

export default function HeroSection({ profile }: HeroSectionProps) {
  const { tr, lang } = useLang();
  const isId = lang === 'id';

  const name           = profile?.name ?? 'Muhamad Ega Nugraha';
  const title          = (isId && profile?.title_id)       || profile?.title       || 'Software Engineer & SAP B1 Technical Consultant';
  const subtitle       = (isId && profile?.subtitle_id)    || profile?.subtitle    || 'Building innovative digital solutions — from full-stack web apps and Flutter mobile apps to IoT systems and enterprise SAP integrations.';
  const statusText     = (isId && profile?.status_text_id) || profile?.status_text || 'Available for opportunities';
  const techBadges     = profile?.tech_badges    ?? ['Next.js', 'Flutter', 'TypeScript', 'Supabase', 'SAP B1'];
  const avatarUrl      = profile?.avatar_url     ?? null;
  const githubUrl      = profile?.github_url     ?? 'https://github.com/megan0088';
  const linkedinUrl    = profile?.linkedin_url   ?? 'https://linkedin.com/in/ega-nugraha';
  const email          = profile?.email          ?? 'eganeue@gmail.com';
  const currentlyLearning = profile?.currently_learning ?? null;
  const cvUrl             = profile?.cv_url             ?? '/Muhamad-Ega-Nugraha-CV.pdf';

  const socialLinks = [
    { icon: GitBranch, href: githubUrl,           label: 'GitHub' },
    { icon: Globe,     href: linkedinUrl,          label: 'LinkedIn' },
    { icon: Mail,      href: `mailto:${email}`,    label: 'Email' },
  ];

  const nameParts = name.split(' ');
  const firstName = nameParts[0];
  const restName  = nameParts.slice(1).join(' ');

  const fadeUp = {
    hidden: { opacity: 0, y: 24 },
    show: (i: number) => ({
      opacity: 1,
      y: 0,
      transition: { duration: 0.5, delay: 0.1 + i * 0.08, ease: [0.22, 1, 0.36, 1] as const },
    }),
  };

  return (
    <section id="home" className="relative min-h-dvh flex items-center overflow-hidden bg-grid">
      <div className="glow-orb w-[600px] h-[600px] bg-brand-600/20 -top-32 -left-32" />

      <div className="relative z-10 max-w-6xl mx-auto px-6 py-32 w-full">
        <div className="flex flex-col-reverse md:flex-row items-center justify-between gap-12 lg:gap-16">

          {/* Left — Text */}
          <div className="flex-1 text-center md:text-left">
            <motion.div variants={fadeUp} custom={0} initial="hidden" animate="show"
              className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-sm font-medium mb-6">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
              </span>
              {statusText}
            </motion.div>

            <motion.h1 variants={fadeUp} custom={1} initial="hidden" animate="show"
              className="font-display text-5xl md:text-6xl lg:text-[5rem] font-bold text-white mb-5 leading-[1.02] tracking-tight text-balance">
              {firstName}{' '}
              <span className="gradient-text">{restName}</span>
            </motion.h1>

            <motion.p variants={fadeUp} custom={2} initial="hidden" animate="show"
              className="text-xl md:text-2xl text-dark-300 mb-4 font-medium">{title}</motion.p>
            <motion.p variants={fadeUp} custom={3} initial="hidden" animate="show"
              className="text-base text-dark-400 max-w-xl mx-auto md:mx-0 mb-8 leading-relaxed">{subtitle}</motion.p>

            <motion.div variants={fadeUp} custom={4} initial="hidden" animate="show"
              className="flex flex-wrap justify-center md:justify-start gap-2 mb-10">
              {techBadges.map((tech) => (
                <span key={tech} className="px-3 py-1 rounded-full text-xs font-mono font-medium bg-white/5 border border-white/10 text-dark-300 hover:border-brand-500/40 hover:text-brand-300 transition-colors duration-200">
                  {tech}
                </span>
              ))}
            </motion.div>

            <motion.div variants={fadeUp} custom={5} initial="hidden" animate="show"
              className="flex flex-col sm:flex-row items-center justify-center md:justify-start gap-3 mb-10">
              <Link href="#experience" className="group inline-flex items-center gap-2 px-7 py-3.5 bg-brand-600 hover:bg-brand-500 text-white font-medium rounded-xl transition-all duration-200 shadow-glow-sm hover:shadow-glow active:scale-95">
                {tr.hero.viewExperience} <ExternalLink size={16} className="transition-transform duration-200 group-hover:translate-x-0.5" />
              </Link>
              <Link href="#contact" className="inline-flex items-center gap-2 px-7 py-3.5 bg-white/5 hover:bg-white/10 text-white font-medium rounded-xl transition-all duration-200 border border-white/10 hover:border-white/20 active:scale-95">
                {tr.hero.getInTouch} <Mail size={16} />
              </Link>
              {cvUrl && (
                <a
                  href={cvUrl}
                  download
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group inline-flex items-center gap-2 px-7 py-3.5 bg-white/5 hover:bg-white/10 text-white font-medium rounded-xl transition-all duration-200 border border-white/10 hover:border-white/20 active:scale-95"
                >
                  {tr.hero.downloadCV} <Download size={16} className="transition-transform duration-200 group-hover:translate-y-0.5" />
                </a>
              )}
            </motion.div>

            <motion.div variants={fadeUp} custom={6} initial="hidden" animate="show"
              className="flex items-center justify-center md:justify-start gap-3">
              {socialLinks.map(({ icon: Icon, href, label }) => (
                <a key={label} href={href} target="_blank" rel="noopener noreferrer" aria-label={label}
                  className="p-3 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 hover:border-white/20 text-dark-400 hover:text-white transition-all duration-200 active:scale-90 hover:-translate-y-0.5">
                  <Icon size={18} />
                </a>
              ))}
            </motion.div>
          </div>

          {/* Right — Avatar */}
          <motion.div className="flex-shrink-0"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
          >
            <div className="relative animate-float">
              <div className="absolute inset-0 rounded-full bg-gradient-to-br from-brand-500 to-accent-purple scale-110 opacity-40 blur-2xl" />
              <div className="absolute inset-0 rounded-full bg-gradient-to-br from-brand-500 to-accent-purple p-[2.5px] scale-[1.04]" />
              <div className="relative w-56 h-56 md:w-72 md:h-72 rounded-full overflow-hidden border-2 border-white/10 bg-dark-800">
                <Image
                  src={avatarUrl ?? `https://github.com/megan0088.png`}
                  alt={`Foto profil ${name}`}
                  fill
                  sizes="(max-width: 768px) 224px, 288px"
                  className="object-cover"
                  priority
                />
              </div>

              {currentlyLearning && (
                <div className="absolute -bottom-3 -right-3 inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-dark-900 border border-brand-500/40 text-xs font-medium text-brand-300 whitespace-nowrap shadow-lg">
                  <BookOpen size={12} /> {currentlyLearning}
                </div>
              )}

            </div>
          </motion.div>
        </div>
      </div>

      <motion.a href="#about" aria-label="Scroll ke bawah" className="absolute bottom-10 left-1/2 -translate-x-1/2 text-dark-500 hover:text-brand-400 transition-colors"
        animate={{ y: [0, 8, 0] }} transition={{ repeat: Infinity, duration: 2 }}>
        <ArrowDown size={20} />
      </motion.a>
    </section>
  );
}
