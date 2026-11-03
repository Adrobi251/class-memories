# Class Memories

Landing page dokumentasi foto & video kelas, dengan upload khusus admin.

## Cara clone repositori ini

```bash
git clone https://github.com/Adrobi251/class-memories.git
cd class-memories
```

> Repo ini tidak menyertakan file foto. Lihat [Aset gambar](#aset-gambar) untuk cara menambahkan foto hero/story sebelum build.

## Tech Stack

- React + Vite (JavaScript)
- Tailwind CSS v4
- CSS animations + IntersectionObserver (tanpa library animasi)
- Lucide React (icon)
- Supabase (PostgreSQL + Auth + Storage)
- Deploy: Vercel

## Prasyarat

- **Node.js 18+** — wajib, dipakai Vite untuk `npm install`, `npm run dev`, dan `npm run build`
- **Akun Supabase** (gratis) — atau Docker kalau mau database lokal, lihat [Supabase self-hosted](#opsi-b--supabase-self-hosted-docker)
- Laragon / XAMPP **opsional** — hanya sebagai web server untuk file hasil build, bukan pengganti database

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

## Database (Supabase)

Database project ini **bukan MySQL/MariaDB**. Supabase memakai PostgreSQL, dan frontend mengaksesnya lewat REST API, jadi tidak ada koneksi `host:port` langsung dari browser.

### 1. Buat project

1. Daftar di [supabase.com](https://supabase.com) lalu **New project**.
2. Isi nama project, password database, dan region terdekat (misal `Southeast Asia (Singapore)`).
3. Tunggu provisioning selesai (±2 menit).

### 2. Buat tabel, bucket, dan policy

1. Buka **SQL Editor** pada project.
2. Copy seluruh isi `supabase/schema.sql`, tempel, lalu **Run**.
3. Script ini membuat:
   - Tabel `public.media`
   - Index `media_created_at_idx`
   - Bucket storage `media` (public read)
   - Policy RLS: publik hanya bisa `select`, admin (role `authenticated`) bisa `insert` / `update` / `delete`

### 3. Struktur tabel `media`

| Kolom | Tipe | Keterangan |
| --- | --- | --- |
| `id` | `uuid` | Primary key, default `gen_random_uuid()` |
| `title` | `text` | Wajib, panjang 1–120 karakter |
| `description` | `text` | Opsional. Ditampilkan sebagai caption di modal preview |
| `media_type` | `text` | `foto` atau `video` |
| `storage_path` | `text` | Path file di bucket `media` |
| `thumbnail_path` | `text` | Path poster video, opsional |
| `uploaded_by` | `uuid` | Referensi `auth.users(id)`, default `auth.uid()` |
| `created_at` | `timestamptz` | Default `now()`, dipakai untuk urutan galeri |

### 4. Buat akun admin

1. **Authentication > Users > Add user** — isi email + password, centang auto-confirm.
2. Matikan **Authentication > Sign In / Providers > Allow new users to sign up** supaya tidak ada yang bisa mendaftar sendiri.
3. Login lewat tombol **Login Admin** di website.

### 5. Ambil kredensial

**Project Settings > API Keys**:

- `Project URL` → `VITE_SUPABASE_URL`
- `anon` / `publishable` key → `VITE_SUPABASE_ANON_KEY`

Anon key memang publik dan aman dipakai di browser; yang membatasi akses adalah policy RLS. **Jangan pernah** memakai `service_role` key di frontend.

> **Penting:** Vite membaca `.env` saat **build**, bukan saat runtime. Setiap kali URL/key berubah, jalankan ulang `npm run build` (atau restart `npm run dev`).

## Menjalankan dengan Laragon / XAMPP

### Kenapa tidak bisa pakai MySQL Laragon/XAMPP?

| Kebutuhan | Laragon / XAMPP | Supabase |
| --- | --- | --- |
| Web server untuk file statis | Ya | Tidak |
| Database | MySQL / MariaDB | PostgreSQL |
| Authentication | Tidak ada | Bawaan |
| File storage + CDN | Tidak ada | Storage bawaan |
| Bisa menggantikan Supabase | **Tidak** | Ya |

MySQL dan PostgreSQL beda dialek SQL, dan aplikasi ini butuh Auth + Storage sekaligus. Menjalankannya di MySQL berarti menulis backend baru (PHP + endpoint upload + sesi login), bukan sekadar mengisi `.env`.

Yang **bisa** dilakukan: pakai Laragon/XAMPP sebagai web server untuk hasil `npm run build`, sementara database tetap di Supabase Cloud.

### Opsi A — Frontend di Laragon/XAMPP + Supabase Cloud

Hasil akhir: `http://class-memories.test` menyajikan situs, data tetap dari Supabase.

1. **Install Node.js 18+** di komputer (sekali saja, untuk build). Cek dengan:

   ```bash
   node -v
   ```

2. **Clone dan install dependencies:**

   ```bash
   git clone https://github.com/Adrobi251/class-memories.git
   cd class-memories
   npm install
   ```

3. **Siapkan Supabase** mengikuti section [Database (Supabase)](#database-supabase) di atas — buat project, jalankan `schema.sql`, buat akun admin.

4. **Isi `.env`** di root project:

   ```env
   VITE_SUPABASE_URL=https://xxxxxxxxxxxx.supabase.co
   VITE_SUPABASE_ANON_KEY=eyJhbGciOi...
   ```

5. **Build:**

   ```bash
   npm run build
   ```

   Output ada di folder `dist/`.

6. **Copy hasil build ke web root Laragon:**

   ```powershell
   New-Item -ItemType Directory -Force C:\laragon\www\class-memories
   Copy-Item -Recurse -Force .\dist\* C:\laragon\www\class-memories\
   ```

   Untuk XAMPP, ganti tujuan menjadi `C:\xampp\htdocs\class-memories\`.

7. **Akses situs:**

   - **Virtual host (disarankan):** klik kanan tray Laragon > **Apache > sites-enabled** atau menu **Virtual Hosts**, buat host `class-memories.test` dengan document root `C:\laragon\www\class-memories`. Lalu buka `http://class-memories.test`.
   - **Subfolder:** kalau diakses lewat `http://localhost/class-memories/`, aset akan 404 karena build menganggap situs ada di root. Build ulang dengan base path:

     ```bash
     npm run build -- --base=/class-memories/
     ```

     lalu copy ulang `dist/` seperti langkah 6.

8. **Verifikasi:**

   - Galeri tampil (bukan skeleton terus-menerus)
   - Filter Semua / Foto / Video berfungsi
   - **Login Admin** berhasil dengan akun dari langkah 3
   - Upload foto/video lalu muncul di galeri
   - Hapus item berhasil

### Troubleshooting Laragon / XAMPP

| Gejala | Penyebab | Solusi |
| --- | --- | --- |
| Halaman blank putih | Aset 404 karena path salah | Pakai virtual host, atau build dengan `--base=/class-memories/` |
| Galeri kosong, ada pesan soal env | `.env` belum diisi saat build | Isi `.env`, jalankan `npm run build` lagi, copy ulang `dist/` |
| Galeri kosong tanpa error | `schema.sql` belum dijalankan | Jalankan `supabase/schema.sql` di SQL Editor |
| "Galeri gagal dimuat (HTTP 401/403)" | Anon key salah atau masih pakai key lama | Ambil ulang dari Project Settings > API Keys, rebuild |
| Login admin gagal | User admin belum dibuat | Authentication > Users > Add user |
| Upload gagal | Bucket `media` atau policy belum ada | Jalankan ulang `schema.sql` |
| Perubahan kode tidak muncul | Browser cache / `dist/` lama | `Ctrl+Shift+R`, copy ulang `dist/`, cek timestamp file |
| Port 80 dipakai IIS | Apache Laragon tidak start | Matikan IIS (`iisreset /stop`) atau ganti port Apache |

Catatan: tidak perlu mengatur CORS manual. Supabase mengizinkan request dari origin mana pun untuk anon key, selama policy RLS benar.

### Opsi B — Supabase self-hosted (Docker)

Kalau tujuannya database benar-benar lokal tanpa cloud, jalankan Supabase di Docker. **Laragon/XAMPP tidak bisa menggantikan ini** — butuh **Docker Desktop** dan RAM sekitar 4 GB.

1. Install [Docker Desktop](https://www.docker.com/products/docker-desktop/) lalu pastikan berjalan.
2. Dari root project:

   ```bash
   npx supabase init
   ```

   Perintah ini membuat `supabase/config.toml`. Lewati kalau file tersebut sudah ada.

3. Nyalakan stack lokal (Postgres, Auth, Storage, Studio):

   ```bash
   npx supabase start
   ```

4. Buka **Studio** di `http://127.0.0.1:54323`, lalu jalankan isi `supabase/schema.sql` di SQL Editor-nya, dan buat user admin di **Authentication > Users**.

5. Ambil kredensial lokal:

   ```bash
   npx supabase status
   ```

   Catat `API URL` (biasanya `http://127.0.0.1:54321`) dan `anon key`.

6. Isi `.env` dengan nilai lokal:

   ```env
   VITE_SUPABASE_URL=http://127.0.0.1:54321
   VITE_SUPABASE_ANON_KEY=<anon key dari supabase status>
   ```

7. Jalankan dev server seperti biasa:

   ```bash
   npm run dev
   ```

8. Matikan stack saat selesai:

   ```bash
   npx supabase stop
   ```

Data tersimpan di volume Docker, jadi tidak hilang saat `stop`. Pakai `npx supabase stop --no-backup` hanya kalau memang ingin menghapus semua data.

Bisa juga dikombinasikan: backend Supabase lokal dari Docker, frontend hasil build disajikan Laragon lewat langkah 5–7 Opsi A. Di `.env`, `VITE_SUPABASE_URL` tetap `http://127.0.0.1:54321`, dan situs diakses dari browser yang sama dengan Docker.

## Fitur

- Hero sinematik dengan foto kelas
- Galeri publik foto & video dengan filter Semua / Foto / Video
- Tombol "Lihat Lebih Banyak" untuk memuat dokumentasi berikutnya
- Section Video dan section cerita (Our Story)
- Preview foto/video dalam modal
- Login admin via Supabase Auth
- Upload foto/video + thumbnail video (admin only)
- Hapus dokumentasi (admin only)
- Row Level Security: publik hanya bisa baca

## Aset gambar

Foto hero dan story disimpan di **Supabase Storage**, bukan di repo, sehingga GitHub tetap bersih dan Vercel bisa auto-deploy tanpa download foto besar.

### Workflow lokal

1. Taruh foto asli di folder `images/`:
   - `Studio Session-30365.jpg` → hero
   - `Studio Session-30412.jpg` → story

2. Generate WebP dengan sharp:

   ```bash
   npm run images
   ```

   Output: `public/images/hero-960.webp`, `hero-1280.webp`, `hero-1920.webp`, `story-960.webp`, `story-1280.webp`, `story-1920.webp` (untuk testing lokal).

3. Test situs dengan photo lokal:

   ```bash
   npm run dev
   ```

   Hero dan story akan tampil dari folder lokal `public/images/`.

### Upload ke Supabase Storage

Untuk deploy ke production (Vercel), foto harus di-upload ke Supabase agar situs mengambilnya dari sana.

1. **Supabase Dashboard → Storage → bucket `media` → New folder → nama `branding`**
2. Upload 6 file WebP dari folder `public/images/`:
   - `hero-960.webp`, `hero-1280.webp`, `hero-1920.webp`
   - `story-960.webp`, `story-1280.webp`, `story-1920.webp`
3. Verifikasi URL publik bisa diakses (buka di browser):
   ```
   https://<project-ref>.supabase.co/storage/v1/object/public/media/branding/hero-1920.webp
   ```

Policy RLS `storage media public read` (dari `schema.sql`) sudah mengizinkan akses publik ke seluruh bucket `media`, termasuk folder `branding/`.

### Kode yang menggunakan foto

- `src/lib/supabaseConfig.js`: helper `brandingUrl(file)` mengakses folder `branding/` di Supabase
- `src/components/Hero.jsx`: menggunakan `brandingUrl('hero-960.webp')` dst.
- `src/components/Story.jsx`: menggunakan `brandingUrl('story-960.webp')` dst.
- `index.html`: preload hero dari `%VITE_SUPABASE_URL%/storage/v1/object/public/media/branding/hero-1920.webp`

Lokal di `npm run dev`, situs akan error karena `brandingUrl()` mencoba akses Supabase. Untuk test dengan foto lokal, edit `Hero.jsx` dan `Story.jsx` sementara ganti `brandingUrl('hero-...')` jadi `/images/hero-...`, lalu ubah kembali sebelum commit.

### Untuk deploy

- Pastikan 6 file WebP sudah di-upload ke `media/branding/` di Supabase (langkah di atas).
- Import repo GitHub ini ke Vercel, isi env `VITE_SUPABASE_URL` dan `VITE_SUPABASE_ANON_KEY`.
- Deploy. Situs akan mengambil hero dan story dari Supabase Storage.
- Repo tetap tidak punya file WebP.

## Deploy ke Vercel

1. Import repo GitHub ini di Vercel.
2. Tambahkan environment variables `VITE_SUPABASE_URL` dan `VITE_SUPABASE_ANON_KEY`.
3. Deploy.
