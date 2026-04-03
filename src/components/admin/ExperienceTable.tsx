'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Edit2, Trash2, Plus, Briefcase, GraduationCap, Trophy, Loader2 } from 'lucide-react';
import type { Experience } from '@/types';
import { formatDateRange } from '@/lib/utils';
import Button from '@/components/ui/Button';
import Modal from '@/components/ui/Modal';
import ExperienceForm from './ExperienceForm';
import type { ExperienceSchema } from '@/lib/validations';
import toast from 'react-hot-toast';

interface ExperienceTableProps {
  experiences: Experience[];
  onCreate: (data: ExperienceSchema) => Promise<void>;
  onUpdate: (id: string, data: ExperienceSchema) => Promise<void>;
  onDelete: (id: string) => Promise<void>;
  loading: boolean;
}

const typeIcons = {
  work: { icon: Briefcase, color: 'text-brand-400' },
  education: { icon: GraduationCap, color: 'text-accent-emerald' },
  competition: { icon: Trophy, color: 'text-accent-purple' },
};

export default function ExperienceTable({ experiences, onCreate, onUpdate, onDelete, loading }: ExperienceTableProps) {
  const [createOpen, setCreateOpen] = useState(false);
  const [editTarget, setEditTarget] = useState<Experience | null>(null);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [deleting, setDeleting] = useState(false);

  const handleCreate = async (data: ExperienceSchema) => {
    setSubmitting(true);
    try {
      await onCreate(data);
      setCreateOpen(false);
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Failed to create experience');
    } finally {
      setSubmitting(false);
    }
  };

  const handleUpdate = async (data: ExperienceSchema) => {
    if (!editTarget) return;
    setSubmitting(true);
    try {
      await onUpdate(editTarget.id, data);
      setEditTarget(null);
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Failed to update experience');
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
      toast.error(err instanceof Error ? err.message : 'Failed to delete experience');
    } finally {
      setDeleting(false);
    }
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-lg font-semibold text-white">Experiences</h2>
        <Button onClick={() => setCreateOpen(true)} size="sm">
          <Plus size={15} />
          Add Experience
        </Button>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-20">
          <Loader2 size={24} className="animate-spin text-dark-400" />
        </div>
      ) : experiences.length === 0 ? (
        <div className="text-center py-20 text-dark-500 border border-dashed border-white/10 rounded-2xl">
          No experiences yet. Click &quot;Add Experience&quot; to get started.
        </div>
      ) : (
        <div className="space-y-2">
          <AnimatePresence>
            {experiences.map((exp) => {
              const config = typeIcons[exp.type];
              return (
                <motion.div
                  key={exp.id}
                  layout
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="flex items-center gap-4 p-4 rounded-xl bg-white/5 border border-white/10 hover:bg-white/8 transition-all duration-200"
                >
                  <config.icon size={16} className={config.color} />
                  <div className="flex-1 min-w-0">
                    <p className="text-white text-sm font-medium truncate">{exp.title}</p>
                    <p className="text-dark-400 text-xs">{exp.company} · {formatDateRange(exp.start_date, exp.end_date, exp.is_current)}</p>
                  </div>
                  {exp.is_current && (
                    <span className="shrink-0 px-2 py-0.5 rounded-full bg-emerald-500/15 text-emerald-400 text-xs border border-emerald-500/30">
                      Current
                    </span>
                  )}
                  <div className="flex items-center gap-1 shrink-0">
                    <button
                      onClick={() => setEditTarget(exp)}
                      className="p-1.5 rounded-lg text-dark-400 hover:text-white hover:bg-white/10 transition-colors"
                      title="Edit"
                    >
                      <Edit2 size={14} />
                    </button>
                    <button
                      onClick={() => setDeleteId(exp.id)}
                      className="p-1.5 rounded-lg text-dark-400 hover:text-red-400 hover:bg-red-500/10 transition-colors"
                      title="Delete"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                </motion.div>
              );
            })}
          </AnimatePresence>
        </div>
      )}

      {/* Create Modal */}
      <Modal isOpen={createOpen} onClose={() => setCreateOpen(false)} title="Add Experience">
        <ExperienceForm onSubmit={handleCreate} isSubmitting={submitting} />
      </Modal>

      {/* Edit Modal */}
      <Modal isOpen={!!editTarget} onClose={() => setEditTarget(null)} title="Edit Experience">
        {editTarget && (
          <ExperienceForm onSubmit={handleUpdate} defaultValues={editTarget} isSubmitting={submitting} />
        )}
      </Modal>

      {/* Delete Confirm Modal */}
      <Modal isOpen={!!deleteId} onClose={() => setDeleteId(null)} title="Delete Experience">
        <p className="text-dark-400 mb-6">Are you sure? This action cannot be undone.</p>
        <div className="flex justify-end gap-3">
          <Button variant="secondary" onClick={() => setDeleteId(null)}>Cancel</Button>
          <Button variant="danger" onClick={handleDelete} loading={deleting}>Delete</Button>
        </div>
      </Modal>
    </div>
  );
}
