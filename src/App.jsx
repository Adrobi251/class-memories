import { Suspense, lazy, useCallback, useState } from 'react'
import Navbar from './components/Navbar'
import Hero from './components/Hero'
import Gallery from './components/Gallery'
import Videos from './components/Videos'
import Story from './components/Story'
import Footer from './components/Footer'
import StatusToast from './components/StatusToast'
import { useAuth } from './context/AuthContext'
import { useMedia } from './hooks/useMedia'

// Admin-only UI stays out of the public bundle until it is opened.
const AdminLoginModal = lazy(() => import('./components/AdminLoginModal'))
const UploadModal = lazy(() => import('./components/UploadModal'))

export default function App() {
  const { isAdmin } = useAuth()
  const { media, loading, error, refresh } = useMedia()
  const [loginOpen, setLoginOpen] = useState(false)
  const [loginMounted, setLoginMounted] = useState(false)
  const [uploadOpen, setUploadOpen] = useState(false)
  const [uploadMounted, setUploadMounted] = useState(false)
  const [notice, setNotice] = useState('')
  const [galleryFilter, setGalleryFilter] = useState('semua')

  const dismissNotice = useCallback(() => setNotice(''), [])

  const openLogin = useCallback(() => {
    setLoginMounted(true)
    setLoginOpen(true)
  }, [])

  const closeLogin = useCallback(() => setLoginOpen(false), [])

  const openUpload = useCallback(() => {
    setUploadMounted(true)
    setUploadOpen(true)
  }, [])

  const closeUpload = useCallback(() => setUploadOpen(false), [])

  const showAllVideos = useCallback(() => {
    setGalleryFilter('video')
    document.getElementById('gallery')?.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }, [])

  function handleUploaded() {
    refresh()
    setNotice('Dokumentasi berhasil diunggah.')
  }

  function handleDeleted() {
    refresh()
    setNotice('Dokumentasi berhasil dihapus.')
  }

  return (
    <div className="min-h-[100dvh] bg-paper text-ink">
      <a
        href="#main-content"
        className="fixed left-4 top-4 z-[600] -translate-y-24 rounded-full bg-soft px-5 py-2.5 text-[11px] font-semibold uppercase tracking-[0.16em] text-paper transition-transform duration-200 focus:translate-y-0 motion-reduce:transition-none"
      >
        Lewati ke konten
      </a>

      <Navbar onLoginClick={openLogin} onUploadClick={openUpload} />

      <main id="main-content" tabIndex={-1} className="outline-none">
        <Hero onUploadClick={openUpload} />

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
                {isAdmin
                  ? 'Kamu masuk sebagai admin. Unggah atau hapus dokumentasi lewat tombol di navigasi dan setiap kartu.'
                  : 'Foto dan video kelas, diurutkan dari dokumentasi terbaru. Unggah dan hapus khusus admin.'}
              </p>
            </div>

            <div className="mt-10">
              <Gallery
                media={media}
                loading={loading}
                error={error}
                isAdmin={isAdmin}
                onDeleted={handleDeleted}
                onUploadClick={openUpload}
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

      <Suspense fallback={null}>
        {loginMounted && <AdminLoginModal open={loginOpen} onClose={closeLogin} />}
        {uploadMounted && (
          <UploadModal open={uploadOpen} onClose={closeUpload} onUploaded={handleUploaded} />
        )}
      </Suspense>

      <StatusToast message={notice} onDismiss={dismissNotice} />
    </div>
  )
}
