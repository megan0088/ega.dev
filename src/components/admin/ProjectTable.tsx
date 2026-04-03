'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Edit2, Trash2, Plus, ExternalLink, GitBranch, Star, Loader2 } from 'lucide-react';
import type { Project } from '@/types';
import Button from '@/components/ui/Button';
import Modal from '@/components/ui/Modal';
import ProjectForm from './ProjectForm';
import type { ProjectSchema } from '@/lib/validations';
import toast from 'react-hot-toast';

interface ProjectTableProps {
  projects: Project[];
  onCreate: (data: ProjectSchema) => Promise<void>;
  onUpdate: (id: string, data: ProjectSchema) => Promise<void>;
  onDelete: (id: string) => Promise<void>;
  loading: boolean;
}

export default function ProjectTable({ projects, onCreate, onUpdate, onDelete, loading }: ProjectTableProps) {
  const [createOpen, setCreateOpen] = useState(false);
  const [editTarget, setEditTarget] = useState<Project | null>(null);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [deleting, setDeleting] = useState(false);

  const handleCreate = async (data: ProjectSchema) => {
    setSubmitting(true);
    try {
      await onCreate(data);
      setCreateOpen(false);
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Failed to create project');
    } finally {
      setSubmitting(false);
    }
  };

  const handleUpdate = async (data: ProjectSchema) => {
    if (!editTarget) return;
    setSubmitting(true);
    try {
      await onUpdate(editTarget.id, data);
      setEditTarget(null);
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Failed to update project');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async () => {
    if (!deleteId) return;
    setDeleting(true);
    try {
      await onDelete(deleteId);
      setDeleteId(null);
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Failed to delete project');
    } finally {
      setDeleting(false);
    }
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-lg font-semibold text-white">Projects</h2>
        <Button onClick={() => setCreateOpen(true)} size="sm">
          <Plus size={15} />
          Add Project
        </Button>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-20">
          <Loader2 size={24} className="animate-spin text-dark-400" />
        </div>
      ) : projects.length === 0 ? (
        <div className="text-center py-20 text-dark-500 border border-dashed border-white/10 rounded-2xl">
          No projects yet. Click &quot;Add Project&quot; to get started.
        </div>
      ) : (
        <div className="space-y-2">
          <AnimatePresence>
            {projects.map((project) => (
              <motion.div
                key={project.id}
                layout
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="flex items-center gap-4 p-4 rounded-xl bg-white/5 border border-white/10 hover:bg-white/8 transition-all duration-200"
              >
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <p className="text-white text-sm font-medium truncate">{project.title}</p>
                    {project.is_featured && (
                      <Star size={12} className="text-yellow-400 shrink-0" />
                    )}
                  </div>
                  <div className="flex flex-wrap gap-1 mt-1">
                    {project.tech_stack.slice(0, 3).map((tech) => (
                      <span key={tech} className="text-xs text-dark-500 font-mono">{tech}</span>
                    ))}
                    {project.tech_stack.length > 3 && (
                      <span className="text-xs text-dark-600">+{project.tech_stack.length - 3}</span>
                    )}
                  </div>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  {project.github_url && (
                    <a href={project.github_url} target="_blank" rel="noopener noreferrer"
                      className="p-1.5 rounded-lg text-dark-500 hover:text-white transition-colors">
                      <GitBranch size={13} />
                    </a>
                  )}
                  {project.live_url && (
                    <a href={project.live_url} target="_blank" rel="noopener noreferrer"
                      className="p-1.5 rounded-lg text-dark-500 hover:text-brand-400 transition-colors">
                      <ExternalLink size={13} />
                    </a>
                  )}
                  <button onClick={() => setEditTarget(project)}
                    className="p-1.5 rounded-lg text-dark-400 hover:text-white hover:bg-white/10 transition-colors">
                    <Edit2 size={14} />
                  </button>
                  <button onClick={() => setDeleteId(project.id)}
                    className="p-1.5 rounded-lg text-dark-400 hover:text-red-400 hover:bg-red-500/10 transition-colors">
                    <Trash2 size={14} />
                  </button>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      )}

      <Modal isOpen={createOpen} onClose={() => setCreateOpen(false)} title="Add Project">
        <ProjectForm onSubmit={handleCreate} isSubmitting={submitting} />
      </Modal>

      <Modal isOpen={!!editTarget} onClose={() => setEditTarget(null)} title="Edit Project">
        {editTarget && (
          <ProjectForm onSubmit={handleUpdate} defaultValues={editTarget} isSubmitting={submitting} />
        )}
      </Modal>

      <Modal isOpen={!!deleteId} onClose={() => setDeleteId(null)} title="Delete Project">
        <p className="text-dark-400 mb-6">Are you sure? This action cannot be undone.</p>
        <div className="flex justify-end gap-3">
          <Button variant="secondary" onClick={() => setDeleteId(null)}>Cancel</Button>
          <Button variant="danger" onClick={handleDelete} loading={deleting}>Delete</Button>
        </div>
      </Modal>
    </div>
  );
}
