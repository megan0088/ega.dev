'use client';

import { useRef, useState, useCallback } from 'react';
import { motion } from 'framer-motion';
import { GitBranch, ExternalLink, Star } from 'lucide-react';
import Image from 'next/image';
import type { Project } from '@/types';
import Badge from '@/components/ui/Badge';
import { useLang } from '@/lib/lang-context';

interface ProjectsSectionProps {
  projects: Project[];
}

const badgeVariants = ['blue', 'purple', 'cyan', 'emerald', 'rose'] as const;

interface TiltState {
  rotateX: number;
  rotateY: number;
  glareX: number;
  glareY: number;
  glareOpacity: number;
}

function ProjectCard({ project, index, large = false }: { project: Project; index: number; large?: boolean }) {
  const { tr } = useLang();
  const cardRef = useRef<HTMLDivElement>(null);
  const [tilt, setTilt] = useState<TiltState>({ rotateX: 0, rotateY: 0, glareX: 50, glareY: 50, glareOpacity: 0 });
  const [isHovered, setIsHovered] = useState(false);

  const handleMouseMove = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    const card = cardRef.current;
    if (!card) return;
    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;
    setTilt({
      rotateX: ((y - centerY) / centerY) * -12,
      rotateY: ((x - centerX) / centerX) * 12,
      glareX: (x / rect.width) * 100,
      glareY: (y / rect.height) * 100,
      glareOpacity: 0.15,
    });
  }, []);

  const handleMouseLeave = useCallback(() => {
    setIsHovered(false);
    setTilt({ rotateX: 0, rotateY: 0, glareX: 50, glareY: 50, glareOpacity: 0 });
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.1, duration: 0.5 }}
      style={{ perspective: '1000px' }}
    >
      <div
        ref={cardRef}
        onMouseMove={handleMouseMove}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={handleMouseLeave}
        style={{
          transform: `rotateX(${tilt.rotateX}deg) rotateY(${tilt.rotateY}deg) scale(${isHovered ? 1.03 : 1})`,
          transition: isHovered ? 'transform 0.1s ease-out' : 'transform 0.5s ease-out',
          transformStyle: 'preserve-3d',
          willChange: 'transform',
        }}
        className="relative flex flex-col rounded-2xl bg-white/5 border border-white/10 overflow-hidden cursor-pointer"
      >
        {/* Glare */}
        <div
          className="absolute inset-0 z-10 rounded-2xl pointer-events-none"
          style={{ background: `radial-gradient(circle at ${tilt.glareX}% ${tilt.glareY}%, rgba(255,255,255,${tilt.glareOpacity}), transparent 60%)` }}
        />
        {/* Border glow */}
        <div
          className="absolute inset-0 z-10 rounded-2xl pointer-events-none transition-opacity duration-300"
          style={{ boxShadow: isHovered ? '0 0 30px rgba(99,102,241,0.15), inset 0 0 30px rgba(99,102,241,0.05)' : 'none', opacity: isHovered ? 1 : 0 }}
        />

        {project.image_url && (
          <div
            className={`relative w-full overflow-hidden ${large ? 'h-52' : 'h-40'} bg-dark-800`}
            style={{ transform: isHovered ? 'translateZ(10px)' : 'translateZ(0)', transition: 'transform 0.3s ease-out', transformStyle: 'preserve-3d' }}
          >
            <Image src={project.image_url} alt={project.title} fill className="object-cover"
              style={{ transform: isHovered ? 'scale(1.07)' : 'scale(1)', transition: 'transform 0.5s ease-out' }} />
            <div className="absolute inset-0 bg-gradient-to-t from-dark-950/80 to-transparent" />
          </div>
        )}

        <div
          className="flex flex-col flex-1 p-5 relative z-[1]"
          style={{ transform: isHovered ? 'translateZ(20px)' : 'translateZ(0)', transition: 'transform 0.3s ease-out' }}
        >
          <div className="flex items-start justify-between gap-2 mb-2">
            <h3 className="font-semibold text-white text-base leading-snug">{project.title}</h3>
            {project.is_featured && (
              <span className="shrink-0 flex items-center gap-1 px-2 py-0.5 rounded-full bg-yellow-500/15 text-yellow-400 text-xs border border-yellow-500/30">
                <Star size={10} />{tr.projects.featured}
              </span>
            )}
          </div>

          <p className="text-dark-400 text-sm leading-relaxed mb-4 flex-1">{project.description}</p>

          <div className="flex flex-wrap gap-1.5 mb-4">
            {project.tech_stack.map((tech, i) => (
              <Badge key={tech} variant={badgeVariants[i % badgeVariants.length]}>{tech}</Badge>
            ))}
          </div>

          <div className="flex items-center gap-3">
            {project.github_url && (
              <a href={project.github_url} target="_blank" rel="noopener noreferrer"
                className="flex items-center gap-1.5 text-dark-400 hover:text-white text-xs transition-colors">
                <GitBranch size={14} />{tr.projects.source}
              </a>
            )}
            {project.live_url && (
              <a href={project.live_url} target="_blank" rel="noopener noreferrer"
                className="flex items-center gap-1.5 text-brand-400 hover:text-brand-300 text-xs transition-colors">
                <ExternalLink size={14} />{tr.projects.liveDemo}
              </a>
            )}
          </div>
        </div>
      </div>
    </motion.div>
  );
}

export default function ProjectsSection({ projects }: ProjectsSectionProps) {
  const { tr } = useLang();
  const featured = projects.filter(p => p.is_featured);
  const rest      = projects.filter(p => !p.is_featured);

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
            <span className="text-brand-400">// </span>{tr.projects.tag}
          </div>
          <h2 className="text-4xl md:text-5xl font-bold text-white">{tr.projects.title}</h2>
        </motion.div>

        {projects.length === 0 ? (
          <div className="text-center py-20 text-dark-500">{tr.projects.empty}</div>
        ) : (
          <>
            {featured.length > 0 && (
              <div className="grid md:grid-cols-2 gap-6 mb-6">
                {featured.map((p, i) => <ProjectCard key={p.id} project={p} index={i} large />)}
              </div>
            )}
            {rest.length > 0 && (
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
                {rest.map((p, i) => <ProjectCard key={p.id} project={p} index={i} />)}
              </div>
            )}
          </>
        )}
      </div>
    </section>
  );
}
