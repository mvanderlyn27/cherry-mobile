-- Create a trigger to add default entry in users/profile when a new auth.users entry is created
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.users (id, created_at, updated_at, credits)
  VALUES (NEW.id, NOW(), NOW(), 0);
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Drop existing trigger if it exists
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;

-- Create the trigger
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Update users table: drop dark_mode and font_size columns, add preferences JSON field
ALTER TABLE public.users 
  DROP COLUMN IF EXISTS dark_mode,
  DROP COLUMN IF EXISTS font_size,
  ADD COLUMN IF NOT EXISTS preferences JSONB DEFAULT '{"theme": "light", "fontSize": "medium", "notifications": true}'::jsonb;

-- Remove is_full_book from user_unlocks table
ALTER TABLE public.user_unlocks
  DROP COLUMN IF EXISTS is_full_book;

-- Update transaction_type enum
-- First, we need to create a new enum type, then update the column
CREATE TYPE public.transaction_type_new AS ENUM (
  'PURCHASE_CREDITS', 
  'UNLOCK_BOOK', 
  'UNLOCK_CHAPTER', 
  'REFUND_CREDITS', 
  'REFUND_UNLOCK'
);

-- Update transactions table to use the new enum
-- This requires a few steps since PostgreSQL doesn't allow direct enum modification
ALTER TABLE public.transactions 
  ALTER COLUMN transaction_type TYPE public.transaction_type_new 
  USING transaction_type::text::public.transaction_type_new;

-- Drop the old enum type
DROP TYPE IF EXISTS public.transaction_type;

-- Rename the new enum type to the original name
ALTER TYPE public.transaction_type_new RENAME TO transaction_type;

-- Add tag_image_url and tag_image_placeholder to tags table
ALTER TABLE public.tags
  ADD COLUMN IF NOT EXISTS tag_image_url TEXT,
  ADD COLUMN IF NOT EXISTS tag_image_placeholder TEXT;

-- Create tags_image storage bucket
INSERT INTO storage.buckets (id, name, public)
VALUES ('tags_image', 'tags_image', true)
ON CONFLICT (id) DO NOTHING;

-- Set up storage policy for the new bucket
CREATE POLICY "Public Access for tags_image" ON storage.objects
  FOR SELECT
  USING (bucket_id = 'tags_image');

-- Allow authenticated users to upload to tags_image bucket
CREATE POLICY "Authenticated users can upload tags images" ON storage.objects
  FOR INSERT
  TO authenticated
  WITH CHECK (bucket_id = 'tags_image');

-- Allow users to update their own uploads
CREATE POLICY "Users can update their own tags images" ON storage.objects
  FOR UPDATE
  TO authenticated
  USING (bucket_id = 'tags_image' AND owner = auth.uid());


-- Create a trigger to handle new user_unlock entries
CREATE OR REPLACE FUNCTION public.handle_new_user_unlock()
RETURNS TRIGGER AS $$
DECLARE
    first_chapter_id UUID;
BEGIN
    -- Case 1: Book unlock (has book_id but no chapter_id)
    IF NEW.book_id IS NOT NULL AND NEW.chapter_id IS NULL THEN
        -- Create book_progress entry
        INSERT INTO public.book_progress (user_id, book_id, status, created_at, updated_at)
        VALUES (NEW.user_id, NEW.book_id, 'unread', NOW(), NOW())
        ON CONFLICT (user_id, book_id) DO NOTHING;
        
        -- Find the first chapter of this book
        SELECT id INTO first_chapter_id
        FROM public.chapters
        WHERE book_id = NEW.book_id
        ORDER BY chapter_number ASC
        LIMIT 1;
        
        -- Create chapter_progress for the first chapter
        IF first_chapter_id IS NOT NULL THEN
            INSERT INTO public.chapter_progress (user_id, chapter_id, status, created_at, updated_at)
            VALUES (NEW.user_id, first_chapter_id, 'unread', NOW(), NOW())
            ON CONFLICT (user_id, chapter_id) DO NOTHING;
        END IF;
    
    -- Case 2: Chapter unlock (has both book_id and chapter_id)
    ELSIF NEW.book_id IS NOT NULL AND NEW.chapter_id IS NOT NULL THEN
        -- Create only chapter_progress entry
        INSERT INTO public.chapter_progress (user_id, chapter_id, status, created_at, updated_at)
        VALUES (NEW.user_id, NEW.chapter_id, 'unread', NOW(), NOW())
        ON CONFLICT (user_id, chapter_id) DO NOTHING;
    END IF;
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Drop existing trigger if it exists
DROP TRIGGER IF EXISTS on_user_unlock_created ON public.user_unlocks;

-- Create the trigger
CREATE TRIGGER on_user_unlock_created
  AFTER INSERT ON public.user_unlocks
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user_unlock();