import { z } from 'zod';

export const experienceSchema = z.object({
  title: z.string().min(2, 'Title must be at least 2 characters'),
  company: z.string().min(2, 'Company must be at least 2 characters'),
  start_date: z.string().regex(/^\d{4}-\d{2}$/, 'Use YYYY-MM format'),
  end_date: z.string().regex(/^\d{4}-\d{2}$/, 'Use YYYY-MM format').nullable().optional(),
  is_current: z.boolean(),
  description: z.array(z.string().min(1)).min(1, 'Add at least one bullet point'),
  type: z.enum(['work', 'education', 'competition']),
});

export type ExperienceSchema = z.infer<typeof experienceSchema>;

export const projectSchema = z.object({
  title: z.string().min(2, 'Title must be at least 2 characters'),
  description: z.string().min(10, 'Description must be at least 10 characters'),
  tech_stack: z.array(z.string().min(1)).min(1, 'Add at least one technology'),
  github_url: z.string().url('Must be a valid URL').nullable().optional().or(z.literal('')),
  live_url: z.string().url('Must be a valid URL').nullable().optional().or(z.literal('')),
  image_url: z.string().nullable().optional(),
  is_featured: z.boolean(),
  preview_type: z.enum(['web', 'model3d', 'video', 'sketchfab']).nullable().optional(),
  preview_url: z.string().nullable().optional(),
});

export type ProjectSchema = z.infer<typeof projectSchema>;

export const loginSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
});

export type LoginSchema = z.infer<typeof loginSchema>;
