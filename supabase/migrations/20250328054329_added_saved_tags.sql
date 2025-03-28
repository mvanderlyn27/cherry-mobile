create table "public"."saved_tags" (
    "id" uuid not null default gen_random_uuid(),
    "created_at" timestamp with time zone not null default now(),
    "user_id" uuid,
    "tag_id" uuid default gen_random_uuid()
);


alter table "public"."saved_tags" enable row level security;

CREATE UNIQUE INDEX saved_tags_pkey ON public.saved_tags USING btree (id);

alter table "public"."saved_tags" add constraint "saved_tags_pkey" PRIMARY KEY using index "saved_tags_pkey";

alter table "public"."saved_tags" add constraint "saved_tags_tag_id_fkey" FOREIGN KEY (tag_id) REFERENCES tags(id) ON UPDATE CASCADE ON DELETE CASCADE not valid;

alter table "public"."saved_tags" validate constraint "saved_tags_tag_id_fkey";

alter table "public"."saved_tags" add constraint "saved_tags_user_id_fkey" FOREIGN KEY (user_id) REFERENCES users(id) ON UPDATE CASCADE ON DELETE CASCADE not valid;

alter table "public"."saved_tags" validate constraint "saved_tags_user_id_fkey";

set check_function_bodies = off;

CREATE OR REPLACE FUNCTION public.handle_new_user()
 RETURNS trigger
 LANGUAGE plpgsql
 SECURITY DEFINER
AS $function$BEGIN
  INSERT INTO public.users (id, created_at, updated_at, credits)
  VALUES (NEW.id, NOW(), NOW(), 0);
   INSERT INTO public.profiles (id, created_at, updated_at)
  VALUES (NEW.id, NOW(), NOW());
  RETURN NEW;
END;$function$
;

grant delete on table "public"."saved_tags" to "anon";

grant insert on table "public"."saved_tags" to "anon";

grant references on table "public"."saved_tags" to "anon";

grant select on table "public"."saved_tags" to "anon";

grant trigger on table "public"."saved_tags" to "anon";

grant truncate on table "public"."saved_tags" to "anon";

grant update on table "public"."saved_tags" to "anon";

grant delete on table "public"."saved_tags" to "authenticated";

grant insert on table "public"."saved_tags" to "authenticated";

grant references on table "public"."saved_tags" to "authenticated";

grant select on table "public"."saved_tags" to "authenticated";

grant trigger on table "public"."saved_tags" to "authenticated";

grant truncate on table "public"."saved_tags" to "authenticated";

grant update on table "public"."saved_tags" to "authenticated";

grant delete on table "public"."saved_tags" to "service_role";

grant insert on table "public"."saved_tags" to "service_role";

grant references on table "public"."saved_tags" to "service_role";

grant select on table "public"."saved_tags" to "service_role";

grant trigger on table "public"."saved_tags" to "service_role";

grant truncate on table "public"."saved_tags" to "service_role";

grant update on table "public"."saved_tags" to "service_role";

create policy "User can edit their own profile"
on "public"."profiles"
as permissive
for all
to public
using ((id = auth.uid()));


create policy "User can Modify there own stuff"
on "public"."saved_tags"
as permissive
for all
to public
using ((auth.uid() = user_id))
with check ((auth.uid() = user_id));
