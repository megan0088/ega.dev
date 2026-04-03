'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { LogOut, Code2, Briefcase, FolderOpen, User, Layers, BarChart2 } from 'lucide-react';
import { createClient } from '@/lib/supabase/client';
import { useExperiences } from '@/hooks/useExperiences';
import { useProjects } from '@/hooks/useProjects';
import ExperienceTable from '@/components/admin/ExperienceTable';
import ProjectTable from '@/components/admin/ProjectTable';
import ProfileForm from '@/components/admin/ProfileForm';
import SkillsManager from '@/components/admin/SkillsManager';
import Button from '@/components/ui/Button';
import toast from 'react-hot-toast';
import type { ExperienceFormData, ProjectFormData } from '@/types';
import type { ExperienceSchema, ProjectSchema } from '@/lib/validations';

type Tab = 'profile' | 'skills' | 'experiences' | 'projects';

export default function AdminPage() {
  const [activeTab, setActiveTab] = useState<Tab>('profile');
  const [signingOut, setSigningOut] = useState(false);
  const router = useRouter();

  const { experiences, loading: expLoading, create: createExp, update: updateExp, remove: removeExp } = useExperiences();
  const { projects, loading: projLoading, create: createProj, update: updateProj, remove: removeProj } = useProjects();

  const handleSignOut = async () => {
    setSigningOut(true);
    const supabase = createClient();
    await supabase.auth.signOut();
    toast.success('Signed out');
    router.push('/admin/login');
    router.refresh();
  };

  const tabs = [
    { id: 'profile' as Tab, label: 'Profile', icon: User, description: 'Name, bio, contact, avatar' },
    { id: 'skills' as Tab, label: 'Skills', icon: BarChart2, description: 'Skill categories & levels' },
    { id: 'experiences' as Tab, label: 'Experience', icon: Briefcase, description: 'Work, education, competition', count: experiences.length },
    { id: 'projects' as Tab, label: 'Projects', icon: FolderOpen, description: 'Portfolio projects', count: projects.length },
  ];

  return (
    <div className="min-h-screen bg-dark-950 flex">
      {/* Sidebar */}
      <div className="fixed left-0 top-0 bottom-0 w-64 bg-dark-900/80 backdrop-blur-xl border-r border-white/5 flex flex-col z-10">
        {/* Logo */}
        <div className="p-6 border-b border-white/5">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-brand-600 flex items-center justify-center">
              <Code2 size={14} />
            </div>
            <div>
              <p className="text-white font-semibold text-sm">ega.dev</p>
              <p className="text-dark-500 text-xs">Admin Dashboard</p>
            </div>
          </div>
        </div>

        {/* Nav */}
        <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
          <p className="text-dark-600 text-xs font-semibold uppercase tracking-widest px-3 mb-3">Content</p>
          {tabs.map(({ id, label, icon: Icon, description, count }) => (
            <button
              key={id}
              onClick={() => setActiveTab(id)}
              className={`w-full flex items-center gap-3 px-3 py-3 rounded-xl text-sm font-medium transition-all duration-200 text-left group ${
                activeTab === id
                  ? 'bg-brand-600/20 text-brand-300 border border-brand-500/30'
                  : 'text-dark-400 hover:text-white hover:bg-white/5 border border-transparent'
              }`}
            >
              <Icon size={15} className="shrink-0" />
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between">
                  <span>{label}</span>
                  {count !== undefined && (
                    <span className={`px-1.5 py-0.5 rounded-full text-xs ${activeTab === id ? 'bg-brand-500/20 text-brand-300' : 'bg-white/5 text-dark-500'}`}>
                      {count}
                    </span>
                  )}
                </div>
                <p className="text-xs text-dark-600 group-hover:text-dark-500 transition-colors truncate mt-0.5">{description}</p>
              </div>
            </button>
          ))}
        </nav>

        {/* Footer */}
        <div className="p-4 border-t border-white/5 space-y-1">
          <a href="/" target="_blank"
            className="flex items-center gap-2 px-3 py-2 rounded-xl text-dark-400 hover:text-white hover:bg-white/5 text-sm transition-colors">
            <Layers size={14} />
            View Portfolio
          </a>
          <Button variant="ghost" className="w-full justify-start text-dark-400 hover:text-red-400"
            onClick={handleSignOut} loading={signingOut} size="sm">
            <LogOut size={14} />
            Sign Out
          </Button>
        </div>
      </div>

      {/* Main content */}
      <div className="ml-64 flex-1 p-8">
        <motion.div
          key={activeTab}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.25 }}
          className="max-w-4xl"
        >
          {/* Page header */}
          <div className="mb-8">
            <h1 className="text-2xl font-bold text-white">
              {tabs.find(t => t.id === activeTab)?.label}
            </h1>
            <p className="text-dark-500 text-sm mt-1">
              {tabs.find(t => t.id === activeTab)?.description}
            </p>
          </div>

          <div className="bg-dark-900/50 border border-white/10 rounded-2xl p-6">
            {activeTab === 'profile' && <ProfileForm />}
            {activeTab === 'skills' && <SkillsManager />}
            {activeTab === 'experiences' && (
              <ExperienceTable
                experiences={experiences}
                onCreate={async (data: ExperienceSchema) => { await createExp(data as ExperienceFormData); }}
                onUpdate={async (id, data: ExperienceSchema) => { await updateExp(id, data as ExperienceFormData); }}
                onDelete={removeExp}
                loading={expLoading}
              />
            )}
            {activeTab === 'projects' && (
              <ProjectTable
                projects={projects}
                onCreate={async (data: ProjectSchema) => { await createProj(data as ProjectFormData); }}
                onUpdate={async (id, data: ProjectSchema) => { await updateProj(id, data as ProjectFormData); }}
                onDelete={removeProj}
                loading={projLoading}
              />
            )}
          </div>
        </motion.div>
      </div>
    </div>
  );
}
