-- Create enums
CREATE TYPE chapter_status AS ENUM ('reading', 'unread', 'completed');
CREATE TYPE transaction_type AS ENUM ('purchase', 'unlock', 'refund');
CREATE TYPE transaction_status AS ENUM ('completed', 'failed', 'pending', 'refund');
CREATE TYPE interaction_type AS ENUM ('share', 'like', 'read', 'purchase', 'open', 'save', 'comment');
CREATE TYPE book_status AS ENUM ('finished', 'reading', 'unread');

-- Create tables
CREATE TABLE users (
    id UUID PRIMARY KEY REFERENCES auth.users,
    credits INTEGER DEFAULT 0,
    premium_user BOOLEAN DEFAULT false,
    dark_mode BOOLEAN DEFAULT false,
    font_size INTEGER DEFAULT 16,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

CREATE TABLE profiles (
    id UUID PRIMARY KEY REFERENCES users(id),
    username TEXT UNIQUE,
    profile_url TEXT,
    profile_placeholder TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

CREATE TABLE books (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title TEXT NOT NULL,
    author TEXT NOT NULL,
    description TEXT,
    cover_url TEXT,
    cover_placeholder TEXT,
    chapter_count INTEGER DEFAULT 0,
    price INTEGER NOT NULL,
    reader_count INTEGER DEFAULT 0,
    reading_time INTEGER,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

CREATE TABLE chapters (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    book_id UUID REFERENCES books(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    content_url TEXT,
    price INTEGER NOT NULL,
    chapter_number INTEGER NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    UNIQUE(book_id, chapter_number)
);

CREATE TABLE tags (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT UNIQUE NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

CREATE TABLE book_tags (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    book_id UUID REFERENCES books(id) ON DELETE CASCADE,
    tag_id UUID REFERENCES tags(id) ON DELETE CASCADE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    UNIQUE(book_id, tag_id)
);

CREATE TABLE chapter_progress (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    chapter_id UUID REFERENCES chapters(id) ON DELETE CASCADE,
    status chapter_status DEFAULT 'unread',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    UNIQUE(user_id, chapter_id)
);

CREATE TABLE liked_chapters (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    chapter_id UUID REFERENCES chapters(id) ON DELETE CASCADE,
    book_id UUID REFERENCES books(id) ON DELETE CASCADE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    UNIQUE(user_id, chapter_id)
);

CREATE TABLE saved_books (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    book_id UUID REFERENCES books(id) ON DELETE CASCADE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    UNIQUE(user_id, book_id)
);

CREATE TABLE user_unlocks (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    book_id UUID REFERENCES books(id) ON DELETE CASCADE,
    chapter_id UUID REFERENCES chapters(id) ON DELETE CASCADE,
    is_full_book BOOLEAN DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    UNIQUE(user_id, book_id, chapter_id)
);

CREATE TABLE transactions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    transaction_type transaction_type NOT NULL,
    credits INTEGER NOT NULL,
    book_id UUID REFERENCES books(id) ON DELETE CASCADE,
    chapter_id UUID REFERENCES chapters(id) ON DELETE CASCADE,
    status transaction_status DEFAULT 'pending',
    payment_intent_id TEXT,
    price DECIMAL(10,2) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

CREATE TABLE interactions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    type interaction_type NOT NULL,
    book_id UUID REFERENCES books(id) ON DELETE CASCADE,
    chapter_id UUID REFERENCES chapters(id) ON DELETE CASCADE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

CREATE TABLE book_progress (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    book_id UUID REFERENCES books(id) ON DELETE CASCADE,
    current_chapter_id UUID REFERENCES chapters(id) ON DELETE CASCADE,
    status book_status DEFAULT 'unread',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    UNIQUE(user_id, book_id)
);

CREATE TABLE cherry_ledger (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    transaction_id UUID REFERENCES transactions(id) ON DELETE CASCADE,
    amount INTEGER NOT NULL,
    previous_balance INTEGER NOT NULL,
    new_balance INTEGER NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

CREATE TABLE comments (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    book_id UUID REFERENCES books(id) ON DELETE CASCADE,
    chapter_id UUID REFERENCES chapters(id) ON DELETE CASCADE,
    content TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Create storage buckets
INSERT INTO storage.buckets (id, name) VALUES ('user_profiles', 'user_profiles');
INSERT INTO storage.buckets (id, name) VALUES ('book_covers', 'book_covers');
INSERT INTO storage.buckets (id, name) VALUES ('chapter_content', 'chapter_content');

-- Create RLS policies
ALTER TABLE books ENABLE ROW LEVEL SECURITY;
ALTER TABLE chapters ENABLE ROW LEVEL SECURITY;
ALTER TABLE tags ENABLE ROW LEVEL SECURITY;
ALTER TABLE book_tags ENABLE ROW LEVEL SECURITY;
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE liked_chapters ENABLE ROW LEVEL SECURITY;
ALTER TABLE comments ENABLE ROW LEVEL SECURITY;
ALTER TABLE chapter_progress ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_unlocks ENABLE ROW LEVEL SECURITY;
ALTER TABLE book_progress ENABLE ROW LEVEL SECURITY;
ALTER TABLE saved_books ENABLE ROW LEVEL SECURITY;
ALTER TABLE transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE cherry_ledger ENABLE ROW LEVEL SECURITY;

-- Public access policies
CREATE POLICY "Public books access" ON books FOR SELECT TO authenticated USING (true);
CREATE POLICY "Public tags access" ON tags FOR SELECT TO authenticated USING (true);
CREATE POLICY "Public book_tags access" ON book_tags FOR SELECT TO authenticated USING (true);
CREATE POLICY "Public profiles access" ON profiles FOR SELECT TO authenticated USING (true);
CREATE POLICY "Public liked_chapters access" ON liked_chapters FOR SELECT TO authenticated USING (true);
CREATE POLICY "Public comments access" ON comments FOR SELECT TO authenticated USING (true);

-- Chapter access policy
CREATE POLICY "First chapter access" ON chapters FOR SELECT TO authenticated 
USING (chapter_number = 1);

CREATE POLICY "Unlocked chapter access" ON chapters FOR SELECT TO authenticated 
USING (
    EXISTS (
        SELECT 1 FROM user_unlocks
        WHERE user_unlocks.user_id = auth.uid()
        AND (user_unlocks.chapter_id = chapters.id OR user_unlocks.book_id = chapters.book_id)
    )
);

-- User-specific access policies
CREATE POLICY "Own chapter_progress access" ON chapter_progress FOR ALL TO authenticated
USING (user_id = auth.uid());

CREATE POLICY "Own user_unlocks access" ON user_unlocks FOR ALL TO authenticated
USING (user_id = auth.uid());

CREATE POLICY "Own book_progress access" ON book_progress FOR ALL TO authenticated
USING (user_id = auth.uid());

CREATE POLICY "Own saved_books access" ON saved_books FOR ALL TO authenticated
USING (user_id = auth.uid());

CREATE POLICY "Own transactions access" ON transactions FOR ALL TO authenticated
USING (user_id = auth.uid());

-- Admin-only access
CREATE POLICY "Admin cherry_ledger access" ON cherry_ledger FOR ALL TO authenticated
USING (auth.uid() IN (SELECT id FROM users WHERE premium_user = true));

-- Create triggers
CREATE OR REPLACE FUNCTION update_book_reader_count()
RETURNS TRIGGER AS $$
BEGIN
    IF NEW.status = 'reading' AND OLD.status = 'unread' THEN
        UPDATE books
        SET reader_count = reader_count + 1
        WHERE id = NEW.book_id;
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER book_reader_count_trigger
AFTER UPDATE ON book_progress
FOR EACH ROW
EXECUTE FUNCTION update_book_reader_count();

CREATE OR REPLACE FUNCTION update_book_progress()
RETURNS TRIGGER AS $$
BEGIN
    IF NEW.status = 'completed' THEN
        UPDATE book_progress bp
        SET current_chapter_id = (
            SELECT id FROM chapters
            WHERE book_id = (SELECT book_id FROM chapters WHERE id = NEW.chapter_id)
            AND chapter_number = (
                SELECT chapter_number + 1 FROM chapters WHERE id = NEW.chapter_id
            )
        )
        WHERE bp.user_id = NEW.user_id
        AND bp.book_id = (SELECT book_id FROM chapters WHERE id = NEW.chapter_id);
        
        -- If it was the last chapter, mark the book as finished
        IF NOT FOUND THEN
            UPDATE book_progress
            SET status = 'finished'
            WHERE user_id = NEW.user_id
            AND book_id = (SELECT book_id FROM chapters WHERE id = NEW.chapter_id);
        END IF;
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER chapter_completion_trigger
AFTER UPDATE ON chapter_progress
FOR EACH ROW
EXECUTE FUNCTION update_book_progress();

CREATE OR REPLACE FUNCTION process_completed_transaction()
RETURNS TRIGGER AS $$
BEGIN
    IF NEW.status = 'completed' THEN
        IF NEW.transaction_type = 'purchase' THEN
            -- Update user credits
            UPDATE users
            SET credits = credits + NEW.credits
            WHERE id = NEW.user_id;
            
            -- Add to cherry ledger
            INSERT INTO cherry_ledger (
                user_id, transaction_id, amount, 
                previous_balance, new_balance
            )
            VALUES (
                NEW.user_id,
                NEW.id,
                NEW.credits,
                (SELECT credits FROM users WHERE id = NEW.user_id) - NEW.credits,
                (SELECT credits FROM users WHERE id = NEW.user_id)
            );
        ELSIF NEW.transaction_type = 'unlock' THEN
            -- Add to user_unlocks
            IF NEW.book_id IS NOT NULL THEN
                INSERT INTO user_unlocks (
                    user_id, book_id, is_full_book
                )
                VALUES (
                    NEW.user_id,
                    NEW.book_id,
                    true
                );
            ELSIF NEW.chapter_id IS NOT NULL THEN
                INSERT INTO user_unlocks (
                    user_id, chapter_id, book_id
                )
                VALUES (
                    NEW.user_id,
                    NEW.chapter_id,
                    (SELECT book_id FROM chapters WHERE id = NEW.chapter_id)
                );
            END IF;
        END IF;
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER completed_transaction_trigger
AFTER UPDATE ON transactions
FOR EACH ROW
EXECUTE FUNCTION process_completed_transaction();

-- Create indexes
CREATE INDEX idx_chapters_book_id ON chapters(book_id);
CREATE INDEX idx_book_tags_book_id ON book_tags(book_id);
CREATE INDEX idx_book_tags_tag_id ON book_tags(tag_id);
CREATE INDEX idx_chapter_progress_user_id ON chapter_progress(user_id);
CREATE INDEX idx_chapter_progress_chapter_id ON chapter_progress(chapter_id);
CREATE INDEX idx_liked_chapters_user_id ON liked_chapters(user_id);
CREATE INDEX idx_liked_chapters_chapter_id ON liked_chapters(chapter_id);
CREATE INDEX idx_saved_books_user_id ON saved_books(user_id);
CREATE INDEX idx_saved_books_book_id ON saved_books(book_id);
CREATE INDEX idx_user_unlocks_user_id ON user_unlocks(user_id);
CREATE INDEX idx_user_unlocks_book_id ON user_unlocks(book_id);
CREATE INDEX idx_user_unlocks_chapter_id ON user_unlocks(chapter_id);
CREATE INDEX idx_transactions_user_id ON transactions(user_id);
CREATE INDEX idx_interactions_user_id ON interactions(user_id);
CREATE INDEX idx_book_progress_user_id ON book_progress(user_id);
CREATE INDEX idx_book_progress_book_id ON book_progress(book_id);
CREATE INDEX idx_comments_user_id ON comments(user_id);
CREATE INDEX idx_comments_book_id ON comments(book_id);
CREATE INDEX idx_comments_chapter_id ON comments(chapter_id);