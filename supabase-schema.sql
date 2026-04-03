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

-- ============================================================
-- Row Level Security (RLS)
-- ============================================================

ALTER TABLE experiences ENABLE ROW LEVEL SECURITY;
ALTER TABLE projects ENABLE ROW LEVEL SECURITY;

-- Public read access (portfolio page)
CREATE POLICY "Public can read experiences"
  ON experiences FOR SELECT USING (true);

CREATE POLICY "Public can read projects"
  ON projects FOR SELECT USING (true);

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
