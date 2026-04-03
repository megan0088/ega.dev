'use client';

import { motion } from 'framer-motion';
import { ArrowDown, GitBranch, Globe, Mail, ExternalLink } from 'lucide-react';
import Link from 'next/link';

const socialLinks = [
  { icon: GitBranch, href: 'https://github.com/eganugraha08', label: 'GitHub' },
  { icon: Globe, href: 'https://linkedin.com/in/ega-nugraha', label: 'LinkedIn' },
  { icon: Mail, href: 'mailto:eganeue@gmail.com', label: 'Email' },
];

const techBadges = ['Next.js', 'Flutter', 'TypeScript', 'Supabase', 'SAP B1'];

export default function HeroSection() {
  return (
    <section id="home" className="relative min-h-screen flex items-center justify-center overflow-hidden bg-grid">
      {/* Glow orbs */}
      <div className="glow-orb w-[600px] h-[600px] bg-brand-600/20 -top-32 -left-32" />
      <div className="glow-orb w-[400px] h-[400px] bg-accent-purple/10 bottom-0 right-0" />

      <div className="relative z-10 max-w-5xl mx-auto px-6 py-32 text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          {/* Status badge */}
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-sm font-medium mb-8">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
            </span>
            Available for opportunities
          </div>

          <h1 className="text-5xl md:text-7xl font-bold text-white mb-6 leading-tight tracking-tight">
            Muhamad{' '}
            <span className="bg-gradient-to-r from-brand-400 via-accent-cyan to-accent-purple bg-clip-text text-transparent">
              Ega Nugraha
            </span>
          </h1>

          <p className="text-xl md:text-2xl text-dark-400 mb-4 font-medium">
            Software Engineer & SAP B1 Technical Consultant
          </p>

          <p className="text-base text-dark-500 max-w-2xl mx-auto mb-10 leading-relaxed">
            Building innovative digital solutions — from full-stack web apps and Flutter mobile apps
            to IoT systems and enterprise SAP integrations.
          </p>

          {/* Tech badges */}
          <div className="flex flex-wrap justify-center gap-2 mb-12">
            {techBadges.map((tech) => (
              <span
                key={tech}
                className="px-3 py-1 rounded-full text-xs font-mono font-medium bg-white/5 border border-white/10 text-dark-300"
              >
                {tech}
              </span>
            ))}
          </div>

          {/* CTA buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16">
            <Link
              href="#experience"
              className="inline-flex items-center gap-2 px-7 py-3.5 bg-brand-600 hover:bg-brand-500 text-white font-medium rounded-xl transition-all duration-200 shadow-glow-sm hover:shadow-glow active:scale-95"
            >
              View Experience
              <ExternalLink size={16} />
            </Link>
            <Link
              href="#contact"
              className="inline-flex items-center gap-2 px-7 py-3.5 bg-white/5 hover:bg-white/10 text-white font-medium rounded-xl transition-all duration-200 border border-white/10 hover:border-white/20 active:scale-95"
            >
              Get in Touch
              <Mail size={16} />
            </Link>
          </div>

          {/* Social links */}
          <div className="flex items-center justify-center gap-4">
            {socialLinks.map(({ icon: Icon, href, label }) => (
              <a
                key={label}
                href={href}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={label}
                className="p-3 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 hover:border-white/20 text-dark-400 hover:text-white transition-all duration-200 active:scale-90"
              >
                <Icon size={18} />
              </a>
            ))}
          </div>
        </motion.div>

        {/* Scroll indicator */}
        <motion.div
          className="absolute bottom-10 left-1/2 -translate-x-1/2"
          animate={{ y: [0, 8, 0] }}
          transition={{ repeat: Infinity, duration: 2 }}
        >
          <ArrowDown size={20} className="text-dark-500" />
        </motion.div>
      </div>
    </section>
  );
}
