'use client';

import { useEffect, useState } from 'react';
import { useForm, useFieldArray } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Plus, Trash2, Save, Loader2 } from 'lucide-react';
import { getProfile, upsertProfile } from '@/lib/api/profile';
import Input from '@/components/ui/Input';
import Textarea from '@/components/ui/Textarea';
import Button from '@/components/ui/Button';
import toast from 'react-hot-toast';

const profileSchema = z.object({
  name: z.string().min(2, 'Required'),
  title: z.string().min(2, 'Required'),
  subtitle: z.string().min(2, 'Required'),
  bio: z.string().min(10, 'Required'),
  bio2: z.string().min(10, 'Required'),
  avatar_url: z.string().nullable().optional(),
  status_text: z.string().min(2, 'Required'),
  currently_learning: z.string().nullable().optional(),
  tech_badges: z.array(z.string().min(1)),
  github_url: z.string().nullable().optional(),
  linkedin_url: z.string().nullable().optional(),
  email: z.string().email('Invalid email').nullable().optional(),
  phone: z.string().nullable().optional(),
  instagram_url: z.string().nullable().optional(),
});

type ProfileSchema = z.infer<typeof profileSchema>;

export default function ProfileForm() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const { register, handleSubmit, control, reset, formState: { errors } } = useForm<ProfileSchema>({
    resolver: zodResolver(profileSchema),
    defaultValues: { tech_badges: [''] },
  });

  const { fields, append, remove } = useFieldArray({
    control,
    // @ts-expect-error useFieldArray works with string arrays
    name: 'tech_badges',
  });

  useEffect(() => {
    getProfile().then((profile) => {
      if (profile) {
        reset({
          ...profile,
          tech_badges: profile.tech_badges.length > 0 ? profile.tech_badges : [''],
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
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">

      {/* Identity */}
      <div>
        <h3 className="text-sm font-semibold text-dark-400 uppercase tracking-widest mb-4 flex items-center gap-3">
          <span className="flex-1 h-px bg-white/10" />Identity<span className="flex-1 h-px bg-white/10" />
        </h3>
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <Input label="Full Name" error={errors.name?.message} placeholder="Muhamad Ega Nugraha" {...register('name')} />
            <Input label="Job Title" error={errors.title?.message} placeholder="Software Engineer & SAP B1 Consultant" {...register('title')} />
          </div>
          <Input label="Subtitle / Tagline" error={errors.subtitle?.message} placeholder="Building innovative digital solutions..." {...register('subtitle')} />
          <Input label="Avatar URL" error={errors.avatar_url?.message} placeholder="https://... or leave blank for GitHub avatar" {...register('avatar_url')} />
        </div>
      </div>

      {/* Status */}
      <div>
        <h3 className="text-sm font-semibold text-dark-400 uppercase tracking-widest mb-4 flex items-center gap-3">
          <span className="flex-1 h-px bg-white/10" />Status Badge<span className="flex-1 h-px bg-white/10" />
        </h3>
        <div className="space-y-4">
          <Input label="Status Text" error={errors.status_text?.message} placeholder="Available for opportunities" {...register('status_text')} />
          <Input label="Currently Learning (optional)" error={errors.currently_learning?.message} placeholder="Apple Developer Academy Binus — Cohort 9" {...register('currently_learning')} />
        </div>
      </div>

      {/* About */}
      <div>
        <h3 className="text-sm font-semibold text-dark-400 uppercase tracking-widest mb-4 flex items-center gap-3">
          <span className="flex-1 h-px bg-white/10" />About Section<span className="flex-1 h-px bg-white/10" />
        </h3>
        <div className="space-y-4">
          <Textarea label="Bio (paragraph 1)" error={errors.bio?.message} placeholder="A passionate software engineer..." {...register('bio')} />
          <Textarea label="Bio (paragraph 2)" error={errors.bio2?.message} placeholder="Currently working as..." {...register('bio2')} />
        </div>
      </div>

      {/* Tech Badges */}
      <div>
        <h3 className="text-sm font-semibold text-dark-400 uppercase tracking-widest mb-4 flex items-center gap-3">
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
        <h3 className="text-sm font-semibold text-dark-400 uppercase tracking-widest mb-4 flex items-center gap-3">
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

      <div className="flex justify-end pt-2">
        <Button type="submit" loading={saving} size="lg">
          <Save size={16} />
          Save Profile
        </Button>
      </div>
    </form>
  );
}
