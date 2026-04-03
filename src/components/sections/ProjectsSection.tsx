'use client';

import { motion } from 'framer-motion';
import { GitBranch, ExternalLink, Star } from 'lucide-react';
import Image from 'next/image';
import type { Project } from '@/types';
import Badge from '@/components/ui/Badge';

interface ProjectsSectionProps {
  projects: Project[];
}

const badgeVariants = ['blue', 'purple', 'cyan', 'emerald', 'rose'] as const;

export default function ProjectsSection({ projects }: ProjectsSectionProps) {
  const featured = projects.filter((p) => p.is_featured);
  const rest = projects.filter((p) => !p.is_featured);

  return (
    <section id="projects" className="relative py-32 px-6 overflow-hidden">
      <div className="glow-orb w-[500px] h-[500px] bg-accent-cyan/10 top-0 right-0" />

      <div className="max-w-6xl mx-auto relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-16"
        >
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/5 border border-white/10 text-dark-400 text-sm font-mono mb-6">
            <span className="text-brand-400">// </span>projects
          </div>
          <h2 className="text-4xl md:text-5xl font-bold text-white">What I&apos;ve Built</h2>
        </motion.div>

        {projects.length === 0 ? (
          <div className="text-center py-20 text-dark-500">
            No projects yet. Add some from the admin dashboard.
          </div>
        ) : (
          <>
            {featured.length > 0 && (
              <div className="grid md:grid-cols-2 gap-6 mb-6">
                {featured.map((project, idx) => (
                  <ProjectCard key={project.id} project={project} index={idx} large />
                ))}
              </div>
            )}
            {rest.length > 0 && (
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {rest.map((project, idx) => (
                  <ProjectCard key={project.id} project={project} index={idx} />
                ))}
              </div>
            )}
          </>
        )}
      </div>
    </section>
  );
}

function ProjectCard({ project, index, large = false }: { project: Project; index: number; large?: boolean }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.1 }}
      className="group relative flex flex-col rounded-2xl bg-white/5 border border-white/10 hover:bg-white/8 hover:border-white/20 transition-all duration-300 overflow-hidden"
    >
      {project.image_url && (
        <div className={`relative w-full overflow-hidden ${large ? 'h-48' : 'h-36'} bg-dark-800`}>
          <Image
            src={project.image_url}
            alt={project.title}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-500"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-dark-950/80 to-transparent" />
        </div>
      )}

      <div className="flex flex-col flex-1 p-5">
        <div className="flex items-start justify-between gap-2 mb-2">
          <h3 className="font-semibold text-white text-base leading-snug">{project.title}</h3>
          {project.is_featured && (
            <span className="shrink-0 flex items-center gap-1 px-2 py-0.5 rounded-full bg-yellow-500/15 text-yellow-400 text-xs border border-yellow-500/30">
              <Star size={10} />
              Featured
            </span>
          )}
        </div>

        <p className="text-dark-400 text-sm leading-relaxed mb-4 flex-1">{project.description}</p>

        <div className="flex flex-wrap gap-1.5 mb-4">
          {project.tech_stack.map((tech, i) => (
            <Badge key={tech} variant={badgeVariants[i % badgeVariants.length]}>
              {tech}
            </Badge>
          ))}
        </div>

        <div className="flex items-center gap-3">
          {project.github_url && (
            <a
              href={project.github_url}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 text-dark-400 hover:text-white text-xs transition-colors"
            >
              <GitBranch size={14} />
              Source
            </a>
          )}
          {project.live_url && (
            <a
              href={project.live_url}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 text-brand-400 hover:text-brand-300 text-xs transition-colors"
            >
              <ExternalLink size={14} />
              Live Demo
            </a>
          )}
        </div>
      </div>
    </motion.div>
  );
}
