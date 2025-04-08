drop trigger if exists "chapter_completion_trigger" on "public"."chapter_progress";

drop trigger if exists "after_chapter_progress_insert_update" on "public"."chapter_progress";

drop trigger if exists "completed_transaction_trigger" on "public"."transactions";

drop trigger if exists "on_user_unlock_created" on "public"."user_unlocks";

drop policy "First chapter access" on "public"."chapters";

drop policy "Unlocked chapter access" on "public"."chapters";

drop policy "Admin cherry_ledger access" on "public"."cherry_ledger";

drop policy "Own user access" on "public"."users";

drop function if exists "public"."update_book_progress"();

alter table "public"."chapter_progress" add column "book_progress_id" uuid not null;

alter table "public"."transactions" add column "error" text;

alter table "public"."transactions" alter column "credits" drop not null;

alter table "public"."transactions" alter column "price" drop not null;

alter table "public"."transactions" alter column "status" set not null;

alter table "public"."chapter_progress" add constraint "chapter_progress_book_progress_id_fkey" FOREIGN KEY (book_progress_id) REFERENCES book_progress(id) ON UPDATE CASCADE ON DELETE CASCADE not valid;

alter table "public"."chapter_progress" validate constraint "chapter_progress_book_progress_id_fkey";

set check_function_bodies = off;

CREATE OR REPLACE FUNCTION public.handle_unlock_transaction()
 RETURNS trigger
 LANGUAGE plpgsql
 SECURITY DEFINER
AS $function$
DECLARE
    user_credits INT;
    price INT;  -- Assuming price is an integer, adjust as necessary
BEGIN
    -- Get the user's current credits
    SELECT credits INTO user_credits FROM users WHERE id = NEW.user_id;

    -- Assuming price is stored in the transaction table
    price := NEW.price;  -- Adjust this if the price is stored elsewhere

    -- Check if the user has enough credits
    IF user_credits >= price THEN
        -- Deduct the price from user's credits
        UPDATE users
        SET credits = credits - price
        WHERE id = NEW.user_id;

        -- Add a new row in the cherry_ledger
        INSERT INTO cherry_ledger (user_id, transaction_id, amount, created_at)
        VALUES (NEW.user_id, NEW.id, price, timezone('utc', now()));

        -- Create a new entry in user_unlocks
        IF NEW.transaction_type = 'UNLOCK_BOOK' THEN
            INSERT INTO user_unlocks (user_id, book_id, created_at)
            VALUES (NEW.user_id, NEW.book_id, timezone('utc', now()));
        ELSIF NEW.transaction_type = 'UNLOCK_CHAPTER' THEN
            INSERT INTO user_unlocks (user_id, book_id, chapter_id, created_at)
            VALUES (NEW.user_id, NEW.book_id, NEW.chapter_id, timezone('utc', now()));
        END IF;

        -- Update the transaction status to 'completed'
        UPDATE transactions
        SET status = 'completed'
        WHERE id = NEW.id;
    ELSE
        RAISE NOTICE 'User does not have enough credits for transaction ID: %', NEW.id;
        UPDATE transactions
        set status = 'failed', error = 'not enough credits'
        where id = NEW.id;
    END IF;

    RETURN NEW;
EXCEPTION
    WHEN OTHERS THEN
        RAISE NOTICE 'Error in handle_unlock_transaction: %', SQLERRM;
        RETURN NULL;  -- Optionally return NULL or handle the error as needed
END;
$function$
;

CREATE OR REPLACE FUNCTION public.decrement_like_count()
 RETURNS trigger
 LANGUAGE plpgsql
 SECURITY DEFINER
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
 SECURITY DEFINER
AS $function$
BEGIN
    UPDATE books
    SET like_count = like_count + 1
    WHERE id = (SELECT book_id FROM chapters WHERE id = NEW.chapter_id);  -- Assuming chapter_id is in liked_chapters
    RETURN NEW;
END;
$function$
;

CREATE OR REPLACE FUNCTION public.process_completed_transaction()
 RETURNS trigger
 LANGUAGE plpgsql
AS $function$BEGIN
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
            -- In the process_completed_transaction() function:
            IF NEW.book_id IS NOT NULL THEN
                INSERT INTO user_unlocks (
                    user_id, book_id
                )
                VALUES (
                    NEW.user_id,
                    NEW.book_id  -- Remove the trailing comma here
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
END;$function$
;

CREATE OR REPLACE FUNCTION public.update_percent_done()
 RETURNS trigger
 LANGUAGE plpgsql
 SECURITY DEFINER
AS $function$
DECLARE
    total_chapters INT;
    completed_chapters INT;
    percent_done_calc NUMERIC;
    cur_book_id UUID;
BEGIN
    -- Check if book_progress_id is valid
    SELECT id INTO cur_book_id FROM book_progress WHERE id = NEW.book_progress_id;
    IF cur_book_id IS NULL THEN
        RAISE EXCEPTION 'Invalid book_progress_id: %', NEW.book_progress_id;
    END IF;

    -- Get the total number of chapters for the book
    SELECT COUNT(*) INTO total_chapters
    FROM chapters
    WHERE book_id = cur_book_id;

    -- Get the number of completed chapters for the user
    SELECT COUNT(*) INTO completed_chapters
    FROM chapter_progress
    WHERE book_progress_id = NEW.book_progress_id AND user_id = NEW.user_id AND status = 'completed';

    -- Calculate the percentage done
    IF total_chapters > 0 THEN
        percent_done_calc := (completed_chapters::NUMERIC / total_chapters) * 100;
    ELSE
        percent_done_calc := 0;
    END IF;

    -- Update the book_progress table
    UPDATE book_progress
    SET percent_done = percent_done_calc,
        status = CASE WHEN percent_done_calc = 100 THEN 'finished' ELSE status END,
        current_chapter_id = CASE WHEN percent_done_calc = 100 THEN NULL ELSE current_chapter_id END
    WHERE id = NEW.book_progress_id;

    RETURN NEW;
EXCEPTION
    WHEN OTHERS THEN
        RAISE NOTICE 'Error in update_percent_done: %', SQLERRM;
        RETURN NULL;  -- Optionally return NULL or handle the error as needed
END;
$function$
;

create policy "Enable read access for all users"
on "public"."chapters"
as permissive
for select
to public
using (true);


create policy "USER CAN DO ANYTHING :D"
on "public"."cherry_ledger"
as permissive
for all
to public
using ((( SELECT auth.uid() AS uid) = user_id))
with check ((( SELECT auth.uid() AS uid) = user_id));


create policy "Enable insert for users based on user_id"
on "public"."liked_chapters"
as permissive
for all
to public
using ((( SELECT auth.uid() AS uid) = user_id))
with check ((( SELECT auth.uid() AS uid) = user_id));


create policy "Enable insert for users based on user_id"
on "public"."users"
as permissive
for all
to public
using ((( SELECT auth.uid() AS uid) = id))
with check ((( SELECT auth.uid() AS uid) = id));


CREATE TRIGGER on_unlock_transaction AFTER INSERT ON public.transactions FOR EACH ROW WHEN (((new.status = 'pending'::transaction_status) AND ((new.transaction_type = 'UNLOCK_BOOK'::transaction_type) OR (new.transaction_type = 'UNLOCK_CHAPTER'::transaction_type)))) EXECUTE FUNCTION handle_unlock_transaction();
ALTER TABLE "public"."transactions" DISABLE TRIGGER "on_unlock_transaction";

CREATE TRIGGER after_chapter_progress_insert_update AFTER INSERT OR UPDATE ON public.chapter_progress FOR EACH ROW WHEN ((new.status = 'completed'::chapter_status)) EXECUTE FUNCTION update_percent_done();
ALTER TABLE "public"."chapter_progress" DISABLE TRIGGER "after_chapter_progress_insert_update";

CREATE TRIGGER completed_transaction_trigger AFTER UPDATE ON public.transactions FOR EACH ROW EXECUTE FUNCTION process_completed_transaction();
ALTER TABLE "public"."transactions" DISABLE TRIGGER "completed_transaction_trigger";

CREATE TRIGGER on_user_unlock_created AFTER INSERT ON public.user_unlocks FOR EACH ROW EXECUTE FUNCTION handle_new_user_unlock();
ALTER TABLE "public"."user_unlocks" DISABLE TRIGGER "on_user_unlock_created";


