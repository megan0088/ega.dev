-- ============================================================
-- Ega Portfolio — Supabase Schema
-- Run this in: Supabase Dashboard → SQL Editor
-- ============================================================

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

-- ============================================================
-- Row Level Security (RLS)
-- ============================================================

ALTER TABLE experiences ENABLE ROW LEVEL SECURITY;
ALTER TABLE projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE profile ENABLE ROW LEVEL SECURITY;
ALTER TABLE skill_categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE skills ENABLE ROW LEVEL SECURITY;

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
  ((SELECT id FROM cat4), 'SAP Business One', 75, 4);
