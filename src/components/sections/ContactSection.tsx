'use client';

import { motion } from 'framer-motion';
import { Mail, Phone, Globe, AtSign, MapPin, Send } from 'lucide-react';
import type { Profile } from '@/types';

interface ContactSectionProps {
  profile: Profile | null;
}

export default function ContactSection({ profile }: ContactSectionProps) {
  const email = profile?.email ?? 'eganeue@gmail.com';
  const phone = profile?.phone ?? '+62 812-9314-8932';
  const linkedinUrl = profile?.linkedin_url ?? 'https://linkedin.com/in/ega-nugraha';
  const instagramUrl = profile?.instagram_url ?? 'https://instagram.com/eganugraha08';

  const contacts = [
    { icon: Mail, label: 'Email', value: email, href: `mailto:${email}` },
    { icon: Phone, label: 'Phone', value: phone, href: `tel:${phone.replace(/\D/g, '')}` },
    { icon: Globe, label: 'LinkedIn', value: linkedinUrl.replace('https://', ''), href: linkedinUrl },
    { icon: AtSign, label: 'Instagram', value: '@' + (instagramUrl.split('/').pop() ?? ''), href: instagramUrl },
    { icon: MapPin, label: 'Location', value: 'Indonesia', href: null },
  ];

  return (
    <section id="contact" className="relative py-32 px-6 overflow-hidden">
      <div className="glow-orb w-[400px] h-[400px] bg-brand-600/10 bottom-0 left-1/2 -translate-x-1/2" />

      <div className="max-w-4xl mx-auto relative z-10 text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-16"
        >
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/5 border border-white/10 text-dark-400 text-sm font-mono mb-6">
            <span className="text-brand-400">// </span>get_in_touch
          </div>
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">Let&apos;s Work Together</h2>
          <p className="text-dark-400 text-lg max-w-xl mx-auto leading-relaxed">
            I&apos;m open to freelance projects, collaborations, and full-time opportunities. Don&apos;t hesitate to reach out!
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.2 }}
          className="grid sm:grid-cols-2 gap-4 mb-10"
        >
          {contacts.map(({ icon: Icon, label, value, href }) => (
            <div key={label} className="flex items-center gap-4 p-4 rounded-2xl bg-white/5 border border-white/10 hover:bg-white/8 hover:border-white/20 transition-all duration-300 text-left">
              <div className="w-10 h-10 rounded-xl bg-brand-500/10 border border-brand-500/20 flex items-center justify-center shrink-0">
                <Icon size={18} className="text-brand-400" />
              </div>
              <div className="min-w-0">
                <p className="text-dark-500 text-xs font-medium">{label}</p>
                {href ? (
                  <a href={href} target={href.startsWith('http') ? '_blank' : undefined} rel="noopener noreferrer"
                    className="text-white text-sm hover:text-brand-300 transition-colors truncate block">
                    {value}
                  </a>
                ) : (
                  <p className="text-white text-sm">{value}</p>
                )}
              </div>
            </div>
          ))}
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.3 }}
        >
          <a href={`mailto:${email}`}
            className="inline-flex items-center gap-2 px-8 py-4 bg-brand-600 hover:bg-brand-500 text-white font-medium rounded-xl transition-all duration-200 shadow-glow hover:shadow-glow-lg active:scale-95 text-base">
            <Send size={18} />
            Send me an email
          </a>
        </motion.div>
      </div>

      <div className="mt-24 pt-8 border-t border-white/10 text-center text-dark-600 text-sm">
        <p>© {new Date().getFullYear()} {profile?.name ?? 'Muhamad Ega Nugraha'}. Built with Next.js & Supabase.</p>
      </div>
    </section>
  );
}
