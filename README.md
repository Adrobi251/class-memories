# Class Memories

Landing page dokumentasi foto & video kelas, dengan upload khusus admin.

## Tech Stack

- React + Vite (JavaScript)
- Tailwind CSS v4
- Motion (animasi)
- Lucide React (icon)
- Supabase (PostgreSQL + Auth + Storage)
- Deploy: Vercel

## Setup lokal

1. Install dependencies:

   ```bash
   npm install
   ```

2. Copy env:

   ```bash
   copy .env.example .env
   ```

3. Isi `VITE_SUPABASE_URL` dan `VITE_SUPABASE_ANON_KEY` dari Supabase Dashboard > Project Settings > API.

4. Jalankan SQL di `supabase/schema.sql` melalui Supabase Dashboard > SQL Editor. Ini membuat tabel `media`, bucket storage `media`, dan policy RLS.

5. Buat akun admin di Supabase Dashboard > Authentication > Users > Add user (email + password). Disarankan matikan public sign-up di Authentication > Sign In / Providers.

6. Jalankan dev server:

   ```bash
   npm run dev
   ```

## Fitur

- Galeri publik foto & video
- Preview foto/video dalam modal
- Login admin via Supabase Auth
- Upload foto/video + thumbnail video (admin only)
- Hapus dokumentasi (admin only)
- Row Level Security: publik hanya bisa baca

## Deploy ke Vercel

1. Import repo GitHub ini di Vercel.
2. Tambahkan environment variables `VITE_SUPABASE_URL` dan `VITE_SUPABASE_ANON_KEY`.
3. Deploy.
