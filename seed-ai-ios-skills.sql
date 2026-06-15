-- ============================================================
-- Tambah skill untuk "AI Savvy" & "Ios Developer"
-- + Pindahkan kedua kategori ini ke urutan paling depan
-- Jalankan di: Supabase Dashboard -> SQL Editor
-- Level: 33 = Beginner, 66 = Intermediate, 100 = Mastery
-- (sesuaikan nanti lewat panel admin kalau perlu)
-- ============================================================

-- 1) Urutkan ulang kategori: AI Savvy & Ios Developer paling depan
UPDATE skill_categories SET sort_order = 0 WHERE name = 'AI Savvy';
UPDATE skill_categories SET sort_order = 1 WHERE name = 'Ios Developer';
UPDATE skill_categories SET sort_order = 2 WHERE name = 'Languages';
UPDATE skill_categories SET sort_order = 3 WHERE name = 'Frontend & Mobile';
UPDATE skill_categories SET sort_order = 4 WHERE name = 'Backend & Database';
UPDATE skill_categories SET sort_order = 5 WHERE name = 'Tools & Others';
UPDATE skill_categories SET sort_order = 6 WHERE name = '3D Design & Animation';

-- 2) Bersihkan dulu kalau pernah jalan skrip ini (biar tidak dobel)
DELETE FROM skills
WHERE category_id IN (
  SELECT id FROM skill_categories WHERE name IN ('AI Savvy', 'Ios Developer')
);

-- 3) Tambah skill AI Engineer ke kategori "AI Savvy"
INSERT INTO skills (category_id, name, level, sort_order)
SELECT id, v.name, v.level, v.sort_order
FROM skill_categories,
LATERAL (VALUES
  ('Python',                            66, 0),
  ('Prompt Engineering',                66, 1),
  ('LLM Integration (OpenAI / Claude)', 66, 2),
  ('OpenRouter API',                    66, 3),
  ('RAG (Retrieval-Augmented Gen.)',    33, 4),
  ('LangChain',                         33, 5),
  ('Hugging Face',                      33, 6),
  ('PyTorch / TensorFlow',              33, 7),
  ('Pandas / NumPy',                    33, 8),
  ('Vector DB (pgvector / Pinecone)',   33, 9)
) AS v(name, level, sort_order)
WHERE skill_categories.name = 'AI Savvy';

-- 4) Tambah skill iOS Developer ke kategori "Ios Developer"
INSERT INTO skills (category_id, name, level, sort_order)
SELECT id, v.name, v.level, v.sort_order
FROM skill_categories,
LATERAL (VALUES
  ('Swift',              66, 0),
  ('SwiftUI',            66, 1),
  ('Xcode',              66, 2),
  ('UIKit',              33, 3),
  ('Combine',            33, 4),
  ('Core Data',          33, 5),
  ('SpriteKit',          66, 6),
  ('ARKit',              33, 7),
  ('App Store Connect',  33, 8)
) AS v(name, level, sort_order)
WHERE skill_categories.name = 'Ios Developer';
