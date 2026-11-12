-- ============================================================
-- Suggested hero / SEO copy — review and edit BEFORE running.
-- Run in Supabase → SQL Editor, or type the same values in /admin.
--
-- The hero now types out each role in `title` one by one.
-- Separate roles with " · " (or " & " / " | ").
-- Keep only the roles you are actually applying for.
-- ============================================================

UPDATE profile SET
  title           = 'Software Engineer · iOS Developer · AI Engineer',
  title_id        = 'Software Engineer · iOS Developer · AI Engineer',
  subtitle        = 'I build native iOS apps with Swift and SwiftUI, AI-powered products with LLMs, and full-stack web apps — backed by enterprise experience with SAP Business One.',
  subtitle_id     = 'Saya membangun aplikasi iOS native dengan Swift dan SwiftUI, produk berbasis AI dengan LLM, dan aplikasi web full-stack — dengan pengalaman enterprise di SAP Business One.',
  tech_badges     = ARRAY['Swift', 'SwiftUI', 'Python', 'LLM', 'Next.js', 'TypeScript', 'Supabase', 'SAP B1'],
  seo_title       = 'Muhamad Ega Nugraha — Software Engineer (iOS · AI · Full-Stack)',
  seo_description = 'Software engineer based in Indonesia building native iOS apps with Swift and SwiftUI, AI-powered products, and full-stack web apps.',
  updated_at      = now();
