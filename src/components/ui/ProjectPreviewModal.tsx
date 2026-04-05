'use client';

import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Monitor, Tablet, Smartphone, ExternalLink, GitBranch, AlertTriangle, Loader2, RotateCcw } from 'lucide-react';
import type { Project } from '@/types';

interface Props {
  project: Project;
  onClose: () => void;
}

type Device = 'desktop' | 'tablet' | 'mobile';

const deviceConfig: Record<Device, { width: string; label: string; icon: React.ElementType }> = {
  desktop: { width: '100%',  label: 'Desktop', icon: Monitor },
  tablet:  { width: '768px', label: 'Tablet',  icon: Tablet },
  mobile:  { width: '390px', label: 'Mobile',  icon: Smartphone },
};


function WebPreview({ url, device }: { url: string; device: Device }) {
  const [status, setStatus] = useState<'loading' | 'loaded' | 'error'>('loading');
  const [key, setKey] = useState(0);

  return (
    <div className="flex flex-col items-center w-full h-full gap-3">
      {/* Device switcher */}
      <div className="flex items-center gap-1 p-1 rounded-xl bg-white/5 border border-white/10 shrink-0">
        {(Object.entries(deviceConfig) as [Device, typeof deviceConfig[Device]][]).map(([d, cfg]) => (
          <button key={d} disabled className="px-3 py-1.5 rounded-lg text-xs font-medium text-dark-500 cursor-default">
            <cfg.icon size={13} />
          </button>
        ))}
      </div>

      {/* Frame container */}
      <div
        className="relative rounded-2xl border border-white/10 overflow-hidden bg-white transition-all duration-300 flex-1 w-full"
        style={{ maxWidth: deviceConfig[device].width }}
      >
        {status === 'loading' && (
          <div className="absolute inset-0 flex flex-col items-center justify-center bg-dark-900 z-10 gap-3">
            <Loader2 size={24} className="animate-spin text-brand-400" />
            <p className="text-dark-500 text-sm">Loading preview...</p>
          </div>
        )}
        {status === 'error' && (
          <div className="absolute inset-0 flex flex-col items-center justify-center bg-dark-900 z-10 gap-4 p-6 text-center">
            <AlertTriangle size={32} className="text-amber-400" />
            <div>
              <p className="text-white font-medium mb-1">Preview blocked</p>
              <p className="text-dark-400 text-sm">This site does not allow embedding. Open it directly instead.</p>
            </div>
            <a href={url} target="_blank" rel="noopener noreferrer"
              className="flex items-center gap-2 px-5 py-2.5 bg-brand-600 hover:bg-brand-500 text-white text-sm font-medium rounded-xl transition-all">
              <ExternalLink size={14} /> Open in new tab
            </a>
            <button onClick={() => { setStatus('loading'); setKey(k => k + 1); }}
              className="flex items-center gap-2 text-dark-500 hover:text-white text-xs transition-colors">
              <RotateCcw size={12} /> Retry
            </button>
          </div>
        )}
        <iframe
          key={key}
          src={url}
          className="w-full h-full border-0"
          style={{ minHeight: '500px' }}
          onLoad={() => setStatus('loaded')}
          onError={() => setStatus('error')}
          sandbox="allow-scripts allow-same-origin allow-forms allow-popups allow-pointer-lock"
          title="Project preview"
        />
      </div>
    </div>
  );
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const ModelViewer = 'model-viewer' as any;

function ModelPreview({ url }: { url: string }) {
  const [loaded, setLoaded] = useState(false);

  return (
    <div className="relative w-full flex-1 rounded-2xl overflow-hidden border border-white/10 bg-dark-900" style={{ minHeight: '500px' }}>
      {!loaded && (
        <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 z-10">
          <Loader2 size={24} className="animate-spin text-brand-400" />
          <p className="text-dark-500 text-sm">Loading 3D model...</p>
        </div>
      )}
      <ModelViewer
        src={url}
        alt="3D model preview"
        camera-controls
        auto-rotate
        shadow-intensity="1"
        exposure="0.8"
        style={{ width: '100%', height: '100%', minHeight: '500px', background: 'transparent' }}
        onLoad={() => setLoaded(true)}
      />
      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 px-3 py-1.5 rounded-full bg-dark-900/80 backdrop-blur-sm border border-white/10 text-xs text-dark-400">
        Drag to rotate · Scroll to zoom
      </div>
    </div>
  );
}

function VideoPreview({ url }: { url: string }) {
  return (
    <div className="w-full flex-1 flex items-center justify-center">
      <video
        src={url}
        controls
        autoPlay
        loop
        playsInline
        className="w-full max-h-[600px] rounded-2xl border border-white/10 bg-dark-900 object-contain"
      />
    </div>
  );
}

function SketchfabPreview({ url }: { url: string }) {
  const [loaded, setLoaded] = useState(false);
  return (
    <div className="relative w-full flex-1 rounded-2xl overflow-hidden border border-white/10" style={{ minHeight: '500px' }}>
      {!loaded && (
        <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 bg-dark-900 z-10">
          <Loader2 size={24} className="animate-spin text-brand-400" />
          <p className="text-dark-500 text-sm">Loading Sketchfab...</p>
        </div>
      )}
      <iframe
        src={url}
        className="w-full h-full border-0"
        style={{ minHeight: '500px' }}
        allow="autoplay; fullscreen; xr-spatial-tracking"
        onLoad={() => setLoaded(true)}
        title="Sketchfab 3D preview"
      />
    </div>
  );
}

export default function ProjectPreviewModal({ project, onClose }: Props) {
  const [device, setDevice] = useState<Device>('desktop');

  // Close on Escape
  useEffect(() => {
    const handler = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose(); };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [onClose]);

  const previewUrl = project.preview_url || project.live_url || '';
  const type = project.preview_type;

  return (
    <AnimatePresence>
      <motion.div
        className="fixed inset-0 z-50 flex flex-col"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
      >
        {/* Backdrop */}
        <div className="absolute inset-0 bg-dark-950/95 backdrop-blur-xl" onClick={onClose} />

        {/* Panel */}
        <motion.div
          className="relative z-10 flex flex-col w-full h-full max-w-7xl mx-auto px-4 pt-4 pb-6"
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.05 }}
        >
          {/* Header */}
          <div className="flex items-center gap-4 mb-4 shrink-0">
            <div className="flex-1 min-w-0">
              <h2 className="text-white font-semibold text-lg truncate">{project.title}</h2>
              <p className="text-dark-500 text-xs truncate">{project.description}</p>
            </div>

            {/* Device switcher — only for web */}
            {type === 'web' && (
              <div className="hidden sm:flex items-center gap-1 p-1 rounded-xl bg-white/5 border border-white/10">
                {(Object.entries(deviceConfig) as [Device, typeof deviceConfig[Device]][]).map(([d, cfg]) => (
                  <button key={d} onClick={() => setDevice(d)}
                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${device === d ? 'bg-brand-600 text-white' : 'text-dark-400 hover:text-white hover:bg-white/5'}`}>
                    <cfg.icon size={13} />
                    <span className="hidden md:inline">{cfg.label}</span>
                  </button>
                ))}
              </div>
            )}

            {/* Links */}
            <div className="flex items-center gap-2">
              {project.github_url && (
                <a href={project.github_url} target="_blank" rel="noopener noreferrer"
                  className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-dark-400 hover:text-white text-xs transition-all">
                  <GitBranch size={14} /> Repo
                </a>
              )}
              {previewUrl && (
                <a href={previewUrl} target="_blank" rel="noopener noreferrer"
                  className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-brand-600/20 hover:bg-brand-600/30 border border-brand-500/30 text-brand-300 text-xs transition-all">
                  <ExternalLink size={14} /> Open
                </a>
              )}
              <button onClick={onClose}
                className="p-2 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-dark-400 hover:text-white transition-all">
                <X size={18} />
              </button>
            </div>
          </div>

          {/* Preview area */}
          <div className="flex-1 flex flex-col min-h-0">
            {!type || !previewUrl ? (
              <div className="flex-1 flex flex-col items-center justify-center gap-4 rounded-2xl border border-white/10 bg-white/5">
                <p className="text-dark-500 text-sm">No preview available for this project.</p>
                {project.live_url && (
                  <a href={project.live_url} target="_blank" rel="noopener noreferrer"
                    className="flex items-center gap-2 px-5 py-2.5 bg-brand-600 hover:bg-brand-500 text-white text-sm font-medium rounded-xl transition-all">
                    <ExternalLink size={14} /> Open Live Demo
                  </a>
                )}
              </div>
            ) : type === 'web' ? (
              <WebPreview url={previewUrl} device={device} />
            ) : type === 'model3d' ? (
              <ModelPreview url={previewUrl} />
            ) : type === 'video' ? (
              <VideoPreview url={previewUrl} />
            ) : type === 'sketchfab' ? (
              <SketchfabPreview url={previewUrl} />
            ) : null}
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
