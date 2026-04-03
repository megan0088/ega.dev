export interface Experience {
  id: string;
  title: string;
  company: string;
  start_date: string;
  end_date?: string | null;
  is_current: boolean;
  description: string[];
  type: 'work' | 'education' | 'competition';
  created_at: string;
}

export interface Project {
  id: string;
  title: string;
  description: string;
  tech_stack: string[];
  github_url: string | null;
  live_url: string | null;
  image_url: string | null;
  is_featured: boolean;
  created_at: string;
}

export type ExperienceFormData = Omit<Experience, 'id' | 'created_at'>;
export type ProjectFormData = Omit<Project, 'id' | 'created_at'>;
