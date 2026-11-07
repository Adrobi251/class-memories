import { useCallback, useState } from 'react'
import Navbar from './components/Navbar'
import Hero from './components/Hero'
import Gallery from './components/Gallery'
import Videos from './components/Videos'
import Story from './components/Story'
import Footer from './components/Footer'
import { useMedia } from './hooks/useMedia'

export default function PublicSite() {
  const { media, loading, error, refresh } = useMedia()
  const [galleryFilter, setGalleryFilter] = useState('semua')

  const showAllVideos = useCallback(() => {
    setGalleryFilter('video')
    document.getElementById('gallery')?.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }, [])

  return (
    <div className="min-h-[100dvh] bg-paper text-ink">
      <a
        href="#main-content"
        className="fixed left-4 top-4 z-[600] -translate-y-24 rounded-full bg-soft px-5 py-2.5 text-[11px] font-semibold uppercase tracking-[0.16em] text-paper transition-transform duration-200 focus:translate-y-0 motion-reduce:transition-none"
      >
        Lewati ke konten
      </a>

      <Navbar />

      <main id="main-content" tabIndex={-1} className="outline-none">
        <Hero />

        <section
          id="gallery"
          aria-labelledby="gallery-title"
          className="scroll-mt-20 border-t border-white/10 py-20 sm:py-28"
        >
          <div className="mx-auto max-w-[1280px] px-5 sm:px-8">
            <div className="flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
              <div>
                <p className="flex items-center gap-3 text-[10px] font-semibold uppercase tracking-[0.32em] text-accent-soft">
                  <span aria-hidden="true" className="h-px w-8 bg-accent-soft/60" />
                  Galeri kami
                </p>
                <h2
                  id="gallery-title"
                  tabIndex={-1}
                  className="mt-4 max-w-[20ch] font-serif text-[clamp(2rem,4.5vw,3.25rem)] leading-[1.05] tracking-[-0.015em] text-balance"
                >
                  Momen dalam perjalanan kita.
                </h2>
              </div>

              <p className="max-w-[38ch] text-sm leading-relaxed text-muted sm:text-right">
                Foto dan video kelas, diurutkan dari dokumentasi terbaru.
              </p>
            </div>

            <div className="mt-10">
              <Gallery
                media={media}
                loading={loading}
                error={error}
                onRetry={refresh}
                filter={galleryFilter}
                onFilterChange={setGalleryFilter}
              />
            </div>
          </div>
        </section>

        <Videos media={media} loading={loading} onShowAll={showAllVideos} />

        <Story />
      </main>

      <Footer />
    </div>
  )
}
