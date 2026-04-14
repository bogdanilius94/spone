-- Supabase schema for Rap Artist SPA
-- Run in Supabase SQL Editor.

create extension if not exists "pgcrypto";

create type public.link_platform as enum (
  'spotify',
  'apple_music',
  'youtube',
  'instagram',
  'tiktok',
  'soundcloud',
  'custom'
);

create type public.video_platform as enum ('youtube', 'vimeo');

create table if not exists public.admin_users (
  user_id uuid primary key references auth.users (id) on delete cascade,
  created_at timestamptz not null default now()
);

create or replace function public.is_admin()
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1
    from public.admin_users
    where user_id = auth.uid()
  );
$$;

revoke all on function public.is_admin() from public;
grant execute on function public.is_admin() to anon, authenticated;

create table if not exists public.global_settings (
  id smallint primary key default 1 check (id = 1),
  artist_name text not null default 'NIGHT RIOT',
  artist_font_family text not null default 'bebas',
  accent_color text not null default '#3BFFB3',
  show_quick_links boolean not null default true,
  show_biography boolean not null default true,
  show_discography boolean not null default true,
  show_gallery boolean not null default true,
  show_videos boolean not null default true,
  show_qr_widget boolean not null default true,
  show_audio_player boolean not null default true,
  hero_background_url text,
  hero_background_blur boolean not null default false,
  hero_video_url text,
  featured_song_title text not null default 'No Track Selected',
  featured_song_stream_url text,
  featured_song_audio_url text,
  bio_text text not null default 'Add your biography from the admin panel.',
  bio_portrait_url text,
  updated_at timestamptz not null default now()
);

insert into public.global_settings (id)
values (1)
on conflict (id) do nothing;

alter table public.global_settings
add column if not exists hero_background_blur boolean not null default false;

alter table public.global_settings
add column if not exists show_quick_links boolean not null default true;

alter table public.global_settings
add column if not exists show_biography boolean not null default true;

alter table public.global_settings
add column if not exists show_discography boolean not null default true;

alter table public.global_settings
add column if not exists show_gallery boolean not null default true;

alter table public.global_settings
add column if not exists show_videos boolean not null default true;

alter table public.global_settings
add column if not exists show_qr_widget boolean not null default true;

alter table public.global_settings
add column if not exists show_audio_player boolean not null default true;

create table if not exists public.social_links (
  id uuid primary key default gen_random_uuid(),
  platform public.link_platform not null default 'custom',
  label text not null,
  url text not null,
  order_index integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.releases (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  cover_url text,
  listen_url text not null,
  release_date date,
  order_index integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.gallery_items (
  id uuid primary key default gen_random_uuid(),
  image_url text not null,
  caption text,
  order_index integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.music_videos (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  platform public.video_platform not null default 'youtube',
  video_url text not null,
  order_index integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists idx_social_links_order on public.social_links (order_index asc, created_at desc);
create index if not exists idx_releases_order on public.releases (order_index asc, created_at desc);
create index if not exists idx_gallery_items_order on public.gallery_items (order_index asc, created_at desc);
create index if not exists idx_music_videos_order on public.music_videos (order_index asc, created_at desc);

create or replace function public.handle_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists trg_global_settings_updated_at on public.global_settings;
create trigger trg_global_settings_updated_at
before update on public.global_settings
for each row
execute function public.handle_updated_at();

drop trigger if exists trg_social_links_updated_at on public.social_links;
create trigger trg_social_links_updated_at
before update on public.social_links
for each row
execute function public.handle_updated_at();

drop trigger if exists trg_releases_updated_at on public.releases;
create trigger trg_releases_updated_at
before update on public.releases
for each row
execute function public.handle_updated_at();

drop trigger if exists trg_gallery_items_updated_at on public.gallery_items;
create trigger trg_gallery_items_updated_at
before update on public.gallery_items
for each row
execute function public.handle_updated_at();

drop trigger if exists trg_music_videos_updated_at on public.music_videos;
create trigger trg_music_videos_updated_at
before update on public.music_videos
for each row
execute function public.handle_updated_at();

alter table public.admin_users enable row level security;
alter table public.global_settings enable row level security;
alter table public.social_links enable row level security;
alter table public.releases enable row level security;
alter table public.gallery_items enable row level security;
alter table public.music_videos enable row level security;

drop policy if exists "Public read global_settings" on public.global_settings;
create policy "Public read global_settings"
on public.global_settings
for select
using (true);

drop policy if exists "Admin write global_settings" on public.global_settings;
create policy "Admin write global_settings"
on public.global_settings
for all
using (public.is_admin())
with check (public.is_admin());

drop policy if exists "Public read social_links" on public.social_links;
create policy "Public read social_links"
on public.social_links
for select
using (true);

drop policy if exists "Admin write social_links" on public.social_links;
create policy "Admin write social_links"
on public.social_links
for all
using (public.is_admin())
with check (public.is_admin());

drop policy if exists "Public read releases" on public.releases;
create policy "Public read releases"
on public.releases
for select
using (true);

drop policy if exists "Admin write releases" on public.releases;
create policy "Admin write releases"
on public.releases
for all
using (public.is_admin())
with check (public.is_admin());

drop policy if exists "Public read gallery_items" on public.gallery_items;
create policy "Public read gallery_items"
on public.gallery_items
for select
using (true);

drop policy if exists "Admin write gallery_items" on public.gallery_items;
create policy "Admin write gallery_items"
on public.gallery_items
for all
using (public.is_admin())
with check (public.is_admin());

drop policy if exists "Public read music_videos" on public.music_videos;
create policy "Public read music_videos"
on public.music_videos
for select
using (true);

drop policy if exists "Admin write music_videos" on public.music_videos;
create policy "Admin write music_videos"
on public.music_videos
for all
using (public.is_admin())
with check (public.is_admin());

drop policy if exists "Admin users self read" on public.admin_users;
create policy "Admin users self read"
on public.admin_users
for select
using (auth.uid() = user_id or public.is_admin());

drop policy if exists "Admin users managed by admins" on public.admin_users;
create policy "Admin users managed by admins"
on public.admin_users
for all
using (public.is_admin())
with check (public.is_admin());

insert into storage.buckets (id, name, public)
values
  ('hero-assets', 'hero-assets', true),
  ('audio-snippets', 'audio-snippets', true),
  ('release-covers', 'release-covers', true),
  ('gallery-images', 'gallery-images', true)
on conflict (id) do nothing;

drop policy if exists "Public media read" on storage.objects;
create policy "Public media read"
on storage.objects
for select
using (bucket_id in ('hero-assets', 'audio-snippets', 'release-covers', 'gallery-images'));

drop policy if exists "Admin media upload" on storage.objects;
create policy "Admin media upload"
on storage.objects
for insert
to authenticated
with check (
  bucket_id in ('hero-assets', 'audio-snippets', 'release-covers', 'gallery-images')
  and public.is_admin()
);

drop policy if exists "Admin media update" on storage.objects;
create policy "Admin media update"
on storage.objects
for update
to authenticated
using (
  bucket_id in ('hero-assets', 'audio-snippets', 'release-covers', 'gallery-images')
  and public.is_admin()
)
with check (
  bucket_id in ('hero-assets', 'audio-snippets', 'release-covers', 'gallery-images')
  and public.is_admin()
);

drop policy if exists "Admin media delete" on storage.objects;
create policy "Admin media delete"
on storage.objects
for delete
to authenticated
using (
  bucket_id in ('hero-assets', 'audio-snippets', 'release-covers', 'gallery-images')
  and public.is_admin()
);

-- After creating the first auth user, grant admin access:
-- insert into public.admin_users(user_id) values ('<AUTH_USER_UUID>');

