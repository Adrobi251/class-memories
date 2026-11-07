import { useEffect, useMemo, useState } from 'react'
import { ArrowRight, Play } from 'lucide-react'
import { brandingUrl, getPublicUrl } from '../lib/supabaseConfig'
import { site } from '../lib/site'

const MAX_SLIDES = 5
const SLIDE_MS = 6000

export default function Hero({ media = [] }) {
  const slides = useMemo(
    () =>
      media
        .filter((item) => item.media_type === 'foto' && item.storage_path)
        .slice(0, MAX_SLIDES)
        .map((item) => ({
          id: item.id,
          src: getPublicUrl(item.storage_path),
          thumb: getPublicUrl(item.thumbnail_path),
        })),
    [media],
  )

  const [active, setActive] = useState(0)
  const current = slides.length ? active % slides.length : 0

  useEffect(() => {
    if (slides.length < 2) return
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return

    const timer = window.setInterval(() => {
      if (document.hidden) return
      setActive((index) => (index + 1) % slides.length)
    }, SLIDE_MS)

    return () => window.clearInterval(timer)
  }, [slides.length])

  return (
    <section
      id="home"
      aria-labelledby="home-title"
      className="relative isolate flex min-h-[100svh] items-end overflow-hidden scroll-mt-20"
    >
      <div aria-hidden="true" className="absolute inset-0 -z-20">
        <picture className="absolute inset-0 block">
          <source
            type="image/webp"
            srcSet={`${brandingUrl('hero-960.webp')} 960w, ${brandingUrl('hero-1920.webp')} 1920w`}
            sizes="100vw"
          />
          <img
            src={brandingUrl('hero-1920.webp')}
            alt=""
            fetchPriority="high"
            decoding="async"
            className="size-full object-cover object-center contrast-125 grayscale-[35%]"
          />
        </picture>

        {slides.map((slide, index) => (
          <picture
            key={slide.id}
            className={`absolute inset-0 block transition-opacity duration-1000 ${
              index === current ? 'opacity-100' : 'opacity-0'
            }`}
          >
            {slide.thumb && <source media="(max-width: 640px)" srcSet={slide.thumb} />}
            <img
              src={slide.src}
              alt=""
              loading={index === 0 ? 'eager' : 'lazy'}
              fetchPriority={index === 0 ? 'high' : undefined}
              decoding="async"
              className="size-full object-cover object-center contrast-125 grayscale-[35%]"
            />
          </picture>
        ))}
      </div>

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
