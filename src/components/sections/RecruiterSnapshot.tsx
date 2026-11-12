'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';
import { Briefcase, Copy, Download, ExternalLink, Globe, GraduationCap, MessageCircle, Sparkles, Star, Zap } from 'lucide-react';
import type { Experience, Profile, Project, Skill } from '@/types';
import Modal from '@/components/ui/Modal';
import { useLang } from '@/lib/lang-context';
import { splitRoles, toWhatsAppNumber } from '@/lib/stack-match';

interface RecruiterSnapshotProps {
  profile: Profile | null;
  experiences: Experience[];
  projects: Project[];
  skills: Skill[];
}

const MAX_SKILLS = 8;
const MAX_PROJECTS = 3;

/**
 * Floating "For Recruiters" button + a one-screen summary.
 * Everything shown is read from the same Supabase data as the rest of the page,
 * so it never drifts out of sync with the portfolio.
 */
export default function RecruiterSnapshot({ profile, experiences, projects, skills }: RecruiterSnapshotProps) {
  const { tr, lang } = useLang();
  const [open, setOpen] = useState(false);
  const isId = lang === 'id';

  const name        = profile?.name ?? 'Muhamad Ega Nugraha';
  const title       = (isId && profile?.title_id) || profile?.title || 'Software Engineer';
  const statusText  = (isId && profile?.status_text_id) || profile?.status_text || null;
  const email       = profile?.email ?? 'eganeue@gmail.com';
  const phone       = profile?.phone ?? null;
  const linkedinUrl = profile?.linkedin_url ?? null;
  const cvUrl       = profile?.cv_url ?? '/Muhamad-Ega-Nugraha-CV.pdf';

  const roles      = splitRoles(title);
  const current    = experiences.filter(e => e.is_current && e.type !== 'competition');
  const education  = experiences.find(e => e.type === 'education' && !e.is_current) ?? experiences.find(e => e.type === 'education');
  const topSkills  = [...skills].sort((a, b) => b.level - a.level || a.sort_order - b.sort_order).slice(0, MAX_SKILLS);
  const featured   = projects.filter(p => p.is_featured);
  const highlights = (featured.length > 0 ? featured : projects).slice(0, MAX_PROJECTS);

  const copyEmail = async () => {
    try {
      await navigator.clipboard.writeText(email);
      toast.success(tr.recruiter.copied);
    } catch {
      toast.error(tr.recruiter.copyFailed);
    }
  };

  const actionClass = 'inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium border border-white/10 bg-white/5 hover:bg-white/10 hover:border-white/20 text-white transition-all duration-200 active:scale-95';

  return (
    <>
      <motion.button
        type="button"
        onClick={() => setOpen(true)}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1.2, duration: 0.4 }}
        whileHover={{ y: -2 }}
        whileTap={{ scale: 0.96 }}
        aria-haspopup="dialog"
        className="fixed bottom-5 right-5 z-30 inline-flex items-center gap-2.5 pl-3 pr-4 py-2.5 rounded-full bg-brand-600 hover:bg-brand-500 text-white shadow-glow-sm hover:shadow-glow transition-colors duration-200"
      >
        <span className="flex h-7 w-7 items-center justify-center rounded-full bg-white/20">
          <Zap size={14} />
        </span>
        <span className="flex flex-col items-start leading-tight">
          <span className="text-sm font-semibold">{tr.recruiter.button}</span>
          <span className="hidden sm:block text-[11px] opacity-80">{tr.recruiter.buttonHint}</span>
        </span>
      </motion.button>

      <Modal isOpen={open} onClose={() => setOpen(false)} title={tr.recruiter.title}>
        <div className="space-y-6">
          {/* Who */}
          <div>
            <h3 className="font-display text-2xl font-bold text-white">{name}</h3>
            {statusText && (
              <p className="mt-2 inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-medium">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
                {statusText}
              </p>
            )}
          </div>

          {/* Roles */}
          <section>
            <h4 className="flex items-center gap-2 text-xs font-mono uppercase tracking-widest text-dark-500 mb-2.5">
              <Sparkles size={13} /> {tr.recruiter.roles}
            </h4>
            <ul className="flex flex-wrap gap-2">
              {roles.map(role => (
                <li key={role} className="px-3 py-1.5 rounded-lg bg-brand-500/10 border border-brand-500/30 text-brand-300 text-sm font-medium">{role}</li>
              ))}
            </ul>
          </section>

          {/* Now + education */}
          {(current.length > 0 || education) && (
            <div className="grid sm:grid-cols-2 gap-4">
              {current.length > 0 && (
                <section>
                  <h4 className="flex items-center gap-2 text-xs font-mono uppercase tracking-widest text-dark-500 mb-2.5">
                    <Briefcase size={13} /> {tr.recruiter.now}
                  </h4>
                  <ul className="space-y-2">
                    {current.map(exp => (
                      <li key={exp.id} className="text-sm">
                        <p className="text-white font-medium">{(isId && exp.title_id) || exp.title}</p>
                        <p className="text-dark-400">{exp.company}</p>
                      </li>
                    ))}
                  </ul>
                </section>
              )}
              {education && (
                <section>
                  <h4 className="flex items-center gap-2 text-xs font-mono uppercase tracking-widest text-dark-500 mb-2.5">
                    <GraduationCap size={13} /> {tr.recruiter.education}
                  </h4>
                  <p className="text-sm text-white font-medium">{(isId && education.title_id) || education.title}</p>
                  <p className="text-sm text-dark-400">{education.company}</p>
                </section>
              )}
            </div>
          )}

          {/* Skills */}
          {topSkills.length > 0 && (
            <section>
              <h4 className="flex items-center gap-2 text-xs font-mono uppercase tracking-widest text-dark-500 mb-2.5">
                <Zap size={13} /> {tr.recruiter.topSkills}
              </h4>
              <ul className="flex flex-wrap gap-1.5">
                {topSkills.map(skill => (
                  <li key={skill.id} className="px-2.5 py-1 rounded-full bg-white/5 border border-white/10 text-dark-300 text-xs font-mono">{skill.name}</li>
                ))}
              </ul>
            </section>
          )}

          {/* Projects */}
          {highlights.length > 0 && (
            <section>
              <h4 className="flex items-center gap-2 text-xs font-mono uppercase tracking-widest text-dark-500 mb-2.5">
                <Star size={13} /> {tr.recruiter.highlights}
              </h4>
              <ul className="space-y-2">
                {highlights.map(project => {
                  const href = project.live_url ?? project.github_url;
                  return (
                    <li key={project.id} className="flex items-start justify-between gap-4 p-3 rounded-xl bg-white/5 border border-white/10">
                      <div className="min-w-0">
                        <p className="text-sm font-semibold text-white">{(isId && project.title_id) || project.title}</p>
                        <p className="text-xs text-dark-400 line-clamp-2 mt-0.5">{(isId && project.description_id) || project.description}</p>
                      </div>
                      {href && (
                        <a href={href} target="_blank" rel="noopener noreferrer"
                          className="shrink-0 inline-flex items-center gap-1 text-xs font-medium text-brand-400 hover:text-brand-300 transition-colors mt-0.5">
                          {tr.recruiter.viewProject} <ExternalLink size={12} />
                        </a>
                      )}
                    </li>
                  );
                })}
              </ul>
            </section>
          )}

          {/* Actions */}
          <div className="grid grid-cols-2 gap-2.5 pt-2 border-t border-white/10">
            {cvUrl && (
              <a href={cvUrl} download target="_blank" rel="noopener noreferrer"
                className="col-span-2 inline-flex items-center justify-center gap-2 px-4 py-3 rounded-xl text-sm font-semibold bg-brand-600 hover:bg-brand-500 text-white transition-all duration-200 active:scale-95 mt-4">
                <Download size={16} /> {tr.hero.downloadCV}
              </a>
            )}
            <button type="button" onClick={copyEmail} className={actionClass}>
              <Copy size={15} /> {tr.recruiter.copyEmail}
            </button>
            {phone && (
              <a href={`https://wa.me/${toWhatsAppNumber(phone)}`} target="_blank" rel="noopener noreferrer" className={actionClass}>
                <MessageCircle size={15} /> {tr.recruiter.whatsapp}
              </a>
            )}
            {linkedinUrl && (
              <a href={linkedinUrl} target="_blank" rel="noopener noreferrer" className={actionClass}>
                <Globe size={15} /> LinkedIn
              </a>
            )}
          </div>
        </div>
      </Modal>
    </>
  );
}
