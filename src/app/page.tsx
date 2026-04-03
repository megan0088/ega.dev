export const revalidate = 0;

import { createClient } from '@/lib/supabase/server';
import Navbar from '@/components/sections/Navbar';
import HeroSection from '@/components/sections/HeroSection';
import AboutSection from '@/components/sections/AboutSection';
import SkillsSection from '@/components/sections/SkillsSection';
import ExperienceSection from '@/components/sections/ExperienceSection';
import ProjectsSection from '@/components/sections/ProjectsSection';
import ContactSection from '@/components/sections/ContactSection';
import type { Experience, Project, Profile, SkillCategory, Skill } from '@/types';

async function getData() {
  try {
    const supabase = await createClient();
    const [
      { data: profile },
      { data: experiences },
      { data: projects },
      { data: skillCategories },
      { data: skills },
    ] = await Promise.all([
      supabase.from('profile').select('*').single(),
      supabase.from('experiences').select('*').order('start_date', { ascending: false }),
      supabase.from('projects').select('*').order('created_at', { ascending: false }),
      supabase.from('skill_categories').select('*').order('sort_order', { ascending: true }),
      supabase.from('skills').select('*').order('sort_order', { ascending: true }),
    ]);
    return {
      profile: profile as Profile | null,
      experiences: (experiences ?? []) as Experience[],
      projects: (projects ?? []) as Project[],
      skillCategories: (skillCategories ?? []) as SkillCategory[],
      skills: (skills ?? []) as Skill[],
    };
  } catch {
    return { profile: null, experiences: [], projects: [], skillCategories: [], skills: [] };
  }
}

export default async function HomePage() {
  const { profile, experiences, projects, skillCategories, skills } = await getData();

  return (
    <main>
      <Navbar />
      <HeroSection profile={profile} />
      <AboutSection profile={profile} />
      <SkillsSection categories={skillCategories} skills={skills} />
      <ExperienceSection experiences={experiences} />
      <ProjectsSection projects={projects} />
      <ContactSection profile={profile} />
    </main>
  );
}
