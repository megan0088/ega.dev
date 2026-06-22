-- ============================================================
-- FIX: bilingual columns + dedupe duplicates + insert iOS projects
-- Jalankan sekali di Supabase SQL Editor.
-- Aman di-rerun (idempotent).
-- ============================================================

-- ── STEP 1: Tambahkan kolom bilingual yang hilang ─────────────
ALTER TABLE projects   ADD COLUMN IF NOT EXISTS title_id       TEXT;
ALTER TABLE projects   ADD COLUMN IF NOT EXISTS description_id TEXT;

ALTER TABLE experiences ADD COLUMN IF NOT EXISTS title_id       TEXT;
ALTER TABLE experiences ADD COLUMN IF NOT EXISTS description_id TEXT[];

ALTER TABLE profile ADD COLUMN IF NOT EXISTS title_id        TEXT;
ALTER TABLE profile ADD COLUMN IF NOT EXISTS subtitle_id     TEXT;
ALTER TABLE profile ADD COLUMN IF NOT EXISTS bio_id          TEXT;
ALTER TABLE profile ADD COLUMN IF NOT EXISTS bio2_id         TEXT;
ALTER TABLE profile ADD COLUMN IF NOT EXISTS status_text_id  TEXT;

-- ── STEP 2: Hapus duplikat (keep oldest by created_at) ────────
DELETE FROM projects
WHERE id IN (
  SELECT id FROM (
    SELECT id, ROW_NUMBER() OVER (PARTITION BY title ORDER BY created_at ASC) AS rn
    FROM projects
  ) t
  WHERE t.rn > 1
);

-- ── STEP 3: Insert 4 iOS projects (skip kalau sudah ada) ──────
INSERT INTO projects (title, title_id, description, description_id, tech_stack, github_url, live_url, image_url, is_featured, preview_type, preview_url)
SELECT
  'Nusantara Chess',
  'Catur Nusantara',
  'A fully playable 3D chess game for iOS — Majapahit (white) vs Sriwijaya (black) on an andesite temple board with procedural batik textures. Built in SwiftUI + RealityKit with a Negamax + alpha-beta AI across three difficulty levels (Prajurit, Senopati, Mahapatih), complete legal-move validation (castling, en passant, promotion), cinematic capture/check/checkmate camera beats, and an educational sheet on Nusantara culture.',
  'Game catur 3D iOS yang fully playable — Majapahit (putih) vs Sriwijaya (hitam) di papan candi andesit dengan tekstur batik prosedural. Dibangun dengan SwiftUI + RealityKit, dilengkapi AI Negamax + alpha-beta tiga tingkat kesulitan (Prajurit, Senopati, Mahapatih), validasi gerakan lengkap (rokade, en passant, promosi), kamera sinematik saat capture/skak/skakmat, dan sheet edukasi tentang budaya Nusantara.',
  ARRAY['Swift 6', 'SwiftUI', 'RealityKit', 'ARKit', 'Xcode 16', 'iOS 18'],
  'https://github.com/megan0088/nusantara-chess',
  NULL, NULL, TRUE, NULL, NULL
WHERE NOT EXISTS (SELECT 1 FROM projects WHERE title = 'Nusantara Chess');

INSERT INTO projects (title, title_id, description, description_id, tech_stack, github_url, live_url, image_url, is_featured, preview_type, preview_url)
SELECT
  'Hello Coach', 'Hello Coach',
  'A push/pull workout tracker for iOS with a companion Apple Watch app. Uses SwiftData for local persistence to track workout sessions, exercise entries, and rep/weight sets across muscle groups (chest, back, shoulders, arms), with analytics for training volume over time.',
  'Tracker workout push/pull untuk iOS dengan companion app Apple Watch. Menggunakan SwiftData untuk persistensi lokal, melacak sesi workout, exercise entries, dan set rep/weight per muscle group (chest, back, shoulder, arms), dilengkapi analytics volume latihan dari waktu ke waktu.',
  ARRAY['Swift', 'SwiftUI', 'SwiftData', 'WatchOS', 'Xcode'],
  'https://github.com/megan0088/hello_coach',
  NULL, NULL, FALSE, NULL, NULL
WHERE NOT EXISTS (SELECT 1 FROM projects WHERE title = 'Hello Coach');

INSERT INTO projects (title, title_id, description, description_id, tech_stack, github_url, live_url, image_url, is_featured, preview_type, preview_url)
SELECT
  'Resolut1on', 'Resolut1on',
  'A resolution and goal-tracking iOS app built with strict Clean Architecture — Core, Domain, Data, and Presentation layers cleanly separated. Showcases dependency inversion, repository pattern, and testable use cases in a SwiftUI codebase.',
  'Aplikasi tracking resolusi & goal untuk iOS yang dibangun dengan Clean Architecture ketat — layer Core, Domain, Data, dan Presentation terpisah rapi. Mendemonstrasikan dependency inversion, repository pattern, dan use case yang testable dalam codebase SwiftUI.',
  ARRAY['Swift', 'SwiftUI', 'Clean Architecture', 'Xcode'],
  'https://github.com/megan0088/resolut1on',
  NULL, NULL, FALSE, NULL, NULL
WHERE NOT EXISTS (SELECT 1 FROM projects WHERE title = 'Resolut1on');

INSERT INTO projects (title, title_id, description, description_id, tech_stack, github_url, live_url, image_url, is_featured, preview_type, preview_url)
SELECT
  'WGG', 'WGG',
  'A dual-target iOS + watchOS app exploring SwiftUI reactive state propagation across iPhone and Apple Watch. Implements on-device sensor data processing with custom algorithms and shares business logic between platform targets through a unified model layer.',
  'Aplikasi dual-target iOS + watchOS yang mengeksplorasi propagasi state reaktif SwiftUI antara iPhone dan Apple Watch. Mengimplementasikan pemrosesan data sensor on-device dengan algoritma custom dan berbagi business logic antar target platform via model layer terpadu.',
  ARRAY['Swift', 'SwiftUI', 'WatchOS', 'Xcode'],
  'https://github.com/megan0088/WGG',
  NULL, NULL, FALSE, NULL, NULL
WHERE NOT EXISTS (SELECT 1 FROM projects WHERE title = 'WGG');

-- ── STEP 4: Update Jarvis (sudah ada di DB) — perluas jadi iOS + macOS ──
UPDATE projects SET
  title          = 'Jarvis — Virtual Pet Wellness Assistant',
  title_id       = 'Jarvis — Asisten Wellness Virtual Pet',
  description    = 'A cross-platform iOS + macOS virtual pet that helps users build healthy habits (hydration, stretching, meal reminders). Built with SwiftUI + SpriteKit for animated character interactions, ActivityKit for iOS Live Activities, and AppKit for a floating Buddy Mode desktop window on macOS.',
  description_id = 'Virtual pet lintas platform iOS + macOS yang membantu user membangun kebiasaan sehat (minum, stretching, pengingat makan). Dibangun dengan SwiftUI + SpriteKit untuk interaksi karakter beranimasi, ActivityKit untuk Live Activity di iOS, dan AppKit untuk Buddy Mode floating window di macOS.',
  tech_stack     = ARRAY['Swift', 'SwiftUI', 'SpriteKit', 'ActivityKit', 'AppKit', 'macOS']
WHERE title = 'Jarvis' OR title = 'Jarvis — Virtual Pet Wellness Assistant';

-- ── STEP 5: Tambah UNIQUE constraint biar ga ada duplikat lagi ──
-- (run sekali, kalau sudah ada akan error tapi aman diabaikan)
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint WHERE conname = 'projects_title_unique'
  ) THEN
    ALTER TABLE projects ADD CONSTRAINT projects_title_unique UNIQUE (title);
  END IF;
END $$;

-- ── VERIFIKASI: harus muncul 5 baris ──────────────────────────
SELECT title, title_id, is_featured, tech_stack
FROM projects
WHERE title IN (
  'Nusantara Chess', 'Hello Coach', 'Resolut1on', 'WGG',
  'Jarvis — Virtual Pet Wellness Assistant'
)
ORDER BY is_featured DESC, title;
