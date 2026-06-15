export const revalidate = 0;

import type { Metadata } from 'next';
import { createClient } from '@/lib/supabase/server';
import type { Profile, Experience, Skill, SkillCategory } from '@/types';
import { formatDateRange } from '@/lib/utils';
import PrintButton from './PrintButton';

export const metadata: Metadata = {
  title: 'CV — Muhamad Ega Nugraha',
  description: 'Curriculum Vitae of Muhamad Ega Nugraha',
};

async function getData() {
  try {
    const supabase = await createClient();
    const [
      { data: profile },
      { data: experiences },
      { data: skillCategories },
      { data: skills },
    ] = await Promise.all([
      supabase.from('profile').select('*').single(),
      supabase.from('experiences').select('*').order('start_date', { ascending: false }),
      supabase.from('skill_categories').select('*').order('sort_order', { ascending: true }),
      supabase.from('skills').select('*').order('sort_order', { ascending: true }),
    ]);
    return {
      profile: profile as Profile | null,
      experiences: (experiences ?? []) as Experience[],
      skillCategories: (skillCategories ?? []) as SkillCategory[],
      skills: (skills ?? []) as Skill[],
    };
  } catch {
    return { profile: null, experiences: [], skillCategories: [], skills: [] };
  }
}

function SidebarLabel({ children }: { children: React.ReactNode }) {
  return (
    <p className="text-[9px] font-bold uppercase tracking-[0.15em] text-blue-400 mb-1">
      {children}
    </p>
  );
}

function SectionTitle({ children }: { children: React.ReactNode }) {
  return (
    <div className="mb-3">
      <h3 className="text-[10px] font-bold uppercase tracking-[0.15em] text-blue-600">{children}</h3>
      <div className="mt-1 h-[1.5px] bg-blue-100 rounded-full" />
    </div>
  );
}

function ExperienceItem({ exp }: { exp: Experience }) {
  return (
    <div className="mb-4 last:mb-0">
      <div className="flex items-start justify-between gap-3 mb-0.5">
        <div>
          <h4 className="text-[11px] font-semibold text-gray-900 leading-tight">{exp.title}</h4>
          <p className="text-[10px] text-blue-600 font-medium mt-0.5">{exp.company}</p>
        </div>
        <span className="text-[9px] text-gray-400 font-mono whitespace-nowrap shrink-0 mt-0.5">
          {formatDateRange(exp.start_date, exp.end_date, exp.is_current)}
          {exp.is_current && (
            <span className="ml-1 text-emerald-500">● Now</span>
          )}
        </span>
      </div>
      {exp.description.length > 0 && (
        <ul className="mt-1.5 space-y-1">
          {exp.description.map((bullet, i) => (
            <li key={i} className="flex gap-1.5 text-[10px] text-gray-600 leading-relaxed">
              <span className="text-blue-400 shrink-0 mt-px">▸</span>
              <span>{bullet}</span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default async function CVPage() {
  const { profile, experiences, skillCategories, skills } = await getData();

  const name       = profile?.name        ?? 'Muhamad Ega Nugraha';
  const title      = profile?.title       ?? 'Software Engineer & SAP B1 Technical Consultant';
  const bio        = profile?.bio         ?? 'A passionate software engineer with a Diploma in Computer Engineering from IPB University. I specialize in building full-stack web apps, cross-platform mobile apps, and enterprise SAP B1 integrations.';
  const bio2       = profile?.bio2        ?? 'Currently working as a SAP B1 Technical Consultant at Soltius Indonesia — developing custom Add-ons, optimizing stored procedures, and integrating SAP with AI systems.';
  const email      = profile?.email       ?? 'eganeue@gmail.com';
  const phone      = profile?.phone       ?? '+62 812-9314-8932';
  const linkedin   = profile?.linkedin_url ?? 'https://linkedin.com/in/ega-nugraha';
  const github     = profile?.github_url  ?? 'https://github.com/megan0088';
  const avatarUrl  = profile?.avatar_url  ?? `https://github.com/megan0088.png`;
  const techBadges = profile?.tech_badges ?? ['Next.js', 'Flutter', 'TypeScript', 'Supabase', 'SAP B1'];

  const workExp      = experiences.filter(e => e.type === 'work');
  const education    = experiences.filter(e => e.type === 'education');
  const competitions = experiences.filter(e => e.type === 'competition');

  const linkedinDisplay = linkedin.replace(/^https?:\/\//, '');
  const githubDisplay   = github.replace(/^https?:\/\//, '');

  return (
    <>
      <style>{`
        @page {
          size: A4;
          margin: 0;
        }
        @media print {
          html, body {
            -webkit-print-color-adjust: exact !important;
            print-color-adjust: exact !important;
          }
          .cv-wrapper {
            padding: 0 !important;
            background: white !important;
          }
          .cv-page {
            box-shadow: none !important;
            margin: 0 !important;
          }
        }
      `}</style>

      <PrintButton />

      {/* Page wrapper */}
      <div className="cv-wrapper min-h-screen bg-gray-100 py-10 print:py-0 print:bg-white">
        {/* A4 card — 794 × 1123px */}
        <div
          className="cv-page mx-auto bg-white shadow-2xl"
          style={{ width: '794px', minHeight: '1123px', display: 'flex' }}
        >
          {/* ── SIDEBAR ────────────────────────────────────── */}
          <aside
            className="flex-shrink-0 flex flex-col p-7"
            style={{ width: '240px', backgroundColor: '#0f172a', color: 'white' }}
          >
            {/* Avatar */}
            <div className="flex flex-col items-center mb-6">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={avatarUrl}
                alt={name}
                width={96}
                height={96}
                className="w-24 h-24 rounded-full object-cover border-2 border-blue-500/40 mb-3"
              />
              <h1 className="text-sm font-bold text-center leading-snug text-white">{name}</h1>
              <p className="text-[10px] text-blue-300 text-center mt-1 leading-relaxed">{title}</p>
            </div>

            {/* Divider */}
            <div className="h-px bg-slate-700 mb-5" />

            {/* Contact */}
            <div className="mb-5">
              <SidebarLabel>Contact</SidebarLabel>
              <div className="space-y-2">
                {[
                  { label: 'Email',    value: email },
                  { label: 'Phone',    value: phone },
                  { label: 'LinkedIn', value: linkedinDisplay },
                  { label: 'GitHub',   value: githubDisplay },
                  { label: 'Location', value: 'Indonesia' },
                ].map(({ label, value }) => (
                  <div key={label}>
                    <p className="text-[8px] text-slate-500 uppercase tracking-wider">{label}</p>
                    <p className="text-[10px] text-slate-200 break-all leading-snug">{value}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Divider */}
            <div className="h-px bg-slate-700 mb-5" />

            {/* Skills */}
            {skillCategories.length > 0 && (
              <div className="mb-5">
                <SidebarLabel>Skills</SidebarLabel>
                {skillCategories.map(cat => {
                  const catSkills = skills.filter(s => s.category_id === cat.id);
                  if (catSkills.length === 0) return null;
                  return (
                    <div key={cat.id} className="mb-3">
                      <p className="text-[8px] text-slate-500 uppercase tracking-wider mb-1">{cat.name}</p>
                      <div className="flex flex-wrap gap-1">
                        {catSkills.map(skill => (
                          <span
                            key={skill.id}
                            className="text-[9px] px-1.5 py-0.5 rounded leading-none"
                            style={{ backgroundColor: '#1e3a5f', color: '#93c5fd', border: '1px solid #1d4ed8' }}
                          >
                            {skill.name}
                          </span>
                        ))}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}

            {/* Tech Stack */}
            {techBadges.length > 0 && (
              <>
                <div className="h-px bg-slate-700 mb-5" />
                <div>
                  <SidebarLabel>Tech Stack</SidebarLabel>
                  <div className="flex flex-wrap gap-1">
                    {techBadges.map(tech => (
                      <span
                        key={tech}
                        className="text-[9px] px-2 py-0.5 rounded-full font-mono leading-none"
                        style={{ backgroundColor: '#1e293b', color: '#60a5fa', border: '1px solid #2563eb' }}
                      >
                        {tech}
                      </span>
                    ))}
                  </div>
                </div>
              </>
            )}
          </aside>

          {/* ── MAIN CONTENT ───────────────────────────────── */}
          <main className="flex-1 p-8 bg-white">

            {/* About */}
            <div className="mb-6">
              <SectionTitle>About Me</SectionTitle>
              <p className="text-[10.5px] text-gray-600 leading-relaxed mb-2">{bio}</p>
              {bio2 && <p className="text-[10.5px] text-gray-600 leading-relaxed">{bio2}</p>}
            </div>

            {/* Work Experience */}
            {workExp.length > 0 && (
              <div className="mb-6">
                <SectionTitle>Work Experience</SectionTitle>
                {workExp.map(exp => <ExperienceItem key={exp.id} exp={exp} />)}
              </div>
            )}

            {/* Education */}
            {education.length > 0 && (
              <div className="mb-6">
                <SectionTitle>Education</SectionTitle>
                {education.map(exp => <ExperienceItem key={exp.id} exp={exp} />)}
              </div>
            )}

            {/* Competitions */}
            {competitions.length > 0 && (
              <div className="mb-6">
                <SectionTitle>Competitions &amp; Achievements</SectionTitle>
                {competitions.map(exp => <ExperienceItem key={exp.id} exp={exp} />)}
              </div>
            )}

          </main>
        </div>
      </div>
    </>
  );
}
