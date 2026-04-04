'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X, Code2 } from 'lucide-react';
import Link from 'next/link';
import { cn } from '@/lib/utils';
import { useLang } from '@/lib/lang-context';
import ThemeToggle from '@/components/ui/ThemeToggle';
import LangToggle from '@/components/ui/LangToggle';

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [active, setActive] = useState('');
  const { tr } = useLang();

  const navLinks = [
    { href: '#home',       label: tr.nav.home },
    { href: '#about',      label: tr.nav.about },
    { href: '#skills',     label: tr.nav.skills },
    { href: '#experience', label: tr.nav.experience },
    { href: '#projects',   label: tr.nav.projects },
    { href: '#contact',    label: tr.nav.contact },
  ];

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) setActive(`#${entry.target.id}`);
        });
      },
      { rootMargin: '-40% 0px -60% 0px' }
    );
    ['home','about','skills','experience','projects','contact'].forEach(id => {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    });
    return () => observer.disconnect();
  }, []);

  return (
    <>
      <motion.header
        className={cn(
          'fixed top-0 left-0 right-0 z-40 transition-all duration-300',
          scrolled ? 'bg-dark-950/80 backdrop-blur-xl border-b border-white/5' : 'bg-transparent'
        )}
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2 font-bold text-white">
            <div className="w-7 h-7 rounded-lg bg-brand-600 flex items-center justify-center">
              <Code2 size={14} className="text-white" />
            </div>
            <span className="font-mono text-sm">ega.dev</span>
          </Link>

          {/* Desktop nav */}
          <nav className="hidden md:flex items-center gap-1">
            {navLinks.map(({ href, label }) => (
              <a
                key={href}
                href={href}
                className={cn(
                  'px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200',
                  active === href
                    ? 'text-white bg-white/10'
                    : 'text-dark-400 hover:text-white hover:bg-white/5'
                )}
              >
                {label}
              </a>
            ))}
          </nav>

          {/* Right: lang + theme + hamburger */}
          <div className="flex items-center gap-2.5">
            <LangToggle />
            <ThemeToggle />
            <button
              className="md:hidden p-2 rounded-lg text-dark-400 hover:text-white hover:bg-white/5 transition-colors"
              onClick={() => setMobileOpen(!mobileOpen)}
              aria-label="Toggle menu"
            >
              {mobileOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
        </div>
      </motion.header>

      {/* Mobile menu */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            className="fixed inset-0 z-30 bg-dark-950/95 backdrop-blur-xl md:hidden flex flex-col items-center justify-center gap-5"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            {navLinks.map(({ href, label }, i) => (
              <motion.a
                key={href}
                href={href}
                className="text-2xl font-medium text-dark-300 hover:text-white transition-colors"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 }}
                onClick={() => setMobileOpen(false)}
              >
                {label}
              </motion.a>
            ))}
            {/* Controls in mobile menu */}
            <motion.div
              className="flex items-center gap-3 mt-4"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4 }}
            >
              <LangToggle />
              <ThemeToggle />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
