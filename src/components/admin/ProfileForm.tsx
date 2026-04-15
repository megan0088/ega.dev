'use client';

import { useEffect, useState } from 'react';
import { useForm, useFieldArray, useWatch } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Plus, Trash2, Save, Loader2, Eye, EyeOff } from 'lucide-react';
import Image from 'next/image';
import { getProfile, upsertProfile } from '@/lib/api/profile';
import Input from '@/components/ui/Input';
import Textarea from '@/components/ui/Textarea';
import Button from '@/components/ui/Button';
import ImageUpload from '@/components/ui/ImageUpload';
import toast from 'react-hot-toast';

const profileSchema = z.object({
  name: z.string().min(2, 'Required'),
  title: z.string().min(2, 'Required'),
  title_id: z.string().nullable().optional(),
  subtitle: z.string().min(2, 'Required'),
  subtitle_id: z.string().nullable().optional(),
  bio: z.string().min(10, 'Required'),
  bio_id: z.string().nullable().optional(),
  bio2: z.string().min(10, 'Required'),
  bio2_id: z.string().nullable().optional(),
  avatar_url: z.string().nullable().optional(),
  status_text: z.string().min(2, 'Required'),
  status_text_id: z.string().nullable().optional(),
  currently_learning: z.string().nullable().optional(),
  tech_badges: z.array(z.string().min(1)),
  github_url: z.string().nullable().optional(),
  linkedin_url: z.string().nullable().optional(),
  email: z.string().email('Invalid email').nullable().optional(),
  phone: z.string().nullable().optional(),
  instagram_url: z.string().nullable().optional(),
  seo_title: z.string().nullable().optional(),
  seo_description: z.string().nullable().optional(),
  cv_url: z.string().nullable().optional(),
});

type ProfileSchema = z.infer<typeof profileSchema>;

function LivePreview({ data }: { data: ProfileSchema }) {
  return (
    <div className="rounded-2xl bg-dark-950 border border-white/10 overflow-hidden">
      <div className="px-4 py-2 bg-white/5 border-b border-white/10 flex items-center gap-2">
        <div className="flex gap-1.5">
          <div className="w-2.5 h-2.5 rounded-full bg-red-500/60" />
          <div className="w-2.5 h-2.5 rounded-full bg-yellow-500/60" />
          <div className="w-2.5 h-2.5 rounded-full bg-emerald-500/60" />
        </div>
        <span className="text-dark-600 text-xs ml-2 font-mono">preview — hero section</span>
      </div>
      <div className="p-6 flex flex-col md:flex-row items-center gap-6">
        {/* Avatar preview */}
        <div className="relative w-20 h-20 rounded-full overflow-hidden bg-dark-800 border-2 border-brand-500/40 shrink-0">
          {data.avatar_url ? (
            <Image src={data.avatar_url} alt="avatar" fill className="object-cover" />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-dark-600 text-xs">No photo</div>
          )}
        </div>

        {/* Text preview */}
        <div className="flex-1 min-w-0 text-center md:text-left">
          {data.status_text && (
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs mb-3">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
              {data.status_text}
            </div>
          )}
          <h3 className="text-lg font-bold text-white leading-tight mb-1">
            {data.name || 'Your Name'}
          </h3>
          <p className="text-brand-400 text-sm font-medium mb-2">
            {data.title || 'Your Title'}
          </p>
          <p className="text-dark-500 text-xs leading-relaxed mb-3 line-clamp-2">
            {data.subtitle || 'Your subtitle here...'}
          </p>
          {data.tech_badges.filter(Boolean).length > 0 && (
            <div className="flex flex-wrap gap-1.5">
              {data.tech_badges.filter(Boolean).map((badge, i) => (
                <span key={i} className="px-2 py-0.5 rounded-full text-xs font-mono bg-white/5 border border-white/10 text-dark-400">
                  {badge}
                </span>
              ))}
            </div>
          )}
          {data.currently_learning && (
            <div className="mt-3 inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-brand-500/10 border border-brand-500/30 text-brand-300 text-xs">
              <span className="w-1.5 h-1.5 rounded-full bg-brand-500 animate-pulse" />
              Learning — {data.currently_learning}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default function ProfileForm() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [showPreview, setShowPreview] = useState(true);

  const { register, handleSubmit, control, reset, setValue, formState: { errors } } = useForm<ProfileSchema>({
    resolver: zodResolver(profileSchema),
    defaultValues: { tech_badges: [''] },
  });

  const { fields, append, remove } = useFieldArray({
    control,
    // @ts-expect-error useFieldArray works with string arrays
    name: 'tech_badges',
  });

  const watchedValues = useWatch({ control });

  useEffect(() => {
    getProfile().then((profile) => {
      if (profile) {
        reset({
          ...profile,
          tech_badges: profile.tech_badges.length > 0 ? profile.tech_badges : [''],
          seo_title: (profile as ProfileSchema & { seo_title?: string }).seo_title ?? '',
          seo_description: (profile as ProfileSchema & { seo_description?: string }).seo_description ?? '',
        });
      }
      setLoading(false);
    });
  }, [reset]);

  const onSubmit = async (data: ProfileSchema) => {
    setSaving(true);
    try {
      await upsertProfile({
        ...data,
        tech_badges: data.tech_badges.filter(Boolean),
        avatar_url: data.avatar_url || null,
        currently_learning: data.currently_learning || null,
        github_url: data.github_url || null,
        linkedin_url: data.linkedin_url || null,
        email: data.email || null,
        phone: data.phone || null,
        instagram_url: data.instagram_url || null,
        cv_url: data.cv_url || null,
      });
      toast.success('Profile saved!');
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Failed to save');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 size={24} className="animate-spin text-dark-400" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Preview toggle */}
      <div className="flex items-center justify-between">
        <p className="text-dark-500 text-sm">Changes are reflected live in the preview.</p>
        <button
          type="button"
          onClick={() => setShowPreview(!showPreview)}
          className="flex items-center gap-2 text-sm text-dark-400 hover:text-white transition-colors"
        >
          {showPreview ? <EyeOff size={15} /> : <Eye size={15} />}
          {showPreview ? 'Hide Preview' : 'Show Preview'}
        </button>
      </div>

      {/* Live Preview */}
      {showPreview && <LivePreview data={watchedValues as ProfileSchema} />}

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">

        {/* Identity */}
        <div>
          <h3 className="text-xs font-semibold text-dark-500 uppercase tracking-widest mb-4 flex items-center gap-3">
            <span className="flex-1 h-px bg-white/10" />Identity<span className="flex-1 h-px bg-white/10" />
          </h3>
          <div className="space-y-4">
            <ImageUpload
              label="Profile Photo"
              value={watchedValues.avatar_url}
              onChange={(url) => setValue('avatar_url', url)}
              folder="avatars"
            />
            <div className="grid grid-cols-2 gap-4">
              <Input label="Full Name" error={errors.name?.message} placeholder="Muhamad Ega Nugraha" {...register('name')} />
              <Input label="Job Title" error={errors.title?.message} placeholder="Software Engineer & SAP B1 Consultant" {...register('title')} />
            </div>
            <Textarea label="Subtitle / Tagline" error={errors.subtitle?.message} placeholder="Building innovative digital solutions..." {...register('subtitle')} />
          </div>
        </div>

        {/* Status */}
        <div>
          <h3 className="text-xs font-semibold text-dark-500 uppercase tracking-widest mb-4 flex items-center gap-3">
            <span className="flex-1 h-px bg-white/10" />Status Badge<span className="flex-1 h-px bg-white/10" />
          </h3>
          <div className="grid grid-cols-2 gap-4">
            <Input label="Status Text" error={errors.status_text?.message} placeholder="Available for opportunities" {...register('status_text')} />
            <Input label="Currently Learning" error={errors.currently_learning?.message} placeholder="Apple Developer Academy — Cohort 9" {...register('currently_learning')} />
          </div>
        </div>

        {/* About */}
        <div>
          <h3 className="text-xs font-semibold text-dark-500 uppercase tracking-widest mb-4 flex items-center gap-3">
            <span className="flex-1 h-px bg-white/10" />About Section<span className="flex-1 h-px bg-white/10" />
          </h3>
          <div className="space-y-4">
            <Textarea label="Bio — paragraph 1" error={errors.bio?.message} placeholder="A passionate software engineer..." {...register('bio')} />
            <Textarea label="Bio — paragraph 2" error={errors.bio2?.message} placeholder="Currently working as..." {...register('bio2')} />
          </div>
        </div>

        {/* Indonesian content */}
        <div>
          <h3 className="text-xs font-semibold text-dark-500 uppercase tracking-widest mb-1 flex items-center gap-3">
            <span className="flex-1 h-px bg-white/10" />🇮🇩 Konten Bahasa Indonesia<span className="flex-1 h-px bg-white/10" />
          </h3>
          <p className="text-dark-600 text-xs mb-4">Opsional — jika kosong, versi Inggris akan digunakan.</p>
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <Input label="Jabatan (ID)" placeholder="Software Engineer & Konsultan SAP B1" {...register('title_id')} />
              <Input label="Status Badge (ID)" placeholder="Tersedia untuk peluang baru" {...register('status_text_id')} />
            </div>
            <Textarea label="Subtitle / Tagline (ID)" placeholder="Membangun solusi digital inovatif..." {...register('subtitle_id')} />
            <Textarea label="Bio — paragraf 1 (ID)" placeholder="Software engineer yang bersemangat..." {...register('bio_id')} />
            <Textarea label="Bio — paragraf 2 (ID)" placeholder="Saat ini bekerja sebagai..." {...register('bio2_id')} />
          </div>
        </div>

        {/* Tech Badges */}
        <div>
          <h3 className="text-xs font-semibold text-dark-500 uppercase tracking-widest mb-4 flex items-center gap-3">
            <span className="flex-1 h-px bg-white/10" />Tech Badges (Hero)<span className="flex-1 h-px bg-white/10" />
          </h3>
          <div className="space-y-2">
            {fields.map((field, index) => (
              <div key={field.id} className="flex gap-2">
                <input
                  className="flex-1 bg-dark-800/80 border border-dark-600 text-dark-100 placeholder-dark-500 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:border-brand-500 focus:ring-brand-500/20 transition-all"
                  placeholder="e.g. Next.js"
                  {...register(`tech_badges.${index}` as const)}
                />
                {fields.length > 1 && (
                  <button type="button" onClick={() => remove(index)}
                    className="p-2.5 rounded-xl bg-red-500/10 hover:bg-red-500/20 text-red-400 border border-red-500/20 transition-colors">
                    <Trash2 size={15} />
                  </button>
                )}
              </div>
            ))}
            <button type="button" onClick={() => append('')}
              className="flex items-center gap-1.5 text-sm text-brand-400 hover:text-brand-300 transition-colors mt-1">
              <Plus size={15} />Add badge
            </button>
          </div>
        </div>

        {/* Contact */}
        <div>
          <h3 className="text-xs font-semibold text-dark-500 uppercase tracking-widest mb-4 flex items-center gap-3">
            <span className="flex-1 h-px bg-white/10" />Contact Info<span className="flex-1 h-px bg-white/10" />
          </h3>
          <div className="grid grid-cols-2 gap-4">
            <Input label="Email" type="email" error={errors.email?.message} placeholder="you@gmail.com" {...register('email')} />
            <Input label="Phone" error={errors.phone?.message} placeholder="+62 812-xxxx-xxxx" {...register('phone')} />
            <Input label="GitHub URL" error={errors.github_url?.message} placeholder="https://github.com/..." {...register('github_url')} />
            <Input label="LinkedIn URL" error={errors.linkedin_url?.message} placeholder="https://linkedin.com/in/..." {...register('linkedin_url')} />
            <Input label="Instagram URL" error={errors.instagram_url?.message} placeholder="https://instagram.com/..." {...register('instagram_url')} />
          </div>
        </div>

        {/* SEO */}
        <div>
          <h3 className="text-xs font-semibold text-dark-500 uppercase tracking-widest mb-4 flex items-center gap-3">
            <span className="flex-1 h-px bg-white/10" />SEO Settings<span className="flex-1 h-px bg-white/10" />
          </h3>
          <div className="space-y-4">
            <Input label="SEO Title" error={errors.seo_title?.message} placeholder="Muhamad Ega Nugraha — Software Engineer" {...register('seo_title')} hint="Shown on browser tab and Google search results" />
            <Textarea label="SEO Description" error={errors.seo_description?.message} placeholder="Full-stack developer, Flutter engineer, and SAP B1 Technical Consultant based in Indonesia." {...register('seo_description')} hint="Shown in Google search results (max 160 characters)" />
          </div>
        </div>

        {/* CV */}
        <div>
          <h3 className="text-xs font-semibold text-dark-500 uppercase tracking-widest mb-4 flex items-center gap-3">
            <span className="flex-1 h-px bg-white/10" />CV / Resume<span className="flex-1 h-px bg-white/10" />
          </h3>
          <Input label="CV URL" error={errors.cv_url?.message} placeholder="https://drive.google.com/..." {...register('cv_url')} hint="Direct link to your CV file (Google Drive, Dropbox, etc). A Download CV button will appear on the hero section." />
        </div>

        <div className="flex justify-end pt-2">
          <Button type="submit" loading={saving} size="lg">
            <Save size={16} />
            Save Profile
          </Button>
        </div>
      </form>
    </div>
  );
}
