import { ArrowRight, Play, Upload } from 'lucide-react'
import { useAuth } from '../context/AuthContext'
import { site } from '../lib/site'

export default function Hero({ onUploadClick }) {
  const { isAdmin } = useAuth()

  return (
    <section
      id="home"
      aria-labelledby="home-title"
      className="relative isolate flex min-h-[100svh] items-end overflow-hidden scroll-mt-20"
    >
      <picture>
        <source
          type="image/webp"
          srcSet="/images/hero-960.webp 960w, /images/hero-1920.webp 1920w"
          sizes="100vw"
        />
        <img
          src="/images/hero-1920.webp"
          alt=""
          aria-hidden="true"
          fetchPriority="high"
          decoding="async"
          className="absolute inset-0 -z-20 size-full object-cover object-center contrast-125 grayscale-[35%]"
        />
      </picture>

      <div
        aria-hidden="true"
        className="absolute inset-0 -z-10 bg-gradient-to-t from-paper via-paper/75 to-paper/25"
      />
      <div
        aria-hidden="true"
        className="absolute inset-0 -z-10 bg-[radial-gradient(120%_90%_at_0%_100%,rgba(9,11,11,0.9)_0%,rgba(9,11,11,0)_60%)]"
      />

      <div className="mx-auto w-full max-w-[1280px] px-5 pb-20 pt-32 sm:px-8 sm:pb-24 lg:pb-28">
        <p className="flex animate-fade-up items-center gap-3 text-[10px] font-semibold uppercase tracking-[0.34em] text-accent-soft">
          <span aria-hidden="true" className="h-px w-10 bg-accent-soft/70" />
          {site.name}
        </p>

        <h1
          id="home-title"
          style={{ animationDelay: '80ms' }}
          className="mt-6 max-w-[16ch] animate-fade-up font-serif text-[clamp(2.6rem,7.5vw,5.75rem)] leading-[0.98] tracking-[-0.02em] text-balance"
        >
          Setiap momen adalah{' '}
          <em className="italic text-accent-soft">cerita.</em>
        </h1>

        <p
          style={{ animationDelay: '160ms' }}
          className="mt-6 max-w-[52ch] animate-fade-up text-sm leading-relaxed text-ink-soft sm:text-base"
        >
          Kumpulan foto dan video momen kebersamaan kelas. Dikelola oleh admin,
          terbuka untuk semua yang pernah menjadi bagian dari kelas ini.
        </p>

        <div
          style={{ animationDelay: '240ms' }}
          className="mt-9 flex animate-fade-up flex-col gap-3 sm:flex-row sm:items-center"
        >
          <a
            href="#gallery"
            className="inline-flex min-h-12 items-center justify-center gap-2 rounded-full bg-signal px-6 text-[11px] font-semibold uppercase tracking-[0.18em] text-white transition-all duration-200 hover:-translate-y-0.5 hover:bg-signal-bright active:translate-y-0"
          >
            Jelajahi Kenangan
            <ArrowRight className="size-4" aria-hidden="true" />
          </a>

          <a
            href="#videos"
            className="inline-flex min-h-12 items-center justify-center gap-2 rounded-full border border-white/25 bg-white/5 px-6 text-[11px] font-semibold uppercase tracking-[0.18em] text-ink backdrop-blur-md transition-colors duration-200 hover:border-accent-soft hover:text-accent-soft"
          >
            <Play className="size-4 fill-current" aria-hidden="true" />
            Tonton Film
          </a>

          {isAdmin && (
            <button
              type="button"
              onClick={onUploadClick}
              className="inline-flex min-h-12 items-center justify-center gap-2 rounded-full px-4 text-[11px] font-semibold uppercase tracking-[0.18em] text-ink/70 transition-colors duration-200 hover:text-ink"
            >
              <Upload className="size-4" aria-hidden="true" />
              Upload
            </button>
          )}
        </div>

        <div
          aria-hidden="true"
          style={{ animationDelay: '340ms' }}
          className="mt-14 hidden animate-fade-up items-center gap-3 text-[10px] uppercase tracking-[0.32em] text-ink/45 sm:flex"
        >
          <span className="scroll-hint grid h-9 w-5 place-items-start justify-center rounded-full border border-white/25 pt-1.5">
            <span className="block size-1 rounded-full bg-accent-soft" />
          </span>
          Gulir
        </div>
      </div>
    </section>
  )
}
