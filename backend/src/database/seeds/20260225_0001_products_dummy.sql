INSERT INTO products (
  title,
  slug,
  short_description,
  description,
  thumbnail_url,
  type,
  price,
  currency,
  status,
  published_at
) VALUES
(
  'AI Faceless Content Mastery',
  'ai-faceless-content-mastery',
  'Program utama untuk scaling content faceless.',
  'Dummy description: berisi kurikulum, template, dan roadmap eksekusi.',
  'https://example.com/images/aifcm.png',
  'course',
  499000.00,
  'IDR',
  'active',
  NOW()
),
(
  'Prompt Library Pack',
  'prompt-library-pack',
  'Kumpulan prompt siap pakai untuk creator.',
  'Dummy description: prompt untuk konten, riset, dan optimasi workflow.',
  'https://example.com/images/prompts.png',
  'template',
  149000.00,
  'IDR',
  'draft',
  NULL
);
