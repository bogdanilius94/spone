# Rap Artist SPA (Next.js + Supabase)

A mobile-first, visually striking single-page application for a rap artist with a secure admin panel for content management.

## Stack
- Next.js (App Router, TypeScript)
- Tailwind CSS v4
- Framer Motion
- React Icons
- Supabase (Auth, Postgres, Storage)

## Features
- Public SPA with:
  - Hero with artist branding, featured song, and custom audio snippet player
  - QR code panel in Hero (share any configured link)
  - Quick links for streaming/social platforms
  - Animated biography section
  - Discography grid
  - Masonry media gallery
  - Embedded music videos (YouTube/Vimeo)
- Protected admin panel:
  - Email/password authentication
  - Hero + bio editor (including blur toggle for background image)
  - CRUD for quick links
  - CRUD for releases + cover uploads
  - CRUD for gallery + image uploads
  - CRUD for videos
- Supabase RLS policies with an `admin_users` access model

## Project Structure
```text
app/
  admin/
    layout.tsx
    page.tsx
  login/
    page.tsx
  globals.css
  layout.tsx
  page.tsx
components/
  admin/
    admin-dashboard.tsx
    admin-section-card.tsx
    hero-settings-form.tsx
    links-manager.tsx
    releases-manager.tsx
    gallery-manager.tsx
    videos-manager.tsx
    storage.ts
    types.ts
  public/
    public-page.tsx
    hero-section.tsx
    audio-player.tsx
    quick-links-section.tsx
    biography-section.tsx
    discography-section.tsx
    gallery-section.tsx
    music-videos-section.tsx
  ui/
    reveal.tsx
    section-title.tsx
lib/
  data.ts
  utils.ts
  supabase/
    config.ts
    client.ts
    server.ts
    middleware.ts
supabase/
  schema.sql
types/
  content.ts
  supabase.ts
proxy.ts
.env.example
```

## Supabase Setup
1. Create a Supabase project.
2. Run [`supabase/schema.sql`](./supabase/schema.sql) in SQL Editor.
3. Create a user in Supabase Auth.
4. Promote that user to admin by executing:

```sql
insert into public.admin_users(user_id)
values ('YOUR_AUTH_USER_UUID');
```

5. Create `.env.local` from `.env.example` and set:

```bash
NEXT_PUBLIC_SUPABASE_URL=...
NEXT_PUBLIC_SUPABASE_ANON_KEY=...
```

## Run Locally
```bash
npm install
npm run dev
```

Open:
- Public page: `http://localhost:3000`
- Admin login: `http://localhost:3000/login`
- Admin dashboard: `http://localhost:3000/admin`

