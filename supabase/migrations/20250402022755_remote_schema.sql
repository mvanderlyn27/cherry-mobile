drop policy "Public book_tags access" on "public"."book_tags";

alter table "public"."books" add column "like_count" integer default 0;

set check_function_bodies = off;

CREATE OR REPLACE FUNCTION public.decrement_like_count()
 RETURNS trigger
 LANGUAGE plpgsql
AS $function$
BEGIN
    UPDATE books
    SET like_count = like_count - 1
    WHERE id = (SELECT book_id FROM chapters WHERE id = OLD.chapter_id);  -- Assuming chapter_id is in liked_chapters
    RETURN OLD;
END;
$function$
;

CREATE OR REPLACE FUNCTION public.increment_like_count()
 RETURNS trigger
 LANGUAGE plpgsql
AS $function$
BEGIN
    UPDATE books
    SET like_count = like_count + 1
    WHERE id = (SELECT book_id FROM chapters WHERE id = NEW.chapter_id);  -- Assuming chapter_id is in liked_chapters
    RETURN NEW;
END;
$function$
;

create policy "Enable read access for all users"
on "public"."book_tags"
as permissive
for select
to public
using (true);


CREATE TRIGGER after_liked_chapters_delete AFTER DELETE ON public.liked_chapters FOR EACH ROW EXECUTE FUNCTION decrement_like_count();

CREATE TRIGGER after_liked_chapters_insert AFTER INSERT ON public.liked_chapters FOR EACH ROW EXECUTE FUNCTION increment_like_count();


