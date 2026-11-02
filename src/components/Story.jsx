import { ArrowRight } from 'lucide-react'
import Reveal from './Reveal'

export default function Story() {
  return (
    <section
      id="story"
      aria-labelledby="story-title"
      className="relative isolate scroll-mt-20 overflow-hidden border-t border-white/10"
    >
      <picture>
        <source
          type="image/webp"
          srcSet="/images/story-960.webp 960w, /images/story-1920.webp 1920w"
          sizes="100vw"
        />
        <img
          src="/images/story-1920.webp"
          alt=""
          aria-hidden="true"
          loading="lazy"
          decoding="async"
          className="absolute inset-0 -z-20 size-full object-cover object-center"
        />
      </picture>

      <div aria-hidden="true" className="absolute inset-0 -z-10 bg-paper/85" />
      <div
        aria-hidden="true"
        className="absolute inset-0 -z-10 bg-gradient-to-r from-paper via-paper/70 to-paper/30"
      />

      <div className="mx-auto max-w-[1280px] px-5 py-24 sm:px-8 sm:py-32">
        <div className="grid gap-14 lg:grid-cols-12 lg:items-center lg:gap-10">
          <Reveal
            className="lg:col-span-7"
          >
            <p className="flex items-center gap-3 text-[10px] font-semibold uppercase tracking-[0.32em] text-accent-soft">
              <span aria-hidden="true" className="h-px w-8 bg-accent-soft/60" />
              Cerita kami
            </p>

            <h2
              id="story-title"
              tabIndex={-1}
              className="mt-5 max-w-[22ch] font-serif text-[clamp(2.1rem,5vw,3.75rem)] leading-[1.05] tracking-[-0.02em] text-balance"
            >
              Lebih dari sekadar <em className="italic text-accent-soft">kelas.</em>
            </h2>

            <p className="mt-6 max-w-[54ch] text-sm leading-relaxed text-ink-soft sm:text-base">
              Kami datang sebagai orang asing, tumbuh sebagai sahabat, dan menciptakan
              kenangan yang tetap tinggal jauh setelah hari terakhir. Setiap tawa,
              tantangan, dan pencapaian membuat kami menjadi keluarga.
            </p>

            <a
              href="#about"
              className="mt-8 inline-flex min-h-12 items-center gap-2 rounded-full bg-soft px-6 text-[11px] font-semibold uppercase tracking-[0.18em] text-paper transition-all duration-200 hover:-translate-y-0.5 hover:bg-accent-soft active:translate-y-0"
            >
              Tentang situs ini
              <ArrowRight className="size-4" aria-hidden="true" />
            </a>
          </Reveal>

          <Reveal
            delay={120}
            className="lg:col-span-5 lg:justify-self-end"
          >
            <p className="font-hand -rotate-2 text-right text-[clamp(2.4rem,5vw,3.75rem)] leading-[1.05] text-accent-soft">
              Terima kasih
              <br />
              untuk kenangannya
            </p>
          </Reveal>
        </div>
      </div>
    </section>
  )
}
