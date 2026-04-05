'use client';

import { useRef, useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { GitBranch, ExternalLink, Star, Play, Box, Video, Layers, Globe } from 'lucide-react';
import Image from 'next/image';
import type { Project } from '@/types';
import Badge from '@/components/ui/Badge';
import ProjectPreviewModal from '@/components/ui/ProjectPreviewModal';
import { useLang } from '@/lib/lang-context';

interface ProjectsSectionProps {
  projects: Project[];
}

const badgeVariants = ['blue', 'purple', 'cyan', 'emerald', 'rose'] as const;

const IOT_KEYWORDS = ['mqtt', 'blynk', 'esp', 'raspberry', 'arduino', 'iot', 'embedded', 'hardware', 'c#', '.net', 'sensor'];

function isIoT(project: Project) {
  return project.tech_stack.some(t =>
    IOT_KEYWORDS.some(kw => t.toLowerCase().includes(kw))
  );
}

const previewTypeIcon = {
  web:       Globe,
  model3d:   Box,
  video:     Video,
  sketchfab: Layers,
};

const previewTypeLabel = {
  web:       'Try it',
  model3d:   'View 3D',
  video:     'Watch',
  sketchfab: 'View 3D',
};

/* ─── 3D tilt hook ─── */
interface TiltState { rx: number; ry: number; gx: number; gy: number; go: number }
const flatTilt: TiltState = { rx: 0, ry: 0, gx: 50, gy: 50, go: 0 };

function useTilt() {
  const ref = useRef<HTMLDivElement>(null);
  const [tilt, setTilt] = useState<TiltState>(flatTilt);
  const [hovered, setHovered] = useState(false);

  const onMove = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    const card = ref.current; if (!card) return;
    const r = card.getBoundingClientRect();
    const x = e.clientX - r.left, y = e.clientY - r.top;
    setTilt({ rx: ((y - r.height/2) / (r.height/2)) * -10, ry: ((x - r.width/2) / (r.width/2)) * 10, gx: (x/r.width)*100, gy: (y/r.height)*100, go: 0.12 });
  }, []);
  const onEnter = useCallback(() => setHovered(true), []);
  const onLeave = useCallback(() => { setHovered(false); setTilt(flatTilt); }, []);

  return { ref, tilt, hovered, onMove, onEnter, onLeave };
}

/* ─── Bento span helper ─── */
// 6-col grid, pattern cycles for visual rhythm
const bentoPatterns = [
  { col: 'md:col-span-4', tall: true  },  // 0: big
  { col: 'md:col-span-2', tall: false },  // 1: small
  { col: 'md:col-span-2', tall: false },  // 2: small
  { col: 'md:col-span-2', tall: false },  // 3: small
  { col: 'md:col-span-4', tall: false },  // 4: wide
  { col: 'md:col-span-3', tall: false },  // 5: half
  { col: 'md:col-span-3', tall: false },  // 6: half
];

/* ─── IoT Badge ─── */
function IotBadge() {
  return (
    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-medium bg-cyan-500/15 border border-cyan-500/30 text-cyan-300">
      <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse" />
      IoT
    </span>
  );
}

/* ─── Project card ─── */
function ProjectCard({ project, index, large = false }: { project: Project; index: number; large?: boolean }) {
  const { tr } = useLang();
  const { ref, tilt, hovered, onMove, onEnter, onLeave } = useTilt();
  const [previewOpen, setPreviewOpen] = useState(false);
  const iot = isIoT(project);
  const hasPreview = !!(project.preview_type && (project.preview_url || project.live_url));
  const PreviewIcon = project.preview_type ? previewTypeIcon[project.preview_type] : Play;
  const previewLabel = project.preview_type ? previewTypeLabel[project.preview_type] : 'Try it';

  return (
    <>
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ delay: index * 0.07, duration: 0.45 }}
        style={{ perspective: '1000px' }}
      >
        <div
          ref={ref}
          onMouseMove={onMove}
          onMouseEnter={onEnter}
          onMouseLeave={onLeave}
          style={{
            transform: `rotateX(${tilt.rx}deg) rotateY(${tilt.ry}deg) scale(${hovered ? 1.025 : 1})`,
            transition: hovered ? 'transform 0.1s ease-out' : 'transform 0.45s ease-out',
            transformStyle: 'preserve-3d',
          }}
          className={`relative flex flex-col rounded-2xl bg-white/5 border overflow-hidden cursor-default h-full
            ${iot ? 'border-cyan-500/20 hover:border-cyan-500/40' : 'border-white/10 hover:border-white/20'}
            transition-colors duration-300`}
        >
          {/* Glare */}
          <div className="absolute inset-0 z-10 rounded-2xl pointer-events-none"
            style={{ background: `radial-gradient(circle at ${tilt.gx}% ${tilt.gy}%, rgba(255,255,255,${tilt.go}), transparent 60%)` }} />

          {/* IoT glow border */}
          {iot && hovered && (
            <div className="absolute inset-0 z-10 rounded-2xl pointer-events-none"
              style={{ boxShadow: '0 0 24px rgba(34,211,238,0.12), inset 0 0 24px rgba(34,211,238,0.04)' }} />
          )}

          {/* Image */}
          {project.image_url && (
            <div
              className={`relative w-full overflow-hidden bg-dark-800 ${large ? 'h-52' : 'h-40'}`}
              style={{ transform: hovered ? 'translateZ(8px)' : 'translateZ(0)', transition: 'transform 0.3s ease-out', transformStyle: 'preserve-3d' }}
            >
              <Image src={project.image_url} alt={project.title} fill className="object-cover"
                style={{ transform: hovered ? 'scale(1.06)' : 'scale(1)', transition: 'transform 0.5s ease-out' }} />
              <div className="absolute inset-0 bg-gradient-to-t from-dark-950/80 to-transparent" />

              {/* Preview button overlay on image */}
              {hasPreview && (
                <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                  <motion.button
                    onClick={() => setPreviewOpen(true)}
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.95 }}
                    className="flex items-center gap-2 px-4 py-2 bg-white/20 backdrop-blur-md border border-white/30 text-white text-sm font-medium rounded-full"
                  >
                    <PreviewIcon size={14} /> {previewLabel}
                  </motion.button>
                </div>
              )}
            </div>
          )}

          {/* Content */}
          <div
            className="flex flex-col flex-1 p-5 relative z-[1]"
            style={{ transform: hovered ? 'translateZ(16px)' : 'translateZ(0)', transition: 'transform 0.3s ease-out' }}
          >
            {/* Title row */}
            <div className="flex items-start gap-2 mb-2">
              <h3 className="font-semibold text-white text-base leading-snug flex-1">{project.title}</h3>
              <div className="flex items-center gap-1.5 shrink-0">
                {iot && <IotBadge />}
                {project.is_featured && (
                  <span className="flex items-center gap-1 px-2 py-0.5 rounded-full bg-yellow-500/15 text-yellow-400 text-[10px] border border-yellow-500/30">
                    <Star size={9} />{tr.projects.featured}
                  </span>
                )}
              </div>
            </div>

            <p className="text-dark-400 text-sm leading-relaxed mb-4 flex-1">{project.description}</p>

            <div className="flex flex-wrap gap-1.5 mb-4">
              {project.tech_stack.map((tech, i) => (
                <Badge key={tech} variant={badgeVariants[i % badgeVariants.length]}>{tech}</Badge>
              ))}
            </div>

            {/* Action row */}
            <div className="flex items-center gap-3">
              {project.github_url && (
                <a href={project.github_url} target="_blank" rel="noopener noreferrer"
                  className="flex items-center gap-1.5 text-dark-400 hover:text-white text-xs transition-colors">
                  <GitBranch size={13} />{tr.projects.source}
                </a>
              )}
              {project.live_url && (
                <a href={project.live_url} target="_blank" rel="noopener noreferrer"
                  className="flex items-center gap-1.5 text-brand-400 hover:text-brand-300 text-xs transition-colors">
                  <ExternalLink size={13} />{tr.projects.liveDemo}
                </a>
              )}

              {/* Preview / Try it button */}
              {hasPreview && (
                <button
                  onClick={() => setPreviewOpen(true)}
                  className={`ml-auto flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium border transition-all
                    ${iot
                      ? 'bg-cyan-500/10 border-cyan-500/30 text-cyan-300 hover:bg-cyan-500/20'
                      : 'bg-brand-500/10 border-brand-500/30 text-brand-300 hover:bg-brand-500/20'
                    }`}
                >
                  <PreviewIcon size={12} />
                  {previewLabel}
                </button>
              )}
            </div>
          </div>
        </div>
      </motion.div>

      {/* Preview Modal */}
      <AnimatePresence>
        {previewOpen && (
          <ProjectPreviewModal project={project} onClose={() => setPreviewOpen(false)} />
        )}
      </AnimatePresence>
    </>
  );
}

/* ─── Section ─── */
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
          <div className="grid grid-cols-1 md:grid-cols-6 gap-4 auto-rows-auto">
            {projects.map((project, i) => {
              const pattern = bentoPatterns[i % bentoPatterns.length];
              // Featured always get the big tile
              const isFeaturedBig = project.is_featured && i === 0;
              const colSpan  = isFeaturedBig ? 'md:col-span-4' : (project.is_featured ? 'md:col-span-3' : pattern.col);
              const rowClass  = (isFeaturedBig || pattern.tall) ? 'md:row-span-2' : '';

              return (
                <div key={project.id} className={`${colSpan} ${rowClass} group`}>
                  <ProjectCard project={project} index={i} large={isFeaturedBig || pattern.tall} />
                </div>
              );
            })}
          </div>
        )}
      </div>
    </section>
  );
}
