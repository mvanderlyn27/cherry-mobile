alter table "public"."books"
add column "reading_time" integer;

comment on column "public"."books"."reading_time" is 'Reading time in minutes for the book';