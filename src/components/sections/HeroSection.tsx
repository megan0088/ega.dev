'use client';

import { motion } from 'framer-motion';
import { ArrowDown, GitBranch, Globe, Mail, ExternalLink } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import type { Profile } from '@/types';
import { useLang } from '@/lib/lang-context';

interface HeroSectionProps {
  profile: Profile | null;
}

export default function HeroSection({ profile }: HeroSectionProps) {
  const { tr } = useLang();

  const name           = profile?.name           ?? 'Muhamad Ega Nugraha';
  const title          = profile?.title          ?? 'Software Engineer & SAP B1 Technical Consultant';
  const subtitle       = profile?.subtitle       ?? 'Building innovative digital solutions — from full-stack web apps and Flutter mobile apps to IoT systems and enterprise SAP integrations.';
  const statusText     = profile?.status_text    ?? 'Available for opportunities';
  const techBadges     = profile?.tech_badges    ?? ['Next.js', 'Flutter', 'TypeScript', 'Supabase', 'SAP B1'];
  const avatarUrl      = profile?.avatar_url     ?? null;
  const githubUrl      = profile?.github_url     ?? 'https://github.com/megan0088';
  const linkedinUrl    = profile?.linkedin_url   ?? 'https://linkedin.com/in/ega-nugraha';
  const email          = profile?.email          ?? 'eganeue@gmail.com';
  const currentlyLearning = profile?.currently_learning ?? null;

  const socialLinks = [
    { icon: GitBranch, href: githubUrl,           label: 'GitHub' },
    { icon: Globe,     href: linkedinUrl,          label: 'LinkedIn' },
    { icon: Mail,      href: `mailto:${email}`,    label: 'Email' },
  ];

  const nameParts = name.split(' ');
  const firstName = nameParts[0];
  const restName  = nameParts.slice(1).join(' ');

  return (
    <section id="home" className="relative min-h-screen flex items-center overflow-hidden bg-grid">
      <div className="glow-orb w-[600px] h-[600px] bg-brand-600/20 -top-32 -left-32" />
      <div className="glow-orb w-[400px] h-[400px] bg-accent-purple/10 bottom-0 right-0" />

      <div className="relative z-10 max-w-6xl mx-auto px-6 py-32 w-full">
        <div className="flex flex-col-reverse md:flex-row items-center justify-between gap-12">

          {/* Left — Text */}
          <motion.div
            className="flex-1 text-center md:text-left"
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-sm font-medium mb-6">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
              </span>
              {statusText}
            </div>

            <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold text-white mb-4 leading-tight tracking-tight">
              {firstName}{' '}
              <span className="bg-gradient-to-r from-brand-400 via-accent-cyan to-accent-purple bg-clip-text text-transparent">
                {restName}
              </span>
            </h1>

            <p className="text-xl md:text-2xl text-dark-400 mb-4 font-medium">{title}</p>
            <p className="text-base text-dark-500 max-w-xl mb-8 leading-relaxed">{subtitle}</p>

            <div className="flex flex-wrap justify-center md:justify-start gap-2 mb-10">
              {techBadges.map((tech) => (
                <span key={tech} className="px-3 py-1 rounded-full text-xs font-mono font-medium bg-white/5 border border-white/10 text-dark-300">
                  {tech}
                </span>
              ))}
            </div>

            <div className="flex flex-col sm:flex-row items-center justify-center md:justify-start gap-4 mb-10">
              <Link href="#experience" className="inline-flex items-center gap-2 px-7 py-3.5 bg-brand-600 hover:bg-brand-500 text-white font-medium rounded-xl transition-all duration-200 shadow-glow-sm hover:shadow-glow active:scale-95">
                {tr.hero.viewExperience} <ExternalLink size={16} />
              </Link>
              <Link href="#contact" className="inline-flex items-center gap-2 px-7 py-3.5 bg-white/5 hover:bg-white/10 text-white font-medium rounded-xl transition-all duration-200 border border-white/10 hover:border-white/20 active:scale-95">
                {tr.hero.getInTouch} <Mail size={16} />
              </Link>
            </div>

            <div className="flex items-center justify-center md:justify-start gap-3">
              {socialLinks.map(({ icon: Icon, href, label }) => (
                <a key={label} href={href} target="_blank" rel="noopener noreferrer" aria-label={label}
                  className="p-3 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 hover:border-white/20 text-dark-400 hover:text-white transition-all duration-200 active:scale-90">
                  <Icon size={18} />
                </a>
              ))}
            </div>
          </motion.div>

          {/* Right — Avatar */}
          <motion.div className="flex-shrink-0"
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <div className="relative">
              <div className="absolute inset-0 rounded-full bg-gradient-to-br from-brand-500 via-accent-cyan to-accent-purple p-[2px] scale-105 opacity-60 blur-sm" />
              <div className="absolute inset-0 rounded-full bg-gradient-to-br from-brand-500 via-accent-cyan to-accent-purple p-[2px] scale-105" />
              <div className="relative w-56 h-56 md:w-72 md:h-72 rounded-full overflow-hidden border-2 border-white/10 bg-dark-800">
                <Image
                  src={avatarUrl ?? `https://github.com/megan0088.png`}
                  alt={name}
                  fill
                  className="object-cover"
                  priority
                />
              </div>

              {currentlyLearning && (
                <motion.div
                  className="absolute -bottom-3 -right-3 px-3 py-1.5 rounded-full bg-dark-900 border border-brand-500/40 text-xs font-medium text-brand-300 whitespace-nowrap shadow-lg"
                  animate={{ y: [0, -4, 0] }}
                  transition={{ repeat: Infinity, duration: 3 }}
                >
                  🍎 {currentlyLearning}
                </motion.div>
              )}

              <motion.div
                className="absolute -top-3 -left-3 px-3 py-1.5 rounded-full bg-dark-900 border border-white/10 text-xs font-medium text-dark-300 whitespace-nowrap shadow-lg"
                animate={{ y: [0, 4, 0] }}
                transition={{ repeat: Infinity, duration: 3.5, delay: 0.5 }}
              >
                💼 SAP B1 Consultant
              </motion.div>
            </div>
          </motion.div>
        </div>
      </div>

      <motion.div className="absolute bottom-10 left-1/2 -translate-x-1/2"
        animate={{ y: [0, 8, 0] }} transition={{ repeat: Infinity, duration: 2 }}>
        <ArrowDown size={20} className="text-dark-500" />
      </motion.div>
    </section>
  );
}
