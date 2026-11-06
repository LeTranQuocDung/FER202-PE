-- ShelfLife: books table, constraints and Row Level Security.
-- Run this whole file in the Supabase SQL Editor.

create extension if not exists pgcrypto;

create table if not exists public.books (
  id         uuid primary key default gen_random_uuid(),
  user_id    uuid not null default auth.uid()
             references auth.users (id) on delete cascade,
  title      text not null,
  author     text not null,
  pages      integer not null,
  status     text not null default 'To Read',
  created_at timestamptz not null default now(),

  constraint books_title_valid
    check (char_length(btrim(title)) >= 1 and char_length(title) <= 80),
  constraint books_author_valid
    check (char_length(btrim(author)) >= 1 and char_length(author) <= 60),
  constraint books_pages_valid
    check (pages between 1 and 5000),
  constraint books_status_valid
    check (status in ('To Read', 'Reading', 'Finished'))
);

create index if not exists books_user_created_idx
  on public.books (user_id, created_at desc);

-- Row Level Security -------------------------------------------------------
alter table public.books enable row level security;
alter table public.books force row level security;

drop policy if exists "books_select_own" on public.books;
drop policy if exists "books_insert_own" on public.books;
drop policy if exists "books_update_own" on public.books;
drop policy if exists "books_delete_own" on public.books;

-- Only authenticated users; each one only touches rows where user_id = their id.
create policy "books_select_own" on public.books
  for select to authenticated
  using (user_id = (select auth.uid()));

create policy "books_insert_own" on public.books
  for insert to authenticated
  with check (user_id = (select auth.uid()));

create policy "books_update_own" on public.books
  for update to authenticated
  using (user_id = (select auth.uid()))
  with check (user_id = (select auth.uid()));

create policy "books_delete_own" on public.books
  for delete to authenticated
  using (user_id = (select auth.uid()));

-- Least privilege: anonymous visitors get nothing; logged-in users only the
-- actions the app needs (and only on the columns it needs to change).
revoke all on public.books from anon;
revoke all on public.books from authenticated;
grant select, insert, delete on public.books to authenticated;
grant update (status) on public.books to authenticated;

