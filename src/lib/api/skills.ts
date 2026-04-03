import { createClient } from '@/lib/supabase/client';
import type { Skill, SkillCategory, SkillFormData, SkillCategoryFormData } from '@/types';

export async function getSkillCategories(): Promise<SkillCategory[]> {
  const supabase = createClient();
  const { data, error } = await supabase
    .from('skill_categories')
    .select('*')
    .order('sort_order', { ascending: true });

  if (error) throw new Error(error.message);
  return data ?? [];
}

export async function getSkills(): Promise<Skill[]> {
  const supabase = createClient();
  const { data, error } = await supabase
    .from('skills')
    .select('*')
    .order('sort_order', { ascending: true });

  if (error) throw new Error(error.message);
  return data ?? [];
}

export async function createSkillCategory(category: SkillCategoryFormData): Promise<SkillCategory> {
  const supabase = createClient();
  const { data, error } = await supabase
    .from('skill_categories')
    .insert([category])
    .select()
    .single();

  if (error) throw new Error(error.message);
  return data;
}

export async function updateSkillCategory(id: string, category: Partial<SkillCategoryFormData>): Promise<SkillCategory> {
  const supabase = createClient();
  const { data, error } = await supabase
    .from('skill_categories')
    .update(category)
    .eq('id', id)
    .select()
    .single();

  if (error) throw new Error(error.message);
  return data;
}

export async function deleteSkillCategory(id: string): Promise<void> {
  const supabase = createClient();
  const { error } = await supabase
    .from('skill_categories')
    .delete()
    .eq('id', id);

  if (error) throw new Error(error.message);
}

export async function createSkill(skill: SkillFormData): Promise<Skill> {
  const supabase = createClient();
  const { data, error } = await supabase
    .from('skills')
    .insert([skill])
    .select()
    .single();

  if (error) throw new Error(error.message);
  return data;
}

export async function updateSkill(id: string, skill: Partial<SkillFormData>): Promise<Skill> {
  const supabase = createClient();
  const { data, error } = await supabase
    .from('skills')
    .update(skill)
    .eq('id', id)
    .select()
    .single();

  if (error) throw new Error(error.message);
  return data;
}

export async function deleteSkill(id: string): Promise<void> {
  const supabase = createClient();
  const { error } = await supabase
    .from('skills')
    .delete()
    .eq('id', id);

  if (error) throw new Error(error.message);
}
