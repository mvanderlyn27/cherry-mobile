-- Create RLS policies
ALTER TABLE users ENABLE ROW LEVEL SECURITY;

ALTER TABLE interactions ENABLE ROW LEVEL SECURITY;

-- Add after existing RLS policies
CREATE POLICY "Own user access" ON users FOR ALL TO authenticated USING (id = auth.uid ());

-- Update interactions policy to admin only
DROP POLICY IF EXISTS "Public interactions read" ON interactions;
DROP POLICY IF EXISTS "Own interactions access" ON interactions;

CREATE POLICY "Admin interactions access" ON interactions FOR ALL TO authenticated 
USING (auth.uid() IN (SELECT id FROM users WHERE premium_user = true));

-- Storage bucket policies
CREATE POLICY "Public profile access"
ON storage.objects FOR SELECT
USING (bucket_id = 'user_profiles');

CREATE POLICY "Public cover access"
ON storage.objects FOR SELECT
USING (bucket_id = 'book_covers');

CREATE POLICY "Restricted chapter content access"
ON storage.objects FOR SELECT
USING (
  bucket_id = 'chapter_content' AND (
    -- Check if user is premium
    auth.uid() IN (SELECT id FROM users WHERE premium_user = true)
    OR
    -- Check if user has full book access
    (
      SPLIT_PART(name, '/', 1) IN (
        SELECT book_id::text FROM user_unlocks 
        WHERE user_id = auth.uid() AND is_full_book = true
      )
    )
    OR
    -- Check if user has chapter access
    (
      SPLIT_PART(name, '/', 2) IN (
        SELECT chapter_id::text FROM user_unlocks 
        WHERE user_id = auth.uid()
      )
    )
  )
);