'use client';

import { useForm, useFieldArray, useWatch } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Plus, Trash2, Globe, Box, Video, Layers } from 'lucide-react';
import { projectSchema, type ProjectSchema } from '@/lib/validations';
import type { Project } from '@/types';
import Input from '@/components/ui/Input';
import Textarea from '@/components/ui/Textarea';
import Button from '@/components/ui/Button';
import ImageUpload from '@/components/ui/ImageUpload';

interface ProjectFormProps {
  onSubmit: (data: ProjectSchema) => Promise<void>;
  defaultValues?: Project;
  isSubmitting?: boolean;
}

const previewTypes = [
  { value: 'web',       label: 'Web / iframe',     icon: Globe,  hint: 'Embed website directly (needs live URL)' },
  { value: 'model3d',   label: '3D Model (.glb)',   icon: Box,    hint: 'Interactive 3D model viewer' },
  { value: 'video',     label: 'Video (.mp4)',       icon: Video,  hint: 'Video showcase / animation reel' },
  { value: 'sketchfab', label: 'Sketchfab',          icon: Layers, hint: 'Embed from Sketchfab URL' },
] as const;

export default function ProjectForm({ onSubmit, defaultValues, isSubmitting }: ProjectFormProps) {
  const { register, handleSubmit, control, setValue, watch, formState: { errors } } = useForm<ProjectSchema>({
    resolver: zodResolver(projectSchema),
    defaultValues: defaultValues
      ? {
          title:          defaultValues.title,
          title_id:       defaultValues.title_id       ?? '',
          description:    defaultValues.description,
          description_id: defaultValues.description_id ?? '',
          tech_stack:     defaultValues.tech_stack.length > 0 ? defaultValues.tech_stack : [''],
          github_url:     defaultValues.github_url  ?? '',
          live_url:       defaultValues.live_url    ?? '',
          image_url:      defaultValues.image_url   ?? '',
          is_featured:    defaultValues.is_featured,
          preview_type:   defaultValues.preview_type ?? null,
          preview_url:    defaultValues.preview_url  ?? '',
        }
      : {
          title: '', title_id: '', description: '', description_id: '',
          tech_stack: [''], github_url: '', live_url: '', image_url: '',
          is_featured: false, preview_type: null, preview_url: '',
        },
  });

  const { fields, append, remove } = useFieldArray({
    control,
    // @ts-expect-error useFieldArray works with string arrays
    name: 'tech_stack',
  });

  const imageUrl    = useWatch({ control, name: 'image_url' });
  const previewUrl  = useWatch({ control, name: 'preview_url' });
  const previewType = watch('preview_type');

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
      <Input label="Project Title (EN)" placeholder="e.g. SiapAda App" error={errors.title?.message} {...register('title')} />

      <Textarea label="Description (EN)" placeholder="Brief description of what the project does..."
        error={errors.description?.message} {...register('description')} />

      {/* Indonesian */}
      <div className="border border-white/10 rounded-xl p-4 space-y-3">
        <div>
          <p className="text-xs font-semibold text-dark-500 uppercase tracking-widest mb-0.5">🇮🇩 Bahasa Indonesia</p>
          <p className="text-dark-600 text-xs">Opsional — jika kosong, versi Inggris akan ditampilkan.</p>
        </div>
        <Input label="Judul Proyek (ID)" placeholder="mis. Aplikasi SiapAda" {...register('title_id')} />
        <Textarea label="Deskripsi (ID)" placeholder="Deskripsi singkat tentang proyek ini..." {...register('description_id')} />
      </div>

      {/* Tech stack */}
      <div>
        <label className="block text-sm font-medium text-dark-300 mb-2">Tech Stack</label>
        <div className="space-y-2">
          {fields.map((field, index) => (
            <div key={field.id} className="flex gap-2">
              <input
                className="flex-1 bg-dark-800/80 border border-dark-600 text-dark-100 placeholder-dark-500 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:border-brand-500 focus:ring-brand-500/20 transition-all"
                placeholder="e.g. Flutter, Next.js"
                {...register(`tech_stack.${index}` as const)}
              />
              {fields.length > 1 && (
                <button type="button" onClick={() => remove(index)}
                  className="p-2.5 rounded-xl bg-red-500/10 hover:bg-red-500/20 text-red-400 border border-red-500/20 transition-colors">
                  <Trash2 size={15} />
                </button>
              )}
            </div>
          ))}
        </div>
        <button type="button" onClick={() => append('')}
          className="mt-2 flex items-center gap-1.5 text-sm text-brand-400 hover:text-brand-300 transition-colors">
          <Plus size={15} />Add technology
        </button>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <Input label="GitHub URL" placeholder="https://github.com/..." error={errors.github_url?.message} {...register('github_url')} />
        <Input label="Live URL" placeholder="https://..." error={errors.live_url?.message} {...register('live_url')} />
      </div>

      {/* Image Upload */}
      <ImageUpload label="Project Image" value={imageUrl} onChange={(url) => setValue('image_url', url ?? '')} folder="projects" />

      {/* Preview / Sandbox */}
      <div>
        <label className="block text-sm font-medium text-dark-300 mb-2">Interactive Preview</label>
        <p className="text-xs text-dark-500 mb-3">Let visitors try your project directly on the portfolio.</p>

        {/* Type selector */}
        <div className="grid grid-cols-2 gap-2 mb-3">
          <button type="button" onClick={() => setValue('preview_type', null)}
            className={`py-2.5 px-3 rounded-xl border text-xs font-medium transition-all text-left ${!previewType ? 'border-brand-500 bg-brand-500/10 text-brand-300' : 'border-white/10 text-dark-500 hover:border-white/20'}`}>
            No preview
          </button>
          {previewTypes.map(({ value, label, icon: Icon, hint }) => (
            <button key={value} type="button" onClick={() => setValue('preview_type', value)}
              className={`py-2.5 px-3 rounded-xl border text-xs font-medium transition-all text-left flex items-start gap-2 ${previewType === value ? 'border-brand-500 bg-brand-500/10 text-brand-300' : 'border-white/10 text-dark-500 hover:border-white/20'}`}>
              <Icon size={13} className="mt-0.5 shrink-0" />
              <div>
                <div>{label}</div>
                <div className={`text-[10px] mt-0.5 ${previewType === value ? 'text-brand-400/70' : 'text-dark-600'}`}>{hint}</div>
              </div>
            </button>
          ))}
        </div>

        {/* Preview URL / upload based on type */}
        {previewType === 'web' && (
          <Input label="Preview URL (defaults to Live URL if empty)"
            placeholder="https://yourapp.com"
            hint="Site must allow iframe embedding"
            {...register('preview_url')} />
        )}
        {previewType === 'sketchfab' && (
          <Input label="Sketchfab Embed URL"
            placeholder="https://sketchfab.com/models/xxx/embed"
            hint="Copy embed URL from Sketchfab share dialog"
            {...register('preview_url')} />
        )}
        {previewType === 'model3d' && (
          <ImageUpload
            label="Upload 3D Model (.glb / .gltf)"
            value={previewUrl}
            onChange={(url) => setValue('preview_url', url ?? '')}
            folder="models"
          />
        )}
        {previewType === 'video' && (
          <ImageUpload
            label="Upload Video (.mp4 / .webm)"
            value={previewUrl}
            onChange={(url) => setValue('preview_url', url ?? '')}
            folder="videos"
          />
        )}
      </div>

      <div className="flex items-center gap-3">
        <input type="checkbox" id="is_featured"
          className="w-4 h-4 rounded border-dark-600 bg-dark-800 text-brand-600 focus:ring-brand-500/50 cursor-pointer"
          {...register('is_featured')} />
        <label htmlFor="is_featured" className="text-sm text-dark-300 cursor-pointer">
          Feature this project (shown prominently)
        </label>
      </div>

      <div className="flex justify-end pt-2">
        <Button type="submit" loading={isSubmitting}>
          {defaultValues ? 'Save Changes' : 'Create Project'}
        </Button>
      </div>
    </form>
  );
}
