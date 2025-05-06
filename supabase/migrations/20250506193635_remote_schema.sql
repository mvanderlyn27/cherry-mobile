drop trigger if exists "after_chapter_progress_insert_update" on "public"."chapter_progress";

drop trigger if exists "completed_transaction_trigger" on "public"."transactions";

drop trigger if exists "on_unlock_transaction" on "public"."transactions";

drop trigger if exists "on_user_unlock_created" on "public"."user_unlocks";

alter table "public"."chapters" add column "is_free" boolean not null default false;

alter table "public"."users" disable row level security;

set check_function_bodies = off;

CREATE OR REPLACE FUNCTION public.delete_user_data(p_user_id uuid)
 RETURNS void
 LANGUAGE plpgsql
 SECURITY DEFINER
AS $function$
BEGIN
    -- Delete from user_unlocks
    DELETE FROM user_unlocks
    WHERE user_id = p_user_id;


    -- Delete from comments X
    DELETE FROM comments
    WHERE user_id = p_user_id;

    -- Delete from interactions X
    DELETE FROM interactions
    WHERE user_id = p_user_id;

    -- Delete from user_unlocks X
    DELETE FROM profiles 
    WHERE id = p_user_id;

    -- Delete from book_progress X
    DELETE FROM book_progress
    WHERE user_id = p_user_id;

    -- Delete from chapter_progress X
    DELETE FROM chapter_progress
    WHERE user_id = p_user_id;

    -- Delete from liked_chapters X
    DELETE FROM liked_chapters
    WHERE user_id = p_user_id;

    -- Delete from saved_books
    DELETE FROM saved_books
    WHERE user_id = p_user_id;

    -- Delete from transactions
    DELETE FROM transactions
    WHERE user_id = p_user_id;

    -- Delete from saved_tags
    DELETE FROM saved_tags
    WHERE user_id = p_user_id;

    -- Delete from users table
    DELETE FROM users
    WHERE id = p_user_id;

    -- Delete from auth.users table
    DELETE FROM auth.users
    WHERE id = p_user_id;

END;
$function$
;

CREATE OR REPLACE FUNCTION public.migrate_user_data(old_user_id uuid, new_user_id uuid)
 RETURNS void
 LANGUAGE plpgsql
 SECURITY DEFINER
AS $function$
BEGIN
    -- Update user data in users table
    UPDATE users
    SET credits = credits + (SELECT COALESCE((SELECT credits FROM users WHERE id = old_user_id), 0)),
        premium_user = (SELECT COALESCE(premium_user, false) FROM users WHERE id = old_user_id) OR premium_user,
        preferences = (SELECT preferences FROM users WHERE id = old_user_id)
    WHERE id = new_user_id;

    -- Migrate user_unlocks
    INSERT INTO user_unlocks (user_id, book_id, chapter_id, created_at, updated_at)
    SELECT new_user_id, book_id, chapter_id, created_at, updated_at
    FROM user_unlocks
    WHERE user_id = old_user_id
      AND NOT EXISTS (
          SELECT 1 FROM user_unlocks
          WHERE user_id = new_user_id AND book_id = user_unlocks.book_id AND chapter_id = user_unlocks.chapter_id
      );

    -- Migrate book_progress
    INSERT INTO book_progress (user_id, book_id, current_chapter_id, status, created_at, updated_at, percent_done)
    SELECT new_user_id, book_id, current_chapter_id, status, created_at, updated_at, percent_done
    FROM book_progress
    WHERE user_id = old_user_id
      AND NOT EXISTS (
          SELECT 1 FROM book_progress
          WHERE user_id = new_user_id AND book_id = book_progress.book_id
      );

    -- Migrate chapter_progress
    INSERT INTO chapter_progress (user_id, chapter_id, book_progress_id, status, created_at, updated_at)
    SELECT new_user_id, chapter_id, book_progress_id, status, created_at, updated_at
    FROM chapter_progress
    WHERE user_id = old_user_id
      AND NOT EXISTS (
          SELECT 1 FROM chapter_progress
          WHERE user_id = new_user_id AND chapter_id = chapter_progress.chapter_id
      );

    -- Migrate liked_chapters
    INSERT INTO liked_chapters (user_id, chapter_id, book_id, created_at, updated_at)
    SELECT new_user_id, chapter_id, book_id, created_at, updated_at
    FROM liked_chapters
    WHERE user_id = old_user_id
      AND NOT EXISTS (
          SELECT 1 FROM liked_chapters
          WHERE user_id = new_user_id AND chapter_id = liked_chapters.chapter_id
      );

    -- Migrate saved_books
    INSERT INTO saved_books (user_id, book_id, created_at, updated_at)
    SELECT new_user_id, book_id, created_at, updated_at
    FROM saved_books
    WHERE user_id = old_user_id
      AND NOT EXISTS (
          SELECT 1 FROM saved_books
          WHERE user_id = new_user_id AND book_id = saved_books.book_id
      );

    -- Migrate saved_tags
    INSERT INTO saved_tags (user_id, tag_id, created_at)
    SELECT new_user_id, tag_id, created_at
    FROM saved_tags
    WHERE user_id = old_user_id
      AND NOT EXISTS (
          SELECT 1 FROM saved_tags
          WHERE user_id = new_user_id AND tag_id = saved_tags.tag_id
      );

END;
$function$
;

CREATE TRIGGER after_chapter_progress_insert_update AFTER INSERT OR UPDATE ON public.chapter_progress FOR EACH ROW WHEN ((new.status = 'completed'::chapter_status)) EXECUTE FUNCTION update_percent_done();

CREATE TRIGGER completed_transaction_trigger AFTER UPDATE ON public.transactions FOR EACH ROW EXECUTE FUNCTION process_completed_transaction();

CREATE TRIGGER on_unlock_transaction AFTER INSERT ON public.transactions FOR EACH ROW WHEN (((new.status = 'pending'::transaction_status) AND ((new.transaction_type = 'UNLOCK_BOOK'::transaction_type) OR (new.transaction_type = 'UNLOCK_CHAPTER'::transaction_type)))) EXECUTE FUNCTION handle_unlock_transaction();

CREATE TRIGGER on_user_unlock_created AFTER INSERT ON public.user_unlocks FOR EACH ROW EXECUTE FUNCTION handle_new_user_unlock();


