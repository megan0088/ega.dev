'use client';

import { useState, useRef } from 'react';
import Image from 'next/image';
import { Upload, X, Loader2, ImageIcon } from 'lucide-react';
import { createClient } from '@/lib/supabase/client';
import { cn } from '@/lib/utils';
import toast from 'react-hot-toast';

interface ImageUploadProps {
  value: string | null | undefined;
  onChange: (url: string | null) => void;
  bucket?: string;
  folder?: string;
  label?: string;
  className?: string;
}

export default function ImageUpload({
  value,
  onChange,
  bucket = 'portfolio',
  folder = 'uploads',
  label = 'Upload Image',
  className,
}: ImageUploadProps) {
  const [uploading, setUploading] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate type & size
    if (!file.type.startsWith('image/')) {
      toast.error('Please select an image file');
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      toast.error('Image must be smaller than 5MB');
      return;
    }

    setUploading(true);
    const supabase = createClient();

    // Unique filename
    const ext = file.name.split('.').pop();
    const filename = `${folder}/${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`;

    const { data, error } = await supabase.storage
      .from(bucket)
      .upload(filename, file, { upsert: true });

    if (error) {
      toast.error('Upload failed: ' + error.message);
      setUploading(false);
      return;
    }

    const { data: { publicUrl } } = supabase.storage
      .from(bucket)
      .getPublicUrl(data.path);

    onChange(publicUrl);
    toast.success('Image uploaded!');
    setUploading(false);

    // Reset input
    if (inputRef.current) inputRef.current.value = '';
  };

  const handleRemove = () => {
    onChange(null);
  };

  return (
    <div className={cn('w-full', className)}>
      {label && (
        <label className="block text-sm font-medium text-dark-300 mb-2">{label}</label>
      )}

      <div className="flex items-start gap-4">
        {/* Preview */}
        <div className="relative w-24 h-24 rounded-xl overflow-hidden bg-dark-800 border border-dark-600 flex items-center justify-center shrink-0">
          {value ? (
            <>
              <Image src={value} alt="Preview" fill className="object-cover" />
              <button
                type="button"
                onClick={handleRemove}
                className="absolute top-1 right-1 w-5 h-5 rounded-full bg-red-500 flex items-center justify-center hover:bg-red-400 transition-colors"
              >
                <X size={10} className="text-white" />
              </button>
            </>
          ) : (
            <ImageIcon size={24} className="text-dark-600" />
          )}
        </div>

        {/* Upload area */}
        <div className="flex-1">
          <input
            ref={inputRef}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={handleUpload}
            disabled={uploading}
          />
          <button
            type="button"
            onClick={() => inputRef.current?.click()}
            disabled={uploading}
            className="w-full flex flex-col items-center justify-center gap-2 px-4 py-5 rounded-xl border-2 border-dashed border-dark-600 hover:border-brand-500/50 hover:bg-brand-500/5 text-dark-400 hover:text-dark-300 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {uploading ? (
              <>
                <Loader2 size={20} className="animate-spin" />
                <span className="text-xs">Uploading...</span>
              </>
            ) : (
              <>
                <Upload size={20} />
                <span className="text-xs text-center">
                  Click to upload<br />
                  <span className="text-dark-600">PNG, JPG, WEBP up to 5MB</span>
                </span>
              </>
            )}
          </button>

          {value && (
            <p className="mt-2 text-xs text-dark-600 truncate" title={value}>
              {value.split('/').pop()}
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
