-- Add timestamps and soft delete columns to all tables
ALTER TABLE books
ADD COLUMN IF NOT EXISTS deleted boolean default false;

ALTER TABLE categories
ADD COLUMN IF NOT EXISTS deleted boolean default false;

ALTER TABLE books_categories
ADD COLUMN IF NOT EXISTS updated_at timestamptz default now(),
ADD COLUMN IF NOT EXISTS deleted boolean default false;

ALTER TABLE tags
ADD COLUMN IF NOT EXISTS updated_at timestamptz default now(),
ADD COLUMN IF NOT EXISTS deleted boolean default false;

ALTER TABLE books_tags
ADD COLUMN IF NOT EXISTS updated_at timestamptz default now(),
ADD COLUMN IF NOT EXISTS deleted boolean default false;

ALTER TABLE user_purchases
ADD COLUMN IF NOT EXISTS updated_at timestamptz default now(),
ADD COLUMN IF NOT EXISTS deleted boolean default false;

ALTER TABLE user_saved_books
ADD COLUMN IF NOT EXISTS updated_at timestamptz default now(),
ADD COLUMN IF NOT EXISTS deleted boolean default false;

ALTER TABLE chapters
ADD COLUMN IF NOT EXISTS deleted boolean default false;

ALTER TABLE comments
ADD COLUMN IF NOT EXISTS updated_at timestamptz default now(),
ADD COLUMN IF NOT EXISTS deleted boolean default false;

ALTER TABLE likes
ADD COLUMN IF NOT EXISTS updated_at timestamptz default now(),
ADD COLUMN IF NOT EXISTS deleted boolean default false;

ALTER TABLE dislikes
ADD COLUMN IF NOT EXISTS updated_at timestamptz default now(),
ADD COLUMN IF NOT EXISTS deleted boolean default false;

ALTER TABLE bookmarks
ADD COLUMN IF NOT EXISTS updated_at timestamptz default now(),
ADD COLUMN IF NOT EXISTS deleted boolean default false;

-- Create the timestamp handling function
CREATE OR REPLACE FUNCTION handle_times()
    RETURNS trigger AS
    $$
    BEGIN
    IF (TG_OP = 'INSERT') THEN
        NEW.created_at := now();
        NEW.updated_at := now();
    ELSEIF (TG_OP = 'UPDATE') THEN
        NEW.created_at = OLD.created_at;
        NEW.updated_at = now();
    END IF;
    RETURN NEW;
    END;
    $$ language plpgsql;

-- Add triggers to all tables
DROP TRIGGER IF EXISTS handle_times_books ON books;
CREATE TRIGGER handle_times_books
    BEFORE INSERT OR UPDATE ON books
    FOR EACH ROW
EXECUTE PROCEDURE handle_times();

DROP TRIGGER IF EXISTS handle_times_categories ON categories;
CREATE TRIGGER handle_times_categories
    BEFORE INSERT OR UPDATE ON categories
    FOR EACH ROW
EXECUTE PROCEDURE handle_times();

DROP TRIGGER IF EXISTS handle_times_books_categories ON books_categories;
CREATE TRIGGER handle_times_books_categories
    BEFORE INSERT OR UPDATE ON books_categories
    FOR EACH ROW
EXECUTE PROCEDURE handle_times();

DROP TRIGGER IF EXISTS handle_times_tags ON tags;
CREATE TRIGGER handle_times_tags
    BEFORE INSERT OR UPDATE ON tags
    FOR EACH ROW
EXECUTE PROCEDURE handle_times();

DROP TRIGGER IF EXISTS handle_times_books_tags ON books_tags;
CREATE TRIGGER handle_times_books_tags
    BEFORE INSERT OR UPDATE ON books_tags
    FOR EACH ROW
EXECUTE PROCEDURE handle_times();

DROP TRIGGER IF EXISTS handle_times_user_purchases ON user_purchases;
CREATE TRIGGER handle_times_user_purchases
    BEFORE INSERT OR UPDATE ON user_purchases
    FOR EACH ROW
EXECUTE PROCEDURE handle_times();

DROP TRIGGER IF EXISTS handle_times_user_saved_books ON user_saved_books;
CREATE TRIGGER handle_times_user_saved_books
    BEFORE INSERT OR UPDATE ON user_saved_books
    FOR EACH ROW
EXECUTE PROCEDURE handle_times();

DROP TRIGGER IF EXISTS handle_times_chapters ON chapters;
CREATE TRIGGER handle_times_chapters
    BEFORE INSERT OR UPDATE ON chapters
    FOR EACH ROW
EXECUTE PROCEDURE handle_times();

DROP TRIGGER IF EXISTS handle_times_comments ON comments;
CREATE TRIGGER handle_times_comments
    BEFORE INSERT OR UPDATE ON comments
    FOR EACH ROW
EXECUTE PROCEDURE handle_times();

DROP TRIGGER IF EXISTS handle_times_likes ON likes;
CREATE TRIGGER handle_times_likes
    BEFORE INSERT OR UPDATE ON likes
    FOR EACH ROW
EXECUTE PROCEDURE handle_times();

DROP TRIGGER IF EXISTS handle_times_dislikes ON dislikes;
CREATE TRIGGER handle_times_dislikes
    BEFORE INSERT OR UPDATE ON dislikes
    FOR EACH ROW
EXECUTE PROCEDURE handle_times();

DROP TRIGGER IF EXISTS handle_times_bookmarks ON bookmarks;
CREATE TRIGGER handle_times_bookmarks
    BEFORE INSERT OR UPDATE ON bookmarks
    FOR EACH ROW
EXECUTE PROCEDURE handle_times();

-- Drop the old update_modified_column function and triggers as they're replaced by handle_times
DROP TRIGGER IF EXISTS update_books_modtime ON books;
DROP TRIGGER IF EXISTS update_categories_modtime ON categories;
DROP TRIGGER IF EXISTS update_chapters_modtime ON chapters;
DROP FUNCTION IF EXISTS update_modified_column();