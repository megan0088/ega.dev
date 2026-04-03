'use client';

import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Trash2, Edit2, ChevronDown, ChevronRight, Loader2 } from 'lucide-react';
import {
  getSkillCategories, getSkills,
  createSkillCategory, updateSkillCategory, deleteSkillCategory,
  createSkill, updateSkill, deleteSkill,
} from '@/lib/api/skills';
import type { Skill, SkillCategory } from '@/types';
import Modal from '@/components/ui/Modal';
import Input from '@/components/ui/Input';
import Button from '@/components/ui/Button';
import toast from 'react-hot-toast';

const colorOptions = [
  { label: 'Blue', value: 'from-brand-500 to-brand-400' },
  { label: 'Purple', value: 'from-accent-purple to-purple-400' },
  { label: 'Green', value: 'from-accent-emerald to-emerald-400' },
  { label: 'Cyan', value: 'from-accent-cyan to-cyan-400' },
  { label: 'Rose', value: 'from-rose-500 to-rose-400' },
];

export default function SkillsManager() {
  const [categories, setCategories] = useState<SkillCategory[]>([]);
  const [skills, setSkills] = useState<Skill[]>([]);
  const [loading, setLoading] = useState(true);
  const [expanded, setExpanded] = useState<string | null>(null);

  // Category modal state
  const [catModal, setCatModal] = useState(false);
  const [editCat, setEditCat] = useState<SkillCategory | null>(null);
  const [catName, setCatName] = useState('');
  const [catColor, setCatColor] = useState(colorOptions[0].value);
  const [catSaving, setCatSaving] = useState(false);

  // Skill modal state
  const [skillModal, setSkillModal] = useState(false);
  const [editSkill, setEditSkill] = useState<Skill | null>(null);
  const [skillCategoryId, setSkillCategoryId] = useState('');
  const [skillName, setSkillName] = useState('');
  const [skillLevel, setSkillLevel] = useState('80');
  const [skillSaving, setSkillSaving] = useState(false);

  // Delete
  const [deleteCatId, setDeleteCatId] = useState<string | null>(null);
  const [deleteSkillId, setDeleteSkillId] = useState<string | null>(null);
  const [deleting, setDeleting] = useState(false);

  const fetchData = useCallback(async () => {
    setLoading(true);
    const [cats, sks] = await Promise.all([getSkillCategories(), getSkills()]);
    setCategories(cats);
    setSkills(sks);
    setLoading(false);
  }, []);

  useEffect(() => { fetchData(); }, [fetchData]);

  const openCatModal = (cat?: SkillCategory) => {
    setEditCat(cat ?? null);
    setCatName(cat?.name ?? '');
    setCatColor(cat?.color ?? colorOptions[0].value);
    setCatModal(true);
  };

  const saveCat = async () => {
    if (!catName.trim()) return;
    setCatSaving(true);
    try {
      if (editCat) {
        const updated = await updateSkillCategory(editCat.id, { name: catName, color: catColor });
        setCategories(prev => prev.map(c => c.id === editCat.id ? updated : c));
        toast.success('Category updated');
      } else {
        const created = await createSkillCategory({ name: catName, color: catColor, sort_order: categories.length });
        setCategories(prev => [...prev, created]);
        toast.success('Category added');
      }
      setCatModal(false);
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Failed');
    } finally {
      setCatSaving(false);
    }
  };

  const openSkillModal = (categoryId: string, skill?: Skill) => {
    setEditSkill(skill ?? null);
    setSkillCategoryId(categoryId);
    setSkillName(skill?.name ?? '');
    setSkillLevel(String(skill?.level ?? 80));
    setSkillModal(true);
  };

  const saveSkill = async () => {
    if (!skillName.trim()) return;
    setSkillSaving(true);
    const level = Math.min(100, Math.max(0, parseInt(skillLevel) || 80));
    try {
      if (editSkill) {
        const updated = await updateSkill(editSkill.id, { name: skillName, level });
        setSkills(prev => prev.map(s => s.id === editSkill.id ? updated : s));
        toast.success('Skill updated');
      } else {
        const catSkills = skills.filter(s => s.category_id === skillCategoryId);
        const created = await createSkill({ category_id: skillCategoryId, name: skillName, level, sort_order: catSkills.length });
        setSkills(prev => [...prev, created]);
        toast.success('Skill added');
      }
      setSkillModal(false);
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Failed');
    } finally {
      setSkillSaving(false);
    }
  };

  const handleDeleteCat = async () => {
    if (!deleteCatId) return;
    setDeleting(true);
    try {
      await deleteSkillCategory(deleteCatId);
      setCategories(prev => prev.filter(c => c.id !== deleteCatId));
      setSkills(prev => prev.filter(s => s.category_id !== deleteCatId));
      setDeleteCatId(null);
      toast.success('Category deleted');
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Failed');
    } finally {
      setDeleting(false);
    }
  };

  const handleDeleteSkill = async () => {
    if (!deleteSkillId) return;
    setDeleting(true);
    try {
      await deleteSkill(deleteSkillId);
      setSkills(prev => prev.filter(s => s.id !== deleteSkillId));
      setDeleteSkillId(null);
      toast.success('Skill deleted');
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Failed');
    } finally {
      setDeleting(false);
    }
  };

  if (loading) {
    return <div className="flex items-center justify-center py-20"><Loader2 size={24} className="animate-spin text-dark-400" /></div>;
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-lg font-semibold text-white">Skills</h2>
        <Button onClick={() => openCatModal()} size="sm">
          <Plus size={15} />Add Category
        </Button>
      </div>

      {categories.length === 0 ? (
        <div className="text-center py-20 text-dark-500 border border-dashed border-white/10 rounded-2xl">
          No categories yet. Click &quot;Add Category&quot; to get started.
        </div>
      ) : (
        <div className="space-y-3">
          {categories.map(cat => {
            const catSkills = skills.filter(s => s.category_id === cat.id);
            const isOpen = expanded === cat.id;
            return (
              <div key={cat.id} className="rounded-2xl bg-white/5 border border-white/10 overflow-hidden">
                {/* Category header */}
                <div className="flex items-center gap-3 px-4 py-3">
                  <button onClick={() => setExpanded(isOpen ? null : cat.id)}
                    className="text-dark-400 hover:text-white transition-colors">
                    {isOpen ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
                  </button>
                  <div className={`h-1 w-6 rounded-full bg-gradient-to-r ${cat.color}`} />
                  <span className="flex-1 text-white font-medium text-sm">{cat.name}</span>
                  <span className="text-dark-500 text-xs">{catSkills.length} skills</span>
                  <button onClick={() => openCatModal(cat)}
                    className="p-1.5 rounded-lg text-dark-400 hover:text-white hover:bg-white/10 transition-colors">
                    <Edit2 size={13} />
                  </button>
                  <button onClick={() => setDeleteCatId(cat.id)}
                    className="p-1.5 rounded-lg text-dark-400 hover:text-red-400 hover:bg-red-500/10 transition-colors">
                    <Trash2 size={13} />
                  </button>
                </div>

                {/* Skills list */}
                <AnimatePresence>
                  {isOpen && (
                    <motion.div
                      initial={{ height: 0 }}
                      animate={{ height: 'auto' }}
                      exit={{ height: 0 }}
                      className="overflow-hidden"
                    >
                      <div className="px-4 pb-3 border-t border-white/5 pt-3 space-y-2">
                        {catSkills.map(skill => (
                          <div key={skill.id} className="flex items-center gap-3">
                            <div className="flex-1">
                              <div className="flex items-center justify-between mb-1">
                                <span className="text-sm text-dark-300">{skill.name}</span>
                                <span className="text-xs font-mono text-dark-500">{skill.level}%</span>
                              </div>
                              <div className="h-1.5 bg-white/5 rounded-full overflow-hidden">
                                <div className={`h-full rounded-full bg-gradient-to-r ${cat.color}`} style={{ width: `${skill.level}%` }} />
                              </div>
                            </div>
                            <button onClick={() => openSkillModal(cat.id, skill)}
                              className="p-1.5 rounded-lg text-dark-400 hover:text-white hover:bg-white/10 transition-colors shrink-0">
                              <Edit2 size={13} />
                            </button>
                            <button onClick={() => setDeleteSkillId(skill.id)}
                              className="p-1.5 rounded-lg text-dark-400 hover:text-red-400 hover:bg-red-500/10 transition-colors shrink-0">
                              <Trash2 size={13} />
                            </button>
                          </div>
                        ))}
                        <button onClick={() => openSkillModal(cat.id)}
                          className="flex items-center gap-1.5 text-xs text-brand-400 hover:text-brand-300 transition-colors mt-2">
                          <Plus size={13} />Add skill
                        </button>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            );
          })}
        </div>
      )}

      {/* Category Modal */}
      <Modal isOpen={catModal} onClose={() => setCatModal(false)} title={editCat ? 'Edit Category' : 'Add Category'}>
        <div className="space-y-4">
          <Input label="Category Name" value={catName} onChange={e => setCatName(e.target.value)} placeholder="e.g. Web Development" />
          <div>
            <label className="block text-sm font-medium text-dark-300 mb-2">Color</label>
            <div className="flex flex-wrap gap-2">
              {colorOptions.map(opt => (
                <button key={opt.value} type="button" onClick={() => setCatColor(opt.value)}
                  className={`flex items-center gap-2 px-3 py-2 rounded-xl text-sm border transition-all ${catColor === opt.value ? 'border-brand-500 bg-brand-500/10 text-white' : 'border-white/10 text-dark-400 hover:border-white/20'}`}>
                  <div className={`h-3 w-6 rounded-full bg-gradient-to-r ${opt.value}`} />
                  {opt.label}
                </button>
              ))}
            </div>
          </div>
          <div className="flex justify-end gap-3 pt-2">
            <Button variant="secondary" onClick={() => setCatModal(false)}>Cancel</Button>
            <Button onClick={saveCat} loading={catSaving}>{editCat ? 'Save' : 'Add'}</Button>
          </div>
        </div>
      </Modal>

      {/* Skill Modal */}
      <Modal isOpen={skillModal} onClose={() => setSkillModal(false)} title={editSkill ? 'Edit Skill' : 'Add Skill'}>
        <div className="space-y-4">
          <Input label="Skill Name" value={skillName} onChange={e => setSkillName(e.target.value)} placeholder="e.g. Next.js" />
          <div>
            <Input label="Proficiency Level (0–100)" type="number" value={skillLevel}
              onChange={e => setSkillLevel(e.target.value)} placeholder="80" hint="0 = beginner, 100 = expert" />
            <div className="mt-3 h-2 bg-white/5 rounded-full overflow-hidden">
              <div className="h-full rounded-full bg-gradient-to-r from-brand-500 to-brand-400 transition-all"
                style={{ width: `${Math.min(100, parseInt(skillLevel) || 0)}%` }} />
            </div>
          </div>
          <div className="flex justify-end gap-3 pt-2">
            <Button variant="secondary" onClick={() => setSkillModal(false)}>Cancel</Button>
            <Button onClick={saveSkill} loading={skillSaving}>{editSkill ? 'Save' : 'Add'}</Button>
          </div>
        </div>
      </Modal>

      {/* Delete Category Confirm */}
      <Modal isOpen={!!deleteCatId} onClose={() => setDeleteCatId(null)} title="Delete Category">
        <p className="text-dark-400 mb-2">This will also delete all skills inside this category.</p>
        <p className="text-dark-500 text-sm mb-6">This action cannot be undone.</p>
        <div className="flex justify-end gap-3">
          <Button variant="secondary" onClick={() => setDeleteCatId(null)}>Cancel</Button>
          <Button variant="danger" onClick={handleDeleteCat} loading={deleting}>Delete</Button>
        </div>
      </Modal>

      {/* Delete Skill Confirm */}
      <Modal isOpen={!!deleteSkillId} onClose={() => setDeleteSkillId(null)} title="Delete Skill">
        <p className="text-dark-400 mb-6">Are you sure? This action cannot be undone.</p>
        <div className="flex justify-end gap-3">
          <Button variant="secondary" onClick={() => setDeleteSkillId(null)}>Cancel</Button>
          <Button variant="danger" onClick={handleDeleteSkill} loading={deleting}>Delete</Button>
        </div>
      </Modal>
    </div>
  );
}
