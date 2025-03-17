-- Create the storage buckets
INSERT INTO storage.buckets (id, name, public, avif_autodetection, file_size_limit, allowed_mime_types)
VALUES 
  ('cover_arts', 'cover_arts', true, false, 5242880, ARRAY['image/png', 'image/jpeg', 'image/gif', 'image/webp']),
  ('profile_pics', 'profile_pics', true, false, 5242880, ARRAY['image/png', 'image/jpeg', 'image/gif', 'image/webp']),
  ('book_chapters', 'book_chapters', false, false, 10485760, ARRAY['text/plain', 'text/markdown', 'application/json'])
ON CONFLICT (id) DO NOTHING;

-- Policy for cover_arts bucket (public access)
CREATE POLICY "Cover arts are publicly accessible"
ON storage.objects FOR SELECT
USING (bucket_id = 'cover_arts');

CREATE POLICY "Authenticated users can upload cover arts"
ON storage.objects FOR INSERT
WITH CHECK (
  bucket_id = 'cover_arts'
  AND auth.role() = 'authenticated'
);

-- Policy for profile_pics bucket (public access)
CREATE POLICY "Profile pictures are publicly accessible"
ON storage.objects FOR SELECT
USING (bucket_id = 'profile_pics');

CREATE POLICY "Users can upload their own profile pictures"
ON storage.objects FOR INSERT
WITH CHECK (
  bucket_id = 'profile_pics'
  AND auth.role() = 'authenticated'
);

-- Policy for book_chapters bucket (restricted access)
CREATE POLICY "Users can access purchased book chapters"
ON storage.objects FOR SELECT
USING (
  bucket_id = 'book_chapters'
  AND (
    auth.role() IN ('anon', 'authenticated')
    AND EXISTS (
      SELECT 1 FROM user_purchases up
      WHERE up.user_id = auth.uid()
      AND up.book_id = (storage.foldername(name))[1]::uuid
    )
  )
);

CREATE POLICY "Authenticated users can upload book chapters"
ON storage.objects FOR INSERT
WITH CHECK (
  bucket_id = 'book_chapters'
  AND auth.role() = 'authenticated'
);