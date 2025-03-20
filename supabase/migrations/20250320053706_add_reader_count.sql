alter table books
add column reader_count integer not null default 0 check (reader_count >= 0);