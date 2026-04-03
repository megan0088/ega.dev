import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatDate(dateString: string): string {
  if (!dateString) return '';
  const date = new Date(dateString + '-01');
  return date.toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
}

export function formatDateRange(startDate: string, endDate: string | null | undefined, isCurrent: boolean): string {
  const start = formatDate(startDate);
  if (isCurrent) return `${start} – Present`;
  if (!endDate) return start;
  return `${start} – ${formatDate(endDate)}`;
}
