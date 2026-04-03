import { cn } from '@/lib/utils';

interface BadgeProps {
  children: React.ReactNode;
  variant?: 'blue' | 'purple' | 'cyan' | 'emerald' | 'rose' | 'default';
  className?: string;
}

const variantClasses = {
  blue: 'bg-brand-500/15 text-brand-300 border border-brand-500/30',
  purple: 'bg-purple-500/15 text-purple-300 border border-purple-500/30',
  cyan: 'bg-cyan-500/15 text-cyan-300 border border-cyan-500/30',
  emerald: 'bg-emerald-500/15 text-emerald-300 border border-emerald-500/30',
  rose: 'bg-rose-500/15 text-rose-300 border border-rose-500/30',
  default: 'bg-white/5 text-dark-300 border border-white/10',
};

export default function Badge({ children, variant = 'default', className }: BadgeProps) {
  return (
    <span className={cn('inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium', variantClasses[variant], className)}>
      {children}
    </span>
  );
}
