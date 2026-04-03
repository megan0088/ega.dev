import { createClient } from '@/lib/supabase/client';
import type { Profile, ProfileFormData } from '@/types';

export async function getProfile(): Promise<Profile | null> {
  const supabase = createClient();
  const { data, error } = await supabase
    .from('profile')
    .select('*')
    .single();

  if (error) return null;
  return data;
}

export async function upsertProfile(profile: ProfileFormData): Promise<Profile> {
  const supabase = createClient();
  const { data, error } = await supabase
    .from('profile')
    .upsert({ id: 1, ...profile, updated_at: new Date().toISOString() })
    .select()
    .single();

  if (error) throw new Error(error.message);
  return data;
}
