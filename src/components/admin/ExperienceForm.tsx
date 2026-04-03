'use client';

import { useEffect } from 'react';
import { useForm, useFieldArray, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Plus, Trash2 } from 'lucide-react';
import { experienceSchema, type ExperienceSchema } from '@/lib/validations';
import type { Experience } from '@/types';
import Input from '@/components/ui/Input';
import Select from '@/components/ui/Select';
import Button from '@/components/ui/Button';

interface ExperienceFormProps {
  onSubmit: (data: ExperienceSchema) => Promise<void>;
  defaultValues?: Experience;
  isSubmitting?: boolean;
}

const typeOptions = [
  { value: 'work', label: '💼 Work' },
  { value: 'education', label: '🎓 Education' },
  { value: 'competition', label: '🏆 Competition' },
];

export default function ExperienceForm({ onSubmit, defaultValues, isSubmitting }: ExperienceFormProps) {
  const {
    register,
    handleSubmit,
    control,
    watch,
    setValue,
    formState: { errors },
  } = useForm<ExperienceSchema>({
    resolver: zodResolver(experienceSchema),
    defaultValues: defaultValues
      ? {
          title: defaultValues.title,
          company: defaultValues.company,
          start_date: defaultValues.start_date,
          end_date: defaultValues.end_date ?? undefined,
          is_current: defaultValues.is_current,
          description: defaultValues.description.length > 0 ? defaultValues.description : [''],
          type: defaultValues.type,
        }
      : {
          title: '',
          company: '',
          start_date: '',
          end_date: undefined,
          is_current: false,
          description: [''],
          type: 'work',
        },
  });

  const { fields, append, remove } = useFieldArray({
    control,
    // @ts-expect-error useFieldArray works with string arrays
    name: 'description',
  });

  const isCurrent = watch('is_current');

  useEffect(() => {
    if (isCurrent) setValue('end_date', undefined);
  }, [isCurrent, setValue]);

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
      <div className="grid grid-cols-2 gap-4">
        <Input
          label="Job Title"
          placeholder="e.g. SAP B1 Technical Consultant"
          error={errors.title?.message}
          {...register('title')}
        />
        <Input
          label="Company / Organization"
          placeholder="e.g. Soltius Indonesia"
          error={errors.company?.message}
          {...register('company')}
        />
      </div>

      <Controller
        control={control}
        name="type"
        render={({ field }) => (
          <Select
            label="Type"
            options={typeOptions}
            error={errors.type?.message}
            {...field}
          />
        )}
      />

      <div className="grid grid-cols-2 gap-4">
        <Input
          label="Start Date"
          placeholder="YYYY-MM"
          hint="Format: 2025-08"
          error={errors.start_date?.message}
          {...register('start_date')}
        />
        <Input
          label="End Date"
          placeholder="YYYY-MM"
          hint="Leave blank if current"
          disabled={isCurrent}
          error={errors.end_date?.message}
          {...register('end_date')}
        />
      </div>

      <div className="flex items-center gap-3">
        <input
          type="checkbox"
          id="is_current"
          className="w-4 h-4 rounded border-dark-600 bg-dark-800 text-brand-600 focus:ring-brand-500/50 cursor-pointer"
          {...register('is_current')}
        />
        <label htmlFor="is_current" className="text-sm text-dark-300 cursor-pointer">
          Currently working here
        </label>
      </div>

      {/* Description bullet points */}
      <div>
        <label className="block text-sm font-medium text-dark-300 mb-2">
          Description (bullet points)
        </label>
        <div className="space-y-2">
          {fields.map((field, index) => (
            <div key={field.id} className="flex gap-2">
              <input
                className="flex-1 bg-dark-800/80 border border-dark-600 text-dark-100 placeholder-dark-500 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:border-brand-500 focus:ring-brand-500/20 transition-all duration-200"
                placeholder={`Bullet point ${index + 1}`}
                {...register(`description.${index}` as const)}
              />
              {fields.length > 1 && (
                <button
                  type="button"
                  onClick={() => remove(index)}
                  className="p-2.5 rounded-xl bg-red-500/10 hover:bg-red-500/20 text-red-400 border border-red-500/20 transition-colors"
                >
                  <Trash2 size={15} />
                </button>
              )}
            </div>
          ))}
        </div>
        {errors.description && (
          <p className="mt-1.5 text-xs text-red-400">
            {Array.isArray(errors.description)
              ? errors.description[0]?.message
              : (errors.description as { message?: string })?.message}
          </p>
        )}
        <button
          type="button"
          onClick={() => append('')}
          className="mt-2 flex items-center gap-1.5 text-sm text-brand-400 hover:text-brand-300 transition-colors"
        >
          <Plus size={15} />
          Add bullet point
        </button>
      </div>

      <div className="flex justify-end gap-3 pt-2">
        <Button type="submit" loading={isSubmitting} size="md">
          {defaultValues ? 'Save Changes' : 'Create Experience'}
        </Button>
      </div>
    </form>
  );
}
