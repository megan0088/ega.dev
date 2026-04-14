-- ============================================================
-- Ega Portfolio — Supabase Schema
-- Run this in: Supabase Dashboard → SQL Editor
-- ============================================================

-- ============================================================
-- Storage bucket for image uploads
-- ============================================================
INSERT INTO storage.buckets (id, name, public)
VALUES ('portfolio', 'portfolio', true)
ON CONFLICT (id) DO NOTHING;

-- Storage policies
DROP POLICY IF EXISTS "Public can view portfolio files" ON storage.objects;
CREATE POLICY "Public can view portfolio files"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'portfolio');

DROP POLICY IF EXISTS "Authenticated users can upload portfolio files" ON storage.objects;
CREATE POLICY "Authenticated users can upload portfolio files"
  ON storage.objects FOR INSERT
  WITH CHECK (bucket_id = 'portfolio' AND auth.role() = 'authenticated');

DROP POLICY IF EXISTS "Authenticated users can delete portfolio files" ON storage.objects;
CREATE POLICY "Authenticated users can delete portfolio files"
  ON storage.objects FOR DELETE
  USING (bucket_id = 'portfolio' AND auth.role() = 'authenticated');

-- Experiences table
CREATE TABLE IF NOT EXISTS experiences (
  id          UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title       TEXT NOT NULL,
  company     TEXT NOT NULL,
  start_date  TEXT NOT NULL,          -- format: YYYY-MM
  end_date    TEXT,                   -- format: YYYY-MM, null if current
  is_current  BOOLEAN DEFAULT FALSE,
  description TEXT[] DEFAULT '{}',   -- array of bullet points
  type        TEXT CHECK (type IN ('work', 'education', 'competition')) NOT NULL DEFAULT 'work',
  created_at  TIMESTAMPTZ DEFAULT NOW()
);

-- Projects table
CREATE TABLE IF NOT EXISTS projects (
  id          UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title       TEXT NOT NULL,
  description TEXT NOT NULL,
  tech_stack  TEXT[] DEFAULT '{}',
  github_url  TEXT,
  live_url    TEXT,
  image_url   TEXT,
  is_featured BOOLEAN DEFAULT FALSE,
  created_at  TIMESTAMPTZ DEFAULT NOW()
);

-- Profile table (single row)
CREATE TABLE IF NOT EXISTS profile (
  id                  INTEGER PRIMARY KEY DEFAULT 1,
  name                TEXT NOT NULL DEFAULT 'Muhamad Ega Nugraha',
  title               TEXT NOT NULL DEFAULT 'Software Engineer & SAP B1 Technical Consultant',
  subtitle            TEXT NOT NULL DEFAULT 'Building innovative digital solutions.',
  bio                 TEXT NOT NULL DEFAULT '',
  bio2                TEXT NOT NULL DEFAULT '',
  avatar_url          TEXT,
  status_text         TEXT NOT NULL DEFAULT 'Available for opportunities',
  currently_learning  TEXT,
  tech_badges         TEXT[] DEFAULT '{}',
  github_url          TEXT,
  linkedin_url        TEXT,
  email               TEXT,
  phone               TEXT,
  instagram_url       TEXT,
  seo_title           TEXT,
  seo_description     TEXT,
  updated_at          TIMESTAMPTZ DEFAULT NOW(),
  CONSTRAINT profile_single_row CHECK (id = 1)
);

-- Skill categories table
CREATE TABLE IF NOT EXISTS skill_categories (
  id          UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name        TEXT NOT NULL,
  color       TEXT NOT NULL DEFAULT 'from-brand-500 to-brand-400',
  sort_order  INTEGER NOT NULL DEFAULT 0,
  created_at  TIMESTAMPTZ DEFAULT NOW()
);

-- Skills table
CREATE TABLE IF NOT EXISTS skills (
  id          UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  category_id UUID NOT NULL REFERENCES skill_categories(id) ON DELETE CASCADE,
  name        TEXT NOT NULL,
  level       INTEGER NOT NULL DEFAULT 80 CHECK (level >= 0 AND level <= 100),
  sort_order  INTEGER NOT NULL DEFAULT 0,
  created_at  TIMESTAMPTZ DEFAULT NOW()
);

-- Add SEO columns if not yet exist (safe migration for existing deployments)
ALTER TABLE profile ADD COLUMN IF NOT EXISTS seo_title TEXT;
ALTER TABLE profile ADD COLUMN IF NOT EXISTS seo_description TEXT;

-- Add project preview columns
ALTER TABLE projects ADD COLUMN IF NOT EXISTS preview_type TEXT CHECK (preview_type IN ('web','model3d','video','sketchfab'));
ALTER TABLE projects ADD COLUMN IF NOT EXISTS preview_url TEXT;

-- ============================================================
-- Row Level Security (RLS)
-- ============================================================

ALTER TABLE experiences ENABLE ROW LEVEL SECURITY;
ALTER TABLE projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE profile ENABLE ROW LEVEL SECURITY;
ALTER TABLE skill_categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE skills ENABLE ROW LEVEL SECURITY;

-- Drop existing policies first (safe to re-run)
DROP POLICY IF EXISTS "Public can read experiences" ON experiences;
DROP POLICY IF EXISTS "Public can read projects" ON projects;
DROP POLICY IF EXISTS "Public can read profile" ON profile;
DROP POLICY IF EXISTS "Public can read skill_categories" ON skill_categories;
DROP POLICY IF EXISTS "Public can read skills" ON skills;
DROP POLICY IF EXISTS "Authenticated users can upsert profile" ON profile;
DROP POLICY IF EXISTS "Authenticated users can manage skill_categories" ON skill_categories;
DROP POLICY IF EXISTS "Authenticated users can manage skills" ON skills;
DROP POLICY IF EXISTS "Authenticated users can insert experiences" ON experiences;
DROP POLICY IF EXISTS "Authenticated users can update experiences" ON experiences;
DROP POLICY IF EXISTS "Authenticated users can delete experiences" ON experiences;
DROP POLICY IF EXISTS "Authenticated users can insert projects" ON projects;
DROP POLICY IF EXISTS "Authenticated users can update projects" ON projects;
DROP POLICY IF EXISTS "Authenticated users can delete projects" ON projects;

-- Public read access (portfolio page)
CREATE POLICY "Public can read experiences"
  ON experiences FOR SELECT USING (true);

CREATE POLICY "Public can read projects"
  ON projects FOR SELECT USING (true);

-- Public read: profile, skill_categories, skills
CREATE POLICY "Public can read profile"
  ON profile FOR SELECT USING (true);

CREATE POLICY "Public can read skill_categories"
  ON skill_categories FOR SELECT USING (true);

CREATE POLICY "Public can read skills"
  ON skills FOR SELECT USING (true);

-- Authenticated write: profile
CREATE POLICY "Authenticated users can upsert profile"
  ON profile FOR ALL USING (auth.role() = 'authenticated');

-- Authenticated write: skill_categories
CREATE POLICY "Authenticated users can manage skill_categories"
  ON skill_categories FOR ALL USING (auth.role() = 'authenticated');

-- Authenticated write: skills
CREATE POLICY "Authenticated users can manage skills"
  ON skills FOR ALL USING (auth.role() = 'authenticated');

-- Authenticated write access (admin dashboard)
CREATE POLICY "Authenticated users can insert experiences"
  ON experiences FOR INSERT WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Authenticated users can update experiences"
  ON experiences FOR UPDATE USING (auth.role() = 'authenticated');

CREATE POLICY "Authenticated users can delete experiences"
  ON experiences FOR DELETE USING (auth.role() = 'authenticated');

CREATE POLICY "Authenticated users can insert projects"
  ON projects FOR INSERT WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Authenticated users can update projects"
  ON projects FOR UPDATE USING (auth.role() = 'authenticated');

CREATE POLICY "Authenticated users can delete projects"
  ON projects FOR DELETE USING (auth.role() = 'authenticated');

-- ============================================================
-- Seed data (from resume)
-- ============================================================

INSERT INTO experiences (title, company, start_date, end_date, is_current, description, type) VALUES
(
  'SAP B1 Technical Consultant',
  'Soltius Indonesia',
  '2025-08',
  NULL,
  TRUE,
  ARRAY[
    'Develop custom Add-ons and system modifications using SAP B1 SDK (C# / .NET)',
    'Write and optimize Stored Procedures, Views, and complex queries for SAP HANA and MS SQL Server',
    'Design and maintain technical reports using Crystal Reports and HANA Pervasive Analytics',
    'Manage system connectivity and data exchange via Service Layer or B1iF (Integration Framework)',
    'Provide advanced technical support, bug fixing, and ensure system stability',
    'Integration between SAP and AI systems'
  ],
  'work'
),
(
  'Traffic Officer',
  'Freelance – JMTO',
  '2024-04',
  '2025-04',
  FALSE,
  ARRAY[
    'Managed traffic control on Jagorawi Toll Road during Ied Fitr',
    'Helped reduce congestion compared to the previous year'
  ],
  'work'
),
(
  'IT Helper',
  'PT Batik Organik',
  '2023-03',
  '2023-10',
  FALSE,
  ARRAY[
    'Assisted in digitalizing product inventory',
    'Migrated product database to a cloud server'
  ],
  'work'
),
(
  'IT Officer',
  'PT Duta Kecantikan Indonesia',
  '2023-01',
  '2023-04',
  FALSE,
  ARRAY[
    'Maintained office network, hardware, and software',
    'Built and launched WordPress-based marketplace (dutacantikindonesia.com)',
    'Developed ad landing pages and managed NComputing setup',
    'Fixed hardware issues and handled network bandwidth'
  ],
  'work'
),
(
  'PPS (Voting Committee)',
  'KPU (General Elections Commission)',
  '2023-06',
  '2024-01',
  FALSE,
  ARRAY[
    'Organized and supervised local voting',
    'Ensured transparent, accurate, and orderly election process'
  ],
  'work'
),
(
  'Diploma in Computer Engineering',
  'IPB University',
  '2019-08',
  '2022-09',
  FALSE,
  ARRAY[
    'Graduate at September 2022',
    'Focused on IoT, hardware programming, and software development'
  ],
  'education'
),
(
  'Kompetisi Innovator Muda – Hacker',
  'Kompetisi Innovator Muda',
  '2024-08',
  '2024-08',
  FALSE,
  ARRAY[
    'Built a complete business case and mockup from scratch in 1 day',
    'Developed SiapAda Apps concept and prototype'
  ],
  'competition'
),
(
  'Front-End Developer',
  'GOTO Hackathon 2023',
  '2023-12',
  '2023-12',
  FALSE,
  ARRAY[
    'Built a mobile marketplace app in 1 day',
    'Presented the solution to judges'
  ],
  'competition'
);

-- ============================================================
-- Seed: Profile
-- ============================================================
INSERT INTO profile (id, name, title, subtitle, bio, bio2, status_text, currently_learning, tech_badges, github_url, linkedin_url, email, phone, instagram_url)
VALUES (
  1,
  'Muhamad Ega Nugraha',
  'Software Engineer & SAP B1 Technical Consultant',
  'Building innovative digital solutions — from full-stack web apps and Flutter mobile apps to IoT systems and enterprise SAP integrations.',
  'A passionate software engineer with a Diploma in Computer Engineering from IPB University. I specialize in building full-stack web apps, cross-platform mobile apps, and enterprise SAP B1 integrations.',
  'Currently working as a SAP B1 Technical Consultant at Soltius Indonesia — developing custom Add-ons, optimizing stored procedures, and integrating SAP with AI systems.',
  'Available for opportunities',
  'Apple Developer Academy Binus — Cohort 9',
  ARRAY['Next.js', 'Flutter', 'TypeScript', 'Supabase', 'SAP B1', 'Swift'],
  'https://github.com/megan0088',
  'https://linkedin.com/in/ega-nugraha',
  'eganeue@gmail.com',
  '+62 812-9314-8932',
  'https://instagram.com/eganugraha08'
) ON CONFLICT (id) DO NOTHING;

-- ============================================================
-- Seed: Skill Categories & Skills
-- ============================================================
WITH cat1 AS (
  INSERT INTO skill_categories (name, color, sort_order) VALUES ('Languages', 'from-brand-500 to-brand-400', 0) RETURNING id
),
cat2 AS (
  INSERT INTO skill_categories (name, color, sort_order) VALUES ('Frontend & Mobile', 'from-accent-purple to-purple-400', 1) RETURNING id
),
cat3 AS (
  INSERT INTO skill_categories (name, color, sort_order) VALUES ('Backend & Database', 'from-accent-emerald to-emerald-400', 2) RETURNING id
),
cat4 AS (
  INSERT INTO skill_categories (name, color, sort_order) VALUES ('Tools & Others', 'from-accent-cyan to-cyan-400', 3) RETURNING id
),
cat5 AS (
  INSERT INTO skill_categories (name, color, sort_order) VALUES ('3D Design & Animation', 'from-orange-400 to-amber-400', 4) RETURNING id
)
INSERT INTO skills (category_id, name, level, sort_order) VALUES
  ((SELECT id FROM cat1), 'TypeScript / JavaScript', 85, 0),
  ((SELECT id FROM cat1), 'Dart (Flutter)', 85, 1),
  ((SELECT id FROM cat1), 'C# (.NET / SAP SDK)', 70, 2),
  ((SELECT id FROM cat1), 'C / C++', 60, 3),
  ((SELECT id FROM cat1), 'Swift (iOS)', 40, 4),
  ((SELECT id FROM cat2), 'Next.js / React', 85, 0),
  ((SELECT id FROM cat2), 'Flutter', 85, 1),
  ((SELECT id FROM cat2), 'Tailwind CSS', 90, 2),
  ((SELECT id FROM cat2), 'Framer Motion', 75, 3),
  ((SELECT id FROM cat2), 'React Native', 55, 4),
  ((SELECT id FROM cat3), 'Supabase / PostgreSQL', 80, 0),
  ((SELECT id FROM cat3), 'Firebase', 75, 1),
  ((SELECT id FROM cat3), 'MySQL', 75, 2),
  ((SELECT id FROM cat3), 'SAP HANA', 65, 3),
  ((SELECT id FROM cat3), 'REST APIs', 85, 4),
  ((SELECT id FROM cat4), 'Git & GitHub', 85, 0),
  ((SELECT id FROM cat4), 'Figma', 70, 1),
  ((SELECT id FROM cat4), 'Postman', 80, 2),
  ((SELECT id FROM cat4), 'IoT (MQTT / ESP8266)', 70, 3),
  ((SELECT id FROM cat4), 'SAP Business One', 75, 4),
  ((SELECT id FROM cat5), '3D Sculpting', 100, 0),
  ((SELECT id FROM cat5), 'Character Rigging', 100, 1),
  ((SELECT id FROM cat5), 'Keyframe Animation', 100, 2),
  ((SELECT id FROM cat5), 'UV Mapping & Texturing', 100, 3),
  ((SELECT id FROM cat5), 'Rendering & Lighting', 100, 4);

-- ============================================================
-- Seed: Projects
-- Run only the INSERT block if starting fresh.
-- Run the UPDATE block if you already have data in the table.
-- ============================================================

INSERT INTO projects (title, description, tech_stack, github_url, live_url, image_url, is_featured, preview_type, preview_url) VALUES

-- ── Featured ──────────────────────────────────────────────────────────────
(
  'Holticura',
  'An end-to-end IoT monitoring system for ginger plant cultivation, built to help small-scale farmers in North Sumatra. An Arduino Uno collects real-time soil moisture, pH, and TDS (nutrient) readings via analog sensors and streams the data to the Blynk IoT dashboard over Wi-Fi using an ESP8266 module. Farmers can monitor field conditions remotely from any device and receive automated alerts when values fall outside healthy thresholds.',
  ARRAY['Arduino', 'C++', 'ESP8266', 'Blynk', 'IoT', 'Sensor'],
  'https://github.com/megan0088/holticura',
  NULL, NULL, TRUE, NULL, NULL
),
(
  'Plate Recognition',
  'A full-stack license plate detection system combining a Python/Flask REST API with a Flutter mobile client. The backend processes uploaded images through an OpenCV pipeline to isolate the plate region, then feeds the result to Tesseract OCR to extract the plate number. The Flutter app lets users capture or pick an image, calls the API, and displays the recognized plate in real time — targeting use cases like toll management and traffic monitoring.',
  ARRAY['Python', 'Flask', 'OpenCV', 'Tesseract OCR', 'Flutter', 'Dart', 'REST API'],
  'https://github.com/megan0088/plate_recognition',
  NULL, NULL, TRUE, NULL, NULL
),
(
  'Karir AI',
  'An AI-powered career counseling app built with Flutter. Users input their interests, existing skills, and life goals; the app sends the profile to an LLM via the OpenRouter API and returns a personalized career roadmap with actionable next steps. State is managed with GetX, consultation history is persisted locally, and the UI features Lottie animations and Google Fonts for a polished experience.',
  ARRAY['Flutter', 'Dart', 'OpenRouter API', 'LLM', 'GetX', 'Lottie'],
  'https://github.com/megan0088/karir_ai',
  NULL, NULL, FALSE, NULL, NULL
),
(
  'Jarvis',
  'A macOS companion app built entirely in Swift and SwiftUI. A floating pet-buddy lives persistently on your desktop and sends contextual wellness reminders — drink water, stretch, take a break, eat — based on elapsed time. The pet''s mood and animation state evolve dynamically depending on how consistently you respond to its nudges, creating a light gamified loop that encourages healthier work habits.',
  ARRAY['Swift', 'SwiftUI', 'SpriteKit', 'AppKit', 'ActivityKit'],
  'https://github.com/megan0088/Jarvis',
  NULL, NULL, FALSE, NULL, NULL
),

-- ── Web ───────────────────────────────────────────────────────────────────
(
  'Rekomendasi Film',
  'A movie discovery platform built with Next.js 14 and the TMDB API. The home page surfaces trending and top-rated titles; a live search bar queries the API as you type. Each movie opens a detail page with cast, synopsis, runtime, and a "Similar Movies" section. The UI is fully responsive and server-side rendered for fast initial loads.',
  ARRAY['Next.js 14', 'TypeScript', 'Tailwind CSS', 'TMDB API', 'SSR'],
  'https://github.com/megan0088/rekomendasi-film',
  NULL, NULL, FALSE, NULL, NULL
),
(
  'Toko Online',
  'A lightweight e-commerce storefront powered by Next.js 14 and the Fake Store API. Products are fetched server-side and rendered in a responsive grid with category filtering. Each product has a dedicated detail page with add-to-cart interaction. Built as a demonstration of Next.js App Router conventions, dynamic routing, and server components.',
  ARRAY['Next.js 14', 'TypeScript', 'Tailwind CSS', 'Fake Store API', 'App Router'],
  'https://github.com/megan0088/toko-online',
  'https://toko-online-jade.vercel.app',
  NULL, FALSE, NULL, NULL
),

-- ── Mobile ────────────────────────────────────────────────────────────────
(
  'EnterKomFlix',
  'A feature-complete movie browsing app built in Flutter for a technical assessment. The home screen shows Now Playing and Popular sections (sourced from TMDB), with support for adding films to a personal Watchlist or Favorites. Users can log in or browse as a guest. The detail screen includes full movie info, genre tags, and a Similar Movies carousel — all managed with clean widget composition.',
  ARRAY['Flutter', 'Dart', 'TMDB API', 'Mobile'],
  'https://github.com/megan0088/EnterKomFlix',
  NULL, NULL, FALSE, NULL, NULL
),
(
  'Kotlin News App',
  'An Android news reader app built natively in Kotlin. Fetches live headlines from a news API and displays them in a RecyclerView with article thumbnails, titles, and source info. Tapping an article opens the full content in a detail screen. Demonstrates core Android development patterns: ViewModel, LiveData, Retrofit, and RecyclerView with a clean MVVM structure.',
  ARRAY['Kotlin', 'Android', 'Retrofit', 'MVVM', 'LiveData'],
  'https://github.com/megan0088/kotlin_newsapp',
  NULL, NULL, FALSE, NULL, NULL
)

ON CONFLICT DO NOTHING;

-- ============================================================
-- Update existing rows (run this if you already ran the INSERT above
-- in a previous session — safe to run multiple times)
-- ============================================================

UPDATE projects SET
  description  = 'An end-to-end IoT monitoring system for ginger plant cultivation, built to help small-scale farmers in North Sumatra. An Arduino Uno collects real-time soil moisture, pH, and TDS (nutrient) readings via analog sensors and streams the data to the Blynk IoT dashboard over Wi-Fi using an ESP8266 module. Farmers can monitor field conditions remotely from any device and receive automated alerts when values fall outside healthy thresholds.',
  tech_stack   = ARRAY['Arduino', 'C++', 'ESP8266', 'Blynk', 'IoT', 'Sensor'],
  is_featured  = TRUE
WHERE title = 'Holticura';

UPDATE projects SET
  description  = 'A full-stack license plate detection system combining a Python/Flask REST API with a Flutter mobile client. The backend processes uploaded images through an OpenCV pipeline to isolate the plate region, then feeds the result to Tesseract OCR to extract the plate number. The Flutter app lets users capture or pick an image, calls the API, and displays the recognized plate in real time.',
  tech_stack   = ARRAY['Python', 'Flask', 'OpenCV', 'Tesseract OCR', 'Flutter', 'Dart', 'REST API'],
  is_featured  = TRUE
WHERE title = 'Plate Recognition';

UPDATE projects SET
  description  = 'An AI-powered career counseling app built with Flutter. Users input their interests, existing skills, and life goals; the app sends the profile to an LLM via the OpenRouter API and returns a personalized career roadmap with actionable next steps. State is managed with GetX and consultation history is persisted locally.',
  tech_stack   = ARRAY['Flutter', 'Dart', 'OpenRouter API', 'LLM', 'GetX', 'Lottie']
WHERE title = 'Karir AI';

UPDATE projects SET
  description  = 'A macOS companion app built entirely in Swift and SwiftUI. A floating pet-buddy lives persistently on your desktop and sends contextual wellness reminders based on elapsed time. The pet''s mood and animation state evolve dynamically depending on how consistently you respond to its nudges, creating a light gamified loop that encourages healthier work habits.',
  is_featured  = FALSE
WHERE title = 'Jarvis';

UPDATE projects SET
  description  = 'A movie discovery platform built with Next.js 14 and the TMDB API. The home page surfaces trending and top-rated titles; a live search bar queries the API as you type. Each movie opens a detail page with cast, synopsis, runtime, and a Similar Movies section. Fully responsive and server-side rendered.',
  tech_stack   = ARRAY['Next.js 14', 'TypeScript', 'Tailwind CSS', 'TMDB API', 'SSR'],
  live_url     = NULL,
  preview_url  = NULL,
  preview_type = NULL
WHERE title = 'Rekomendasi Film';

UPDATE projects SET
  description  = 'A lightweight e-commerce storefront powered by Next.js 14 and the Fake Store API. Products are fetched server-side and rendered in a responsive grid with category filtering. Each product has a dedicated detail page with add-to-cart interaction. Built as a demonstration of Next.js App Router conventions, dynamic routing, and server components.',
  tech_stack   = ARRAY['Next.js 14', 'TypeScript', 'Tailwind CSS', 'Fake Store API', 'App Router'],
  preview_url  = NULL,
  preview_type = NULL
WHERE title = 'Toko Online';
