drop policy "Public book_tags access" on "public"."book_tags";

drop policy "Public books access" on "public"."books";

drop policy "First chapter access" on "public"."chapters";

drop policy "Public comments access" on "public"."comments";

drop policy "Public liked_chapters access" on "public"."liked_chapters";

drop policy "Public profiles access" on "public"."profiles";

drop policy "Public tags access" on "public"."tags";

alter table "public"."book_progress" add column "percent_done" real not null default '0'::real;

alter table "public"."book_progress" alter column "book_id" set not null;

alter table "public"."book_progress" alter column "user_id" set not null;

alter table "public"."book_tags" alter column "book_id" set not null;

alter table "public"."book_tags" alter column "tag_id" set not null;

alter table "public"."books" drop column "chapter_count";

alter table "public"."books" alter column "reader_count" set not null;

alter table "public"."chapter_progress" alter column "chapter_id" set not null;

alter table "public"."chapter_progress" alter column "user_id" set not null;

alter table "public"."chapters" alter column "book_id" set not null;

alter table "public"."cherry_ledger" alter column "transaction_id" set not null;

alter table "public"."cherry_ledger" alter column "user_id" set not null;

alter table "public"."comments" alter column "book_id" set not null;

alter table "public"."comments" alter column "user_id" set not null;

alter table "public"."interactions" alter column "user_id" set not null;

alter table "public"."liked_chapters" alter column "chapter_id" set not null;

alter table "public"."liked_chapters" alter column "user_id" set not null;

alter table "public"."saved_books" alter column "book_id" set not null;

alter table "public"."saved_books" alter column "id" set default gen_random_uuid();

alter table "public"."saved_books" alter column "user_id" set not null;

alter table "public"."saved_tags" alter column "tag_id" set not null;

alter table "public"."saved_tags" alter column "user_id" set not null;

alter table "public"."user_unlocks" alter column "book_id" set not null;

alter table "public"."user_unlocks" alter column "user_id" set not null;

set check_function_bodies = off;

CREATE OR REPLACE FUNCTION public.increment_reader_count()
 RETURNS trigger
 LANGUAGE plpgsql
AS $function$
BEGIN
    IF NEW.status = 'reading' THEN
        UPDATE books
        SET reader_count = reader_count + 1
        WHERE id = NEW.book_id;  -- Assuming book_id is the foreign key in book_progress
    END IF;
    RETURN NEW;
END;
$function$
;

CREATE OR REPLACE FUNCTION public.update_percent_done()
 RETURNS trigger
 LANGUAGE plpgsql
AS $function$
DECLARE
    total_chapters INT;
    completed_chapters INT;
    percent_done NUMERIC;
BEGIN
    -- Get the total number of chapters for the book
    SELECT COUNT(*) INTO total_chapters
    FROM chapters
    WHERE book_id = NEW.book_id;  -- Assuming book_id is the foreign key in chapter_progress

    -- Get the number of completed chapters for the user
    SELECT COUNT(*) INTO completed_chapters
    FROM chapter_progress
    WHERE book_id = NEW.book_id AND user_id = NEW.user_id AND status = 'completed';  -- Assuming user_id is in chapter_progress

    -- Calculate the percentage done
    IF total_chapters > 0 THEN
        percent_done := (completed_chapters::NUMERIC / total_chapters) * 100;
    ELSE
        percent_done := 0;
    END IF;

    -- Update the book_progress table
    UPDATE book_progress
    SET percent_done = percent_done
    WHERE book_id = NEW.book_id AND user_id = NEW.user_id;  -- Assuming user_id is in book_progress

    RETURN NEW;
END;
$function$
;

create policy "Public book_tags access"
on "public"."book_tags"
as permissive
for select
to public
using (true);


create policy "Public books access"
on "public"."books"
as permissive
for select
to public
using (true);


create policy "First chapter access"
on "public"."chapters"
as permissive
for select
to public
using ((chapter_number = 1));


create policy "Public comments access"
on "public"."comments"
as permissive
for select
to public
using (true);


create policy "Public liked_chapters access"
on "public"."liked_chapters"
as permissive
for select
to public
using (true);


create policy "Public profiles access"
on "public"."profiles"
as permissive
for select
to public
using (true);


create policy "Public tags access"
on "public"."tags"
as permissive
for select
to public
using (true);


CREATE TRIGGER after_book_progress_insert_update AFTER INSERT OR UPDATE ON public.book_progress FOR EACH ROW EXECUTE FUNCTION increment_reader_count();

CREATE TRIGGER after_chapter_progress_insert_update AFTER INSERT OR UPDATE ON public.chapter_progress FOR EACH ROW WHEN ((new.status = 'completed'::chapter_status)) EXECUTE FUNCTION update_percent_done();


