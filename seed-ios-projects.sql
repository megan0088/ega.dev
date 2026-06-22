-- ============================================================
-- Seed iOS Projects (bilingual EN/ID)
-- Safe to re-run: uses WHERE NOT EXISTS for inserts, UPDATE for existing rows.
-- Run in Supabase SQL Editor.
-- ============================================================

-- ── 1. Nusantara Chess (FEATURED) ─────────────────────────────
INSERT INTO projects (title, title_id, description, description_id, tech_stack, github_url, live_url, image_url, is_featured, preview_type, preview_url)
SELECT
  'Nusantara Chess',
  'Catur Nusantara',
  'A fully playable 3D chess game for iOS — Majapahit (white) vs Sriwijaya (black) on an andesite temple board with procedural batik textures. Built in SwiftUI + RealityKit with a Negamax + alpha-beta AI across three difficulty levels (Prajurit, Senopati, Mahapatih), complete legal-move validation (castling, en passant, promotion), cinematic capture/check/checkmate camera beats, and an educational sheet on Nusantara culture.',
  'Game catur 3D iOS yang fully playable — Majapahit (putih) vs Sriwijaya (hitam) di papan candi andesit dengan tekstur batik prosedural. Dibangun dengan SwiftUI + RealityKit, dilengkapi AI Negamax + alpha-beta tiga tingkat kesulitan (Prajurit, Senopati, Mahapatih), validasi gerakan lengkap (rokade, en passant, promosi), kamera sinematik saat capture/skak/skakmat, dan sheet edukasi tentang budaya Nusantara.',
  ARRAY['Swift 6', 'SwiftUI', 'RealityKit', 'ARKit', 'Xcode 16', 'iOS 18'],
  'https://github.com/megan0088/nusantara-chess',
  NULL,
  NULL,
  TRUE,
  NULL,
  NULL
WHERE NOT EXISTS (SELECT 1 FROM projects WHERE title = 'Nusantara Chess');

-- ── 2. Hello Coach ────────────────────────────────────────────
INSERT INTO projects (title, title_id, description, description_id, tech_stack, github_url, live_url, image_url, is_featured, preview_type, preview_url)
SELECT
  'Hello Coach',
  'Hello Coach',
  'A push/pull workout tracker for iOS with a companion Apple Watch app. Uses SwiftData for local persistence to track workout sessions, exercise entries, and rep/weight sets across muscle groups (chest, back, shoulders, arms), with analytics for training volume over time.',
  'Tracker workout push/pull untuk iOS dengan companion app Apple Watch. Menggunakan SwiftData untuk persistensi lokal, melacak sesi workout, exercise entries, dan set rep/weight per muscle group (chest, back, shoulder, arms), dilengkapi analytics volume latihan dari waktu ke waktu.',
  ARRAY['Swift', 'SwiftUI', 'SwiftData', 'WatchOS', 'Xcode'],
  'https://github.com/megan0088/hello_coach',
  NULL,
  NULL,
  FALSE,
  NULL,
  NULL
WHERE NOT EXISTS (SELECT 1 FROM projects WHERE title = 'Hello Coach');

-- ── 3. Resolut1on ─────────────────────────────────────────────
INSERT INTO projects (title, title_id, description, description_id, tech_stack, github_url, live_url, image_url, is_featured, preview_type, preview_url)
SELECT
  'Resolut1on',
  'Resolut1on',
  'A resolution and goal-tracking iOS app built with strict Clean Architecture — Core, Domain, Data, and Presentation layers cleanly separated. Showcases dependency inversion, repository pattern, and testable use cases in a SwiftUI codebase.',
  'Aplikasi tracking resolusi & goal untuk iOS yang dibangun dengan Clean Architecture ketat — layer Core, Domain, Data, dan Presentation terpisah rapi. Mendemonstrasikan dependency inversion, repository pattern, dan use case yang testable dalam codebase SwiftUI.',
  ARRAY['Swift', 'SwiftUI', 'Clean Architecture', 'Xcode'],
  'https://github.com/megan0088/resolut1on',
  NULL,
  NULL,
  FALSE,
  NULL,
  NULL
WHERE NOT EXISTS (SELECT 1 FROM projects WHERE title = 'Resolut1on');

-- ── 4. WGG ────────────────────────────────────────────────────
INSERT INTO projects (title, title_id, description, description_id, tech_stack, github_url, live_url, image_url, is_featured, preview_type, preview_url)
SELECT
  'WGG',
  'WGG',
  'A dual-target iOS + watchOS app exploring SwiftUI reactive state propagation across iPhone and Apple Watch. Implements on-device sensor data processing with custom algorithms and shares business logic between platform targets through a unified model layer.',
  'Aplikasi dual-target iOS + watchOS yang mengeksplorasi propagasi state reaktif SwiftUI antara iPhone dan Apple Watch. Mengimplementasikan pemrosesan data sensor on-device dengan algoritma custom dan berbagi business logic antar target platform via model layer terpadu.',
  ARRAY['Swift', 'SwiftUI', 'WatchOS', 'Xcode'],
  'https://github.com/megan0088/WGG',
  NULL,
  NULL,
  FALSE,
  NULL,
  NULL
WHERE NOT EXISTS (SELECT 1 FROM projects WHERE title = 'WGG');

-- ── 5. Jarvis — UPDATE existing row to reflect iOS + macOS scope ──
UPDATE projects SET
  title         = 'Jarvis — Virtual Pet Wellness Assistant',
  title_id      = 'Jarvis — Asisten Wellness Virtual Pet',
  description   = 'A cross-platform iOS + macOS virtual pet that helps users build healthy habits (hydration, stretching, meal reminders). Built with SwiftUI + SpriteKit for animated character interactions, ActivityKit for iOS Live Activities, and AppKit for a floating Buddy Mode desktop window on macOS.',
  description_id = 'Virtual pet lintas platform iOS + macOS yang membantu user membangun kebiasaan sehat (minum, stretching, pengingat makan). Dibangun dengan SwiftUI + SpriteKit untuk interaksi karakter beranimasi, ActivityKit untuk Live Activity di iOS, dan AppKit untuk Buddy Mode floating window di macOS.',
  tech_stack    = ARRAY['Swift', 'SwiftUI', 'SpriteKit', 'ActivityKit', 'AppKit', 'macOS']
WHERE title = 'Jarvis';
