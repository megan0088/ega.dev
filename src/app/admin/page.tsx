'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { LogOut, Code2, Briefcase, FolderOpen, User } from 'lucide-react';
import { createClient } from '@/lib/supabase/client';
import { useExperiences } from '@/hooks/useExperiences';
import { useProjects } from '@/hooks/useProjects';
import type { ExperienceFormData, ProjectFormData } from '@/types';
import ExperienceTable from '@/components/admin/ExperienceTable';
import ProjectTable from '@/components/admin/ProjectTable';
import Button from '@/components/ui/Button';
import toast from 'react-hot-toast';
import type { ExperienceSchema, ProjectSchema } from '@/lib/validations';

type Tab = 'experiences' | 'projects';

export default function AdminPage() {
  const [activeTab, setActiveTab] = useState<Tab>('experiences');
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
    { id: 'experiences' as Tab, label: 'Experiences', icon: Briefcase, count: experiences.length },
    { id: 'projects' as Tab, label: 'Projects', icon: FolderOpen, count: projects.length },
  ];

  return (
    <div className="min-h-screen bg-dark-950">
      {/* Sidebar */}
      <div className="fixed left-0 top-0 bottom-0 w-60 bg-dark-900/80 backdrop-blur-xl border-r border-white/5 flex flex-col z-10">
        <div className="p-6 border-b border-white/5">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-brand-600 flex items-center justify-center">
              <Code2 size={14} />
            </div>
            <div>
              <p className="text-white font-semibold text-sm">ega.dev</p>
              <p className="text-dark-500 text-xs">Admin</p>
            </div>
          </div>
        </div>

        <nav className="flex-1 p-4 space-y-1">
          {tabs.map(({ id, label, icon: Icon, count }) => (
            <button
              key={id}
              onClick={() => setActiveTab(id)}
              className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 ${
                activeTab === id
                  ? 'bg-brand-600/20 text-brand-300 border border-brand-500/30'
                  : 'text-dark-400 hover:text-white hover:bg-white/5'
              }`}
            >
              <span className="flex items-center gap-2.5">
                <Icon size={15} />
                {label}
              </span>
              <span className={`px-2 py-0.5 rounded-full text-xs ${activeTab === id ? 'bg-brand-500/20 text-brand-300' : 'bg-white/5 text-dark-500'}`}>
                {count}
              </span>
            </button>
          ))}
        </nav>

        <div className="p-4 border-t border-white/5">
          <a
            href="/"
            target="_blank"
            className="flex items-center gap-2 px-3 py-2 rounded-xl text-dark-400 hover:text-white hover:bg-white/5 text-sm transition-colors mb-2"
          >
            <User size={14} />
            View Portfolio
          </a>
          <Button
            variant="ghost"
            className="w-full justify-start text-dark-400 hover:text-red-400"
            onClick={handleSignOut}
            loading={signingOut}
            size="sm"
          >
            <LogOut size={14} />
            Sign Out
          </Button>
        </div>
      </div>

      {/* Main content */}
      <div className="ml-60 p-8">
        <motion.div
          key={activeTab}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="max-w-4xl"
        >
          <div className="mb-8">
            <h1 className="text-2xl font-bold text-white">
              {activeTab === 'experiences' ? 'Experience' : 'Projects'}
            </h1>
            <p className="text-dark-500 text-sm mt-1">
              {activeTab === 'experiences'
                ? 'Manage your work, education, and competition history.'
                : 'Manage your portfolio projects.'}
            </p>
          </div>

          <div className="bg-dark-900/50 border border-white/10 rounded-2xl p-6">
            {activeTab === 'experiences' ? (
              <ExperienceTable
                experiences={experiences}
                onCreate={async (data: ExperienceSchema) => { await createExp(data as ExperienceFormData); }}
                onUpdate={async (id, data: ExperienceSchema) => { await updateExp(id, data as ExperienceFormData); }}
                onDelete={removeExp}
                loading={expLoading}
              />
            ) : (
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
