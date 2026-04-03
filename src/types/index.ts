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

export interface Profile {
  id: string;
  name: string;
  title: string;
  subtitle: string;
  bio: string;
  bio2: string;
  avatar_url: string | null;
  status_text: string;
  currently_learning: string | null;
  tech_badges: string[];
  github_url: string | null;
  linkedin_url: string | null;
  email: string | null;
  phone: string | null;
  instagram_url: string | null;
  seo_title?: string | null;
  seo_description?: string | null;
  updated_at: string;
}

export interface SkillCategory {
  id: string;
  name: string;
  color: string;
  sort_order: number;
  created_at: string;
}

export interface Skill {
  id: string;
  category_id: string;
  name: string;
  level: number;
  sort_order: number;
  created_at: string;
}

export type ExperienceFormData = Omit<Experience, 'id' | 'created_at'>;
export type ProjectFormData = Omit<Project, 'id' | 'created_at'>;
export type ProfileFormData = Omit<Profile, 'id' | 'updated_at'>;
export type SkillCategoryFormData = Omit<SkillCategory, 'id' | 'created_at'>;
export type SkillFormData = Omit<Skill, 'id' | 'created_at'>;
