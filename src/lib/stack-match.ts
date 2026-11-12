import type { Project } from '@/types';

// Match keyword as a whole word (not substring) — so 'ai' doesn't match 'Tailwind',
// 'ml' doesn't match 'HTML', 'rag' doesn't match 'Storage', etc.
export function buildPatterns(keywords: readonly string[]): RegExp[] {
  return keywords.map(kw => {
    const escaped = kw.toLowerCase().replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    return new RegExp(`(^|[^a-z0-9])${escaped}([^a-z0-9]|$)`, 'i');
  });
}

export function matchesKeywords(project: Project, patterns: RegExp[]): boolean {
  return project.tech_stack.some(tech => patterns.some(re => re.test(tech.toLowerCase())));
}

export function getRelatedProjects(projects: Project[], keywords: readonly string[]): Project[] {
  const patterns = buildPatterns(keywords);
  return projects.filter(p => matchesKeywords(p, patterns));
}

/** Categories used by the project filter. Order = display order. */
export const PROJECT_CATEGORIES = [
  { id: 'ai',      keywords: ['ai', 'llm', 'openrouter', 'openai', 'claude', 'gpt', 'gemini', 'machine learning', 'ml', 'tensorflow', 'pytorch', 'langchain', 'rag', 'hugging face', 'huggingface', 'nlp', 'opencv', 'ocr', 'tesseract'] },
  { id: 'ios',     keywords: ['swift', 'swiftui', 'ios', 'xcode', 'uikit', 'spritekit', 'appkit', 'arkit', 'combine', 'core data', 'activitykit', 'macos'] },
  { id: 'web',     keywords: ['next', 'next.js', 'react', 'typescript', 'javascript', 'tailwind', 'html', 'css', 'vue', 'nuxt', 'laravel', 'web'] },
  { id: 'mobile',  keywords: ['flutter', 'dart', 'react native', 'kotlin', 'android'] },
  { id: 'backend', keywords: ['supabase', 'firebase', 'mysql', 'postgresql', 'mongodb', 'node', 'express', 'rest', 'api', 'hana', 'sap', 'laravel', 'backend'] },
  { id: 'iot',     keywords: ['mqtt', 'blynk', 'esp8266', 'esp32', 'raspberry', 'arduino', 'iot', 'embedded', 'sensor'] },
] as const;

export type ProjectCategoryId = typeof PROJECT_CATEGORIES[number]['id'];

/** Split a profile title like "iOS Developer · AI Engineer & Software Engineer" into roles. */
export function splitRoles(title: string): string[] {
  const roles = title.split(/\s+[·|•&]\s+|\s+\/\s+/).map(r => r.trim()).filter(Boolean);
  return roles.length > 0 ? roles : [title];
}

/** 0812-xxxx / +62 812 xxxx → 62812xxxx (wa.me format). */
export function toWhatsAppNumber(phone: string): string {
  const digits = phone.replace(/\D/g, '');
  return digits.startsWith('0') ? `62${digits.slice(1)}` : digits;
}
