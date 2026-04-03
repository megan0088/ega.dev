'use client';

import { useState, useEffect, useCallback } from 'react';
import type { Experience, ExperienceFormData } from '@/types';
import { getExperiences, createExperience, updateExperience, deleteExperience } from '@/lib/api/experiences';
import toast from 'react-hot-toast';

export function useExperiences() {
  const [experiences, setExperiences] = useState<Experience[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetch = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await getExperiences();
      setExperiences(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch experiences');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetch(); }, [fetch]);

  const create = async (data: ExperienceFormData) => {
    const newExp = await createExperience(data);
    setExperiences((prev) => [newExp, ...prev]);
    toast.success('Experience added');
    return newExp;
  };

  const update = async (id: string, data: Partial<ExperienceFormData>) => {
    const updated = await updateExperience(id, data);
    setExperiences((prev) => prev.map((e) => (e.id === id ? updated : e)));
    toast.success('Experience updated');
    return updated;
  };

  const remove = async (id: string) => {
    await deleteExperience(id);
    setExperiences((prev) => prev.filter((e) => e.id !== id));
    toast.success('Experience deleted');
  };

  return { experiences, loading, error, refetch: fetch, create, update, remove };
}
