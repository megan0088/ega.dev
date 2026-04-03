import { createClient } from '@/lib/supabase/client';
import type { Experience, ExperienceFormData } from '@/types';

export async function getExperiences(): Promise<Experience[]> {
  const supabase = createClient();
  const { data, error } = await supabase
    .from('experiences')
    .select('*')
    .order('start_date', { ascending: false });

  if (error) throw new Error(error.message);
  return data ?? [];
}

export async function createExperience(experience: ExperienceFormData): Promise<Experience> {
  const supabase = createClient();
  const { data, error } = await supabase
    .from('experiences')
    .insert([experience])
    .select()
    .single();

  if (error) throw new Error(error.message);
  return data;
}

export async function updateExperience(id: string, experience: Partial<ExperienceFormData>): Promise<Experience> {
  const supabase = createClient();
  const { data, error } = await supabase
    .from('experiences')
    .update(experience)
    .eq('id', id)
    .select()
    .single();

  if (error) throw new Error(error.message);
  return data;
}

export async function deleteExperience(id: string): Promise<void> {
  const supabase = createClient();
  const { error } = await supabase
    .from('experiences')
    .delete()
    .eq('id', id);

  if (error) throw new Error(error.message);
}
