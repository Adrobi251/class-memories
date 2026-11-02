-- Class Memories: Supabase schema
-- Jalankan seluruh file ini di Supabase Dashboard > SQL Editor

-- 1. Tabel metadata media
create table if not exists public.media (
  id uuid primary key default gen_random_uuid(),
  title text not null check (char_length(title) between 1 and 120),
  description text,
  media_type text not null check (media_type in ('foto', 'video')),
  storage_path text not null,
  thumbnail_path text,
  uploaded_by uuid default auth.uid() references auth.users (id) on delete set null,
  created_at timestamptz not null default now()
);

create index if not exists media_created_at_idx on public.media (created_at desc);

-- 2. RLS: publik baca, admin tulis
alter table public.media enable row level security;

drop policy if exists "media public read" on public.media;
create policy "media public read" on public.media for select using (true);

drop policy if exists "media admin insert" on public.media;
create policy "media admin insert" on public.media for insert to authenticated with check (true);

drop policy if exists "media admin update" on public.media;
create policy "media admin update" on public.media for update to authenticated using (true);

drop policy if exists "media admin delete" on public.media;
create policy "media admin delete" on public.media for delete to authenticated using (true);

-- 3. Bucket storage (public read)
insert into storage.buckets (id, name, public)
values ('media', 'media', true)
on conflict (id) do update set public = true;

-- 4. Storage policies
drop policy if exists "storage media public read" on storage.objects;
create policy "storage media public read" on storage.objects for select using (bucket_id = 'media');

drop policy if exists "storage media admin insert" on storage.objects;
create policy "storage media admin insert" on storage.objects for insert to authenticated with check (bucket_id = 'media');

drop policy if exists "storage media admin update" on storage.objects;
create policy "storage media admin update" on storage.objects for update to authenticated using (bucket_id = 'media');

drop policy if exists "storage media admin delete" on storage.objects;
create policy "storage media admin delete" on storage.objects for delete to authenticated using (bucket_id = 'media');
