import { createClient } from '@/lib/supabase/server';
import Navbar from '@/components/sections/Navbar';
import HeroSection from '@/components/sections/HeroSection';
import AboutSection from '@/components/sections/AboutSection';
import ExperienceSection from '@/components/sections/ExperienceSection';
import ProjectsSection from '@/components/sections/ProjectsSection';
import ContactSection from '@/components/sections/ContactSection';
import type { Experience, Project } from '@/types';

async function getData() {
  try {
    const supabase = await createClient();
    const [{ data: experiences }, { data: projects }] = await Promise.all([
      supabase.from('experiences').select('*').order('start_date', { ascending: false }),
      supabase.from('projects').select('*').order('created_at', { ascending: false }),
    ]);
    return { experiences: (experiences ?? []) as Experience[], projects: (projects ?? []) as Project[] };
  } catch {
    return { experiences: [], projects: [] };
  }
}

export default async function HomePage() {
  const { experiences, projects } = await getData();

  return (
    <main>
      <Navbar />
      <HeroSection />
      <AboutSection />
      <ExperienceSection experiences={experiences} />
      <ProjectsSection projects={projects} />
      <ContactSection />
    </main>
  );
}
