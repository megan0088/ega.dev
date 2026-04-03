'use client';

import { useState, useEffect, useCallback } from 'react';
import type { Project, ProjectFormData } from '@/types';
import { getProjects, createProject, updateProject, deleteProject } from '@/lib/api/projects';
import toast from 'react-hot-toast';

export function useProjects() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetch = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await getProjects();
      setProjects(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch projects');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetch(); }, [fetch]);

  const create = async (data: ProjectFormData) => {
    const newProj = await createProject(data);
    setProjects((prev) => [newProj, ...prev]);
    toast.success('Project added');
    return newProj;
  };

  const update = async (id: string, data: Partial<ProjectFormData>) => {
    const updated = await updateProject(id, data);
    setProjects((prev) => prev.map((p) => (p.id === id ? updated : p)));
    toast.success('Project updated');
    return updated;
  };

  const remove = async (id: string) => {
    await deleteProject(id);
    setProjects((prev) => prev.filter((p) => p.id !== id));
    toast.success('Project deleted');
  };

  return { projects, loading, error, refetch: fetch, create, update, remove };
}
