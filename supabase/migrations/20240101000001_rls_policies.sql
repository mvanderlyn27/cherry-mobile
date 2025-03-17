-- Enable Row Level Security on all tables
ALTER TABLE books ENABLE ROW LEVEL SECURITY;

ALTER TABLE categories ENABLE ROW LEVEL SECURITY;

ALTER TABLE books_categories ENABLE ROW LEVEL SECURITY;

ALTER TABLE tags ENABLE ROW LEVEL SECURITY;

ALTER TABLE books_tags ENABLE ROW LEVEL SECURITY;

ALTER TABLE user_purchases ENABLE ROW LEVEL SECURITY;

ALTER TABLE user_saved_books ENABLE ROW LEVEL SECURITY;

ALTER TABLE chapters ENABLE ROW LEVEL SECURITY;

ALTER TABLE comments ENABLE ROW LEVEL SECURITY;

ALTER TABLE likes ENABLE ROW LEVEL SECURITY;

ALTER TABLE dislikes ENABLE ROW LEVEL SECURITY;

ALTER TABLE bookmarks ENABLE ROW LEVEL SECURITY;

-- Books policies
-- Everyone can read books
CREATE POLICY "Books are viewable by everyone" ON books FOR
SELECT
    USING (true);

-- Only authenticated users can insert books (would typically be admin only in production)
CREATE POLICY "Authenticated users can insert books" ON books FOR INSERT TO authenticated
WITH
    CHECK (true);

-- Only authenticated users can update their own books (would typically be admin only in production)
CREATE POLICY "Authenticated users can update books" ON books FOR
UPDATE TO authenticated USING (true);

-- Categories policies
-- Everyone can read categories
CREATE POLICY "Categories are viewable by everyone" ON categories FOR
SELECT
    USING (true);

-- Only authenticated users can insert categories (would typically be admin only in production)
CREATE POLICY "Authenticated users can insert categories" ON categories FOR INSERT TO authenticated
WITH
    CHECK (true);

-- Books Categories junction table policies
-- Everyone can read book categories
CREATE POLICY "Book categories are viewable by everyone" ON books_categories FOR
SELECT
    USING (true);

-- Only authenticated users can insert book categories (would typically be admin only in production)
CREATE POLICY "Authenticated users can insert book categories" ON books_categories FOR INSERT TO authenticated
WITH
    CHECK (true);

-- Tags policies
-- Everyone can read tags
CREATE POLICY "Tags are viewable by everyone" ON tags FOR
SELECT
    USING (true);

-- Only authenticated users can insert tags (would typically be admin only in production)
CREATE POLICY "Authenticated users can insert tags" ON tags FOR INSERT TO authenticated
WITH
    CHECK (true);

-- Books Tags junction table policies
-- Everyone can read book tags
CREATE POLICY "Book tags are viewable by everyone" ON books_tags FOR
SELECT
    USING (true);

-- Only authenticated users can insert book tags (would typically be admin only in production)
CREATE POLICY "Authenticated users can insert book tags" ON books_tags FOR INSERT TO authenticated
WITH
    CHECK (true);

-- User Purchases policies
-- Users can only view their own purchases
CREATE POLICY "Users can view own purchases" ON user_purchases FOR
SELECT
    TO authenticated USING (auth.uid () = user_id);

-- Users can only insert their own purchases
CREATE POLICY "Users can insert own purchases" ON user_purchases FOR INSERT TO authenticated
WITH
    CHECK (auth.uid () = user_id);

-- User Saved Books policies
-- Users can only view their own saved books
CREATE POLICY "Users can view own saved books" ON user_saved_books FOR
SELECT
    TO authenticated USING (auth.uid () = user_id);

-- Users can only insert their own saved books
CREATE POLICY "Users can insert own saved books" ON user_saved_books FOR INSERT TO authenticated
WITH
    CHECK (auth.uid () = user_id);

-- Users can only delete their own saved books
CREATE POLICY "Users can delete own saved books" ON user_saved_books FOR DELETE TO authenticated USING (auth.uid () = user_id);

-- Chapters policies
-- Everyone can read chapters
CREATE POLICY "Chapters are viewable by everyone" ON chapters FOR
SELECT
    USING (true);

-- Only authenticated users can insert chapters (would typically be admin only in production)
CREATE POLICY "Authenticated users can insert chapters" ON chapters FOR INSERT TO authenticated
WITH
    CHECK (true);

-- Comments policies
-- Everyone can read comments
CREATE POLICY "Comments are viewable by everyone" ON comments FOR
SELECT
    USING (true);

-- Only authenticated users can insert their own comments
CREATE POLICY "Users can insert own comments" ON comments FOR INSERT TO authenticated
WITH
    CHECK (auth.uid () = user_id);

-- Only users can update their own comments
CREATE POLICY "Users can update own comments" ON comments FOR
UPDATE TO authenticated USING (auth.uid () = user_id);

-- Only users can delete their own comments
CREATE POLICY "Users can delete own comments" ON comments FOR DELETE TO authenticated USING (auth.uid () = user_id);

-- Likes policies
-- Everyone can read likes
CREATE POLICY "Likes are viewable by everyone" ON likes FOR
SELECT
    USING (true);

-- Only authenticated users can insert their own likes
CREATE POLICY "Users can insert own likes" ON likes FOR INSERT TO authenticated
WITH
    CHECK (auth.uid () = user_id);

-- Only users can delete their own likes
CREATE POLICY "Users can delete own likes" ON likes FOR DELETE TO authenticated USING (auth.uid () = user_id);

-- Dislikes policies
-- Everyone can read dislikes
CREATE POLICY "Dislikes are viewable by everyone" ON dislikes FOR
SELECT
    USING (true);

-- Only authenticated users can insert their own dislikes
CREATE POLICY "Users can insert own dislikes" ON dislikes FOR INSERT TO authenticated
WITH
    CHECK (auth.uid () = user_id);

-- Only users can delete their own dislikes
CREATE POLICY "Users can delete own dislikes" ON dislikes FOR DELETE TO authenticated USING (auth.uid () = user_id);

-- Bookmarks policies
-- Users can only view their own bookmarks
CREATE POLICY "Users can view own bookmarks" ON bookmarks FOR
SELECT
    TO authenticated USING (auth.uid () = user_id);

-- Users can only insert their own bookmarks
CREATE POLICY "Users can insert own bookmarks" ON bookmarks FOR INSERT TO authenticated
WITH
    CHECK (auth.uid () = user_id);

-- Users can only delete their own bookmarks
CREATE POLICY "Users can delete own bookmarks" ON bookmarks FOR DELETE TO authenticated USING (auth.uid () = user_id);