# Performance ledger

Measured with `vite preview` + Playwright (Edge headless), 1280x720, real Supabase data.
Slow profile = CDP `Network.emulateNetworkConditions` 1.6 Mbps down / 750 kbps up / 150 ms RTT + 4x CPU throttle.

## Baseline (before optimization)

| Metric | Fast | Slow (4G + 4x CPU) |
| --- | --- | --- |
| FCP | 556 ms | 2036 ms |
| LCP | 1084 ms | 2580 ms |
| CLS | 0.031 | 0.031 |
| Long tasks | 2 (129 ms) | 5 (997 ms) |
| JS (gzip) | 182.2 kB | 182.2 kB |
| CSS (gzip) | 6.2 kB | 6.2 kB |

Media payload was the dominant cost:

| Object | Size | Cache-Control |
| --- | --- | --- |
| `foto/...30412.jpg` | 3197 kB | `private, no-cache` |
| `foto/...30365.jpg` | 3230 kB | `private, no-cache` |
| `foto/...30386.jpg` | 3582 kB | `private, no-cache` |

~10 MB per visit, re-downloaded every time (no caching), and the grid rendered full-resolution originals
because photos had no `thumbnail_path`.

## Changes kept

1. Client-side photo optimization on upload (`src/lib/image.js`): max 1920 px WebP q0.82 for the main
   file, max 800 px WebP q0.72 for the thumbnail, plus `cacheControl: 31536000`. Measured on a synthetic
   4000x3000 PNG: 29.3 MB -> 1.16 MB main + 86 kB thumb (noise image = worst case; real photos are smaller).
2. `MediaThumbnail` prefers `thumbnail_path` for photos, falls back to the original on error, and exposes a
   `priority` prop. Hero preview images are `eager` + `fetchpriority="high"`; grid images stay `lazy`.
3. Admin modals are code-split (`React.lazy`) and mount on first open: main chunk 624.6 -> 617.0 kB raw
   (182.2 -> 180.9 kB gzip), with `AdminLoginModal` 2.0 kB and `UploadModal` 9.5 kB loaded on demand.
4. `preconnect` to the Supabase origin (`%VITE_SUPABASE_URL%`) to cut DNS/TLS before the first media request.
5. `useMedia` bounded to `.limit(500)`.

## After

| Metric | Fast | Slow (4G + 4x CPU) |
| --- | --- | --- |
| FCP | 460 ms | 2036 ms |
| LCP | 988 ms | 2580 ms |
| CLS | 0.031 | 0.031 |
| Long tasks | 1 (50 ms) | 5 (997 ms) |
| JS (gzip) | 180.9 kB | 180.9 kB |

The slow-profile numbers are unchanged because the three legacy photos are still full-resolution originals:
at 1.6 Mbps they need ~50 s of transfer. Fixing that needs the objects re-uploaded (see below).

## Attempted and reverted / not done

| Idea | Result | Verdict | Why |
| --- | --- | --- | --- |
| Replace `@supabase/supabase-js` with `fetch` for public reads, lazy-load it for admin | Not done | pending | Measured at 215 kB raw (~65 kB gzip) of the initial bundle. Real win, but needs auth to move behind a lazy boundary; revisit if the bundle budget tightens. |
| Supabase image transformations | Not possible | rejected | Requires a paid plan; client-side compression covers the free tier. |
| Memoizing gallery cards / `React.memo` | Not measured | rejected | Gallery renders <= 500 small nodes, no INP symptom observed. |

## Outstanding

The three existing objects predate the compression pipeline (~10 MB total, `no-cache`) and must be
re-uploaded through the admin UI (or replaced by a script with a service-role key) before the slow-profile
numbers improve.
